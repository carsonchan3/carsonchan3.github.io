import { describe, expect, it } from "vitest";
import { buildPricingRequestMessage, getPricingSelectionLabel, pricingTiers } from "./pricingConfig";

describe("pricing configuration", () => {
  it("provides the approved Hong Kong dollar starting prices for each service tier", () => {
    expect(pricingTiers.map((tier) => tier.name)).toEqual(["Assist", "Managed", "Evidence Pro"]);
    expect(pricingTiers.map((tier) => tier.price)).toEqual(["From HK$6,800", "From HK$11,800", "From HK$16,800"]);
    expect(pricingTiers.every((tier) => tier.priceUnit === "per event cage")).toBe(true);
  });

  it("makes the requested support durations clear across the three packages", () => {
    expect(pricingTiers.find((tier) => tier.id === "assist")?.features).toContain("Four hours of technical support");
    expect(pricingTiers.find((tier) => tier.id === "managed")?.features).toContain("Six hours of technical support");
    expect(pricingTiers.find((tier) => tier.id === "evidence-pro")?.features).toContain("Eight hours of technical support");
  });

  it("includes a Class 20 cage in the Managed and Evidence Pro packages", () => {
    expect(pricingTiers.find((tier) => tier.id === "managed")?.features).toContain("Class 20 cage included");
    expect(pricingTiers.find((tier) => tier.id === "evidence-pro")?.features).toContain("Class 20 cage included");
  });

  it("places clear included and excluded details inside each package", () => {
    expect(pricingTiers.every((tier) => tier.details.some((detail) => detail.included))).toBe(true);
    expect(pricingTiers.every((tier) => tier.details.some((detail) => !detail.included))).toBe(true);
    expect(pricingTiers.find((tier) => tier.id === "managed")?.details).toContainEqual(expect.objectContaining({ included: true, title: "Class 20 event setup" }));
    expect(pricingTiers.find((tier) => tier.id === "assist")?.details).toContainEqual(expect.objectContaining({ included: false, title: "Class 20 cage" }));
  });

  it("creates a readable prefilled request selection", () => {
    expect(getPricingSelectionLabel("managed")).toBe("Managed");
  });

  it("adds the chosen configuration to a pricing request message", () => {
    expect(buildPricingRequestMessage("evidence-pro", "We need an indoor pilot.")).toContain("Evidence Pro");
  });
});
