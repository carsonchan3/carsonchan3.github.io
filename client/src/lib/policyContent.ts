import { marked } from "marked";
import type { WebsiteLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";
import { policyContent, type PolicyContentRecord } from "./policyContent.generated";

export type { PolicyContentRecord };
export type PolicyPageKey = PolicyContentRecord["page"];

export const policyPagePaths: Record<PolicyPageKey, string> = { legal: "/legal", sales: "/sales-policy" };

export const policiesForPage = (page: PolicyPageKey) => policyContent.filter((policy) => policy.page === page);

const slugify = (text: string) => text.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Section headings (##) of a policy, used for its in-page contents list. */
export function policySections(policy: PolicyContentRecord) {
  return [...policy.body.matchAll(/^## (.+)$/gm)].map(([, title]) => ({ title: title.trim(), id: `${policy.id}-${slugify(title)}` }));
}

/** Renders a policy body: section headings get linkable ids, and site links follow the page language. */
export function renderPolicy(policy: PolicyContentRecord, language: WebsiteLanguage) {
  const html = marked.parse(policy.body, { gfm: true, breaks: true }) as string;
  return html
    .replace(/<h2>(.*?)<\/h2>/g, (_match, title: string) => `<h2 id="${policy.id}-${slugify(title)}">${title}</h2>`)
    .replace(/<table>/g, '<div class="policy-table"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/href="(\/[^"]*)"/g, (_match, href: string) => `href="${staticSitePath(localizedPath(href, language))}"`)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

export function formatPolicyDate(date: string, language: WebsiteLanguage) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(language === "zh-Hant" ? "zh-HK" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
