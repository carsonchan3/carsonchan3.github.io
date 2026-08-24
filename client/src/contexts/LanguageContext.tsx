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
  if (window.location.pathname === "/zh-hant" || window.location.pathname.startsWith("/zh-hant/")) return "zh-Hant";
  return "en";
}

export function LanguageProvider({ children, initialLanguage: preferredLanguage }: { children: ReactNode; initialLanguage?: WebsiteLanguage }) {
  const [language, setLanguage] = useState<WebsiteLanguage>(() => preferredLanguage ?? initialLanguage());

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
