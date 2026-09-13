import { describe, expect, it } from "vitest";
import { continuousCalibrationVideoPresentation, eventScaleEvidencePanelPresentation, eventScaleFeatureTilePresentation, eventScaleTileDetailInteraction, eventScopePlanningInputs, eventWorkflowSteps, flex13SystemVideoPresentation, formatOrganiserImpactMetric, mobileSmartRefereeCardAspectRatio, mobileSmartRefereeRevealPolicy, organiserImpactDetail, organiserImpactMetricAnimation, organiserImpactOutcomeIconPresentation, organiserOutcomeCards, organiserOutcomesIntroduction, proofPoints, smartRefereeContextNavigation, smartRefereeDecisionRail, smartRefereeFullDarkThemePresentation, smartRefereeHeroBackgroundPresentation, smartRefereeHeroVideoPresentation, smartRefereeIconSystemPresentation, smartRefereeMedia, smartRefereePageHierarchy, smartRefereeReferenceFormatPresentation, smartRefereeVisualStoryPresentation, technicalConfidence, technicalSpecificationPresentation, traditionalChinesePromisePresentation } from "./Product";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";
import { getPremiumVariant, getShield205Variant, premiumProductContent, shield205Content } from "@/components/ProductDetailDialog";

describe("Smart Referee organiser-first journey", () => {
  it("leads with one organiser promise followed by three tangible outcomes", () => {
    expect(smartRefereePageHierarchy.slice(0, 3)).toEqual(["organiser-promise", "organiser-outcomes", "system-replay"]);
    expect(smartRefereePageHierarchy).toContain("rule-workflow");
    expect(smartRefereePageHierarchy.at(-1)).toBe("event-scope");
    expect(organiserOutcomesIntroduction).toEqual({
      heading: "What is Drone Sports Referee?",
      description: "A calibrated decision-support system that gives officials one shared, reviewable view of difficult scoring moments.",
    });
    expect(organiserOutcomeCards).toEqual([
      expect.objectContaining({ title: "Resolve close calls" }),
      expect.objectContaining({ title: "Keep the next match moving" }),
      expect.objectContaining({ title: "Align officiating standards" }),
    ]);
  });

  it("adapts the reference product-system format while preserving Smart Referee-specific content and decision flow", () => {
    expect(smartRefereeReferenceFormatPresentation).toEqual({
      hero: "field-scene-decision-rail",
      outcomes: "editorial-outcome-spread",
      replay: "signature-decision-console",
      technical: "dominant-plus-two-product-system",
      workflow: "true-white-decision-rail",
      organiserImpact: "deep-ink-outcome-band-and-operational-rail",
      conversion: "event-scope-closer",
    });
    expect(smartRefereeVisualStoryPresentation).toEqual({
      decisionConsole: "verified-media-with-operational-status-rail",
      organiserImpact: "deep-ink-editorial-outcomes-with-operational-rail",
      pricing: "deep-ink-service-family",
      ruleWorkflow: "configurable-condition-evidence-shared-call",
    });
    expect(smartRefereeFullDarkThemePresentation).toEqual({
      organiserOutcomes: "deep-ink-high-contrast",
      eventWorkflow: "deep-ink-high-contrast",
      technicalLayer: "deep-ink-high-contrast",
      ruleWorkflow: "deep-ink-high-contrast",
      eventDelivery: "deep-ink-high-contrast",
      eventScope: "deep-ink-high-contrast",
    });
    expect(smartRefereeIconSystemPresentation).toEqual({
      decisionRail: ["SlidersHorizontal", "ScanLine", "CircleCheck"],
      organiserOutcomes: ["Eye", "ScanLine", "ShieldCheck"],
      workflow: ["Settings2", "ScanLine", "CircleCheck"],
      technical: ["Crosshair", "Radar", "RefreshCw"],
    });
    expect(smartRefereeDecisionRail).toEqual([
      { label: "Rule input", value: "Active scoring condition" },
      { label: "Evidence", value: "Tracked position + review" },
      { label: "Decision", value: "Shared call" },
    ]);
    expect(smartRefereeContextNavigation.map((item) => item.href)).toEqual(["#organiser-outcomes", "#system-video", "#technical-confidence", "#pricing"]);
    expect(eventScopePlanningInputs).toEqual(["Venue and cage count", "Match format", "Programme schedule", "Delivery support"]);
  });

  it("shows the replay before the event workflow and keeps human authority explicit", () => {
    expect(smartRefereePageHierarchy.indexOf("system-replay")).toBeLessThan(smartRefereePageHierarchy.indexOf("event-workflow"));
    expect(eventWorkflowSteps).toHaveLength(3);
    expect(eventWorkflowSteps.map((step) => step.title)).toEqual(["Set the event rule", "Review the tracked moment", "Make the call together"]);
    expect(eventWorkflowSteps[2].detail).toContain("Officials keep their authority");
  });

  it("frames organiser impact as clear event-protection outcomes without unsupported performance claims", () => {
    expect(smartRefereePageHierarchy).toContain("organiser-impact-detail");
    expect(organiserImpactDetail).toMatchObject({
      index: "04",
      audience: "For organisers",
      title: "Keep the schedule moving. Keep each decision clear.",
    });
    expect(organiserImpactDetail.description).toContain("without displacing the officials");
    expect(organiserImpactDetail.outcomes.map((outcome) => outcome.title)).toEqual(["Keep play moving", "Build trust", "Retain the record"]);
    expect(organiserImpactOutcomeIconPresentation).toEqual(["TimerReset", "ShieldCheck", "FileCheck2"]);
    expect(organiserImpactDetail.planningSignals).toHaveLength(3);
    expect(organiserImpactDetail.qualification).toContain("validate against your own staffing");
    expect(organiserImpactMetricAnimation).toEqual({ trigger: "when-visible", durationMilliseconds: 1800, respectsReducedMotion: true });
    expect(formatOrganiserImpactMetric(organiserImpactDetail.planningSignals[0], 4, "en")).toBe("4+ minutes");
    expect(formatOrganiserImpactMetric(organiserImpactDetail.planningSignals[1], 40, "zh-Hant")).toBe("超過 40+ 分鐘");
    expect(formatOrganiserImpactMetric(organiserImpactDetail.planningSignals[2], 27_000, "en")).toBe("HK$27k");
  });

  it("keeps technical evidence visible after the organiser value narrative", () => {
    expect(smartRefereePageHierarchy.indexOf("technical-confidence")).toBeGreaterThan(smartRefereePageHierarchy.indexOf("event-workflow"));
    expect(technicalSpecificationPresentation).toBe("visible-evidence-panel");
    expect(eventScaleEvidencePanelPresentation).toBe("dominant-plus-two-supporting");
    expect(eventScaleFeatureTilePresentation).toEqual({ mobileColumns: 1, desktopColumns: 3, desktopRows: 2, desktopWidth: "editorial-max-w-5xl", primaryPanel: "decision-data", supportingPanels: ["passive-tracking", "continuous-calibration"], layout: "dominant-two-supporting", visibility: "image-led-product-stories" });
    expect(eventScaleTileDetailInteraction).toEqual({ hover: "reveals-description", click: "toggles-description", technicalCards: "static-no-duplicate-copy", pitchPlacement: "standalone-panel-after-event-scale" });
    expect(technicalConfidence.title).toBe("Technical confidence, when your team needs it.");
    expect(technicalConfidence.markerTitle).toBe("Passive Tracking");
    expect(technicalConfidence.markerDescription).toContain("reflective markers");
    expect(technicalConfidence.continuousCalibrationTitle).toBe("Zero Drift. Pure Precision.");
    expect(technicalConfidence.continuousCalibrationDescription).toContain("automatically and continuously");
    expect(technicalConfidence.pitchVideoTitle).toBe("Drone Sports Referee Pitch");
    expect(proofPoints).toContainEqual({ value: "±0.20 mm", label: "3D accuracy" });
    expect(proofPoints).toContainEqual({ value: "10 ms", label: "decision making end to end" });
  });

  it("preserves the supplied tracking, human-officiating, marker, system-video, calibration-video, and reference media", () => {
    expect(smartRefereeMedia.decisionDataBackground).toBe("/manus-storage/precision-referee-console_516e698b.webp");
    expect(smartRefereeMedia.humanReferee).toBe("/manus-storage/referee-angle_083e0bbc.webp");
    expect(smartRefereeMedia.stickers).toBe("/manus-storage/cheapstickers_6b71bf1e.jpg");
    expect(smartRefereeMedia.precisionPoster).toBe("/manus-storage/flex13camerasys_aa73a4e5.jpg");
    expect(smartRefereeMedia.precisionVideo).toBe("/manus-storage/v2fulluncompressed_1dc97341.mp4");
    expect(smartRefereeMedia.continuousCalibrationVideo).toBe("/manus-storage/cont-calibration_a6322d41.mp4");
    expect(smartRefereeMedia.trackingVideo).toBe("/manus-storage/vli-tracking-test-video_f82aa6d7.mp4");
  });

  it("defines the premium TOPS Shield 205 product experience without checkout language", () => {
    expect(shield205Content.title).toBe("TOPS Shield 205: The Agile Striker");
    expect(shield205Content.pitch).toContain("high-intensity drone sports");
    expect(shield205Content.tiers.certified.label).toBe("VLI Certified Edition");
    expect(shield205Content.tiers.certified.features).toContain("Includes 1-Year VLI CARE: Covers heavy collision damage, water damage, and rapid replacements.");
    expect(shield205Content.tiers.builder.features).toContain("Factory default settings (requires manual PID tuning).");
    expect(shield205Content.specifications).toHaveLength(5);
    expect(shield205Content.inTheBox).toContain("1x Custom VLI Transport Bag");
    expect(shield205Content.inTheBox).not.toContain("1x VLI CARE Activation Code");
    expect(traditionalChineseTranslations["TOPS Shield 205: The Agile Striker"]).toBe("TOPS Shield 205：敏捷突擊者");
    expect(traditionalChineseTranslations["Add to Quote"]).toBe("加入報價");

    const variants = {
      familyId: "tops-shield-205",
      reference: "1",
      name: "TOPS Shield 205",
      category: "Competition Frames",
      description: "205 mm platform",
      variants: [
        { sourceId: "rtf", number: "1", label: "TOPS Shield 205 RTF", name: "TOPS Shield 205 RTF", model: "RTF", description: "Ready to fly", price: "HK$4,329", image: "", imageAlt: "" },
        { sourceId: "pnp", number: "2", label: "TOPS Shield 205 PNP", name: "TOPS Shield 205 PNP", model: "PNP", description: "Bring your own receiver", price: "HK$2,743", image: "", imageAlt: "" },
      ],
    };
    expect(getShield205Variant(variants, "certified").sourceId).toBe("rtf");
    expect(getShield205Variant(variants, "builder").sourceId).toBe("pnp");
  });

  it("defines premium quote-first experiences for TOPS Shield 220, R220F, and TOPS Shield 400", () => {
    expect(premiumProductContent["tops-shield-220"].defaultTier).toBe("certified");
    expect(Object.keys(premiumProductContent["tops-shield-220"].tiers)).toEqual(["certified", "travel", "builder"]);
    expect(premiumProductContent["r220f"].tiers.certified?.label).toBe("VLI Ready-to-Deploy Edition");
    expect(premiumProductContent["tops-shield-400"].defaultTier).toBe("certified");

    const shield220 = {
      familyId: "tops-shield-220",
      reference: "3–5",
      name: "TOPS Shield 220",
      category: "Drone platform",
      description: "220 mm platform",
      variants: [
        { sourceId: "27", number: "3", label: "RTF", name: "TOPS Shield 220 RTF", model: "TZ002", description: "", price: "HK$3,718", image: "", imageAlt: "" },
        { sourceId: "28", number: "4", label: "RTF + Bag", name: "TOPS Shield 220 RTF + Bag", model: "TZ002", description: "", price: "HK$4,056", image: "", imageAlt: "" },
        { sourceId: "29", number: "5", label: "PNP", name: "TOPS Shield 220 PNP", model: "TZ002", description: "", price: "HK$2,743", image: "", imageAlt: "" },
      ],
    };
    expect(getPremiumVariant(shield220, "certified", premiumProductContent["tops-shield-220"]).sourceId).toBe("27");
    expect(getPremiumVariant(shield220, "travel", premiumProductContent["tops-shield-220"]).sourceId).toBe("28");
    expect(getPremiumVariant(shield220, "builder", premiumProductContent["tops-shield-220"]).sourceId).toBe("29");
    expect(traditionalChineseTranslations["TOPS Shield 220: The Competition Workhorse"]).toBe("TOPS Shield 220：競賽主力平台");
    expect(traditionalChineseTranslations["R220F: The Ready-to-Deploy Training Platform"]).toBe("R220F：可即時部署的訓練平台");
    expect(traditionalChineseTranslations["TOPS Shield 400: The Arena-Scale Platform"]).toBe("TOPS Shield 400：場館級平台");
  });

  it("preserves the pitch-video controls and the mobile visibility policy", () => {
    expect(smartRefereeHeroVideoPresentation).toEqual({ aspectRatio: "16:9", objectFit: "contain", controls: false, autoPlay: true, muted: true, loop: true, containerTreatment: "borderless-integrated" });
    expect(smartRefereeHeroBackgroundPresentation).toEqual({ source: "homepage-hero-video", treatment: "autoplay-video-with-tracking-poster-fallback", autoPlay: true, muted: true, loop: true, playsInline: true, preload: "auto" });
    expect(flex13SystemVideoPresentation).toEqual({ title: "Drone Sports Referee Pitch", aspectRatio: "16:9", autoPlay: false, muted: false, loop: false, controls: true, playsInline: true, preload: "metadata", controlsList: "nodownload noremoteplayback", disablePictureInPicture: true });
    expect(continuousCalibrationVideoPresentation).toEqual({ autoPlay: true, muted: true, loop: true, controls: false, playsInline: true, preload: "metadata" });
    expect(mobileSmartRefereeRevealPolicy).toBe("always-visible");
    expect(mobileSmartRefereeCardAspectRatio).toBe("21:9");
  });

  it("maps the revised organiser promise, outcomes, workflow, and visible evidence into Traditional Chinese", () => {
    [
      "Fair calls. A", "protected schedule.", "Plan your event", "Watch a decision replay", "Rule input", "Active scoring condition", "Evidence", "Tracked position + review", "Decision", "Shared call", "Overview", "Decision Console", "Technical layer", "Event delivery", "View technical detail", "Close detail", "01 · SHARED VIEW", "OPERATIONAL REPLAY", "03 · DECISION RAIL", "02 · TECHNICAL LAYER", "03 · RULE WORKFLOW", "05 · READY TO VERIFY", "06 · READY TO SCOPE", "What is Drone Sports Referee?", "A calibrated decision-support system that gives officials one shared, reviewable view of difficult scoring moments.", "Resolve close calls", "Keep the next match moving", "Align officiating standards", "For organisers", "Keep the schedule moving. Keep each decision clear.", "Smart Referee gives your competition a consistent way to review difficult scoring moments and retain a clear decision record—without displacing the officials responsible for the call.", "Keep play moving", "Help officials return a reviewable decision to the field, so the next match can begin with less uncertainty.", "Build trust", "Give teams and officials a clear process around consequential scoring decisions.", "Retain the record", "Keep a reviewable decision trail for organisers, officials, and post-event follow-up.", "Planning signals", "per review delay", "Wasted time on dispute per event", "Extra cost related to all parties", "Planning values supplied for event discussion; validate against your own staffing, venue, and programme data.", "A product layer, built for", "event scale.", "One rule. One shared", "decision path.", "Rule condition", "Set the active scoring condition", "Position evidence", "Review the tracked moment", "Record the shared decision", "Active workflow stage", "Decision path", "Event fit", "Scope your event before the quote.", "Venue and cage count", "Match format", "Programme schedule", "Delivery support", "Request an event scope", "Passive Tracking", "Passive tracking uses reflective markers that bounce infrared light from OptiTrack cameras back to the lens. It’s ideal for complex tracking volumes where cost-effective, lightweight markers are preferred.", "Zero Drift. Pure Precision.", "Motive calibrates automatically and continuously with data collected during normal use of the system. No longer does your calibration degrade over time with changing temperatures or challenging building movement—it is always a “fresh” calibration.", "Drone Sports Referee Pitch", "A focused overview of the Smart Referee workflow for organisers, officials, and delivery teams.", "Compare all service inclusions",
    ].forEach((key) => expect(traditionalChineseTranslations[key]).toBeTruthy());
    expect(traditionalChinesePromisePresentation).toBe("two-intentional-lines");
  });
});
