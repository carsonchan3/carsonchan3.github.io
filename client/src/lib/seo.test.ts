import { describe, expect, it } from "vitest";
import { absoluteUrl, buildStructuredData, getSeoPage, localizedPath, publicSeoPages, publicRoutePaths, trimLocalePrefix } from "./seo";

describe("SEO route registry", () => {
  it("covers every indexable public marketing route with bilingual title and description copy", () => {
    expect(publicSeoPages.map((page) => page.path)).toEqual(publicRoutePaths);
    for (const page of publicSeoPages) {
      expect(page.copy.en.title).not.toBe("Velocity Lab Innovation - Precision Drone Sports Refereeing");
      expect(page.copy.en.description.length).toBeGreaterThan(40);
      expect(page.copy["zh-Hant"].title).toMatch(/[\u3400-\u9fff]/);
      expect(page.copy["zh-Hant"].description).toMatch(/[\u3400-\u9fff]/);
    }
  });

  it("uses stable public URLs for English and Traditional Chinese pages", () => {
    expect(localizedPath("/services", "en")).toBe("/services");
    expect(localizedPath("/services", "zh-Hant")).toBe("/zh-hant/services");
    expect(localizedPath("/#partners", "zh-Hant")).toBe("/zh-hant#partners");
    expect(trimLocalePrefix("/zh-hant/dronesportsreferee")).toBe("/dronesportsreferee");
    expect(absoluteUrl("/contact", "zh-Hant")).toBe("https://velocity-lab.com/zh-hant/contact/");
  });

  it("builds only truthful published schema inputs for applicable pages", () => {
    const home = getSeoPage("/");
    const referee = getSeoPage("/dronesportsreferee");
    expect(home).not.toBeNull();
    expect(referee).not.toBeNull();
    expect(buildStructuredData(home!, "en").some((item) => item["@type"] === "Organization")).toBe(true);
    expect(buildStructuredData(referee!, "en").some((item) => item["@type"] === "VideoObject")).toBe(true);
  });
});
