import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
for (let attempt = 0; attempt < 60; attempt += 1) {
  try { if ((await fetch(base)).ok) break; } catch { /* wait for local server */ }
  if (attempt === 59) throw new Error("Local server did not become ready");
  await new Promise(resolve => setTimeout(resolve, 500));
}
const all = await fetch(`${base}/api/listings`);
assert.equal(all.status, 200);
assert.equal((await all.json()).total, 9);
const filtered = await fetch(`${base}/api/listings?category=Excavators&condition=Used&maxPrice=150000&search=Chicago`);
const result = await filtered.json();
assert.equal(result.total, 1);
assert.equal(result.listings[0].name, "Caterpillar 320 Excavator");
for (const query of ["maxPrice=12abc", "category=invalid", "search=a&search=b", "unknown=1"]) {
  const response = await fetch(`${base}/api/listings?${query}`);
  assert.equal(response.status, 400);
  assert.equal(typeof (await response.json()).error, "string");
}
console.log("HTTP smoke passed: production page, nine listings, combined filters, and four invalid requests.");
