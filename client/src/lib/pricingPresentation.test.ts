import { describe, expect, it } from "vitest";
import { pricingRevealPolicy, pricingVisibilityClass } from "./pricingPresentation";

describe("Smart Referee pricing presentation", () => {
  it("keeps pricing content outside the scroll-reveal visibility dependency", () => {
    expect(pricingVisibilityClass).toBe("pricing-content");
    expect(pricingRevealPolicy).toBe("always-visible");
  });
});
