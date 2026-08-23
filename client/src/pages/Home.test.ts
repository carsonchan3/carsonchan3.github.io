import { describe, expect, it } from "vitest";
import { collaborators, desktopHomeHeroVideoAspectRatio, mobileHomeHeroVideoAspectRatio, mobileOfferingCardAspectRatio } from "./Home";

describe("homepage supporting organisations", () => {
  it("identifies the HKSTP logo as the Ideation Programme", () => {
    expect(collaborators).toContainEqual(expect.objectContaining({
      name: "Hong Kong Science and Technology Parks Ideation Programme",
      logo: "/manus-storage/HKSTP_6e2bc852.png",
    }));
  });
});

describe("homepage mobile offering presentation", () => {
  it("uses a 21:9 format for compact mobile offering cards", () => {
    expect(mobileOfferingCardAspectRatio).toBe("21:9");
  });

  it("uses a readable mobile hero ratio and an OptiTrack-inspired 32:9 desktop video treatment", () => {
    expect(mobileHomeHeroVideoAspectRatio).toBe("4:5");
    expect(desktopHomeHeroVideoAspectRatio).toBe("32:9");
  });
});
