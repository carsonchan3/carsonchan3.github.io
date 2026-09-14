import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import type { ProductDetail, ProductVariant } from "@/components/ProductDetailDialog";
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
