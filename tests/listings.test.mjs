import test from "node:test";
import assert from "node:assert/strict";
import { filterListings, listings, InvalidFilter } from "../lib/listings.ts";

test("all nine sample listings are returned with stable IDs", () => {
  const result = filterListings(new URLSearchParams());
  assert.equal(result.total, 9);
  assert.equal(new Set(result.listings.map(x => x.id)).size, 9);
});
test("filters combine category, condition, price and trimmed case-insensitive search", () => {
  const result = filterListings(new URLSearchParams({ category: "Excavators", condition: "Used", maxPrice: "150000", search: "  CHICAGO  " }));
  assert.equal(result.total, 1);
  assert.equal(result.listings[0].id, "1");
});
test("description search and no results work", () => {
  assert.equal(filterListings(new URLSearchParams({ search: "grade control" })).total, 1);
  assert.equal(filterListings(new URLSearchParams({ search: "does-not-exist" })).total, 0);
  assert.equal(filterListings(new URLSearchParams({ maxPrice: "0" })).total, 0);
});
for (const maxPrice of ["", "-1", "NaN", "12abc", "12.5", "1e9", "9007199254740992"]) {
  test(`rejects invalid maximum price ${JSON.stringify(maxPrice)}`, () => {
    assert.throws(() => filterListings(new URLSearchParams({ maxPrice })), InvalidFilter);
  });
}
test("rejects invalid enum, oversized search, repeated and unknown parameters", () => {
  for (const query of ["category=invalid", "condition=invalid", `search=${"x".repeat(101)}`, "search=a&search=b", "typo=1"]) {
    assert.throws(() => filterListings(new URLSearchParams(query)), InvalidFilter);
  }
});
test("search does not mutate or reorder the shared inventory", () => {
  const before = JSON.stringify(listings);
  filterListings(new URLSearchParams({ search: "Chicago" }));
  assert.equal(JSON.stringify(listings), before);
});
