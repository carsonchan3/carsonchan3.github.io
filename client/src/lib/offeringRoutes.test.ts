import { describe, expect, it } from "vitest";
import { offeringCards, offeringPaths } from "./offeringRoutes";

describe("offering routes", () => {
  it("exposes a dedicated destination for each homepage offering", () => {
    expect(offeringPaths).toEqual([
      { title: "Smart Referee", href: "/dronesportsreferee" },
      { title: "Drone Equipment", href: "/product" },
      { title: "Services", href: "/services" },
    ]);
  });

  it("gives every offering card an image and visible call to action", () => {
    expect(offeringCards.every((card) => card.image && card.cta && card.description)).toBe(true);
    expect(offeringCards.find((card) => card.title === "Smart Referee")?.image).toBe("/manus-storage/flex13camerasys_aa73a4e5.jpg");
    expect(offeringCards.find((card) => card.title === "Drone Equipment")?.image).toBe("/manus-storage/Droneequipment_2ab6c2b7.jpg");
    expect(offeringCards.find((card) => card.title === "Services")?.image).toBe("/manus-storage/service_214ca02f.jpeg");
  });
});
