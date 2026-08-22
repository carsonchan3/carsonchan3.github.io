import { describe, expect, it } from "vitest";
import { createProductFamilyId, isProductFamilyIdAvailable, resolveProductImageAlt } from "./productAdmin";

describe("product admin helpers", () => {
  it("generates a stable product family ID from a new product name", () => {
    expect(createProductFamilyId("TOPS Shield 205 RTF")).toBe("tops-shield-205-rtf");
  });

  it("provides accessible image alt text when a new product has none", () => {
    expect(resolveProductImageAlt("", "TOPS Shield 205")).toBe("TOPS Shield 205 product image");
  });

  it("prevents a new product from reusing an existing product family ID", () => {
    expect(isProductFamilyIdAvailable(["tops-shield-205"], "tops-shield-205")).toBe(false);
    expect(isProductFamilyIdAvailable(["tops-shield-205"], "tops-shield-250")).toBe(true);
  });
});
