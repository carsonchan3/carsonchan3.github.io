import { useEffect } from "react";
import { useWebsiteLanguage, type WebsiteLanguage } from "@/contexts/LanguageContext";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";

const textOriginals = new WeakMap<Text, string>();
const attributeOriginals = new WeakMap<Element, Map<string, string>>();
const translatableAttributes = ["aria-label", "aria-description", "alt", "placeholder", "title"];

export function translateReviewedCopy(source: string, language: WebsiteLanguage) {
  if (language === "en") return source;
  const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return source;
  const [, prefix, core, suffix] = match;
  return `${prefix}${traditionalChineseTranslations[core] ?? core}${suffix}`;
}

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  return !parent || ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName) || Boolean(parent.closest(".vli-language-toggle, [data-live-metric]"));
}

function translateTextNode(node: Text, language: WebsiteLanguage) {
  if (shouldSkipTextNode(node)) return;
  const original = textOriginals.get(node) ?? node.data;
  textOriginals.set(node, original);
  const translated = translateReviewedCopy(original, language);
  if (node.data !== translated) node.data = translated;
}

function translateElementAttributes(element: Element, language: WebsiteLanguage) {
  if (element.closest(".vli-language-toggle, [data-live-metric]")) return;
  const originals = attributeOriginals.get(element) ?? new Map<string, string>();
  attributeOriginals.set(element, originals);
  for (const attribute of translatableAttributes) {
    const current = element.getAttribute(attribute);
    if (current === null) continue;
    const original = originals.get(attribute) ?? current;
    originals.set(attribute, original);
    const translated = translateReviewedCopy(original, language);
    if (current !== translated) element.setAttribute(attribute, translated);
  }
}

function translateTree(root: Node, language: WebsiteLanguage) {
  if (root.nodeType === Node.TEXT_NODE) translateTextNode(root as Text, language);
  if (root.nodeType === Node.ELEMENT_NODE) translateElementAttributes(root as Element, language);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text, language);
    node = walker.nextNode();
  }
  if (root.nodeType === Node.ELEMENT_NODE) {
    (root as Element).querySelectorAll("*").forEach((element) => translateElementAttributes(element, language));
  }
}

export default function WebsiteTranslationObserver() {
  const { language } = useWebsiteLanguage();

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    translateTree(root, language);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target as Text, language);
        }
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          translateElementAttributes(mutation.target, language);
        }
        Array.from(mutation.addedNodes).forEach((node) => translateTree(node, language));
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: translatableAttributes });
    return () => observer.disconnect();
  }, [language]);

  return null;
}
