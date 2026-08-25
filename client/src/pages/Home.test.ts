import { describe, expect, it } from "vitest";
import { collaborators, desktopHomeHeroVideoAspectRatio, mobileHeroScrollCue, mobileHomeHeroContentPolicy, mobileHomeHeroVideoAspectRatio, mobileOfferingCardAspectRatio, partnerHeadingPresentation, publicCollaborators } from "./Home";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";

describe("homepage supporting organisations", () => {
  it("identifies the HKSTP logo as the Ideation Programme", () => {
    expect(collaborators).toContainEqual(expect.objectContaining({
      name: "Hong Kong Science and Technology Parks Ideation Programme",
      logo: "/manus-storage/HKSTP_6e2bc852.png",
    }));
  });

  it("includes HKDSA in the public partner strip using its preserved supplied record", () => {
    expect(collaborators).toContainEqual(expect.objectContaining({
      name: "Hong Kong Drone Sports Association",
      logo: "/manus-storage/HKDSA_9a3a9c17.jpeg",
      isPublic: true,
    }));
    expect(publicCollaborators.map((collaborator) => collaborator.name)).toContain("Hong Kong Drone Sports Association");
    expect(publicCollaborators).toHaveLength(3);
  });

  it("keeps the Supporting network label at the upper left while centring the partner heading and copy", () => {
    expect(partnerHeadingPresentation).toEqual({
      labelPosition: "top-left",
      headingAlignment: "center",
      descriptionAlignment: "center",
    });
  });

  it("uses the requested bilingual HKSTP Ideation Programme name", () => {
    expect(traditionalChineseTranslations["Hong Kong Science and Technology Parks Ideation Programme"]).toBe("香港科技園 ideation programme");
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
