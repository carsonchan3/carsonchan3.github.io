import { describe, expect, it } from "vitest";
import { sanitizeProductCart } from "@/lib/productCart";
import { catalogueItems, isValidCatalogImageUrl, mergeCatalogueWithDatabase, productFamilies, quoteCartTopRightClasses } from "./Equipment";

describe("Spreadsheet-backed equipment catalogue content", () => {
  it("keeps the active catalogue records while presenting them as compact product families", () => {
    expect(catalogueItems).toHaveLength(21);
    expect(productFamilies).toHaveLength(13);
    expect(productFamilies.flatMap((family) => family.variants)).toHaveLength(21);
    expect(catalogueItems.every((item) => item.name.length > 0 && item.description.length >= 30 && item.description.length <= 110)).toBe(true);
    expect(catalogueItems.every((item) => item.category.length > 0 && item.sourceId.length > 0)).toBe(true);
  });

  it("groups TOPS Shield configurations as selectable versions with their own prices", () => {
    const topsShield205 = productFamilies.find((family) => family.familyId === "tops-shield-205");
    const topsShield220 = productFamilies.find((family) => family.familyId === "tops-shield-220");

    expect(topsShield205?.variants.map((variant) => `${variant.label}:${variant.price}`)).toEqual(["RTF:HK$3,330", "PNP:HK$2,110"]);
    expect(topsShield220?.variants.map((variant) => variant.label)).toEqual(["RTF", "RTF + Bag", "PNP"]);
  });

  it("renumbers active product variants sequentially from #1 and excludes the former #79 item", () => {
    const variants = productFamilies.flatMap((family) => family.variants);

    expect(variants.map((variant) => variant.number)).toEqual(Array.from({ length: 21 }, (_, index) => String(index + 1)));
    expect(variants.some((variant) => variant.sourceId === "79" || variant.name.includes("TA300"))).toBe(false);
  });

  it("does not expose placeholder copy in the catalogue data", () => {
    const visibleCopy = catalogueItems.flatMap((item) => [item.name, item.category, item.description]).join(" ");

    expect(visibleCopy.toLowerCase()).not.toContain("placeholder");
  });

  it("uses the spreadsheet HKD price and photo for every item", () => {
    expect(catalogueItems.every((item) => /^HK\$[\d,]+$/.test(item.price))).toBe(true);
    expect(catalogueItems.every((item) => item.image.startsWith("/manus-storage/excel_prod_") && item.imageAlt.length > 0)).toBe(true);
  });

  it("restores only valid known cart quantities from local persistence", () => {
    const variantIds = productFamilies.flatMap((family) => family.variants.map((variant) => variant.sourceId));
    const savedCart = sanitizeProductCart({ "25": 2, "26": 99, "79": 1, unknown: 1, "27": 0, "28": 100, "29": "3" }, variantIds);

    expect(savedCart).toEqual({ "25": 2, "26": 99 });
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
