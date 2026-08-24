import { useEffect } from "react";
import { useLocation } from "wouter";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { absoluteUrl, buildStructuredData, getSeoPage, isPrivateOrNonIndexablePath, localizedPath } from "@/lib/seo";

type HeadElementTag = "meta" | "link" | "script";

function ensureHeadElement(tag: HeadElementTag, selector: string, attributes: Record<string, string>, content?: string) {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = document.createElement(tag);
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
  if (content !== undefined) element.textContent = content;
  return element;
}

export default function SeoHead() {
  const [location] = useLocation();
  const { language } = useWebsiteLanguage();

  useEffect(() => {
    const page = getSeoPage(location);
    if (!page || isPrivateOrNonIndexablePath(location)) {
      document.title = "Velocity Lab Innovation";
      ensureHeadElement("meta", 'meta[name="robots"]', { name: "robots", content: "noindex, nofollow" });
      document.head.querySelectorAll('[data-seo-managed="true"]').forEach((element) => element.remove());
      return;
    }

    const copy = page.copy[language];
    const canonical = absoluteUrl(page.path, language);
    document.title = copy.title;
    document.documentElement.lang = language;
    ensureHeadElement("meta", 'meta[name="description"]', { name: "description", content: copy.description });
    ensureHeadElement("meta", 'meta[name="robots"]', { name: "robots", content: "index, follow" });
    ensureHeadElement("link", 'link[rel="canonical"]', { rel: "canonical", href: canonical });
    ensureHeadElement("link", 'link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: absoluteUrl(page.path, "en") });
    ensureHeadElement("link", 'link[rel="alternate"][hreflang="zh-Hant"]', { rel: "alternate", hreflang: "zh-Hant", href: absoluteUrl(page.path, "zh-Hant") });
    ensureHeadElement("link", 'link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: absoluteUrl(page.path, "en") });
    ensureHeadElement("meta", 'meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureHeadElement("meta", 'meta[property="og:site_name"]', { property: "og:site_name", content: "Velocity Lab Innovation" });
    ensureHeadElement("meta", 'meta[property="og:locale"]', { property: "og:locale", content: language === "zh-Hant" ? "zh_HK" : "en_US" });
    ensureHeadElement("meta", 'meta[property="og:title"]', { property: "og:title", content: copy.title });
    ensureHeadElement("meta", 'meta[property="og:description"]', { property: "og:description", content: copy.description });
    ensureHeadElement("meta", 'meta[property="og:url"]', { property: "og:url", content: canonical });
    ensureHeadElement("meta", 'meta[property="og:image"]', { property: "og:image", content: page.socialImage });
    ensureHeadElement("meta", 'meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureHeadElement("meta", 'meta[name="twitter:title"]', { name: "twitter:title", content: copy.title });
    ensureHeadElement("meta", 'meta[name="twitter:description"]', { name: "twitter:description", content: copy.description });
    ensureHeadElement("meta", 'meta[name="twitter:image"]', { name: "twitter:image", content: page.socialImage });
    ensureHeadElement("script", 'script[data-seo-schema="true"]', { type: "application/ld+json", "data-seo-schema": "true" }, JSON.stringify({ "@context": "https://schema.org", "@graph": buildStructuredData(page, language) }));

    const managedPaths = Array.from(document.head.querySelectorAll('[data-seo-managed="true"]'));
    managedPaths.forEach((element) => element.remove());
    const currentLanguageTarget = localizedPath(page.path, language);
    if (currentLanguageTarget !== location) window.history.replaceState({}, "", currentLanguageTarget);
  }, [language, location]);

  return null;
}
