import { describe, expect, it } from "vitest";
import { productContent } from "./productContent.generated";
import { getProductContent } from "./productContent";
import { productFamilies } from "@/pages/Equipment";

describe("Markdown-managed product content", () => {
  it("contains a bilingual record for every product family", () => {
    expect(productContent.length).toBe(productFamilies.length);
    for (const family of productFamilies) {
      const content = getProductContent(family.familyId);
      expect(content).toBeDefined();
      expect(content?.description.en.length).toBeGreaterThan(20);
      expect(content?.description["zh-Hant"]).toMatch(/[\u3400-\u9fff]/);
    }
  });

  it("provides full localized detail blocks for the premium families", () => {
    for (const familyId of ["tops-shield-205", "tops-shield-220", "r220f", "tops-shield-400"]) {
      const content = getProductContent(familyId);
      expect(content?.detail?.en.premiumTitle).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].premiumTitle).toBeTruthy();
      expect(Object.keys(content?.detail?.en.tiers ?? {}).length).toBeGreaterThan(0);
      expect(Object.keys(content?.detail?.["zh-Hant"].tiers ?? {}).length).toBeGreaterThan(0);
      expect(content?.detail?.en.specifications.length).toBeGreaterThan(0);
      expect(content?.detail?.en.inTheBox.length).toBeGreaterThan(0);
      expect(content?.detail?.["zh-Hant"].inTheBox.length).toBeGreaterThan(0);
    }
  });

  it("keeps stable family identifiers and does not encode pricing or media in Markdown content", () => {
    expect(new Set(productContent.map((item) => item.familyId)).size).toBe(productContent.length);
    for (const item of productContent) {
      expect(JSON.stringify(item)).not.toMatch(/HK\$/);
      expect(JSON.stringify(item)).not.toMatch(/manus-storage/);
    }
  });
});
