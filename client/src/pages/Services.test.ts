import { describe, expect, it } from "vitest";
import { mobileServiceCardAspectRatio, publicServiceCatalogueSource, resolvedServiceCatalogueRevealPolicy, serviceBanners, serviceImageClassName, serviceImagePanelClassName } from "./Services";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";

describe("Services thumbnail data", () => {
  it("uses the supplied Traditional Chinese service headings", () => {
    expect(traditionalChineseTranslations["Choose the support that fits your next step."]).toBe("選擇您的服務。");
    expect(traditionalChineseTranslations["Build skill."]).toBe("培養技能，");
    expect(traditionalChineseTranslations["Fly with purpose."]).toBe("自由翱翔前往您的目標。");
    expect(traditionalChineseTranslations["Not sure which service is right?"]).toBe("需要定制服務？");
  });

  it("maps every service option to the supplied real-world media", () => {
    expect(serviceBanners.map((service) => ({ title: service.title, thumbnail: service.thumbnail, mediaSource: service.mediaSource }))).toEqual([
      { title: "Drone Repair Service", thumbnail: "/manus-storage/dronerepairthumb_ad988635.jpeg", mediaSource: "user-supplied-real-world-photo" },
      { title: "PID tuning service", thumbnail: "/manus-storage/pidtuningthumb_fcb394b2.jpeg", mediaSource: "user-supplied-real-world-photo" },
      { title: "Drone Building Course", thumbnail: "/manus-storage/Competition-readydecisionlayerthumb_b7c645e2.jpeg", mediaSource: "user-supplied-real-world-photo" },
      { title: "Advanced drone course for adults", thumbnail: "/manus-storage/advancedronecourseforadultthumb_193b4cb1.jpeg", mediaSource: "user-supplied-real-world-photo" },
      { title: "Drone Services", thumbnail: "/manus-storage/referee-angle_083e0bbc.webp", mediaSource: "user-supplied-real-world-photo" },
    ]);
  });

  it("keeps exactly one distinct visual thumbnail for each service", () => {
    const thumbnails = serviceBanners.map((service) => service.thumbnail);

    expect(thumbnails).toHaveLength(5);
    expect(new Set(thumbnails).size).toBe(5);
    expect(thumbnails.every((thumbnail) => thumbnail.startsWith("/manus-storage/"))).toBe(true);
    expect(serviceBanners.every((service) => service.mediaSource === "user-supplied-real-world-photo" && service.imageAlt.length > 20)).toBe(true);
  });

  it("provides duration and scope-based pricing guidance for every service", () => {
    expect(serviceBanners.every((service) => service.duration.length > 20 && service.pricing.length > 20)).toBe(true);
    expect(serviceBanners.every((service) => /quoted|quotation/i.test(service.pricing))).toBe(true);
    expect(serviceBanners.some((service) => /HK\$|\$\d/.test(service.pricing))).toBe(false);
  });

  it("uses the service titles as valid persisted service-enquiry selections", () => {
    expect(serviceBanners.map((service) => service.title)).toEqual([
      "Drone Repair Service",
      "PID tuning service",
      "Drone Building Course",
      "Advanced drone course for adults",
      "Drone Services",
    ]);
  });

  it("restores Drone Services with the supplied photography and video scope", () => {
    const droneServices = serviceBanners.find((service) => service.title === "Drone Services");
    expect(droneServices?.description).toBe("Plan and capture professional drone photography and video for events, facilities, campaigns, and technical storytelling.");
    expect(droneServices?.thumbnail).toBe("/manus-storage/referee-angle_083e0bbc.webp");
  });

  it("prioritizes a mail-in repair assessment and conditional delivery-fee waiver", () => {
    const repairService = serviceBanners[0];

    expect(repairService?.title).toBe("Drone Repair Service");
    expect(repairService?.description).toMatch(/mail in/i);
    expect(repairService?.pricing).toMatch(/quotation.*first/i);
    expect(repairService?.pricing).toMatch(/delivery fees can be waived/i);
  });

  it("uses one fixed responsive crop treatment for every service image panel", () => {
    expect(serviceImagePanelClassName).toContain("absolute inset-0 h-full");
    expect(serviceImagePanelClassName).toContain("sm:relative sm:h-72");
    expect(serviceImagePanelClassName).toContain("lg:h-full");
    expect(serviceImageClassName).toContain("object-cover");
    expect(serviceImageClassName).toContain("object-center");
  });

  it("uses a square mobile format for service cards", () => {
    expect(mobileServiceCardAspectRatio).toBe("1:1");
  });

  it("keeps asynchronously loaded service records visible after desktop reveal setup", () => {
    expect(publicServiceCatalogueSource).toBe("versioned-static-catalogue");
    expect(resolvedServiceCatalogueRevealPolicy).toBe("show-static-results-immediately");
  });
});
