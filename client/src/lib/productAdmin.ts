export function createProductFamilyId(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "new-product";
}

export function resolveProductImageAlt(imageAlt: string, productName: string): string {
  return imageAlt.trim() || `${productName.trim()} product image`;
}

export function isProductFamilyIdAvailable(existingFamilyIds: string[], familyId: string): boolean {
  return !existingFamilyIds.includes(familyId.trim());
}
