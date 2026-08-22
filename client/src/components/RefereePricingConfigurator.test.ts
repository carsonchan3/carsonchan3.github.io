import { describe, expect, it } from "vitest";
import { pricingCardDetailPresentation } from "./RefereePricingConfigurator";

describe("Smart Referee pricing mobile cards", () => {
  it("uses included and excluded details inside each starting-point card", () => {
    expect(pricingCardDetailPresentation).toBe("included-and-excluded-details");
  });
});
