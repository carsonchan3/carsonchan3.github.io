import { describe, expect, it } from "vitest";
import { eventScaleEvidencePanelPresentation, eventWorkflowSteps, formatOrganiserImpactMetric, mobileSmartRefereeCardAspectRatio, mobileSmartRefereeRevealPolicy, organiserImpactDetail, organiserImpactMetricAnimation, organiserOutcomeCards, proofPoints, smartRefereeHeroBackgroundPresentation, smartRefereeHeroVideoPresentation, smartRefereeMedia, smartRefereePageHierarchy, technicalConfidence, technicalSpecificationPresentation, traditionalChinesePromisePresentation } from "./Product";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";

describe("Smart Referee organiser-first journey", () => {
  it("leads with one organiser promise followed by three tangible outcomes", () => {
    expect(smartRefereePageHierarchy.slice(0, 3)).toEqual(["organiser-promise", "organiser-outcomes", "system-replay"]);
    expect(organiserOutcomeCards).toEqual([
      expect.objectContaining({ title: "Resolve close calls" }),
      expect.objectContaining({ title: "Keep the next match moving" }),
      expect.objectContaining({ title: "Align officiating standards" }),
    ]);
  });

  it("shows the replay before the event workflow and keeps human authority explicit", () => {
    expect(smartRefereePageHierarchy.indexOf("system-replay")).toBeLessThan(smartRefereePageHierarchy.indexOf("event-workflow"));
    expect(eventWorkflowSteps).toHaveLength(3);
    expect(eventWorkflowSteps.map((step) => step.title)).toEqual(["Set the event rule", "Review the tracked moment", "Make the call together"]);
    expect(eventWorkflowSteps[2].detail).toContain("Officials keep their authority");
  });

  it("keeps the organiser-impact scenario visible, animated, and qualified as a planning discussion", () => {
    expect(smartRefereePageHierarchy).toContain("organiser-impact-detail");
    expect(organiserImpactDetail.metrics).toHaveLength(3);
    expect(organiserImpactDetail.qualification).toContain("validate against your own staffing");
    expect(organiserImpactDetail.description).toContain("not measured outcomes or guaranteed savings");
    expect(organiserImpactMetricAnimation).toEqual({ trigger: "when-visible", durationMilliseconds: 1800, respectsReducedMotion: true });
    expect(formatOrganiserImpactMetric(organiserImpactDetail.metrics[0], 4, "en")).toBe("4+ minutes");
    expect(formatOrganiserImpactMetric(organiserImpactDetail.metrics[1], 40, "zh-Hant")).toBe("超過 40+ 分鐘");
    expect(formatOrganiserImpactMetric(organiserImpactDetail.metrics[2], 27_000, "en")).toBe("HK$27k");
  });

  it("keeps technical evidence visible after the organiser value narrative", () => {
    expect(smartRefereePageHierarchy.indexOf("technical-confidence")).toBeGreaterThan(smartRefereePageHierarchy.indexOf("event-workflow"));
    expect(technicalSpecificationPresentation).toBe("visible-evidence-panel");
    expect(eventScaleEvidencePanelPresentation).toBe("individual-panels-beneath-title");
    expect(technicalConfidence.title).toBe("Technical confidence, when your team needs it.");
    expect(proofPoints).toContainEqual({ value: "±0.20 mm", label: "3D accuracy" });
    expect(proofPoints).toContainEqual({ value: "10 ms", label: "decision making end to end" });
  });

  it("preserves the supplied tracking, human-officiating, marker, precision, and reference media", () => {
    expect(smartRefereeMedia.humanReferee).toBe("/manus-storage/referee-angle_083e0bbc.webp");
    expect(smartRefereeMedia.stickers).toBe("/manus-storage/cheapstickers_6b71bf1e.jpg");
    expect(smartRefereeMedia.precision).toBe("/manus-storage/flex13camerasys_aa73a4e5.jpg");
    expect(smartRefereeMedia.trackingVideo).toBe("/manus-storage/vli-tracking-test-video_f82aa6d7.mp4");
    expect(smartRefereeMedia.ruleSupportLogos).toHaveLength(3);
  });

  it("preserves seamless autoplay video treatment and the mobile visibility policy", () => {
    expect(smartRefereeHeroVideoPresentation).toEqual({ aspectRatio: "16:9", objectFit: "contain", controls: false, autoPlay: true, muted: true, loop: true, containerTreatment: "borderless-integrated" });
    expect(smartRefereeHeroBackgroundPresentation).toEqual({ source: "homepage-hero-video", treatment: "dark-overlay-background", autoPlay: true, muted: true, loop: true });
    expect(mobileSmartRefereeRevealPolicy).toBe("always-visible");
    expect(mobileSmartRefereeCardAspectRatio).toBe("21:9");
  });

  it("maps the revised organiser promise, outcomes, workflow, and visible evidence into Traditional Chinese", () => {
    [
      "Fair calls. A", "protected schedule.", "Plan your event", "Watch a decision replay", "Resolve close calls", "Keep the next match moving", "Align officiating standards", "View an illustrative event-delay scenario", "Technical confidence, when your team needs it.", "Compare all service inclusions",
    ].forEach((key) => expect(traditionalChineseTranslations[key]).toBeTruthy());
    expect(traditionalChinesePromisePresentation).toBe("two-intentional-lines");
  });
});
