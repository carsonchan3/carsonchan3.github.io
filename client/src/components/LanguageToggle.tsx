import { useState } from "react";
import { toast } from "sonner";

type LanguageTogglePlacement = "inline" | "desktop" | "mobile-toolbar";

export default function LanguageToggle({ className = "", placement = "inline" }: { className?: string; placement?: LanguageTogglePlacement }) {
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const placementClass = placement === "desktop" ? "hidden lg:inline-flex" : "inline-flex";

  const chooseLanguage = (nextLanguage: "en" | "zh") => {
    if (nextLanguage === "zh") {
      toast.info("中文內容準備中，目前只提供英文版本。", { description: "Chinese page content is being prepared." });
      return;
    }
    setLanguage("en");
  };

  if (placement === "mobile-toolbar") {
    return <button type="button" data-placement={placement} data-testid="language-toolbar-zh" onClick={() => chooseLanguage("zh")} aria-label="Chinese language option" aria-pressed={language === "zh"} className={`vli-language-toggle inline-flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors lg:hidden ${className}`}>中</button>;
  }

  return (
    <div data-placement={placement} className={`vli-language-toggle ${placementClass} items-center rounded-full border p-1 text-xs font-semibold backdrop-blur ${className}`} role="group" aria-label="Language selector">
      <button type="button" data-testid="language-zh" data-language={language === "zh" ? "active" : "inactive"} onClick={() => chooseLanguage("zh")} aria-pressed={language === "zh"} className="rounded-full px-3 py-1.5 transition-colors">中</button>
      <button type="button" data-testid="language-en" data-language={language === "en" ? "active" : "inactive"} onClick={() => chooseLanguage("en")} aria-pressed={language === "en"} className="rounded-full px-3 py-1.5 transition-colors">ENG</button>
    </div>
  );
}
