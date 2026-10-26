import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
for (let attempt = 0; attempt < 60; attempt += 1) {
  try { if ((await fetch(base)).ok) break; } catch { /* local server may still be starting */ }
  if (attempt === 59) throw new Error("Local server did not become ready");
  await new Promise(resolve => setTimeout(resolve, 500));
}
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 900 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base);
  await page.getByRole("heading", { name: "Caterpillar 320 Excavator" }).waitFor();
  assert.equal(await page.locator("article").count(), 9);
  await page.getByRole("button", { name: "Excavators", exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll("article").length === 2);
  assert.equal(await page.getByRole("button", { name: "Excavators", exact: true }).getAttribute("aria-pressed"), "true");
  const input = page.getByRole("searchbox");
  await input.fill("Chicago");
  await page.waitForFunction(() => document.querySelectorAll("article").length === 1);
  await page.getByText("Equipment details", { exact: true }).click();
  assert.ok(await page.locator("details[open]").count() === 1);
  await input.fill("no-match-query");
  await page.getByText("No equipment found", { exact: true }).waitFor();
  await input.fill("");
  await page.waitForFunction(() => document.querySelectorAll("article").length === 2);
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
  }
  assert.equal((await page.request.get(`${base}/api/listings?maxPrice=12abc`)).status(), 400);
  assert.equal((await page.request.get(`${base}/api/listings?category=invalid`)).status(), 400);

  // A real request failure must expose an error and permit recovery.
  let fail = true;
  await page.route("**/api/listings*", route => fail ? route.fulfill({ status: 503, body: "unavailable" }) : route.continue());
  await input.fill("Detroit");
  await page.getByRole("alert").filter({ hasText: "Unable to load equipment" }).waitFor();
  fail = false;
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await page.getByText("No equipment found", { exact: true }).waitFor(); // Detroit has a crane, not an excavator.
  await page.unroute("**/api/listings*");

  // Delayed old search must not win over a newer request.
  await page.getByRole("button", { name: "All", exact: true }).first().click();
  await page.route("**/api/listings*", async route => {
    if (new URL(route.request().url()).searchParams.get("search") === "Chicago") {
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    await route.continue().catch(() => {}); // an obsolete fetch can be aborted
  });
  const oldRequest = page.waitForRequest(request => new URL(request.url()).searchParams.get("search") === "Chicago");
  await input.fill("Chicago");
  await oldRequest;
  await input.fill("Detroit");
  await page.getByRole("heading", { name: "Liebherr LTM 1100 Crane" }).waitFor();
  await new Promise(resolve => setTimeout(resolve, 800));
  assert.equal(await page.locator("article").count(), 1);
  assert.ok(await page.getByRole("heading", { name: "Liebherr LTM 1100 Crane" }).isVisible());
  assert.deepEqual(errors, []);
  console.log("Browser checks passed: filters, search, details, empty/error/retry, stale requests, API 400s, and four viewport widths.");
} finally { await browser.close(); }
