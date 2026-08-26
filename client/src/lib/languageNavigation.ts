import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/seo";

export function languageSwitchPath(currentPath: string, nextLanguage: WebsiteLanguage) {
  return localizedPath(currentPath, nextLanguage);
}
