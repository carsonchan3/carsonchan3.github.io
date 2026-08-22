import { describe, expect, it } from "vitest";
import { mobileServiceCardAspectRatio, resolvedServiceCatalogueRevealPolicy, serviceBanners, serviceImageClassName, serviceImagePanelClassName } from "./Services";

describe("Services thumbnail data", () => {
  it("maps every service option to its intended managed thumbnail", () => {
    expect(serviceBanners.map((service) => ({ title: service.title, thumbnail: service.thumbnail }))).toEqual([
      { title: "Drone Repair Service", thumbnail: "/manus-storage/vli-service-repair_13ee3faf.png" },
      { title: "PID tuning service", thumbnail: "/manus-storage/vli-service-pid-tuning_e541b71d.png" },
      { title: "Drone Building Course", thumbnail: "/manus-storage/vli-service-building-skills_c32759ba.png" },
      { title: "Advanced drone course for adults", thumbnail: "/manus-storage/vli-service-advanced-course_d14dd579.png" },
    ]);
  });

  it("keeps exactly one distinct visual thumbnail for each service", () => {
    const thumbnails = serviceBanners.map((service) => service.thumbnail);

    expect(thumbnails).toHaveLength(4);
    expect(new Set(thumbnails).size).toBe(4);
    expect(thumbnails.every((thumbnail) => thumbnail.startsWith("/manus-storage/"))).toBe(true);
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
    ]);
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
    expect(resolvedServiceCatalogueRevealPolicy).toBe("show-database-results-immediately");
  });
});
