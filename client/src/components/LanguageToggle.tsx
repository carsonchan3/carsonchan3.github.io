import { useWebsiteLanguage } from "@/contexts/LanguageContext";

type LanguageTogglePlacement = "inline" | "desktop" | "mobile-toolbar";

export default function LanguageToggle({ className = "", placement = "inline" }: { className?: string; placement?: LanguageTogglePlacement }) {
  const { language, setLanguage } = useWebsiteLanguage();
  const placementClass = placement === "desktop" ? "hidden lg:inline-flex" : "inline-flex";

  const chooseLanguage = (nextLanguage: "en" | "zh-Hant") => setLanguage(nextLanguage);

  if (placement === "mobile-toolbar") {
    const nextLanguage = language === "zh-Hant" ? "en" : "zh-Hant";
    return <button type="button" data-placement={placement} data-testid="language-toolbar-toggle" onClick={() => chooseLanguage(nextLanguage)} aria-label={language === "zh-Hant" ? "切換至英文" : "切換至繁體中文"} aria-pressed={language === "zh-Hant"} className={`vli-language-toggle inline-flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors lg:hidden ${className}`}>{language === "zh-Hant" ? "ENG" : "中"}</button>;
  }

  return (
    <div data-placement={placement} className={`vli-language-toggle ${placementClass} items-center rounded-full border p-1 text-xs font-semibold backdrop-blur ${className}`} role="group" aria-label="Language selector">
      <button type="button" data-testid="language-zh" data-language={language === "zh-Hant" ? "active" : "inactive"} onClick={() => chooseLanguage("zh-Hant")} aria-pressed={language === "zh-Hant"} className="rounded-full px-3 py-1.5 transition-colors">中</button>
      <button type="button" data-testid="language-en" data-language={language === "en" ? "active" : "inactive"} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"} className="rounded-full px-3 py-1.5 transition-colors">ENG</button>
    </div>
  );
}
