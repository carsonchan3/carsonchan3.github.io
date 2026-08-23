import { describe, expect, it } from "vitest";
import { disputeTimerPolicy, getDisputeTimeIncrements, mobileSmartRefereeCardAspectRatio, mobileSmartRefereeRevealPolicy, proofPoints, smartRefereeFeaturePanels, smartRefereeHeroVideoPresentation, smartRefereeMedia, technicalSpecificationPresentation } from "./Product";

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

  it("gives passive markers their own competition-focused panel with the supplied sticker image", () => {
    expect(smartRefereeFeaturePanels.passiveMarkers.eyebrow).toBe("Passive competition markers");
    expect(smartRefereeFeaturePanels.passiveMarkers.image).toBe(smartRefereeMedia.stickers);
    expect(smartRefereeFeaturePanels.passiveMarkers.title).toBe("Simple marker stickers. Practical deployment.");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Lightweight sticker layout for competition drones");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Low-cost preparation for repeat events");
  });

  it("uses the requested industry-leading precision message and Flex 13 media", () => {
    expect(smartRefereeFeaturePanels.precision.eyebrow).toBe("Industry-Leading Precision");
    expect(smartRefereeFeaturePanels.precision.image).toBe(smartRefereeMedia.precision);
    expect(smartRefereeFeaturePanels.precision.description).toBe(
      "High-fidelity 3D tracking provides a consistent spatial reference for scoring review, event reporting, and repeatable system setup across competition days."
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
  it("preserves the full system video with a 16:9 contain treatment and controls", () => {
    expect(smartRefereeHeroVideoPresentation).toEqual({
      aspectRatio: "16:9",
      objectFit: "contain",
      controls: true,
    });
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
