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
    expect(offeringCards.find((card) => card.title === "Smart Referee")?.image).toBe("/media/flex13camerasys-card_15bc69dd.jpg");
    expect(offeringCards.find((card) => card.title === "Drone Equipment")?.image).toBe("/media/Droneequipment-card_e0a531df.jpg");
    expect(offeringCards.find((card) => card.title === "Services")?.image).toBe("/media/service-card_c463c693.jpg");
  });
});
