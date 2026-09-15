import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import type { ProductDetail, ProductVariant, PremiumProductContent, PremiumTier } from "@/components/ProductDetailDialog";
import { productContent } from "./productContent.generated";

export type ProductContentRecord = (typeof productContent)[number];

export const getProductContent = (familyId: string) => productContent.find((item) => item.familyId === familyId);

export const productContentText = (familyId: string, language: WebsiteLanguage) => {
  const content = getProductContent(familyId);
  if (!content) return undefined;
  return {
    title: content.title[language],
    description: content.description[language],
  };
};

export function applyProductContent(family: ProductDetail, language: WebsiteLanguage): ProductDetail {
  const content = productContentText(family.familyId, language);
  if (!content) return family;
  return {
    ...family,
    description: content.description,
    variants: family.variants.map((variant: ProductVariant) => ({ ...variant, description: content.description })),
  };
}

export function getEditablePremiumProductContent(
  familyId: string,
  language: WebsiteLanguage,
  fallback: PremiumProductContent | undefined,
): PremiumProductContent | undefined {
  const record = getProductContent(familyId);
  const detail = record?.detail?.[language];
  if (!detail || !fallback) return fallback;
  const tiers = Object.fromEntries(
    (Object.keys(fallback.tiers) as PremiumTier[]).map((tier) => {
      const fallbackTier = fallback.tiers[tier];
      const markdownTier = detail.tiers[tier];
      return [tier, {
        ...(fallbackTier ?? {}),
        label: markdownTier?.label ?? fallbackTier?.label ?? tier,
        subtitle: markdownTier?.subtitle ?? fallbackTier?.subtitle ?? "",
        features: markdownTier?.features ?? fallbackTier?.features ?? [],
      }];
    }),
  ) as PremiumProductContent["tiers"];
  return {
    ...fallback,
    title: detail.premiumTitle || fallback.title,
    pitch: record.description[language],
    platformLabel: detail.platformLabel || fallback.platformLabel,
    certifiedCare: Boolean(detail.careTitle) && Boolean(detail.careDescription) ? fallback.certifiedCare : false,
    careTitle: detail.careTitle || fallback.careTitle,
    careDescription: detail.careDescription || fallback.careDescription,
    tiers,
    specifications: detail.specifications,
    inTheBox: detail.inTheBox,
  };
}

export function getEditableCareCopy(familyId: string, language: WebsiteLanguage) {
  const detail = getProductContent(familyId)?.detail?.[language];
  if (!detail || !detail.careTitle || !detail.careDescription) return undefined;
  return { title: detail.careTitle, description: detail.careDescription };
}
