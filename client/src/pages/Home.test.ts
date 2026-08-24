import { describe, expect, it } from "vitest";
import { collaborators, desktopHomeHeroVideoAspectRatio, mobileHeroScrollCue, mobileHomeHeroContentPolicy, mobileHomeHeroVideoAspectRatio, mobileOfferingCardAspectRatio } from "./Home";

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

  it("keeps mobile hero copy compact so the primary video remains visible above the fold", () => {
    expect(mobileHomeHeroContentPolicy).toEqual({
      presentation: "compact-overlay",
      secondaryDescription: "hidden",
      actionLayout: "two-column",
    });
  });

  it("provides a concise mobile cue that moves visitors from the hero to the offering choices", () => {
    expect(mobileHeroScrollCue).toEqual({
      target: "offerings",
      label: "Explore offerings below",
    });
  });
});
