import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";

export type WebsiteLanguage = "en" | "zh-Hant";

type LanguageContextValue = {
  language: WebsiteLanguage;
  setLanguage: (language: WebsiteLanguage) => void;
};

const storageKey = "vli-website-language";
const LanguageContext = createContext<LanguageContextValue>({ language: "en", setLanguage: () => undefined });

function initialLanguage(): WebsiteLanguage {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem(storageKey) === "zh-Hant" ? "zh-Hant" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<WebsiteLanguage>(initialLanguage);

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useWebsiteLanguage() {
  return useContext(LanguageContext);
}
