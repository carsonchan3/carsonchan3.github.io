import { ArrowRight, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import RefereePricingConfigurator from "@/components/RefereePricingConfigurator";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { homepageHeroVideoPosterSrc, homepageHeroVideoSrc } from "@/lib/heroMedia";

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
export const eventScaleEvidencePanelPresentation = "compact-square-feature-tiles";
export const eventScaleFeatureTilePresentation = {
  mobileColumns: 2,
  desktopColumns: 4,
  tileAspectRatio: "1:1",
  visibility: "all-features-together",
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
  treatment: "dark-overlay-background",
  autoPlay: true,
  muted: true,
  loop: true,
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
  "drone-sports-referee-pitch",
  "event-delivery-options",
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
  title: "One held call can affect more than the moment.",
  description: "A scoring review can use the schedule buffer intended to protect the next match. The planning values below are discussion inputs, not measured outcomes or guaranteed savings.",
  metrics: [
    { value: 4, label: "per review delay", formatter: "review-delay" },
    { value: 40, label: "Wasted time on dispute per event", formatter: "dispute-time" },
    { value: 27_000, label: "Extra cost related to all parties", formatter: "hkd-compact" },
  ],
  qualification: "Planning values supplied for event discussion; validate against your own staffing, venue, and programme data.",
} as const;

export const organiserImpactMetricAnimation = {
  trigger: "when-visible",
  durationMilliseconds: 1800,
  respectsReducedMotion: true,
} as const;

type OrganiserImpactMetric = (typeof organiserImpactDetail.metrics)[number];

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
  ruleSupportLogos: [
    { id: "afa", src: "/manus-storage/AFA-logo_0b746387.png", alt: "AFA logo" },
    { id: "fida", src: "/manus-storage/fida-logo_98f84f21.jpg", alt: "FIDA logo" },
    { id: "fai", src: "/manus-storage/fai-logo_375508e2.svg", alt: "FAI logo" },
  ],
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
  rulesTitle: "Configurable competition rules",
  rulesDescription: "Smart Referee can be configured around an organisation’s active rule set, scoring conditions, and review workflow. Making the selected rules explicit in the operating configuration helps officials apply the intended standard consistently and reduces the risk that a rule is overlooked or incorrectly recalled under event pressure.",
  pitchVideoTitle: "Drone Sports Referee Pitch",
  pitchVideoDescription: "A focused overview of the Smart Referee workflow for organisers, officials, and delivery teams.",
  referenceCaption: "Supplied rule and federation references are shown for event-context discussion only; their display does not indicate endorsement.",
} as const;

function EventScaleTile({ id, label, detail, expanded, onToggle, className, technicalEvidence = false, children }: { id: string; label: string; detail: string; expanded: boolean; onToggle: () => void; className: string; technicalEvidence?: boolean; children: ReactNode }) {
  const detailId = `event-scale-tile-${id}-detail`;
  return <article data-event-scale-panel data-feature-tile data-tile-index={id} data-technical-evidence-panel={technicalEvidence ? "true" : undefined} data-reveal className={`group relative aspect-square overflow-hidden rounded-xl border border-white/10 ${className}`}>
    <div className="relative z-10 h-full pointer-events-none">{children}</div>
    <button type="button" data-tile-detail-toggle data-tile-index={id} aria-expanded={expanded} aria-controls={detailId} aria-label={`${expanded ? "Hide" : "Show"} details for ${label}`} onClick={onToggle} className="absolute inset-0 z-20 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"><span className="sr-only">{expanded ? "Hide details" : "Show details"}</span></button>
    <div id={detailId} data-tile-detail-panel aria-hidden={!expanded} className={`pointer-events-none absolute inset-0 z-10 flex items-end bg-[linear-gradient(180deg,rgba(7,16,20,0.22)_0%,rgba(7,16,20,0.97)_62%)] p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-5 ${expanded ? "opacity-100" : ""}`}><p className="text-[11px] leading-4 text-white/85 sm:text-xs sm:leading-5">{detail}</p></div>
  </article>;
}

