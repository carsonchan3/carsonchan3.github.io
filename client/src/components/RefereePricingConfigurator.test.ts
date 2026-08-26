import { describe, expect, it } from "vitest";
import { pricingTiers } from "@/lib/pricingConfig";
import { pricingCardDetailPresentation, pricingFamilyPresentation, pricingTierCardPresentation, pricingTierIconPresentation } from "./RefereePricingConfigurator";

describe("Smart Referee pricing organiser scenarios", () => {
  it("uses scenario-led cards with optional detailed comparison instead of dense default matrices", () => {
    expect(pricingCardDetailPresentation).toBe("scenario-led-progressive-details");
    expect(pricingTierCardPresentation).toBe("rounded-option-cards");
    expect(pricingFamilyPresentation).toBe("unified-quiet-service-family");
    expect(pricingTierIconPresentation).toEqual(["Settings2", "Users", "Trophy"]);
  });

  it("gives every event package a plain-language organiser scenario", () => {
    expect(pricingTiers.map((tier) => tier.scenario)).toEqual([
      "For organisers with core event infrastructure",
      "For organisers who want a managed event day",
      "For marquee or sponsor-facing events",
    ]);
  });
});
