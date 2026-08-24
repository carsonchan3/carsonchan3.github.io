import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { parseHTML } from "linkedom";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import superjson from "superjson";
import App from "../client/src/App";
import { translateReviewedCopy } from "../client/src/components/WebsiteTranslationObserver";
import type { WebsiteLanguage } from "../client/src/contexts/LanguageContext";
import { absoluteUrl, buildStructuredData, getSeoPage, localizedPath, publicSeoPages, siteOrigin } from "../client/src/lib/seo";
import { trpc } from "../client/src/lib/trpc";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist", "public");
const translatableAttributes = ["aria-label", "aria-description", "alt", "placeholder", "title"];

function createStaticApp(route: string, language: WebsiteLanguage) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { enabled: false, retry: false }, mutations: { retry: false } },
  });
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: "https://velocity-lab.com/api/trpc", transformer: superjson })],
  });

  return renderToStaticMarkup(
    createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(
        trpc.Provider,
        { client: trpcClient, queryClient },
        createElement(App, { initialLanguage: language, ssrPath: route }),
      ),
    ),
  );
}

function translateStaticTree(root: Element, language: WebsiteLanguage) {
  if (language === "en") return;
  const visit = (element: Element) => {
    const shouldSkip = element.closest(".vli-language-toggle, [data-live-metric]") || ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(element.tagName);
    if (shouldSkip) return;
    for (const attribute of translatableAttributes) {
      const current = element.getAttribute(attribute);
      if (current !== null) element.setAttribute(attribute, translateReviewedCopy(current, language));
    }
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === 3) {
        node.textContent = translateReviewedCopy(node.textContent ?? "", language);
      } else if (node.nodeType === 1) {
        visit(node as Element);
      }
    }
  };
  visit(root);
}

function localizeStaticLinks(document: Document, language: WebsiteLanguage) {
  if (language === "en") return;
  document.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("/manus-storage/") || /^(https?:|mailto:|tel:)/.test(href)) return;
    if (href.startsWith("/")) anchor.setAttribute("href", localizedPath(href, language));
  });
}

function setMeta(document: Document, selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as Element | null;
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function setLink(document: Document, selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as Element | null;
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
}

function applySeoHead(document: Document, route: string, language: WebsiteLanguage) {
  const page = getSeoPage(route);
  if (!page) throw new Error(`No public SEO page configured for ${route}`);
  const copy = page.copy[language];
  const canonical = absoluteUrl(page.path, language);
  document.documentElement.setAttribute("lang", language);
  document.title = copy.title;
  setMeta(document, 'meta[name="description"]', { name: "description", content: copy.description });
  setMeta(document, 'meta[name="robots"]', { name: "robots", content: "index, follow" });
  setLink(document, 'link[rel="canonical"]', { rel: "canonical", href: canonical });
  setLink(document, 'link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: absoluteUrl(page.path, "en") });
  setLink(document, 'link[rel="alternate"][hreflang="zh-Hant"]', { rel: "alternate", hreflang: "zh-Hant", href: absoluteUrl(page.path, "zh-Hant") });
  setLink(document, 'link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: new URL(page.path, siteOrigin).toString() });
  setMeta(document, 'meta[property="og:type"]', { property: "og:type", content: "website" });
  setMeta(document, 'meta[property="og:site_name"]', { property: "og:site_name", content: "Velocity Lab Innovation" });
  setMeta(document, 'meta[property="og:locale"]', { property: "og:locale", content: language === "zh-Hant" ? "zh_HK" : "en_US" });
  setMeta(document, 'meta[property="og:title"]', { property: "og:title", content: copy.title });
  setMeta(document, 'meta[property="og:description"]', { property: "og:description", content: copy.description });
  setMeta(document, 'meta[property="og:url"]', { property: "og:url", content: canonical });
  setMeta(document, 'meta[property="og:image"]', { property: "og:image", content: page.socialImage });
  setMeta(document, 'meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  setMeta(document, 'meta[name="twitter:title"]', { name: "twitter:title", content: copy.title });
  setMeta(document, 'meta[name="twitter:description"]', { name: "twitter:description", content: copy.description });
  setMeta(document, 'meta[name="twitter:image"]', { name: "twitter:image", content: page.socialImage });
  const schema = document.createElement("script");
  schema.setAttribute("type", "application/ld+json");
  schema.setAttribute("data-seo-schema", "true");
  schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": buildStructuredData(page, language) });
  document.head.querySelector('script[data-seo-schema="true"]')?.remove();
  document.head.appendChild(schema);
}

function applyNoIndexHead(document: Document) {
  document.documentElement.setAttribute("lang", "en");
  document.title = "Page not found | Velocity Lab Innovation";
  setMeta(document, 'meta[name="description"]', { name: "description", content: "The requested Velocity Lab Innovation page is not available." });
  setMeta(document, 'meta[name="robots"]', { name: "robots", content: "noindex, nofollow" });
}

function buildSitemap() {
  const urlEntries = publicSeoPages.flatMap((page) => {
    const variants: WebsiteLanguage[] = ["en", "zh-Hant"];
    return variants.map((language) => {
      const alternateLinks = variants.map((alternateLanguage) => `    <xhtml:link rel="alternate" hreflang="${alternateLanguage}" href="${absoluteUrl(page.path, alternateLanguage)}" />`).join("\n");
      return `  <url>\n    <loc>${absoluteUrl(page.path, language)}</loc>\n${alternateLinks}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL(page.path, siteOrigin).toString()}" />\n  </url>`;
    });
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urlEntries.join("\n")}\n</urlset>\n`;
}

async function writeDocument(destination: string, html: string) {
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `<!doctype html>\n${html}`, "utf8");
}

async function prerenderPublicPages() {
  const template = await readFile(path.join(outputRoot, "index.html"), "utf8");
  for (const page of publicSeoPages) {
    for (const language of ["en", "zh-Hant"] as const) {
      const { document } = parseHTML(template);
      const root = document.getElementById("root");
      if (!root) throw new Error("Static build is missing the #root element");
      root.innerHTML = createStaticApp(page.path, language);
      root.setAttribute("data-seo-prerendered", "true");
      translateStaticTree(root, language);
      localizeStaticLinks(document, language);
      applySeoHead(document, page.path, language);
      const outputPath = language === "en"
        ? (page.path === "/" ? path.join(outputRoot, "index.html") : path.join(outputRoot, page.path.slice(1), "index.html"))
        : path.join(outputRoot, "zh-hant", ...(page.path === "/" ? [] : [page.path.slice(1)]), "index.html");
      await writeDocument(outputPath, document.toString());
    }
  }

  const { document: notFoundDocument } = parseHTML(template);
  const notFoundRoot = notFoundDocument.getElementById("root");
  if (!notFoundRoot) throw new Error("Static build is missing the #root element");
  notFoundRoot.innerHTML = createStaticApp("/404", "en");
  notFoundRoot.setAttribute("data-seo-prerendered", "true");
  applyNoIndexHead(notFoundDocument);
  await writeDocument(path.join(outputRoot, "404.html"), notFoundDocument.toString());
  await writeFile(path.join(outputRoot, "sitemap.xml"), buildSitemap(), "utf8");
}

await prerenderPublicPages();
