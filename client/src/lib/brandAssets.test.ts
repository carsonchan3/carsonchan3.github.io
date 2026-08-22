import { describe, expect, it } from "vitest";
import { headerLogoSrc, mobileHeaderLogoScale, mobileHeaderLogoScaleClass } from "./brandAssets";

describe("Velocity Lab Innovation brand assets", () => {
  it("uses the supplied white-and-turquoise logo for website headers", () => {
    expect(headerLogoSrc).toBe("/manus-storage/velocity-lab-innovation-header-logo-white_90e0b256.png");
  });

  it("keeps desktop logo sizing unchanged while scaling the header logo to 90 percent on mobile", () => {
    expect(mobileHeaderLogoScale).toBe("90%");
    expect(mobileHeaderLogoScaleClass).toBe("vli-mobile-logo-scale-90");
  });
});
