export function matchesCatalogSearch(query: string, fields: Array<string | null | undefined>) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return fields.some((field) => field?.toLowerCase().includes(normalizedQuery));
}
