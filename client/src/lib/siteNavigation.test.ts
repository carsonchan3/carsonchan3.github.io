import { describe, expect, it } from "vitest";
import { siteNavigation } from "./siteNavigation";

describe("site navigation", () => {
  it("exposes the three offering routes under their current canonical paths", () => {
    expect(siteNavigation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Smart Referee", href: "/dronesportsreferee" }),
        expect.objectContaining({ label: "Products", href: "/product" }),
        expect.objectContaining({ label: "Services", href: "/services" }),
      ]),
    );
  });

  it("keeps Contact available while leaving People off public navigation", () => {
    const labels = siteNavigation.map((item) => item.label);
    expect(labels).toContain("Contact");
    expect(labels).not.toContain("People");
    expect(siteNavigation).not.toEqual(expect.arrayContaining([expect.objectContaining({ href: "/people" })]));
    expect(labels).not.toContain("Use Cases");
    expect(labels).not.toContain("Demo");
    expect(labels).not.toContain("Pricing");
    expect(siteNavigation).toEqual(expect.arrayContaining([expect.objectContaining({ label: "Contact", href: "/contact", key: "contact" })]));
  });

  it("uses the offering taxonomy in the mobile menu without changing desktop and footer Products terminology", () => {
    const productNavigation = siteNavigation.find((item) => item.key === "product");
    expect(productNavigation).toMatchObject({
      label: "Products",
      mobileLabel: "Drone Equipment",
      href: "/product",
    });
  });
});
