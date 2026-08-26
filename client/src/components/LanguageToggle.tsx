import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import type { MouseEvent } from "react";
import { languageSwitchPath } from "@/lib/languageNavigation";

type LanguageTogglePlacement = "inline" | "desktop" | "mobile-toolbar";

export default function LanguageToggle({ className = "", placement = "inline" }: { className?: string; placement?: LanguageTogglePlacement }) {
  const { language, setLanguage } = useWebsiteLanguage();
  const [location] = useLocation();
  const placementClass = placement === "desktop" ? "hidden lg:inline-flex" : "inline-flex";

  const languageHref = (nextLanguage: "en" | "zh-Hant") => languageSwitchPath(location, nextLanguage);
  const chooseLanguage = (event: MouseEvent<HTMLAnchorElement>, nextLanguage: "en" | "zh-Hant") => {
    event.preventDefault();
    setLanguage(nextLanguage);

    const destination = event.currentTarget.href;
    if (typeof window !== "undefined" && window.location.href !== destination) window.location.assign(destination);
  };

  if (placement === "mobile-toolbar") {
    const nextLanguage = language === "zh-Hant" ? "en" : "zh-Hant";
    return <a href={languageHref(nextLanguage)} data-placement={placement} data-testid="language-toolbar-toggle" onClick={(event) => chooseLanguage(event, nextLanguage)} aria-label={language === "zh-Hant" ? "切換至英文" : "切換至繁體中文"} aria-pressed={language === "zh-Hant"} className={`vli-language-toggle inline-flex size-11 touch-manipulation items-center justify-center rounded-full border text-sm font-semibold transition-colors lg:hidden ${className}`}>{language === "zh-Hant" ? "ENG" : "中"}</a>;
  }

  return (
    <div data-placement={placement} className={`vli-language-toggle ${placementClass} items-center rounded-full border p-1 text-xs font-semibold backdrop-blur ${className}`} role="group" aria-label="Language selector">
      <a href={languageHref("zh-Hant")} data-testid="language-zh" data-language={language === "zh-Hant" ? "active" : "inactive"} onClick={(event) => chooseLanguage(event, "zh-Hant")} aria-pressed={language === "zh-Hant"} className={`rounded-full px-3 py-1.5 transition-colors ${placement === "inline" ? "inline-flex min-h-11 touch-manipulation items-center" : ""}`}>中</a>
      <a href={languageHref("en")} data-testid="language-en" data-language={language === "en" ? "active" : "inactive"} onClick={(event) => chooseLanguage(event, "en")} aria-pressed={language === "en"} className={`rounded-full px-3 py-1.5 transition-colors ${placement === "inline" ? "inline-flex min-h-11 touch-manipulation items-center" : ""}`}>ENG</a>
    </div>
  );
}
