import { ArrowRight, CircleCheck, Crosshair, Eye, FileCheck2, Radar, RefreshCw, ScanLine, Settings2, ShieldCheck, SlidersHorizontal, TimerReset } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import RefereePricingConfigurator from "@/components/RefereePricingConfigurator";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { homepageHeroVideoPosterSrc, homepageHeroVideoSrc } from "@/lib/heroMedia";
import { trackConversion } from "@/lib/conversionTracking";

export const proofPoints = [
  { value: "OptiTrack", label: "industry leading motion capture technology" },
  { value: "Unity", label: "event operations interface" },
  { value: "±0.20 mm", label: "3D accuracy" },
  { value: "10 ms", label: "decision making end to end" },
];

export const mobileSmartRefereeRevealPolicy = "always-visible";
export const mobileSmartRefereeCardAspectRatio = "21:9";
export const technicalSpecificationPresentation = "visible-evidence-panel";
export const traditionalChinesePromisePresentation = "two-intentional-lines";
export const eventScaleEvidencePanelPresentation = "dominant-plus-two-supporting";
export const eventScaleFeatureTilePresentation = {
  mobileColumns: 1,
  desktopColumns: 3,
  desktopRows: 2,
  desktopWidth: "editorial-max-w-5xl",
  primaryPanel: "decision-data",
  supportingPanels: ["passive-tracking", "continuous-calibration"],
  layout: "dominant-two-supporting",
  visibility: "image-led-product-stories",
} as const;
export const eventScaleTileDetailInteraction = {
  hover: "reveals-description",
  click: "toggles-description",
  pitchPlacement: "standalone-panel-after-event-scale",
} as const;
export const smartRefereeHeroVideoPresentation = {
  aspectRatio: "16:9",
  objectFit: "contain",
  controls: false,
  autoPlay: true,
  muted: true,
  loop: true,
  containerTreatment: "borderless-integrated",
} as const;
export const smartRefereeHeroBackgroundPresentation = {
  source: "homepage-hero-video",
  treatment: "autoplay-video-with-tracking-poster-fallback",
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto",
} as const;
export const flex13SystemVideoPresentation = {
  title: "Drone Sports Referee Pitch",
  aspectRatio: "16:9",
  autoPlay: false,
  muted: false,
  loop: false,
  controls: true,
  playsInline: true,
  preload: "metadata",
  controlsList: "nodownload noremoteplayback",
  disablePictureInPicture: true,
} as const;
export const continuousCalibrationVideoPresentation = {
  autoPlay: true,
  muted: true,
  loop: true,
  controls: false,
  playsInline: true,
  preload: "metadata",
} as const;
export const smartRefereePageHierarchy = [
  "organiser-promise",
  "organiser-outcomes",
  "system-replay",
  "event-workflow",
  "organiser-impact-detail",
  "technical-confidence",
  "rule-workflow",
  "drone-sports-referee-pitch",
  "event-delivery-options",
  "event-scope",
] as const;

export const smartRefereeReferenceFormatPresentation = {
  hero: "field-scene-decision-rail",
  outcomes: "editorial-outcome-spread",
  replay: "signature-decision-console",
  technical: "dominant-plus-two-product-system",
  workflow: "true-white-decision-rail",
  organiserImpact: "deep-ink-outcome-band-and-operational-rail",
  conversion: "event-scope-closer",
} as const;

export const smartRefereeVisualStoryPresentation = {
  decisionConsole: "verified-media-with-operational-status-rail",
  organiserImpact: "deep-ink-editorial-outcomes-with-operational-rail",
  pricing: "deep-ink-service-family",
  ruleWorkflow: "configurable-condition-evidence-shared-call",
} as const;

export const smartRefereeFullDarkThemePresentation = {
  organiserOutcomes: "deep-ink-high-contrast",
  eventWorkflow: "deep-ink-high-contrast",
  technicalLayer: "deep-ink-high-contrast",
  ruleWorkflow: "deep-ink-high-contrast",
  eventDelivery: "deep-ink-high-contrast",
  eventScope: "deep-ink-high-contrast",
} as const;

export const smartRefereeContextNavigation = [
  { href: "#organiser-outcomes", label: "Overview" },
  { href: "#system-video", label: "Decision Console" },
  { href: "#technical-confidence", label: "Technical layer" },
  { href: "#pricing", label: "Event delivery" },
] as const;

export const eventScopePlanningInputs = [
  "Venue and cage count",
  "Match format",
  "Programme schedule",
  "Delivery support",
] as const;

