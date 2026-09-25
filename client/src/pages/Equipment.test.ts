import { describe, expect, it } from "vitest";
import { sanitizeProductCart } from "@/lib/productCart";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";
import { cartKey, minimumQuantity, serviceOptionLabel, servicePrice } from "@/lib/productPricing";
import { cartLineMinimum, equipmentPricingNote, getVisibleProductFamilies, isValidCatalogImageUrl, mergeCatalogueWithDatabase, productFamilies, quoteCartTopRightClasses } from "./Equipment";

describe("Markdown-backed equipment catalogue content", () => {
  it("provides formal starting-price guidance before shopping items in both site languages", () => {
    expect(equipmentPricingNote.en).toBe("Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.");
    expect(equipmentPricingNote["zh-Hant"]).toBe("所列價格僅供參考起點。最終供貨情況、運費及賽事計劃要求，將於為您度身訂造的報價中確認。");
  });

  it("hides the families marked visible: false in Markdown", () => {
    const visibleFamilies = getVisibleProductFamilies(productFamilies);
    const visibleVariants = visibleFamilies.flatMap((family) => family.variants);

    expect(visibleFamilies.map((family) => family.familyId)).toEqual(expect.arrayContaining(["tops-shield-205", "tops-shield-220", "r220f", "tops-shield-400", "d6-pro", "tops-shield-200", "tops-shield-200-cup", "tops-shield-200-battery", "gmb-4s-battery", "ta300-charger", "tops-bag-200", "tops-bag-220"]));
    expect(visibleVariants.map((variant) => variant.sourceId)).toEqual(expect.arrayContaining(["5", "19", "20", "25", "26", "27", "28", "29", "34", "35", "36", "69", "70", "71", "72", "78", "79", "83", "84"]));
  });

  it("keeps every catalogue family and variant from content/products", () => {
    expect(productFamilies).toHaveLength(20);
    expect(productFamilies.flatMap((family) => family.variants)).toHaveLength(28);
    expect(productFamilies.every((family) => family.name.length > 0 && family.category.length > 0)).toBe(true);
  });

  it("groups TOPS Shield configurations as selectable versions with their own prices", () => {
    const topsShield205 = productFamilies.find((family) => family.familyId === "tops-shield-205");
    const topsShield220 = productFamilies.find((family) => family.familyId === "tops-shield-220");

    expect(topsShield205?.variants.map((variant) => `${variant.label}:${variant.price}`)).toEqual(["RTF:HK$2,430", "PNP:HK$1,900"]);
    expect(topsShield220?.variants.map((variant) => variant.label)).toEqual(["RTF", "RTF + Bag", "PNP"]);
  });

  it("numbers product variants sequentially from #1", () => {
    const variants = productFamilies.flatMap((family) => family.variants);
    expect(variants.map((variant) => variant.number)).toEqual(Array.from({ length: variants.length }, (_, index) => String(index + 1)));
  });

  it("uses the revised custom equipment request copy in Traditional Chinese", () => {
    expect(traditionalChineseTranslations["Share your requirements and questions and we will help find the best equipment for you."]).toBe("分享您的要求及問題，我們會協助您尋找最適合的設備。");
  });

  it("gives every variant a price and image", () => {
    const variants = productFamilies.flatMap((family) => family.variants);
    expect(variants.every((variant) => /^HK\$[\d,]+(?:\.\d{1,2})?$/.test(variant.price))).toBe(true);
    expect(variants.every((variant) => variant.image.length > 0 && variant.imageAlt.length > 0)).toBe(true);
  });

  it("restores only valid known cart lines from local persistence and applies the Tier 1 minimum", () => {
    const keys = ["25-t1", "25-t2", "26-t2care", "79-t1", "28-t1", "29-t1"];
    const savedCart = sanitizeProductCart({ "25-t1": 1, "25-t2": 1, "26-t2care": 99, "79-t1": 1, "25": 3, unknown: 1, "28-t1": 100, "29-t1": "3" }, keys, cartLineMinimum);

    expect(savedCart).toEqual({ "25-t1": 2, "25-t2": 1, "26-t2care": 99, "79-t1": 1 });
  });

  it("requires 2 pcs for Tier 1 PARTS only drones but allows a single Tier 2 unit", () => {
    const rtf205 = productFamilies.find((family) => family.familyId === "tops-shield-205")!.variants[0];
    const charger = productFamilies.find((family) => family.familyId === "d6-pro")!.variants[0];
    expect(minimumQuantity(rtf205, "t1")).toBe(2);
    expect(minimumQuantity(rtf205, "t2")).toBe(1);
    expect(minimumQuantity(rtf205, "t2care")).toBe(1);
    expect(minimumQuantity(charger, "t1")).toBe(1);
    expect(cartLineMinimum(cartKey(rtf205.sourceId, "t1"))).toBe(2);
  });

  it("prices and labels each service option for the quote request", () => {
    const rtf205 = productFamilies.find((family) => family.familyId === "tops-shield-205")!.variants[0];
    expect(servicePrice(rtf205, "t1")).toBe("HK$2,430");
    expect(servicePrice(rtf205, "t2")).toBe("HK$3,430");
    expect(servicePrice(rtf205, "t2care")).toBe("HK$3,990");
    expect(serviceOptionLabel(rtf205, "t2care")).toBe("Tier 2 VLI-verified + VLI-CARE");
    expect(serviceOptionLabel(productFamilies.find((family) => family.familyId === "d6-pro")!.variants[0], "t1")).toBe("");
  });

  it("keeps static product images when an existing database record has an incomplete upload URL", () => {
    const fallback = productFamilies.find((family) => family.familyId === "tops-shield-205");
    const merged = mergeCatalogueWithDatabase([{
      familyId: "tops-shield-205",
      name: "TOPS Shield 205",
      category: "Drone platform",
      description: "Updated description",
      imageUrl: "/manus-storage/",
      imageAlt: "",
      refNumber: "25–26",
      variants: [{ name: "RTF", model: "TZ009", price: "HK$3,330" }],
    }]);

    const updatedFamily = merged.find((family) => family.familyId === "tops-shield-205");
    expect(updatedFamily?.variants[0].image).toBe(fallback?.variants[0].image);
    expect(updatedFamily?.variants[0].fallbackImage).toBe(fallback?.variants[0].image);
    expect(isValidCatalogImageUrl("/manus-storage/")).toBe(false);
    expect(isValidCatalogImageUrl("/manus-storage/uploaded-image.png")).toBe(true);
  });

  it("keeps the floating quote cart in the top-right clear of the site header", () => {
    expect(quoteCartTopRightClasses.trigger).toContain("right-4 top-20");
    expect(quoteCartTopRightClasses.trigger).toContain("sm:right-6 sm:top-24");
    expect(quoteCartTopRightClasses.trigger).not.toContain("top-1/2");
    expect(quoteCartTopRightClasses.panel).toContain("top-36");
    expect(quoteCartTopRightClasses.panel).not.toContain("bottom-24");
  });
});
