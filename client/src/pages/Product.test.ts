import { describe, expect, it } from "vitest";
import { disputeTimerPolicy, getDisputeTimeIncrements, mobileSmartRefereeCardAspectRatio, mobileSmartRefereeRevealPolicy, organiserAdoptionPanels, organiserPainPanels, proofPoints, smartRefereeFeaturePanels, smartRefereeHeroVideoPresentation, smartRefereeMedia, smartRefereeOpeningRuleQuote, smartRefereePageHierarchy, technicalSpecificationPresentation } from "./Product";

describe("Smart Referee proof points", () => {
  it("uses the supplied OptiTrack motion-capture description", () => {
    expect(proofPoints).toContainEqual({
      value: "OptiTrack",
      label: "industry leading motion capture technology",
    });
  });

  it("shows the supplied accuracy and end-to-end decision-making specifications", () => {
    expect(proofPoints).toContainEqual({ value: "±0.20 mm", label: "3D accuracy" });
    expect(proofPoints).toContainEqual({ value: "10 ms", label: "decision making end to end" });
  });

  it("does not retain the replaced Replay or Rules proof points", () => {
    expect(proofPoints.map((point) => point.value)).not.toContain("Replay");
    expect(proofPoints.map((point) => point.value)).not.toContain("Rules");
    expect(proofPoints.map((point) => point.value)).not.toContain("120 FPS");
  });
});

describe("Smart Referee marker and precision panels", () => {
  it("removes the unobtrusive infrared panel from the page configuration", () => {
    expect(smartRefereeFeaturePanels).not.toHaveProperty("infrared");
  });

  it("gives passive markers their own event-operations panel with the supplied sticker image", () => {
    expect(smartRefereeFeaturePanels.passiveMarkers.eyebrow).toBe("Standardised competition markers");
    expect(smartRefereeFeaturePanels.passiveMarkers.image).toBe(smartRefereeMedia.stickers);
    expect(smartRefereeFeaturePanels.passiveMarkers.title).toBe("Standardise setup without adding hardware cost.");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Fast, repeatable pre-event setup");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Low-cost consumables for recurring events");
  });

  it("uses the requested industry-leading precision message and Flex 13 media", () => {
    expect(smartRefereeFeaturePanels.precision.eyebrow).toBe("Industry-Leading Precision");
    expect(smartRefereeFeaturePanels.precision.image).toBe(smartRefereeMedia.precision);
    expect(smartRefereeFeaturePanels.precision.description).toBe(
      "High-fidelity 3D tracking provides a consistent spatial reference for scoring review, operational reporting, and repeatable system setup across competition days."
    );
  });
});

describe("Smart Referee technical presentation", () => {
  it("keeps technical information concise by using proof points without a dropdown menu", () => {
    expect(technicalSpecificationPresentation).toBe("proof-points-only");
    expect(proofPoints).toContainEqual({ value: "±0.20 mm", label: "3D accuracy" });
    expect(proofPoints).toContainEqual({ value: "10 ms", label: "decision making end to end" });
  });
});

describe("Smart Referee system video presentation", () => {
  it("preserves the full system video as a seamless muted autoplay loop", () => {
    expect(smartRefereeHeroVideoPresentation).toEqual({
      aspectRatio: "16:9",
      objectFit: "contain",
      controls: false,
      autoPlay: true,
      muted: true,
      loop: true,
    });
  });

  it("places the system video directly after the B2B introduction", () => {
    expect(smartRefereePageHierarchy.slice(0, 2)).toEqual(["b2b-introduction", "system-video"]);
  });
});

describe("Smart Referee dispute-reduction support", () => {
  it("starts the illustrative dispute counter at 13:04 and advances it per ten seconds of active scrolling", () => {
    expect(disputeTimerPolicy.initialSeconds).toBe(13 * 60 + 4);
    expect(disputeTimerPolicy.activeScrollMillisecondsPerSecond).toBe(10_000);
    expect(getDisputeTimeIncrements(9_999)).toBe(0);
    expect(getDisputeTimeIncrements(10_000)).toBe(1);
    expect(getDisputeTimeIncrements(30_000)).toBe(3);
  });

  it("maps the supplied human-officiating, rulebook, dispute, and tracking media", () => {
    expect(smartRefereeMedia.humanReferee).toBe("/manus-storage/referee-angle_083e0bbc.webp");
    expect(smartRefereeMedia.rulebook).toBe("/manus-storage/FAI-rulebook_f63443a8.jpg");
    expect(smartRefereeMedia.dispute).toBe("/manus-storage/dispute_6f42a381.webp");
    expect(smartRefereeMedia.trackingVideo).toBe("/manus-storage/vli-tracking-test-video_f82aa6d7.mp4");
    expect(smartRefereeMedia.trackingPoster).toBe("/manus-storage/vli-tracking-test-first-frame_2dca2577.jpg");
  });

  it("leads with the supplied scoring-rule quote and clearly marks the dispute window as illustrative", () => {
    expect(smartRefereeOpeningRuleQuote.text).toContain("entire drone ball has passed through");
    expect(smartRefereeOpeningRuleQuote.attribution).toContain("F9.A.8.4");
    expect(organiserPainPanels[0]).toMatchObject({ value: "13:04", label: "Illustrative dispute window" });
  });

  it("adds individual organiser adoption panels without unsupported outcome claims", () => {
    expect(organiserAdoptionPanels.map((panel) => panel.title)).toEqual(["Venue-ready scope", "Rule-to-evidence workflow", "Event-day delivery plan"]);
  });
});

describe("Smart Referee mobile presentation", () => {
  it("keeps the complete page independent of scroll-reveal visibility on mobile", () => {
    expect(mobileSmartRefereeRevealPolicy).toBe("always-visible");
  });

  it("uses a compact 21:9 treatment for Smart Referee cards on mobile", () => {
    expect(mobileSmartRefereeCardAspectRatio).toBe("21:9");
  });

  it("keeps the marker-benefit card concise for mobile while preserving every benefit", () => {
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toHaveLength(3);
  });
});
