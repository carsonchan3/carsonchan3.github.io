import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import type { ProductDetail, ProductVariant, PremiumProductContent } from "@/components/ProductDetailDialog";
import { productContent, type ProductDetailContentRecord } from "./productContent.generated";

export type ProductContentRecord = ProductDetailContentRecord;

export const getProductContent = (familyId: string) => productContent.find((item) => item.familyId === familyId);

export const productContentText = (familyId: string, language: WebsiteLanguage) => {
  const content = getProductContent(familyId);
  if (!content) return undefined;
  return {
    title: content.title[language],
    category: content.category[language],
    description: content.description[language],
  };
};

/** Builds the catalogue from content/products/*.md. Reference numbers run sequentially across every family in `order`. */
export function buildProductFamilies(records: readonly ProductContentRecord[] = productContent): ProductDetail[] {
  let counter = 0;
  return records.map((record) => {
    const first = counter + 1;
    const variants: ProductVariant[] = record.variants.map((variant) => ({
      sourceId: variant.id,
      number: String(++counter),
      label: variant.label,
      name: variant.name,
      model: variant.model,
      description: record.description.en,
      price: variant.price,
      image: variant.image,
      imageAlt: variant.imageAlt,
      ...(variant.tier ? { tier: variant.tier } : {}),
    }));
    return {
      familyId: record.familyId,
      reference: variants.length > 1 ? `${first}–${counter}` : String(first),
      name: record.title.en,
      category: record.category.en,
      description: record.description.en,
      variants,
    };
  });
}

export const hiddenProductFamilyIds = new Set(productContent.filter((record) => !record.visible).map((record) => record.familyId));

export function applyProductContent(family: ProductDetail, language: WebsiteLanguage): ProductDetail {
  const content = productContentText(family.familyId, language);
  if (!content) return family;
  return {
    ...family,
    name: content.title,
    category: content.category,
    description: content.description,
    variants: family.variants.map((variant: ProductVariant) => ({ ...variant, description: content.description })),
  };
}

export function getPremiumProductContent(familyId: string, language: WebsiteLanguage): PremiumProductContent | undefined {
  const record = getProductContent(familyId);
  const detail = record?.detail?.[language];
  if (!record || !detail) return undefined;
  const tierIds = Object.keys(detail.tiers);
  const defaultTier = record.defaultTier && tierIds.includes(record.defaultTier)
    ? record.defaultTier
    : tierIds.includes("certified") ? "certified" : tierIds[0];
  return {
    testId: `${familyId}-premium-detail`,
    title: detail.premiumTitle,
    pitch: record.description[language],
    platformLabel: detail.platformLabel,
    defaultTier,
    tiers: detail.tiers,
    specifications: detail.specifications,
    inTheBox: detail.inTheBox,
    careTiers: record.vliCareTiers,
    careTitle: detail.careTitle,
    careDescription: detail.careDescription,
  };
}

export function getEditableCareCopy(familyId: string, language: WebsiteLanguage) {
  const detail = getProductContent(familyId)?.detail?.[language];
  if (!detail || !detail.careTitle || !detail.careDescription) return undefined;
  return { title: detail.careTitle, description: detail.careDescription };
}