export const smartRefereeIconSystemPresentation = {
  decisionRail: ["SlidersHorizontal", "ScanLine", "CircleCheck"],
  organiserOutcomes: ["Eye", "ScanLine", "ShieldCheck"],
  workflow: ["Settings2", "ScanLine", "CircleCheck"],
  technical: ["Crosshair", "Radar", "RefreshCw"],
} as const;

export const smartRefereeDecisionRail = [
  { label: "Rule input", value: "Active scoring condition" },
  { label: "Evidence", value: "Tracked position + review" },
  { label: "Decision", value: "Shared call" },
] as const;

const decisionRailIcons = [SlidersHorizontal, ScanLine, CircleCheck] as const;
const organiserOutcomeIcons = { resolve: Eye, schedule: ScanLine, standard: ShieldCheck } as const;
const workflowStepIcons = [Settings2, ScanLine, CircleCheck] as const;

const ruleWorkflowStages = [
  { id: "condition", label: "Rule condition", title: "Set the active scoring condition", detail: "Keep the rule requirement explicit before the review begins.", Icon: SlidersHorizontal },
  { id: "evidence", label: "Position evidence", title: "Review the tracked moment", detail: "Bring the calibrated position and relevant replay into one view.", Icon: Crosshair },
  { id: "decision", label: "Shared call", title: "Record the shared decision", detail: "Officials retain authority with one reviewable event context.", Icon: CircleCheck },
] as const;

export const organiserOutcomesIntroduction = {
  heading: "What is Drone Sports Referee?",
  description: "A calibrated decision-support system that gives officials one shared, reviewable view of difficult scoring moments.",
} as const;

export const organiserOutcomeCards = [
  {
    id: "resolve",
    number: "01",
    title: "Resolve close calls",
    detail: "Give officials one reviewable reference when a scoring moment is difficult to see.",
  },
  {
    id: "schedule",
    number: "02",
    title: "Keep the next match moving",
    detail: "Help the decision return to the field so the programme can continue with clarity.",
  },
  {
    id: "standard",
    number: "03",
    title: "Align officiating standards",
    detail: "Apply the active event rule to the same calibrated position evidence for every review.",
  },
] as const;

export const eventWorkflowSteps = [
  {
    number: "01",
    title: "Set the event rule",
    detail: "Configure the scoring condition and review path around the format you are running.",
  },
  {
    number: "02",
    title: "Review the tracked moment",
    detail: "Bring the relevant position evidence into one shared view for the officials.",
  },
  {
    number: "03",
    title: "Make the call together",
    detail: "Officials keep their authority while working from the same reviewable context.",
  },
] as const;

export const organiserImpactDetail = {
  index: "04",
  audience: "For organisers",
  title: "Keep the schedule moving. Keep each decision clear.",
  description: "Smart Referee gives your competition a consistent way to review difficult scoring moments and retain a clear decision record—without displacing the officials responsible for the call.",
  outcomes: [
    { title: "Keep play moving", detail: "Help officials return a reviewable decision to the field, so the next match can begin with less uncertainty." },
    { title: "Build trust", detail: "Give teams and officials a clear process around consequential scoring decisions." },
    { title: "Retain the record", detail: "Keep a reviewable decision trail for organisers, officials, and post-event follow-up." },
  ],
  planningSignals: [
    { value: 4, label: "per review delay", formatter: "review-delay" },
    { value: 40, label: "Wasted time on dispute per event", formatter: "dispute-time" },
    { value: 27_000, label: "Extra cost related to all parties", formatter: "hkd-compact" },
  ],
  qualification: "Planning values supplied for event discussion; validate against your own staffing, venue, and programme data.",
} as const;

const organiserImpactOutcomeIcons = {
  "Keep play moving": TimerReset,
  "Build trust": ShieldCheck,
  "Retain the record": FileCheck2,
} as const;

export const organiserImpactOutcomeIconPresentation = ["TimerReset", "ShieldCheck", "FileCheck2"] as const;

export const organiserImpactMetricAnimation = {
  trigger: "when-visible",
  durationMilliseconds: 1800,
  respectsReducedMotion: true,
} as const;

type OrganiserImpactMetric = (typeof organiserImpactDetail.planningSignals)[number];

export const formatOrganiserImpactMetric = (metric: OrganiserImpactMetric, value: number, language: "en" | "zh-Hant") => {
  if (metric.formatter === "hkd-compact") return `HK$${Math.round(value / 1_000)}k`;
  if (metric.formatter === "review-delay") return language === "zh-Hant" ? `${value} 分鐘以上` : `${value}+ minutes`;
  return language === "zh-Hant" ? `超過 ${value}+ 分鐘` : `over ${value}+ minutes`;
};