export default function Product() {
  const [expandedEventScaleTile, setExpandedEventScaleTile] = useState<string | null>(null);
  const toggleEventScaleTile = (id: string) => setExpandedEventScaleTile((current) => current === id ? null : id);
  return (
    <div className="smart-referee-page min-h-screen bg-black text-white" data-mobile-reveal-policy={mobileSmartRefereeRevealPolicy}>
      <SiteHeader active="referee" />
      <main data-reveal-page className="pt-16">
        <section id="organiser-promise" data-testid="smart-referee-hero" data-background-treatment={smartRefereeHeroBackgroundPresentation.treatment} className="relative isolate overflow-hidden border-b border-white/10 bg-[#071117]">
          <img src={homepageHeroVideoPosterSrc} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 -z-30 h-full w-full object-cover object-center" />
          <video src={homepageHeroVideoSrc} poster={homepageHeroVideoPosterSrc} aria-hidden="true" autoPlay={smartRefereeHeroBackgroundPresentation.autoPlay} muted={smartRefereeHeroBackgroundPresentation.muted} loop={smartRefereeHeroBackgroundPresentation.loop} playsInline preload="metadata" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(7,17,23,0.97)_0%,rgba(7,17,23,0.88)_48%,rgba(7,17,23,0.66)_100%)]" />
          <div className="container relative z-10 py-16 md:py-20 lg:py-24">
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Smart Referee for event organisers</p>
              <h1 data-testid="smart-referee-hero-decision-heading" className="velocity-headline max-w-3xl text-[clamp(2.7rem,7vw,6.6rem)] leading-[0.92] text-white"><span>Fair calls. A</span><span data-smart-referee-zh-line-break className="text-accent"> protected schedule.</span></h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 md:text-lg">When a scoring moment is hard to see, Smart Referee gives officials a shared reviewable view—so your competition can move on with confidence.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a data-testid="smart-referee-hero-service-action" href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Plan your event <ArrowRight size={18} /></a>
                <a href="#system-video" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent">Watch a decision replay <ArrowRight size={18} /></a>
              </div>
            </div>
          </div>
        </section>

        <section id="organiser-outcomes" data-testid="organiser-outcomes" className="border-b border-white/10 bg-[#0B1419] py-5 md:py-7">
          <div className="container">
            <div data-testid="organiser-outcomes-introduction" data-reveal className="reveal-up max-w-4xl py-8 md:py-10">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <h2 className="velocity-headline max-w-3xl text-[clamp(2.5rem,5vw,5.25rem)] leading-[0.96] text-white">{organiserOutcomesIntroduction.heading}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">{organiserOutcomesIntroduction.description}</p>
            </div>
            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
              {organiserOutcomeCards.map((outcome, index) => (
                <article data-reveal key={outcome.id} className="reveal-up bg-[#0B1419] p-5 md:p-6" style={{ transitionDelay: `${index * 70}ms` }}>
                  <p className="font-mono text-sm font-semibold text-accent">{outcome.number}</p>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">{outcome.title}</h2>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{outcome.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="system-video" data-testid="smart-referee-system-video" className="border-b border-white/10 bg-[#071117] py-12 md:py-16">
          <div className="container">
            <div data-reveal className="reveal-up mb-7 grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div><p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Decision replay</p><h2 className="velocity-headline max-w-2xl text-white">See the call, not just the <span className="text-accent">replay.</span></h2></div>
              <p className="max-w-md text-sm leading-6 text-white/65">A single calibrated view helps officials review the relevant moment together, then return their attention to the event.</p>
            </div>
            <div data-reveal data-presentation={smartRefereeHeroVideoPresentation.containerTreatment} className="reveal-up relative -mx-4 overflow-hidden bg-[#071117] sm:-mx-6 lg:-mx-8" style={{ transitionDelay: "90ms" }}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(64,224,208,0.08),transparent_58%)]" />
              <video src={smartRefereeMedia.trackingVideo} poster={smartRefereeMedia.trackingPoster} autoPlay={smartRefereeHeroVideoPresentation.autoPlay} muted={smartRefereeHeroVideoPresentation.muted} loop={smartRefereeHeroVideoPresentation.loop} controls={smartRefereeHeroVideoPresentation.controls} playsInline preload="metadata" className="relative z-10 mx-auto aspect-video h-full w-full max-w-7xl bg-transparent object-contain">Your browser does not support embedded video.</video>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-gradient-to-t from-[#071117] to-transparent" />
            </div>
          </div>
        </section>

        <section id="event-workflow" data-testid="event-workflow" className="velocity-section border-b border-white/10 bg-[#27282B]">
          <div className="container grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal className="reveal-up overflow-hidden rounded-lg border border-white/10 bg-black/20">
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[4/3]">
                <img src={smartRefereeMedia.humanReferee} alt="Scoring officials viewing a drone-sports goal through the arena net" className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#161719]/90 via-[#161719]/10 to-transparent" />
                <p className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">One difficult moment. One shared view.</p>
              </div>
            </div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">A simple event workflow</p>
              <h2 className="velocity-headline max-w-2xl text-white">From question to <span className="text-accent">shared call.</span></h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70">Officials remain central to the game. Smart Referee is there to make a difficult scoring moment easier to review without replacing human authority.</p>
              <ol className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {eventWorkflowSteps.map((step) => (
                  <li key={step.number} className="grid gap-3 py-4 sm:grid-cols-[3.25rem_1fr] sm:gap-5">
                    <span className="font-mono text-sm font-semibold text-accent">{step.number}</span>
                    <div><h3 className="font-semibold text-white">{step.title}</h3><p className="mt-1.5 text-sm leading-6 text-white/60">{step.detail}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="organiser-impact-detail" data-testid="organiser-impact-detail" className="border-b border-white/10 bg-black py-10 md:py-12">
          <div className="container max-w-4xl">
            <div data-reveal className="reveal-up rounded-lg border border-accent/25 bg-accent/5 p-5 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Organiser impact</p>
              <h2 className="velocity-headline mt-3 max-w-2xl text-white">{organiserImpactDetail.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{organiserImpactDetail.description}</p>
              <div className="mt-7 grid gap-px overflow-hidden border border-accent/20 bg-accent/20 sm:grid-cols-3">
                {organiserImpactDetail.metrics.map((metric, index) => (
                  <div key={metric.label} data-reveal className="reveal-up bg-[#0B1419] p-5" style={{ transitionDelay: `${index * 70}ms` }}><RollingImpactMetric metric={metric} /><p className="mt-3 text-xs leading-5 text-white/65">{metric.label}</p></div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-5 text-white/50">{organiserImpactDetail.qualification}</p>
            </div>
          </div>
        </section>

        <section id="technical-confidence" data-testid="technical-confidence" className="velocity-section border-b border-white/10 bg-[#171C1D]">
          <div className="container">
            <div data-reveal className="reveal-up mx-auto max-w-3xl text-center">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Built for event scale</p>
              <h2 className="velocity-headline mx-auto max-w-2xl text-white">{technicalConfidence.title}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70">{technicalConfidence.description}</p>
            </div>
            <div data-testid="event-scale-evidence-panels" data-presentation={eventScaleEvidencePanelPresentation} data-mobile-columns={eventScaleFeatureTilePresentation.mobileColumns} data-desktop-columns={eventScaleFeatureTilePresentation.desktopColumns} data-tile-aspect-ratio={eventScaleFeatureTilePresentation.tileAspectRatio} data-visibility={eventScaleFeatureTilePresentation.visibility} className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:gap-5">
              <EventScaleTile id="01" label="Decision data" detail={technicalConfidence.description} expanded={expandedEventScaleTile === "01"} onToggle={() => toggleEventScaleTile("01")} className="bg-[radial-gradient(circle_at_70%_20%,rgba(64,224,208,0.18),transparent_0_34%),#0B1419]"><div className="p-4 sm:p-5"><p className="text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs">01 · DECISION DATA</p><div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">{proofPoints.map((point) => <div key={point.value} className="border-l border-white/15 pl-2 sm:pl-3"><p className="text-lg font-semibold tracking-[-0.05em] text-white sm:text-2xl">{point.value}</p><p className="mt-1 text-[9px] leading-3 text-white/55 sm:text-[10px] sm:leading-4">{point.label}</p></div>)}</div></div></EventScaleTile>
              <EventScaleTile id="02" label={technicalConfidence.markerTitle} detail={technicalConfidence.markerDescription} expanded={expandedEventScaleTile === "02"} onToggle={() => toggleEventScaleTile("02")} className="bg-[#0B1419]"><img src={smartRefereeMedia.stickers} alt="Circular passive marker stickers for competition drones" className="absolute inset-0 h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-t from-[#071014] via-[#071014]/70 to-transparent" /><div className="relative flex h-full flex-col p-4 sm:p-5"><p className="text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs">02 · TRACKING SETUP</p><h3 className="mt-auto text-lg font-semibold tracking-tight text-white sm:text-2xl">{technicalConfidence.markerTitle}</h3><p className="mt-2 hidden text-[10px] leading-4 text-white/70 sm:block">{technicalConfidence.markerDescription}</p></div></EventScaleTile>
              <div data-testid="technical-evidence-panels" className="contents">
                <EventScaleTile id="03" technicalEvidence label={technicalConfidence.continuousCalibrationTitle} detail={technicalConfidence.continuousCalibrationDescription} expanded={expandedEventScaleTile === "03"} onToggle={() => toggleEventScaleTile("03")} className="bg-black"><video data-testid="continuous-calibration-video" src={smartRefereeMedia.continuousCalibrationVideo} autoPlay={continuousCalibrationVideoPresentation.autoPlay} muted={continuousCalibrationVideoPresentation.muted} loop={continuousCalibrationVideoPresentation.loop} controls={continuousCalibrationVideoPresentation.controls} playsInline={continuousCalibrationVideoPresentation.playsInline} preload={continuousCalibrationVideoPresentation.preload} className="absolute inset-0 h-full w-full object-cover opacity-45">Your browser does not support embedded video.</video><div className="absolute inset-0 bg-gradient-to-t from-[#071014] via-[#071014]/60 to-transparent" /><div className="relative flex h-full flex-col p-4 sm:p-5"><p className="text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs">03 · CONTINUOUS CALIBRATION</p><h3 className="mt-auto text-lg font-semibold tracking-tight text-white sm:text-2xl">{technicalConfidence.continuousCalibrationTitle}</h3><p className="mt-2 hidden text-[10px] leading-4 text-white/70 sm:block">{technicalConfidence.continuousCalibrationDescription}</p></div></EventScaleTile>
                <EventScaleTile id="04" technicalEvidence label={technicalConfidence.rulesTitle} detail={`${technicalConfidence.rulesDescription} ${technicalConfidence.referenceCaption}`} expanded={expandedEventScaleTile === "04"} onToggle={() => toggleEventScaleTile("04")} className="bg-[#0B1419]"><div className="p-4 sm:p-5"><p className="text-[10px] font-semibold tracking-[0.2em] text-accent sm:text-xs">04 · CONFIGURABLE RULES</p><h3 className="mt-2 text-sm font-semibold tracking-tight text-white sm:text-lg">{technicalConfidence.rulesTitle}</h3><div data-rule-reference-logos className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">{smartRefereeMedia.ruleSupportLogos.map((logo) => <img key={logo.id} src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="h-7 min-w-0 flex-1 object-contain sm:h-9" />)}</div></div></EventScaleTile>
              </div>
            </div>
          </div>
        </section>

        <section id="drone-sports-referee-pitch" data-testid="drone-sports-referee-pitch" data-pitch-video-panel className="velocity-section border-b border-white/10 bg-[#0B1419]">
          <div data-reveal className="container reveal-up">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6 md:p-8"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Drone Sports Referee</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-4xl">{technicalConfidence.pitchVideoTitle}</h2></div><p className="max-w-md text-sm leading-6 text-white/65">{technicalConfidence.pitchVideoDescription}</p></div><video data-testid="flex13-system-video" src={smartRefereeMedia.precisionVideo} poster={smartRefereeMedia.precisionPoster} aria-label="Drone Sports Referee Pitch video" autoPlay={flex13SystemVideoPresentation.autoPlay} muted={flex13SystemVideoPresentation.muted} loop={flex13SystemVideoPresentation.loop} controls={flex13SystemVideoPresentation.controls} controlsList={flex13SystemVideoPresentation.controlsList} disablePictureInPicture={flex13SystemVideoPresentation.disablePictureInPicture} playsInline={flex13SystemVideoPresentation.playsInline} preload={flex13SystemVideoPresentation.preload} onContextMenu={(event) => event.preventDefault()} className="aspect-video w-full rounded-xl bg-black object-contain">Your browser does not support embedded video.</video></div>
          </div>
        </section>

        <RefereePricingConfigurator />

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-10 text-[var(--paper)] md:py-12">
          <div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl"><div className="mb-4 h-1 w-12 bg-accent" /><h2 className="velocity-headline mb-3 text-[var(--paper)]">Plan your next competition with confidence.</h2><p className="text-lg leading-8 text-[var(--mist)]">Share your venue, match format, and schedule. We will propose the decision-support scope, event staffing, and delivery path that fit your programme.</p></div>
            <a href="#pricing" className="inline-flex shrink-0 items-center gap-2 border border-white/40 px-6 py-3 font-semibold text-[var(--paper)] transition-colors hover:border-accent hover:bg-accent hover:text-black">Plan your event <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
