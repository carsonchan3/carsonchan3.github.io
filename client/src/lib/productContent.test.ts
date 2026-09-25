import { describe, expect, it } from "vitest";
import { productContent } from "./productContent.generated";
import { getPremiumProductContent, getProductContent, getProductSpecsAndContents } from "./productContent";
import { productFamilies } from "@/pages/Equipment";

describe("Markdown-managed product content", () => {
  it("contains a bilingual record for every product family", () => {
    expect(productContent.length).toBe(productFamilies.length);
    for (const family of productFamilies) {
      const content = getProductContent(family.familyId);
      expect(content).toBeDefined();
      expect(content?.description.en.length).toBeGreaterThan(20);
      expect(content?.description["zh-Hant"]).toMatch(/[㐀-鿿]/);
      expect(content?.variants.length).toBeGreaterThan(0);
    }
  });

  it("provides full localized detail blocks for the premium families", () => {
    for (const familyId of ["tops-shield-205", "tops-shield-220", "r200f", "r220f", "tops-shield-400"]) {
      const content = getProductContent(familyId);
      expect(content?.detail?.en.premiumTitle).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].premiumTitle).toBeTruthy();
      expect(content?.detail?.en.specificationsTitle).toBeTruthy();
      expect(content?.detail?.en.inTheBoxTitle).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].specificationsTitle).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].inTheBoxTitle).toBeTruthy();
      expect(content?.detail?.en.equipmentTierPartsLabel).toBeTruthy();
      expect(content?.detail?.en.equipmentTierVerifiedLabel).toBeTruthy();
      expect(content?.detail?.en.careAddOnTitle).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].equipmentTierPartsLabel).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].equipmentTierVerifiedLabel).toBeTruthy();
      expect(content?.detail?.["zh-Hant"].careAddOnTitle).toBeTruthy();
      expect(Object.keys(content?.detail?.en.tiers ?? {}).length).toBeGreaterThan(0);
      expect(Object.keys(content?.detail?.["zh-Hant"].tiers ?? {}).length).toBeGreaterThan(0);
      expect(content?.detail?.en.specifications.length).toBeGreaterThan(0);
      for (const language of ["en", "zh-Hant"] as const) {
        for (const tier of Object.values(content?.detail?.[language].tiers ?? {})) expect(tier.inTheBox.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps stable family and variant identifiers", () => {
    expect(new Set(productContent.map((item) => item.familyId)).size).toBe(productContent.length);
    const variantIds = productContent.flatMap((item) => item.variants.map((variant) => variant.id));
    expect(new Set(variantIds).size).toBe(variantIds.length);
  });

  it("maps every premium tier to a Markdown variant with its own box contents", () => {
    const shield220 = getPremiumProductContent("tops-shield-220", "en");
    expect(Object.keys(shield220?.tiers ?? {})).toEqual(["certified", "travel", "builder"]);
    expect(shield220?.careTiers).toEqual(["certified"]);
    expect(shield220?.tiers.certified.inTheBox).toContain("1x Remote controller");
    expect(shield220?.tiers.builder.inTheBox).not.toContain("1x Remote controller");
    expect(getPremiumProductContent("d6-pro", "en")).toBeUndefined();
  });

  it("gives simple products specifications and box contents in both languages", () => {
    for (const familyId of ["d6-pro", "ta300-charger", "tops-bag-200", "tops-shield-200"]) {
      expect(getProductSpecsAndContents(familyId, "en")?.specifications.length).toBeGreaterThan(0);
      expect(getProductSpecsAndContents(familyId, "zh-Hant")?.inTheBox.length).toBeGreaterThan(0);
    }
  });

  it("never publishes internal wholesale or MSRP pricing", () => {
    const serialized = JSON.stringify(productContent);
    expect(serialized).not.toMatch(/wholesale|批發|MSRP|零售價/i);
  });
});
