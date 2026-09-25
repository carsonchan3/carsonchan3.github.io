import type { ProductVariant } from "@/components/ProductDetailDialog";

/** Service option a variant is quoted under: Tier 1 PARTS only, Tier 2 VLI-verified, or Tier 2 plus the VLI-CARE add-on. */
export type ServiceOption = "t1" | "t2" | "t2care";

export function addPrices(base: string, addOn?: string) {
  if (!addOn) return base;
  const baseValue = Number(base.replace(/[^\d.]/g, ""));
  const addOnValue = Number(addOn.replace(/[^\d.]/g, ""));
  return Number.isFinite(baseValue) && Number.isFinite(addOnValue) ? `HK$${(baseValue + addOnValue).toLocaleString("en-HK")}` : `${base} + ${addOn}`;
}

/** Options a variant can actually be sold under, from content/pricing.md. */
export function availableServiceOptions(variant: ProductVariant): ServiceOption[] {
  if (!variant.tier2Price) return ["t1"];
  return variant.vliCarePrice ? ["t1", "t2", "t2care"] : ["t1", "t2"];
}

export function servicePrice(variant: ProductVariant, option: ServiceOption) {
  if (option === "t2" && variant.tier2Price) return variant.tier2Price;
  if (option === "t2care" && variant.tier2Price) return addPrices(variant.tier2Price, variant.vliCarePrice);
  return variant.tier1Price ?? variant.price;
}

/** Short English label added to quote-request lines; empty for items sold only at one price. */
export function serviceOptionLabel(variant: ProductVariant, option: ServiceOption) {
  if (!variant.tier2Price) return "";
  if (option === "t2care") return "Tier 2 VLI-verified + VLI-CARE";
  if (option === "t2") return "Tier 2 VLI-verified";
  return "Tier 1 PARTS only";
}

/** Minimum order quantity; only Tier 1 carries one (Tier 1 min. qty in content/pricing.md). */
export function minimumQuantity(variant: ProductVariant, option: ServiceOption) {
  return option === "t1" ? Math.max(1, variant.tier1MinQty ?? 1) : 1;
}

const cartKeyPattern = /^(.+)-(t1|t2|t2care)$/;
export const cartKey = (sourceId: string, option: ServiceOption) => `${sourceId}-${option}`;
export function parseCartKey(key: string): { sourceId: string; option: ServiceOption } | null {
  const match = cartKeyPattern.exec(key);
  return match ? { sourceId: match[1], option: match[2] as ServiceOption } : null;
}
