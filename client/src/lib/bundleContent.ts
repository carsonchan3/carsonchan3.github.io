import { marked } from "marked";
import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";
import { bundleContent, type BundleContentRecord } from "./bundleContent.generated";

export type { BundleContentRecord };
export { bundleContent };

export const visibleBundles = bundleContent.filter((bundle) => bundle.visible);
/** The Bundles page shows equipment bundles and taught STEM programmes as separate groups. */
export const equipmentBundles = visibleBundles.filter((bundle) => bundle.group === "equipment");
export const programmeBundles = visibleBundles.filter((bundle) => bundle.group === "programme");

/** Renders one "What's included" line; site links such as (/scoreboard) follow the page language. */
export function renderBundleLine(markdown: string, language: WebsiteLanguage) {
  const html = marked.parseInline(markdown, { gfm: true }) as string;
  return html.replace(/href="(\/[^"]*)"/g, (_match, href: string) => `href="${staticSitePath(localizedPath(href, language))}"`);
}
