import { describe, expect, it } from "vitest";
import { homepageHeroImageSrc } from "./heroMedia";

describe("homepage hero media", () => {
  it("uses the supplied drone-flight image instead of a hero video", () => {
    expect(homepageHeroImageSrc).toBe("/manus-storage/vli-hero-flightline_df77848d.webp");
  });
});