function RollingImpactMetric({ metric }: { metric: OrganiserImpactMetric }) {
  const { language } = useWebsiteLanguage();
  const valueRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number>(metric.value);
  const hasEnteredView = useRef(false);

  useEffect(() => {
    const element = valueRef.current;
    if (!element) return;

    let animationFrame = 0;
    const animate = (instant = false) => {
      if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayValue(metric.value);
        return;
      }
      const startedAt = window.performance.now();
      const tick = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / organiserImpactMetricAnimation.durationMilliseconds, 1);
        setDisplayValue(Math.round(metric.value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) animationFrame = window.requestAnimationFrame(tick);
      };
      animationFrame = window.requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return () => window.cancelAnimationFrame(animationFrame);
    }

    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasEnteredView.current) return;
      hasEnteredView.current = true;
      setDisplayValue(0);
      animate();
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [metric]);

  return <span ref={valueRef} data-live-metric className="font-mono text-3xl font-semibold leading-none tracking-tight text-accent sm:text-4xl">{formatOrganiserImpactMetric(metric, displayValue, language)}</span>;
}

export const smartRefereeMedia = {
  humanReferee: "/manus-storage/referee-angle_083e0bbc.webp",
  stickers: "/manus-storage/cheapstickers_6b71bf1e.jpg",
  precisionPoster: "/manus-storage/flex13camerasys_aa73a4e5.jpg",
  precisionVideo: "/manus-storage/v2fulluncompressed_1dc97341.mp4",
  continuousCalibrationVideo: "/manus-storage/cont-calibration_a6322d41.mp4",
  trackingVideo: "/manus-storage/vli-tracking-test-video_f82aa6d7.mp4",
  trackingPoster: "/manus-storage/vli-tracking-test-first-frame_2dca2577.jpg",
} as const;

export const technicalConfidence = {
  title: "Technical confidence, when your team needs it.",
  description: "The Smart Referee system is designed to turn high-speed position data into a shared reference that can be prepared consistently for an event.",
  markerTitle: "Passive Tracking",
  markerDescription: "Passive tracking uses reflective markers that bounce infrared light from OptiTrack cameras back to the lens. It’s ideal for complex tracking volumes where cost-effective, lightweight markers are preferred.",
  continuousCalibrationTitle: "Zero Drift. Pure Precision.",
  continuousCalibrationDescription: "Motive calibrates automatically and continuously with data collected during normal use of the system. No longer does your calibration degrade over time with changing temperatures or challenging building movement—it is always a “fresh” calibration.",
  pitchVideoTitle: "Drone Sports Referee Pitch",
  pitchVideoDescription: "A focused overview of the Smart Referee workflow for organisers, officials, and delivery teams.",
} as const;

function EventScaleTile({ id, label, detail, expanded, onToggle, className, technicalEvidence = false, children }: { id: string; label: string; detail: ReactNode; expanded: boolean; onToggle: () => void; className: string; technicalEvidence?: boolean; children: ReactNode }) {
  const detailId = `event-scale-tile-${id}-detail`;
  return <article data-event-scale-panel data-feature-tile data-tile-index={id} data-technical-evidence-panel={technicalEvidence ? "true" : undefined} data-reveal className={`group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ${className}`}>
    <div className="relative z-10 h-full pointer-events-none">{children}</div>
    <div aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 z-[15] inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#071117]/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm sm:bottom-5 sm:right-5"><span>{expanded ? "Close detail" : "View technical detail"}</span><ArrowRight size={13} className={expanded ? "rotate-90" : ""} /></div>
    <button type="button" data-tile-detail-toggle data-tile-index={id} aria-expanded={expanded} aria-controls={detailId} aria-label={`${expanded ? "Hide" : "Show"} details for ${label}`} onClick={onToggle} className="absolute inset-0 z-20 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"><span className="sr-only">{expanded ? "Hide details" : "Show details"}</span></button>
    <div id={detailId} data-tile-detail-panel aria-hidden={!expanded} className={`pointer-events-none absolute inset-0 z-10 flex items-end bg-[linear-gradient(180deg,rgba(7,16,20,0.22)_0%,rgba(7,16,20,0.97)_62%)] p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-5 ${expanded ? "opacity-100" : ""}`}><p className="text-[11px] leading-4 text-white/85 sm:text-xs sm:leading-5">{detail}</p></div>
  </article>;
}

