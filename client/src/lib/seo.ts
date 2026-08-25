import type { WebsiteLanguage } from "@/contexts/LanguageContext";

export const siteOrigin = "https://velocity-lab.com";
export const chineseLocalePrefix = "/zh-hant";
export const publicRoutePaths = ["/", "/dronesportsreferee", "/product", "/services", "/people", "/contact", "/privacy"] as const;
export type PublicRoutePath = (typeof publicRoutePaths)[number];

export type LocalizedSeoCopy = {
  title: string;
  description: string;
};

export type PublicSeoPage = {
  path: PublicRoutePath;
  key: "home" | "referee" | "product" | "services" | "people" | "contact" | "privacy";
  copy: Record<WebsiteLanguage, LocalizedSeoCopy>;
  breadcrumb: string;
  socialImage: string;
  schemas: Array<"organization" | "website" | "breadcrumb" | "service" | "video">;
};

const managedMediaOrigin = "https://velolab-gkpolzge.manus.space";
export const managedMediaUrl = (path: string) => `${managedMediaOrigin}${path}`;

export const publicSeoPages: PublicSeoPage[] = [
  {
    path: "/",
    key: "home",
    copy: {
      en: {
        title: "Velocity Lab Innovation | Smart Referee, Drone Equipment & Services",
        description: "Velocity Lab Innovation provides Smart Referee decision support, drone equipment, repair, coaching, and drone media services for competition and technical programmes.",
      },
      "zh-Hant": {
        title: "速研創新 | Smart Referee、無人機產品及服務",
        description: "速研創新提供 Smart Referee 判決支援、無人機產品、維修、培訓及無人機影像服務，支援賽事及技術項目。",
      },
    },
    breadcrumb: "Home",
    socialImage: managedMediaUrl("/manus-storage/vli-hero-video-first-frame_6e981c30.jpg"),
    schemas: ["organization", "website"],
  },
  {
    path: "/dronesportsreferee",
    key: "referee",
    copy: {
      en: {
        title: "Smart Referee for Drone Sports Organisers | Velocity Lab Innovation",
        description: "Smart Referee gives drone-sports officials a shared, reviewable view of difficult scoring moments, helping organisers apply configured rules and keep competition schedules moving.",
      },
      "zh-Hant": {
        title: "無人機運動 Smart Referee | 速研創新",
        description: "Smart Referee 為無人機運動裁判提供共同、可覆核的困難得分瞬間視角，協助主辦方套用已配置規則並讓賽程清晰推進。",
      },
    },
    breadcrumb: "Smart Referee",
    socialImage: managedMediaUrl("/manus-storage/flex13camerasys_aa73a4e5.jpg"),
    schemas: ["breadcrumb", "service", "video"],
  },
  {
    path: "/product",
    key: "product",
    copy: {
      en: {
        title: "Drone Equipment & Competition Systems | Velocity Lab Innovation",
        description: "Explore drone equipment, power, charging, and venue systems from Velocity Lab Innovation. Request a quote for a competition or technical programme configuration.",
      },
      "zh-Hant": {
        title: "無人機產品與競賽系統 | 速研創新",
        description: "探索速研創新的無人機產品、供電、充電及場地系統，並為您的賽事或技術項目索取配置報價。",
      },
    },
    breadcrumb: "Products",
    socialImage: managedMediaUrl("/manus-storage/vli-hero-video-first-frame_6e981c30.jpg"),
    schemas: ["breadcrumb"],
  },
  {
    path: "/services",
    key: "services",
    copy: {
      en: {
        title: "Drone Repair, Tuning, Coaching & Media Services | VLI",
        description: "Explore Velocity Lab Innovation drone repair, PID tuning, drone-building coaching, adult courses, and professional drone photography and video services.",
      },
      "zh-Hant": {
        title: "無人機維修、調校、培訓及影像服務 | 速研創新",
        description: "探索速研創新的無人機維修、PID 調校、無人機組裝培訓、成人課程及專業無人機攝影與影片服務。",
      },
    },
    breadcrumb: "Services",
    socialImage: managedMediaUrl("/manus-storage/dronerepairthumb_ad988635.jpeg"),
    schemas: ["breadcrumb", "service"],
  },
  {
    path: "/people",
    key: "people",
    copy: {
      en: {
        title: "About Velocity Lab Innovation | Team & Technical Delivery",
        description: "Meet the engineers and drone-sports practitioners behind Velocity Lab Innovation, working across UAV systems, motion technology, robotics, and competition delivery.",
      },
      "zh-Hant": {
        title: "關於速研創新 | 團隊與技術交付",
        description: "認識速研創新背後的工程師及無人機運動實踐者，結合無人機系統、動作技術、機械人及賽事執行的實務經驗。",
      },
    },
    breadcrumb: "About VLI",
    socialImage: managedMediaUrl("/manus-storage/CarsonChan_2ddbd847.png"),
    schemas: ["breadcrumb"],
  },
  {
    path: "/contact",
    key: "contact",
    copy: {
      en: {
        title: "Contact Velocity Lab Innovation | Smart Referee, Products & Services",
        description: "Contact Velocity Lab Innovation about Smart Referee, drone equipment, repair, technical support, coaching, or drone media services.",
      },
      "zh-Hant": {
        title: "聯絡速研創新 | Smart Referee、產品及服務",
        description: "聯絡速研創新，查詢 Smart Referee、無人機產品、維修、技術支援、培訓或無人機影像服務。",
      },
    },
    breadcrumb: "Contact",
    socialImage: managedMediaUrl("/manus-storage/vli-hero-video-first-frame_6e981c30.jpg"),
    schemas: ["breadcrumb"],
  },
  {
    path: "/privacy",
    key: "privacy",
    copy: {
      en: {
        title: "Privacy Notice | Velocity Lab Innovation",
        description: "Read how Velocity Lab Innovation handles information shared through website enquiries and how to contact the team with privacy questions.",
      },
      "zh-Hant": {
        title: "私隱聲明 | 速研創新",
        description: "了解速研創新如何處理您透過網站查詢提供的資料，以及如何聯絡團隊查詢私隱事宜。",
      },
    },
    breadcrumb: "Privacy Notice",
    socialImage: managedMediaUrl("/manus-storage/vli-hero-video-first-frame_6e981c30.jpg"),
    schemas: ["breadcrumb"],
  },
];

