import { describe, expect, it } from "vitest";
import { mobileSmartRefereeCardAspectRatio, mobileSmartRefereeRevealPolicy, modules, proofPoints, smartRefereeFeaturePanels, technicalSpecificationPresentation } from "./Product";

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

describe("Smart Referee infrared and precision panels", () => {
  it("highlights unobtrusive IR LED tracking and passive competition markers", () => {
    expect(smartRefereeFeaturePanels.infrared.eyebrow).toBe("Unobtrusive IR LED tracking");
    expect(smartRefereeFeaturePanels.infrared.description).toContain("850 nm IR LEDs");
    expect(smartRefereeFeaturePanels.infrared.description).not.toContain("passive markers");
    expect(smartRefereeFeaturePanels.infrared.steps).toContain("Built to blend into the match environment");
  });

  it("gives passive markers their own competition-focused technology panel", () => {
    expect(smartRefereeFeaturePanels.passiveMarkers.eyebrow).toBe("Passive competition markers");
    expect(smartRefereeFeaturePanels.passiveMarkers.title).toBe("Lightweight markers. Lower cost of entry.");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Lightweight marker layout for competition drones");
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toContain("Low-cost hardware approach for repeat events");
  });

  it("uses the requested industry-leading precision message", () => {
    expect(smartRefereeFeaturePanels.precision.eyebrow).toBe("Industry-Leading Precision");
    expect(smartRefereeFeaturePanels.precision.description).toBe(
      "Our 3D precision is the best in the business, outperforming even the highest-resolution competition."
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

describe("Smart Referee evidence-led review capability", () => {
  it("explains that decisions can be reviewed against replay-ready match context", () => {
    expect(modules).toContainEqual(
      expect.objectContaining({
        title: "Evidence for every decision",
        text: expect.stringContaining("replay-ready match context"),
      })
    );
  });
});

describe("Smart Referee mobile presentation", () => {
  it("keeps the complete page independent of scroll-reveal visibility on mobile", () => {
    expect(mobileSmartRefereeRevealPolicy).toBe("always-visible");
  });

  it("uses a compact 21:9 treatment for Smart Referee cards on mobile", () => {
    expect(mobileSmartRefereeCardAspectRatio).toBe("21:9");
  });

  it("consolidates passive-marker benefits into one integrated card while preserving every benefit", () => {
    expect(smartRefereeFeaturePanels.passiveMarkers.benefits).toHaveLength(3);
  });
});
