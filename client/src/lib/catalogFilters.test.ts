import { describe, expect, it } from "vitest";
import { matchesCatalogSearch } from "./catalogFilters";

describe("catalog search matching", () => {
  it("matches terms regardless of case across product or service fields", () => {
    expect(matchesCatalogSearch("r200", ["R200F", "Drone platform"])).toBe(true);
    expect(matchesCatalogSearch("quotation", ["Drone repair", "Quotation first"])).toBe(true);
  });

  it("handles blank queries and does not match unrelated records", () => {
    expect(matchesCatalogSearch("", ["PID tuning"])).toBe(true);
    expect(matchesCatalogSearch("camera", ["PID tuning", "2–4 hours"])).toBe(false);
  });
});