export default function Product() {
  const [expandedEventScaleTile, setExpandedEventScaleTile] = useState<string | null>(null);
  const [activeRuleWorkflowStage, setActiveRuleWorkflowStage] = useState<(typeof ruleWorkflowStages)[number]["id"]>("condition");
  const toggleEventScaleTile = (id: string) => setExpandedEventScaleTile((current) => current === id ? null : id);
  const activeRuleWorkflow = ruleWorkflowStages.find((stage) => stage.id === activeRuleWorkflowStage) ?? ruleWorkflowStages[0];
  return (
    <div className="smart-referee-page min-h-screen bg-black text-white" data-mobile-reveal-policy={mobileSmartRefereeRevealPolicy}>
      <SiteHeader active="referee" />
      <main data-reveal-page className="pt-16">
        <section id="organiser-promise" data-testid="smart-referee-hero" data-background-treatment={smartRefereeHeroBackgroundPresentation.treatment} data-presentation={smartRefereeReferenceFormatPresentation.hero} className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-white/10 bg-[#071117]">
          <img src={smartRefereeMedia.trackingPoster} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 z-0 h-full w-full object-cover object-right" />
          <video data-testid="smart-referee-hero-video" src={homepageHeroVideoSrc} poster={homepageHeroVideoPosterSrc} aria-hidden="true" autoPlay={smartRefereeHeroBackgroundPresentation.autoPlay} muted={smartRefereeHeroBackgroundPresentation.muted} loop={smartRefereeHeroBackgroundPresentation.loop} playsInline={smartRefereeHeroBackgroundPresentation.playsInline} preload={smartRefereeHeroBackgroundPresentation.preload} onCanPlay={(event) => { void event.currentTarget.play().catch(() => undefined); }} className="absolute inset-0 z-[1] h-full w-full object-cover object-center" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] opacity-35 [background-image:linear-gradient(rgba(64,224,208,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,208,0.12)_1px,transparent_1px)] [background-size:3rem_3rem]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(7,17,23,0.98)_0%,rgba(7,17,23,0.9)_48%,rgba(7,17,23,0.34)_100%)]" />
          <div className="container relative z-20 flex min-h-[calc(100svh-4rem)] flex-col justify-end py-12 md:py-16 lg:py-20">
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Smart Referee for event organisers</p>
              <h1 data-testid="smart-referee-hero-decision-heading" className="velocity-headline max-w-3xl text-[clamp(2.9rem,7vw,6.8rem)] leading-[0.9] text-white"><span>Fair calls. A</span><span data-smart-referee-zh-line-break className="text-accent"> protected schedule.</span></h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">When a scoring moment is hard to see, Smart Referee gives officials a shared reviewable view—so your competition can move on with confidence.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a data-testid="smart-referee-hero-service-action" href="#pricing" onClick={() => trackConversion("smart_referee_cta", { action: "hero_pricing", route: "dronesportsreferee" })} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Plan your event <ArrowRight size={18} /></a>
                <a href="#system-video" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent">Watch a decision replay <ArrowRight size={18} /></a>
              </div>
            </div>
            <div data-testid="smart-referee-decision-rail" className="mt-10 grid border-t border-white/25 pt-5 sm:mt-14 sm:grid-cols-3 sm:gap-8">
              {smartRefereeDecisionRail.map((item, index) => { const Icon = decisionRailIcons[index]; return <div key={item.label} className="py-3 sm:py-0"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45"><Icon aria-hidden="true" size={14} className="text-accent" strokeWidth={1.8} />{item.label}</p><p className="mt-1 text-sm font-medium text-white">{item.value}</p></div>; })}
            </div>
          </div>
        </section>

        <nav aria-label="Smart Referee sections" className="sticky top-16 z-40 hidden border-b border-white/10 bg-[#071117]/95 backdrop-blur-lg lg:block">
          <div className="container flex h-12 items-center justify-between gap-5">
            <p className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Smart Referee</p>
            <div className="flex items-center gap-5 text-xs font-semibold text-white/70 xl:gap-7">
              {smartRefereeContextNavigation.map((item) => <a key={item.href} href={item.href} className="transition-colors hover:text-accent">{item.label}</a>)}
            </div>
          </div>
        </nav>

        <section id="organiser-outcomes" data-testid="organiser-outcomes" data-presentation={smartRefereeReferenceFormatPresentation.outcomes} data-theme={smartRefereeFullDarkThemePresentation.organiserOutcomes} className="border-b border-white/10 bg-[#0B1419] py-14 text-white md:py-24">
          <div className="container">
            <div data-testid="organiser-outcomes-introduction" data-reveal className="reveal-up grid max-w-5xl gap-7 border-t border-white/15 pt-5 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <div>
              <p className="font-mono text-xs font-semibold tracking-[0.18em] text-accent">01 · SHARED VIEW</p>
              <h2 className="velocity-headline max-w-3xl text-[clamp(2.5rem,5vw,5.25rem)] leading-[0.96] text-white">{organiserOutcomesIntroduction.heading}</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-white/70 md:text-lg">{organiserOutcomesIntroduction.description}</p>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden border-y border-white/15 bg-white/10 md:grid-cols-3">
              {organiserOutcomeCards.map((outcome, index) => {
                const Icon = organiserOutcomeIcons[outcome.id];
                return <article data-reveal key={outcome.id} className="reveal-up bg-[#0B1419] px-5 py-8 md:px-7 md:py-10" style={{ transitionDelay: `${index * 70}ms` }}>
                  <Icon aria-hidden="true" className="h-5 w-5 text-accent" strokeWidth={1.7} />
                  <p className="mt-5 font-mono text-xs font-semibold text-accent">{outcome.number}</p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">{outcome.title}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{outcome.detail}</p>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section id="system-video" data-testid="smart-referee-system-video" data-presentation={smartRefereeReferenceFormatPresentation.replay} className="border-b border-white/10 bg-[#071117] py-14 md:py-24">
          <div className="container">
            <div data-reveal className="reveal-up mb-8 grid gap-4 border-t border-white/15 pt-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div><p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-accent">OPERATIONAL REPLAY</p><h2 className="velocity-headline max-w-2xl text-white">See the call, not just the <span className="text-accent">replay.</span></h2></div>
              <p className="max-w-md text-sm leading-6 text-white/65">A single calibrated view helps officials review the relevant moment together, then return their attention to the event.</p>
            </div>
            <div data-reveal data-presentation={smartRefereeHeroVideoPresentation.containerTreatment} className="reveal-up overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#02080A] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-3" style={{ transitionDelay: "90ms" }}>
              <div className="grid border-b border-white/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:grid-cols-3">
                {smartRefereeDecisionRail.map((item, index) => { const Icon = decisionRailIcons[index]; return <div key={item.label} className={`flex items-center gap-2 px-3 py-3 ${index > 0 ? "border-t border-white/10 sm:border-l sm:border-t-0" : ""}`}><Icon aria-hidden="true" size={14} className={index === 2 ? "text-accent" : "text-white/45"} strokeWidth={1.8} />{item.label}</div>; })}
              </div>
              <div className="grid lg:grid-cols-[minmax(0,1fr)_15rem]">
                <div className="relative min-h-[17rem] overflow-hidden bg-black sm:min-h-[28rem]">
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_60%_30%,rgba(64,224,208,0.12),transparent_42%)]" />
                  <video src={smartRefereeMedia.trackingVideo} poster={smartRefereeMedia.trackingPoster} autoPlay={smartRefereeHeroVideoPresentation.autoPlay} muted={smartRefereeHeroVideoPresentation.muted} loop={smartRefereeHeroVideoPresentation.loop} controls={smartRefereeHeroVideoPresentation.controls} playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover opacity-90">Your browser does not support embedded video.</video>
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#02080A]/95 via-transparent to-[#02080A]/35" />
                  <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-6"><div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">{smartRefereeDecisionRail[1].label}</p><p className="mt-1 text-sm font-medium text-white">{smartRefereeDecisionRail[1].value}</p></div><p className="hidden text-right font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 sm:block">{smartRefereeDecisionRail[2].value}</p></div>
                </div>
                <aside className="flex flex-col justify-between bg-[#091419] p-5 sm:p-6">
                  <div className="space-y-5">
                    {smartRefereeDecisionRail.map((item, index) => { const Icon = decisionRailIcons[index]; return <div key={item.label} className={`${index > 0 ? "border-t border-white/10 pt-5" : ""}`}><p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent"><Icon aria-hidden="true" size={14} strokeWidth={1.8} />0{index + 1} · {item.label}</p><p className="mt-2 text-sm leading-6 text-white/80">{item.value}</p></div>; })}
                  </div>
                  <div className="mt-8 border-t border-white/10 pt-4"><div className="h-px w-10 bg-accent" /><p className="mt-3 text-xs leading-5 text-white/55">{technicalConfidence.description}</p></div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section id="event-workflow" data-testid="event-workflow" data-presentation={smartRefereeReferenceFormatPresentation.workflow} data-theme={smartRefereeFullDarkThemePresentation.eventWorkflow} className="velocity-section border-b border-white/10 bg-[#071117] text-white">
          <div className="container grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal className="reveal-up overflow-hidden rounded-[1.75rem] border border-[#071117]/10 bg-[#071117] shadow-[0_20px_50px_rgba(7,17,23,0.16)]">
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[4/3]">
                <img src={smartRefereeMedia.humanReferee} alt="Scoring officials viewing a drone-sports goal through the arena net" className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#161719]/90 via-[#161719]/10 to-transparent" />
                <p className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">One difficult moment. One shared view.</p>
              </div>
            </div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
              <p className="mb-3 font-mono text-xs font-semibold tracking-[0.18em] text-accent">03 · DECISION RAIL</p>
              <h2 className="velocity-headline max-w-2xl text-white">From question to <span className="text-accent">shared call.</span></h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">Officials remain central to the game. Smart Referee is there to make a difficult scoring moment easier to review without replacing human authority.</p>
              <ol className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {eventWorkflowSteps.map((step, index) => {
                  const Icon = workflowStepIcons[index];
                  return (
                  <li key={step.number} className="grid gap-3 py-4 sm:grid-cols-[3.25rem_1fr] sm:gap-5">
                    <span className="flex items-center gap-2 font-mono text-sm font-semibold text-accent"><Icon aria-hidden="true" size={16} strokeWidth={1.8} />{step.number}</span>
                    <div><h3 className="font-semibold text-white">{step.title}</h3><p className="mt-1.5 text-sm leading-6 text-white/65">{step.detail}</p></div>
                  </li>
                ); })}
              </ol>
            </div>
          </div>
        </section>

        <section id="organiser-impact-detail" data-testid="organiser-impact-detail" data-presentation={smartRefereeReferenceFormatPresentation.organiserImpact} className="border-b border-white/10 bg-[#071117] py-14 text-white md:py-24">
          <div className="container">
            <div data-reveal className="reveal-up max-w-3xl border-t border-white/15 pt-5">
              <p className="font-mono text-xs font-semibold tracking-[0.18em] text-accent">{organiserImpactDetail.index} · {organiserImpactDetail.audience}</p>
              <h2 className="velocity-headline mt-5 max-w-3xl text-[clamp(2.5rem,5.5vw,5.6rem)] leading-[0.95] text-white">{organiserImpactDetail.title}</h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">{organiserImpactDetail.description}</p>
            </div>
            <div data-testid="organiser-impact-outcomes" className="mt-12 grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {organiserImpactDetail.outcomes.map((outcome, index) => (
                <article key={outcome.title} data-reveal className="reveal-up px-0 py-7 md:px-7 md:py-9 first:md:pl-0 last:md:pr-0" style={{ transitionDelay: `${index * 70}ms` }}>
                  {(() => { const Icon = organiserImpactOutcomeIcons[outcome.title]; return <Icon aria-hidden="true" className="h-6 w-6 text-accent" strokeWidth={1.75} />; })()}
                  <p className="font-mono text-xs font-semibold text-accent">0{index + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">{outcome.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{outcome.detail}</p>
                </article>
              ))}
            </div>
            <div data-testid="organiser-impact-planning-signals" className="mt-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/35 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Planning signals</p>
              <div className="mt-5 grid divide-y divide-white/10 border-y border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {organiserImpactDetail.planningSignals.map((metric, index) => (
                  <div key={metric.label} data-reveal className="reveal-up py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0" style={{ transitionDelay: `${index * 70}ms` }}><RollingImpactMetric metric={metric} /><p className="mt-3 text-xs leading-5 text-white/65">{metric.label}</p></div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-5 text-white/50">{organiserImpactDetail.qualification}</p>
            </div>
          </div>
        </section>

        <section id="technical-confidence" data-testid="technical-confidence" data-presentation={smartRefereeReferenceFormatPresentation.technical} data-theme={smartRefereeFullDarkThemePresentation.technicalLayer} className="velocity-section border-b border-white/10 bg-[#0B1419]">
          <div className="container">
            <div data-reveal className="reveal-up grid max-w-5xl gap-5 border-t border-white/15 pt-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <p className="mb-0 font-mono text-xs font-semibold tracking-[0.18em] text-accent">02 · TECHNICAL LAYER</p>
              <div>
                <h2 className="velocity-headline max-w-3xl text-white">A product layer, built for <span className="text-accent">event scale.</span></h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">{technicalConfidence.description}</p>
              </div>
            </div>
            <div data-testid="event-scale-evidence-panels" data-presentation={eventScaleEvidencePanelPresentation} data-mobile-columns={eventScaleFeatureTilePresentation.mobileColumns} data-desktop-columns={eventScaleFeatureTilePresentation.desktopColumns} data-desktop-rows={eventScaleFeatureTilePresentation.desktopRows} data-primary-panel={eventScaleFeatureTilePresentation.primaryPanel} data-visibility={eventScaleFeatureTilePresentation.visibility} className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3 md:grid-rows-2 md:gap-5">
              <EventScaleTile id="01" label="Decision data" detail={technicalConfidence.description} expanded={expandedEventScaleTile === "01"} onToggle={() => toggleEventScaleTile("01")} className="min-h-[22rem] bg-[radial-gradient(circle_at_74%_18%,rgba(64,224,208,0.24),transparent_0_36%),#0B1419] md:col-span-2 md:row-span-2 md:min-h-0 md:aspect-auto" ><div className="flex h-full flex-col p-5 sm:p-7"><p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs"><Crosshair aria-hidden="true" size={16} strokeWidth={1.8} />01 · DECISION DATA</p><div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-8">{proofPoints.map((point) => <div key={point.value} className="border-l border-white/15 pl-3 sm:pl-4"><p className="text-2xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">{point.value}</p><p className="mt-1.5 max-w-[10rem] text-[10px] leading-4 text-white/55 sm:text-xs sm:leading-5">{point.label}</p></div>)}</div></div></EventScaleTile>
              <EventScaleTile id="02" label={technicalConfidence.markerTitle} detail={technicalConfidence.markerDescription} expanded={expandedEventScaleTile === "02"} onToggle={() => toggleEventScaleTile("02")} className="min-h-[16rem] bg-[#0B1419] md:min-h-0 md:aspect-auto"><img src={smartRefereeMedia.stickers} alt="Circular passive marker stickers for competition drones" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-t from-[#071014] via-[#071014]/70 to-transparent" /><div className="relative flex h-full flex-col p-5 sm:p-6"><p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs"><Radar aria-hidden="true" size={16} strokeWidth={1.8} />02 · TRACKING SETUP</p><h3 className="mt-auto text-2xl font-semibold tracking-tight text-white sm:text-3xl">{technicalConfidence.markerTitle}</h3><p className="mt-2 max-w-md text-xs leading-5 text-white/70">{technicalConfidence.markerDescription}</p></div></EventScaleTile>
              <div data-testid="technical-evidence-panels" className="contents">
                <EventScaleTile id="03" technicalEvidence label={technicalConfidence.continuousCalibrationTitle} detail={technicalConfidence.continuousCalibrationDescription} expanded={expandedEventScaleTile === "03"} onToggle={() => toggleEventScaleTile("03")} className="min-h-[16rem] bg-[#0E171B] md:min-h-0 md:aspect-auto"><video data-testid="continuous-calibration-video" src={smartRefereeMedia.continuousCalibrationVideo} autoPlay={continuousCalibrationVideoPresentation.autoPlay} muted={continuousCalibrationVideoPresentation.muted} loop={continuousCalibrationVideoPresentation.loop} controls={continuousCalibrationVideoPresentation.controls} playsInline={continuousCalibrationVideoPresentation.playsInline} preload={continuousCalibrationVideoPresentation.preload} className="absolute inset-0 h-full w-full object-cover opacity-45">Your browser does not support embedded video.</video><div className="absolute inset-0 bg-gradient-to-t from-[#071014] via-[#071014]/60 to-transparent" /><div className="relative flex h-full flex-col p-5 sm:p-6"><p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs"><RefreshCw aria-hidden="true" size={16} strokeWidth={1.8} />03 · CONTINUOUS CALIBRATION</p><h3 className="mt-auto text-2xl font-semibold tracking-tight text-white sm:text-3xl">{technicalConfidence.continuousCalibrationTitle}</h3><p className="mt-2 max-w-md text-xs leading-5 text-white/70">{technicalConfidence.continuousCalibrationDescription}</p></div></EventScaleTile>
              </div>
            </div>
          </div>
        </section>

        <section id="rule-workflow" data-testid="rule-workflow" data-theme={smartRefereeFullDarkThemePresentation.ruleWorkflow} className="border-b border-white/10 bg-[#071117] py-14 text-white md:py-24">
          <div className="container">
            <div data-reveal className="reveal-up grid gap-5 border-t border-white/15 pt-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div><p className="font-mono text-xs font-semibold tracking-[0.18em] text-accent">03 · RULE WORKFLOW</p><h2 className="velocity-headline mt-4 max-w-xl text-white">One rule. One shared <span className="text-accent">decision path.</span></h2></div>
              <p className="max-w-xl text-sm leading-7 text-white/70">Use the current event rule, the tracked moment, and the review context to keep the decision process explicit for everyone involved.</p>
            </div>
            <div data-reveal data-presentation={smartRefereeVisualStoryPresentation.ruleWorkflow} className="reveal-up mt-10 overflow-hidden rounded-[1.75rem] border border-[#071117]/15 bg-[#071117] p-3 shadow-[0_24px_60px_rgba(7,17,23,0.22)] sm:p-4" style={{ transitionDelay: "80ms" }}>
              <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
                {ruleWorkflowStages.map((stage, index) => {
                  const Icon = stage.Icon;
                  const selected = activeRuleWorkflowStage === stage.id;
                  return <button key={stage.id} type="button" aria-pressed={selected} onClick={() => setActiveRuleWorkflowStage(stage.id)} className={`group min-h-36 p-5 text-left transition-colors ${selected ? "bg-[#132C31]" : "bg-[#071117] hover:bg-white/[0.045]"}`}><div className="flex items-center justify-between"><Icon aria-hidden="true" size={19} className="text-accent" strokeWidth={1.75} /><span className="font-mono text-[10px] font-semibold text-white/40">0{index + 1}</span></div><p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">{stage.label}</p><p className="mt-2 text-sm font-semibold text-white">{stage.title}</p></button>;
                })}
              </div>
              <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_16rem] lg:items-end">
                <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Active workflow stage</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{activeRuleWorkflow.title}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{activeRuleWorkflow.detail}</p></div>
                <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Decision path</p><div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white"><SlidersHorizontal aria-hidden="true" size={15} className="text-accent" /><ArrowRight aria-hidden="true" size={14} className="text-white/40" /><Crosshair aria-hidden="true" size={15} className="text-accent" /><ArrowRight aria-hidden="true" size={14} className="text-white/40" /><CircleCheck aria-hidden="true" size={15} className="text-accent" /></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="drone-sports-referee-pitch" data-testid="drone-sports-referee-pitch" data-pitch-video-panel className="velocity-section border-b border-white/10 bg-[#0B1419]">
          <div data-reveal className="container reveal-up">
            <div data-presentation={smartRefereeReferenceFormatPresentation.conversion} className="mx-auto max-w-5xl overflow-hidden border border-white/10 bg-black/20 p-4 sm:p-6 md:p-8"><div className="mb-5 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs font-semibold tracking-[0.18em] text-accent">05 · READY TO VERIFY</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-4xl">{technicalConfidence.pitchVideoTitle}</h2></div><p className="max-w-md text-sm leading-6 text-white/65">{technicalConfidence.pitchVideoDescription}</p></div><video data-testid="flex13-system-video" src={smartRefereeMedia.precisionVideo} poster={smartRefereeMedia.precisionPoster} aria-label="Drone Sports Referee Pitch video" autoPlay={flex13SystemVideoPresentation.autoPlay} muted={flex13SystemVideoPresentation.muted} loop={flex13SystemVideoPresentation.loop} controls={flex13SystemVideoPresentation.controls} controlsList={flex13SystemVideoPresentation.controlsList} disablePictureInPicture={flex13SystemVideoPresentation.disablePictureInPicture} playsInline={flex13SystemVideoPresentation.playsInline} preload={flex13SystemVideoPresentation.preload} onContextMenu={(event) => event.preventDefault()} className="aspect-video w-full rounded-xl bg-black object-contain">Your browser does not support embedded video.</video></div>
          </div>
        </section>

        <RefereePricingConfigurator />

        <section id="event-scope" className="border-y border-white/10 bg-[#071117] py-14 text-white md:py-20">
          <div data-reveal className="container reveal-up grid items-end gap-7 border-t border-white/15 pt-5 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl"><p className="font-mono text-xs font-semibold tracking-[0.18em] text-accent">06 · READY TO SCOPE</p><h2 className="velocity-headline mt-4 text-white">A clearer event day starts <span className="text-accent">before the first call.</span></h2><p className="mt-5 text-lg leading-8 text-white/70">Bring your venue, cage count, match format, and programme schedule. We will help define the appropriate Smart Referee delivery path.</p></div>
            <a href="#pricing" onClick={() => trackConversion("smart_referee_cta", { action: "event_scope_pricing", route: "dronesportsreferee" })} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Request an event scope <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
