import { describe, expect, it } from "vitest";
import { offeringCards, offeringPaths } from "./offeringRoutes";
import { traditionalChineseTranslations } from "./zhTranslations";

describe("offering routes", () => {
  it("exposes a dedicated destination for each homepage offering", () => {
    expect(offeringPaths).toEqual([
      { title: "Smart Referee", href: "/dronesportsreferee" },
      { title: "Drone Equipment", href: "/product" },
      { title: "Drone Photo / Cinematography", href: "/services" },
    ]);
  });

  it("gives every offering card an image and visible call to action", () => {
    expect(offeringCards.every((card) => card.image && card.cta && card.description)).toBe(true);
    expect(offeringCards.find((card) => card.title === "Smart Referee")?.image).toBe("/manus-storage/flex13camerasys_aa73a4e5.jpg");
    expect(offeringCards.find((card) => card.title === "Drone Equipment")?.image).toBe("/manus-storage/Droneequipment_2ab6c2b7.jpg");
    expect(offeringCards.find((card) => card.title === "Drone Photo / Cinematography")?.image).toBe("/manus-storage/dronecinematography_894d41bd.jpeg");
  });

  it("provides Traditional Chinese coverage for the revised cinematography offering", () => {
    ["Aerial storytelling", "Drone Photo / Cinematography", "Plan professional aerial photography and cinematography for events, facilities, campaigns, and technical storytelling.", "Explore cinematography"].forEach((key) => expect(traditionalChineseTranslations[key]).toBeTruthy());
  });
});
