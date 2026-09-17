import { describe, expect, it } from "vitest";
import { detailedServicePricingSheet, mobileServiceCardAspectRatio, publicServiceCatalogueSource, serviceBanners, serviceCardInteraction, serviceImageClassName, serviceImagePanelClassName, servicesHeroPresentation } from "./Services";
import { renderServiceMarkdown, serviceContent } from "@/lib/serviceContent";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";

describe("Markdown-managed services", () => {
  it("keeps the Services hero focused by removing the introductory paragraph", () => {
    expect(servicesHeroPresentation).toEqual({ introductoryParagraph: "removed" });
  });

  it("uses the supplied Traditional Chinese service headings", () => {
    expect(traditionalChineseTranslations["Choose the support that fits your next step."]).toBe("選擇您的服務。");
    expect(traditionalChineseTranslations["Build skill."]).toBe("培養技能，");
    expect(traditionalChineseTranslations["Fly with purpose."]).toBe("自由翱翔前往您的目標。");
    expect(traditionalChineseTranslations["Not sure which service is right?"]).toBe("需要定制服務？");
    expect(traditionalChineseTranslations["Detailed service pricing"]).toBe("詳細服務價目表");
  });

  it("links customers to the supplied Google Sheet for detailed service pricing", () => {
    expect(detailedServicePricingSheet).toEqual({
      serviceTitle: "Drone Photo / Cinematography",
      embedHref: "https://docs.google.com/spreadsheets/d/1pgINM3xf6ZbeMtfgLgd6kfBXSpe33T6iwcAmqn1T3-g/preview?rm=minimal",
      href: "https://docs.google.com/spreadsheets/d/1pgINM3xf6ZbeMtfgLgd6kfBXSpe33T6iwcAmqn1T3-g/edit?usp=sharing",
      label: "Detailed service pricing",
      description: "View the current public price book directly below.",
      ariaLabel: "Open detailed service pricing in Google Sheets (opens in a new tab)",
    });
  });

  it("loads services from content/services in order, with the same enquiry titles as before", () => {
    expect(publicServiceCatalogueSource).toBe("markdown-content-services");
    expect(serviceBanners.map((service) => service.title)).toEqual([
      "Drone Repair Service",
      "PID tuning service",
      "Drone Building Course / Coaching Sessions",
      "Advanced drone course for adults",
      "Drone Photo / Cinematography",
    ]);
    expect(serviceBanners.map((service) => service.number)).toEqual(["01", "02", "03", "04", "05"]);
    expect(new Set(serviceBanners.map((service) => service.thumbnail)).size).toBe(serviceBanners.length);
  });

  it("provides bilingual summary, dropdown description, and guidance for every service", () => {
    for (const service of serviceContent) {
      for (const language of ["en", "zh-Hant"] as const) {
        expect(service.title[language].length).toBeGreaterThan(0);
        expect(service.summary[language].length).toBeGreaterThan(20);
        expect(service.body[language].length).toBeGreaterThan(10);
      }
      expect(service.summary["zh-Hant"]).toMatch(/[㐀-鿿]/);
      expect(service.body["zh-Hant"]).toMatch(/[㐀-鿿]/);
    }
    expect(serviceContent.every((service) => /quoted|quotation/i.test(service.pricing.en))).toBe(true);
  });

  it("uses the repair intake form only for the repair service", () => {
    expect(serviceBanners.filter((service) => service.enquiryForm === "repair").map((service) => service.title)).toEqual(["Drone Repair Service"]);
    expect(serviceBanners[0].record.summary.en).toMatch(/mail in/i);
    expect(serviceBanners[0].record.pricing.en).toMatch(/delivery fees can be waived/i);
  });

  it("toggles a Markdown description when a service card is clicked", () => {
    expect(serviceCardInteraction).toBe("click-toggles-markdown-description");
    expect(renderServiceMarkdown("Hello **team**")).toContain("<strong>team</strong>");
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
});