export function trimLocalePrefix(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === chineseLocalePrefix) return "/";
  if (normalizedPath.startsWith(`${chineseLocalePrefix}/`)) return normalizedPath.slice(chineseLocalePrefix.length) || "/";
  return normalizedPath;
}

export function localizedPath(path: string, language: WebsiteLanguage) {
  const [pathname, hash = ""] = path.split("#", 2);
  const canonicalPath = trimLocalePrefix(pathname || "/");
  const localizedPathname = language === "zh-Hant" ? `${chineseLocalePrefix}${canonicalPath === "/" ? "" : canonicalPath}` : canonicalPath;
  return `${localizedPathname || "/"}${hash ? `#${hash}` : ""}`;
}

export function absoluteUrl(path: string, language: WebsiteLanguage = "en") {
  const localized = localizedPath(path, language);
  const [pathname, hash = ""] = localized.split("#", 2);
  const documentPath = pathname === "/" ? "/" : `${pathname.replace(/\/$/, "")}/`;
  return new URL(`${documentPath}${hash ? `#${hash}` : ""}`, siteOrigin).toString();
}

export function getSeoPage(path: string) {
  const normalizedPath = trimLocalePrefix(path.split("#", 1)[0] || "/").replace(/\/$/, "") || "/";
  return publicSeoPages.find((page) => page.path === normalizedPath) ?? null;
}

export function isPrivateOrNonIndexablePath(path: string) {
  const normalizedPath = trimLocalePrefix(path);
  return normalizedPath.startsWith("/owner") || normalizedPath === "/404" || getSeoPage(normalizedPath) === null;
}

const organizationId = `${siteOrigin}/#organization`;
const serviceProvider = { "@id": organizationId };

export function buildStructuredData(page: PublicSeoPage, language: WebsiteLanguage) {
  const copy = page.copy[language];
  const canonicalUrl = absoluteUrl(page.path, language);
  const common = { "@context": "https://schema.org", inLanguage: language };
  const schemas: Record<string, unknown>[] = [];

  if (page.schemas.includes("organization")) {
    schemas.push({
      ...common,
      "@type": "Organization",
      "@id": organizationId,
      name: "Velocity Lab Innovation",
      alternateName: "VLI",
      url: siteOrigin,
      logo: managedMediaUrl("/manus-storage/vli_logo_with_text_bb6773ef.png"),
      email: "info@velocity-lab.com",
      telephone: "+85266507520",
      address: { "@type": "PostalAddress", addressLocality: "Hong Kong", addressCountry: "HK" },
    });
  }

  if (page.schemas.includes("website")) {
    schemas.push({
      ...common,
      "@type": "WebSite",
      "@id": `${siteOrigin}/#website`,
      name: "Velocity Lab Innovation",
      url: siteOrigin,
      publisher: serviceProvider,
      inLanguage: ["en", "zh-Hant"],
    });
  }

  if (page.schemas.includes("breadcrumb")) {
    schemas.push({
      ...common,
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: language === "zh-Hant" ? "主頁" : "Home", item: absoluteUrl("/", language) },
        { "@type": "ListItem", position: 2, name: language === "zh-Hant" ? page.copy[language].title.split(" |")[0] : page.breadcrumb, item: canonicalUrl },
      ],
    });
  }

  if (page.schemas.includes("service")) {
    const serviceDescription = page.key === "referee"
      ? copy.description
      : page.key === "services"
      ? copy.description
      : "";
    if (serviceDescription) {
      schemas.push({
        ...common,
        "@type": "Service",
        name: page.key === "referee" ? (language === "zh-Hant" ? "無人機運動 Smart Referee" : "Smart Referee for Drone Sports") : (language === "zh-Hant" ? "無人機服務" : "Drone Services"),
        description: serviceDescription,
        url: canonicalUrl,
        provider: serviceProvider,
        areaServed: { "@type": "AdministrativeArea", name: "Hong Kong" },
      });
    }
  }

  if (page.schemas.includes("video")) {
    schemas.push({
      ...common,
      "@type": "VideoObject",
      name: language === "zh-Hant" ? "無人機運動裁判簡介影片" : "Drone Sports Referee Pitch",
      description: language === "zh-Hant" ? "為主辦方、裁判及執行團隊提供的 Smart Referee 工作流程重點概覽。" : "A focused overview of the Smart Referee workflow for organisers, officials, and delivery teams.",
      thumbnailUrl: managedMediaUrl("/manus-storage/flex13camerasys_aa73a4e5.jpg"),
      uploadDate: "2026-08-24T12:26:38+00:00",
      contentUrl: managedMediaUrl("/manus-storage/v2fulluncompressed_1dc97341.mp4"),
      embedUrl: canonicalUrl,
    });
  }

  return schemas;
}
