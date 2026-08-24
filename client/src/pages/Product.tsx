import { ArrowRight, CircleCheck, Clock3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import RefereePricingConfigurator from "@/components/RefereePricingConfigurator";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";

export const proofPoints = [
  { value: "OptiTrack", label: "industry leading motion capture technology" },
  { value: "Unity", label: "event operations interface" },
  { value: "±0.20 mm", label: "3D accuracy" },
  { value: "10 ms", label: "decision making end to end" },
];

export const mobileSmartRefereeRevealPolicy = "always-visible";
export const mobileSmartRefereeCardAspectRatio = "21:9";
export const technicalSpecificationPresentation = "proof-points-only";
export const smartRefereeHeroVideoPresentation = {
  aspectRatio: "16:9",
  objectFit: "contain",
  controls: false,
  autoPlay: true,
  muted: true,
  loop: true,
  containerTreatment: "borderless-integrated",
} as const;
export const smartRefereePageHierarchy = ["b2b-introduction", "system-video", "organiser-impact-metrics", "human-led-officiating", "evidence-based-decision-support", "dispute-reduction", "passive-markers", "proof-points", "precision", "event-delivery-options"] as const;
export const smartRefereeOpeningQuote = {
  text: "You may delay, but time will not.",
  attribution: "Benjamin Franklin",
} as const;
export const smartRefereeOpeningQuotePresentation = "centered-single-line";
export const smartRefereeOpeningQuoteFitPolicy = {
  wrap: "never",
  fontSize: "clamp(0.95rem,2.35vw,2.05rem)",
  tracking: "tight",
} as const;
export const smartRefereeChineseHeadingFitPolicy = {
  targets: ["hero-decision", "human-sightline"],
  fontSize: "clamp(0.9rem,5.2vw,2rem)",
  wrap: "never",
  fallbackWrap: "pretty-anywhere",
} as const;
export const organiserPainPanelPresentation = "narrow-separated";
export const organiserPainPanels = [
  { value: "4+ minutes", label: "per review delay", detail: "An illustrative scoring review can consume the schedule buffer intended to protect the run sheet." },
  { value: "01 slot", label: "Next start held", detail: "One unresolved call can keep the next match from starting while an answer is sought." },
  { value: "04 roles", label: "Delivery focus diverted", detail: "Officials, team representatives, venue operations, and production coordination can be pulled into the same moment." },
] as const;
export const organiserAdoptionPanels = [
  { number: "01", title: "Venue-ready scope", detail: "Define cage count, technical prerequisites, and the delivery boundaries before match day." },
  { number: "02", title: "Rule-to-evidence workflow", detail: "Align tracked position, scoring conditions, and the review path around your competition rules." },
  { number: "03", title: "Event-day delivery plan", detail: "Set the support, officials, escalation, and fallback responsibilities inside one proposed operating model." },
] as const;
export const sharedExperienceSections = [
  {
    id: "human-led-officiating",
    testId: "human-led-officiating-section",
    linkLabel: "Human sightline",
    eyebrow: "A shared experience",
    title: "A clear sightline is the starting point for a shared call.",
    summary: "Officials remain central to the game. A fast scoring moment can still be difficult to resolve when the goal area is obscured and the next match moment is already unfolding.",
  },
  {
    id: "evidence-based-decision-support",
    testId: "evidence-based-decision-support-section",
    linkLabel: "Shared evidence",
    eyebrow: "Decision support",
    title: "Turn the rule into a shared, reviewable reference.",
    summary: "Smart Referee links calibrated position data to the rule condition so officials, team representatives, and event operations can work from the same decision context.",
  },
] as const;
export const disputeTimerPolicy = {
  initialSeconds: 13 * 60 + 4,
  activeScrollMillisecondsPerSecond: 10_000,
};

export const illustrativeDisputeCostScenario = {
  currency: "HK$",
  label: "Illustrative active event-time cost",
  qualification: "Scenario only — not a quoted rate, measured loss, or guaranteed saving.",
  assumptions: [
    { role: "Officials and jury", people: 2, hourlyRate: 250 },
    { role: "Event and venue operations", people: 2, hourlyRate: 300 },
    { role: "Active match-slot coordination", people: 1, hourlyRate: 1_200 },
  ],
} as const;

export const illustrativeDisputeCostCopy = "This transparent scenario assumes two officials or jury members at HK$250/hour, two event or venue operations staff at HK$300/hour, and one active match-slot coordination cost at HK$1,200/hour.";

type OrganiserImpactMetric = {
  value: number;
  label: string;
  suffix: string;
  formatter: "plain" | "hkd-compact";
  rolling: boolean;
  prefix?: string;
  zhPrefix?: string;
  zhSuffix?: string;
};

export const organiserImpactMetrics: readonly OrganiserImpactMetric[] = [
  { value: 40, label: "Wasted time on dispute per event", prefix: "over ", zhPrefix: "超過 ", suffix: "+ minutes", zhSuffix: "+ 分鐘", formatter: "plain", rolling: true },
  { value: 27_000, label: "Extra cost related to all parties", suffix: "", formatter: "hkd-compact", rolling: true },
  { value: 4, label: "Staff needed per officiating venue", suffix: "+", formatter: "plain", rolling: false },
] as const;
export const organiserImpactMetricPresentation = "proof-point-band";
export const rollingMetricPolicy = {
  trigger: "when-visible",
  durationMilliseconds: 900,
  respectsReducedMotion: true,
} as const;

export const formatOrganiserImpactMetric = (metric: OrganiserImpactMetric, value: number, language: "en" | "zh-Hant") => {
  if (metric.formatter === "hkd-compact") return `HK$${Math.round(value / 1_000)}k`;
  const prefix = language === "zh-Hant" ? (metric.zhPrefix ?? metric.prefix ?? "") : (metric.prefix ?? "");
  const suffix = language === "zh-Hant" ? (metric.zhSuffix ?? metric.suffix) : metric.suffix;
  return `${prefix}${value}${suffix}`;
};

export const getDisputeTimeIncrements = (activeScrollMilliseconds: number) =>
  Math.floor(activeScrollMilliseconds / disputeTimerPolicy.activeScrollMillisecondsPerSecond);

export const getIllustrativeDisputeCost = (disputeSeconds: number) => {
  const hourlyOperatingCost = illustrativeDisputeCostScenario.assumptions.reduce(
    (total, assumption) => total + assumption.people * assumption.hourlyRate,
    0,
  );
  return Math.round((hourlyOperatingCost * disputeSeconds) / 3600 / 10) * 10;
};

export const formatDisputeTimer = (seconds: number) =>
  `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

function RollingMetric({
  value,
  formatter = (nextValue, language) => nextValue.toLocaleString(language === "zh-Hant" ? "zh-HK" : "en-HK"),
  ariaLabel,
  className,
}: {
  value: number;
  formatter?: (value: number, language: "en" | "zh-Hant") => string;
  ariaLabel: string;
  className: string;
}) {
  const { language } = useWebsiteLanguage();
  const metricRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasEnteredView = useRef(false);

  useEffect(() => {
    const metric = metricRef.current;
    if (!metric) return;

    let animationFrame = 0;
    const animateToValue = (instant = false) => {
      if (instant || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplayValue(value);
        return;
      }

      const startedAt = window.performance.now();
      const tick = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / rollingMetricPolicy.durationMilliseconds, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) animationFrame = window.requestAnimationFrame(tick);
      };
      animationFrame = window.requestAnimationFrame(tick);
    };

    if (hasEnteredView.current) {
      animateToValue();
      return () => window.cancelAnimationFrame(animationFrame);
    }

    if (!("IntersectionObserver" in window)) {
      animateToValue();
      return () => window.cancelAnimationFrame(animationFrame);
    }

    const observer = new window.IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasEnteredView.current) return;
      hasEnteredView.current = true;
      setDisplayValue(0);
      animateToValue();
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(metric);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return <span ref={metricRef} data-live-metric aria-label={ariaLabel} className={className}>{formatter(displayValue, language)}</span>;
}

export const smartRefereeMedia = {
  humanReferee: "/manus-storage/referee-angle_083e0bbc.webp",
  rulebook: "/manus-storage/FAI-rulebook_f63443a8.jpg",
  dispute: "/manus-storage/dispute_6f42a381.webp",
  stickers: "/manus-storage/cheapstickers_6b71bf1e.jpg",
  precision: "/manus-storage/flex13camerasys_aa73a4e5.jpg",
  trackingVideo: "/manus-storage/vli-tracking-test-video_f82aa6d7.mp4",
  trackingPoster: "/manus-storage/vli-tracking-test-first-frame_2dca2577.jpg",
} as const;

export const smartRefereeFeaturePanels = {
  passiveMarkers: {
    eyebrow: "Standardised competition markers",
    title: "Standardise setup without adding hardware cost.",
    description: "Low-cost passive marker stickers help organisers standardise tracked-drone preparation across teams, without adding powered marker hardware to the event inventory.",
    image: smartRefereeMedia.stickers,
    imageAlt: "Circular passive marker stickers for competition drones",
    benefits: [
      "Fast, repeatable pre-event setup",
      "Low-cost consumables for recurring events",
      "No powered marker kit to deploy or maintain",
    ],
  },
  precision: {
    eyebrow: "Industry-Leading Precision",
    title: "Decision-grade spatial evidence at event scale.",
    description: "High-fidelity 3D tracking provides a consistent spatial reference for scoring review, operational reporting, and repeatable system setup across competition days.",
    image: smartRefereeMedia.precision,
    imageAlt: "OptiTrack Flex 13 camera positioned at a drone-sports arena",
  },
} as const;

export default function Product() {
  const [disputeSeconds, setDisputeSeconds] = useState(disputeTimerPolicy.initialSeconds);
  const activeScrollMilliseconds = useRef(0);
  const scrollingRef = useRef(false);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    let idleTimer: number | undefined;
    let animationFrame: number;

    const markScrollActive = () => {
      scrollingRef.current = true;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        scrollingRef.current = false;
      }, 550);
    };

    const tick = (timestamp: number) => {
      if (lastFrameRef.current && scrollingRef.current) {
        activeScrollMilliseconds.current += timestamp - lastFrameRef.current;
        const increments = getDisputeTimeIncrements(activeScrollMilliseconds.current);
        if (increments > 0) {
          activeScrollMilliseconds.current -= increments * disputeTimerPolicy.activeScrollMillisecondsPerSecond;
          setDisputeSeconds((seconds) => seconds + increments);
        }
      }
      lastFrameRef.current = timestamp;
      animationFrame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", markScrollActive, { passive: true });
    animationFrame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", markScrollActive);
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const disputeTimerLabel = formatDisputeTimer(disputeSeconds);
  const illustrativeDisputeCost = getIllustrativeDisputeCost(disputeSeconds);

  return (
    <div className="smart-referee-page min-h-screen bg-black text-white" data-mobile-reveal-policy={mobileSmartRefereeRevealPolicy}>
      <SiteHeader active="referee" />
      <main data-reveal-page className="pt-16">
        <section data-testid="smart-referee-hero" className="border-b border-white/10 bg-[#111416]">
          <div className="container grid items-center gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
            <div data-reveal className="reveal-up relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="mb-4 h-1 w-12 bg-accent" />
              <blockquote data-quote-fit={smartRefereeOpeningQuoteFitPolicy.wrap} className="max-w-full whitespace-nowrap text-[clamp(0.95rem,2.35vw,2.05rem)] font-semibold leading-none tracking-[-0.045em] text-white">“{smartRefereeOpeningQuote.text}”</blockquote>
              <cite className="mt-4 block text-xs not-italic font-semibold uppercase tracking-[0.18em] text-accent">— {smartRefereeOpeningQuote.attribution}</cite>
              <h1 data-testid="smart-referee-hero-decision-heading" data-chinese-heading-fit={smartRefereeChineseHeadingFitPolicy.targets[0]} className="velocity-headline smart-referee-heading-fit mb-4 mt-8 text-white">Turn the rule into a <span className="text-accent">reviewable decision.</span></h1>
              <p className="leading-7 text-white/75">Smart Referee combines calibrated tracking, rules-aware review, and event delivery support to help organisers protect the run sheet and give every stakeholder a clearer account of the call.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a data-testid="smart-referee-hero-service-action" href="#pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Request event proposal <ArrowRight size={18} /></a>
                <a href="#system-video" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent">See the system in action <ArrowRight size={18} /></a>
              </div>
            </div>
            <div data-reveal className="reveal-up grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3" data-presentation={organiserPainPanelPresentation} style={{ transitionDelay: "90ms" }}>
              {organiserPainPanels.map((panel) => (
                <div key={panel.label} className="bg-[#0B1419]/95 p-4 sm:min-h-44 sm:p-5">
                  <p className="font-mono text-3xl font-semibold leading-none tracking-tight text-accent sm:text-4xl">{panel.value}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">{panel.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/65">{panel.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="system-video" data-testid="smart-referee-system-video" className="border-b border-white/10 bg-[#071117] py-12 md:py-16">
          <div className="container">
            <div data-reveal className="reveal-up mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">See the system in action</p><h2 className="velocity-headline text-white">A full view of the <span className="text-accent">decision layer.</span></h2></div>
              <p className="max-w-sm text-sm leading-6 text-white/65">The same calibrated evidence layer that supports officials can be planned into your event delivery model.</p>
            </div>
            <div data-reveal data-presentation={smartRefereeHeroVideoPresentation.containerTreatment} className="reveal-up relative -mx-4 mt-7 overflow-hidden bg-[#071117] sm:-mx-6 lg:-mx-8" style={{ transitionDelay: "90ms" }}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(64,224,208,0.08),transparent_58%)]" />
              <video src={smartRefereeMedia.trackingVideo} poster={smartRefereeMedia.trackingPoster} autoPlay={smartRefereeHeroVideoPresentation.autoPlay} muted={smartRefereeHeroVideoPresentation.muted} loop={smartRefereeHeroVideoPresentation.loop} controls={smartRefereeHeroVideoPresentation.controls} playsInline preload="metadata" className="relative z-10 mx-auto aspect-video h-full w-full max-w-7xl bg-transparent object-contain">Your browser does not support embedded video.</video>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-gradient-to-t from-[#071117] to-transparent" />
            </div>
          </div>
        </section>

        <section data-testid="organiser-impact-metrics" data-presentation={organiserImpactMetricPresentation} className="border-y border-white/10 bg-[var(--ink-soft)] py-6 text-[var(--paper)] md:py-8">
          <div className="container">
            <h2 className="sr-only">Illustrative organiser impact metrics</h2>
            <div className="grid gap-5 text-center sm:grid-cols-3">
              {organiserImpactMetrics.map((metric, index) => (
                <div data-reveal key={metric.label} className="reveal-up" style={{ transitionDelay: `${index * 70}ms` }}>
                  {metric.rolling ? (
                    <RollingMetric value={metric.value} formatter={(value, language) => formatOrganiserImpactMetric(metric, value, language)} ariaLabel={`${formatOrganiserImpactMetric(metric, metric.value, "en")} ${metric.label}`} className="text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl" />
                  ) : (
                    <div className="text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">{metric.value}{metric.suffix}</div>
                  )}
                  <p className="mt-2 text-sm text-[var(--mist)]">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[10px] leading-5 text-[var(--mist)]">Planning values supplied for event discussion; validate against your own staffing, venue, and programme data.</p>
          </div>
        </section>

        <nav data-testid="smart-referee-section-jump-links" aria-label="Smart Referee decision-support sections" className="border-b border-white/10 bg-black py-4">
          <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">Decision-support overview</p>
            <div className="flex flex-wrap gap-2">
              {sharedExperienceSections.map((section, index) => (
                <a key={section.id} href={`#${section.id}`} className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-accent hover:text-accent">
                  <span className="font-mono text-[10px] text-accent">0{index + 1}</span>{section.linkLabel}<span aria-hidden="true">↓</span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div data-testid="officiating-comparison">
          <section id={sharedExperienceSections[0].id} data-testid={sharedExperienceSections[0].testId} aria-labelledby={`${sharedExperienceSections[0].id}-heading`} className="velocity-section scroll-mt-16 border-b border-white/10 bg-[#27282B]">
            <div className="container grid items-center gap-7 lg:grid-cols-[0.92fr_1.08fr]">
              <div data-reveal className="reveal-up">
                <div className="mb-5 h-1 w-12 bg-accent" />
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{sharedExperienceSections[0].eyebrow}</p>
                <h2 id={`${sharedExperienceSections[0].id}-heading`} data-testid="human-sightline-heading" data-chinese-heading-fit={smartRefereeChineseHeadingFitPolicy.targets[1]} className="velocity-headline smart-referee-heading-fit text-white">{sharedExperienceSections[0].title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{sharedExperienceSections[0].summary}</p>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/65">No official should be expected to establish absolute positional certainty from one partially obscured view. When a drone ball is pressed around the goal ring, it can be difficult to confirm whether the full ball crossed in the required direction before the next match moment unfolds.</p>
              </div>
              <article data-testid="traditional-officiating-panel" data-reveal className="reveal-up overflow-hidden rounded-lg border border-white/10 bg-black/25 p-4 sm:p-5" style={{ transitionDelay: "90ms" }}>
                <div className="mb-4 flex items-center justify-between gap-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Human-led judgement</p>
                  <span className="shrink-0 font-mono text-sm text-white/30">01</span>
                </div>
                <div data-testid="traditional-officiating-flow" className="relative overflow-hidden rounded-md border border-white/10 bg-[#161719]">
                  <img src={smartRefereeMedia.humanReferee} alt="Scoring officials viewing a drone-sports goal through the arena net" className="aspect-[21/9] w-full object-cover sm:aspect-[16/9]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#161719] via-[#161719]/20 to-transparent" />
                  <p className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">One angle, real-time pressure</p>
                </div>
              </article>
            </div>
          </section>

          <section id={sharedExperienceSections[1].id} data-testid={sharedExperienceSections[1].testId} aria-labelledby={`${sharedExperienceSections[1].id}-heading`} className="velocity-section scroll-mt-16 bg-[var(--ink-soft)]">
            <div className="container grid items-center gap-7 lg:grid-cols-[1.08fr_0.92fr]">
              <article data-testid="smart-referee-support-panel" data-reveal className="reveal-up overflow-hidden rounded-lg border border-accent/25 bg-accent/10 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Smart Referee decision support</p>
                  <span className="shrink-0 font-mono text-sm text-accent/65">02</span>
                </div>
                <div data-testid="smart-referee-support-flow" className="overflow-hidden rounded-md border border-accent/25 bg-[#171C1D] shadow-[inset_0_0_50px_rgba(64,224,208,0.06)]">
                  <img src={smartRefereeMedia.rulebook} alt="Drone-sport scoring rule excerpt specifying the entire drone ball must cross the opposing goal ring" className="aspect-[21/9] w-full object-cover object-left sm:aspect-[16/9]" />
                  <div className="grid gap-2 border-t border-accent/20 p-4 sm:grid-cols-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">01 · Tracked position</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">02 · Rule condition</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">03 · Reviewable call</span>
                  </div>
                </div>
              </article>
              <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
                <div className="mb-5 h-1 w-12 bg-accent" />
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{sharedExperienceSections[1].eyebrow}</p>
                <h2 id={`${sharedExperienceSections[1].id}-heading`} className="velocity-headline text-white">{sharedExperienceSections[1].title}</h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{sharedExperienceSections[1].summary}</p>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/75">Calibrated spatial data gives officials a reviewable record against rule-defined scoring conditions—supporting a faster, more consistent decision without removing human authority.</p>
                <p className="mt-6 max-w-xl text-sm leading-6 text-white/55">Smart Referee is designed to support—not replace—official judgement. It gives referees stronger shared context so the game can remain transparent, consistent, and fair.</p>
              </div>
            </div>
          </section>
        </div>

        <section data-testid="dispute-reduction-section" className="velocity-section bg-black">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.92fr_1.08fr]">
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up relative overflow-hidden rounded-lg border border-white/10 bg-[#171C1D] shadow-2xl">
              <img src={smartRefereeMedia.dispute} alt="Officials reviewing a drone-sports match from outside the competition cage" className="aspect-[21/9] w-full object-cover sm:aspect-[4/3]" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#111416]/90 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Keep the event moving</p>
            </div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Lowering disputes</p>
              <h2 className="velocity-headline mb-5 text-white">Protect the run sheet—and the cost of delivery.</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70">A reviewable evidence layer helps organisers resolve contested moments with greater confidence, so officials, team representatives, and operations staff can return to the next scheduled match instead of an extended debate.</p>
              <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-5 sm:p-7">
                <div className="flex items-center gap-2 text-accent"><Clock3 size={18} /><p className="text-[10px] font-semibold uppercase tracking-[0.15em]">Illustrative dispute-time scenario</p></div>
                <div className="mt-4 grid gap-5 sm:grid-cols-[1fr_0.9fr] sm:items-end">
                  <div>
                    <RollingMetric value={disputeSeconds} formatter={formatDisputeTimer} ariaLabel={`${disputeTimerLabel} on the dispute time counter`} className="block font-mono text-6xl font-semibold leading-none tracking-tight text-white sm:text-8xl" />
                    <p className="mt-3 text-xs leading-5 text-white/65">Elapsed review time consuming the margin between scheduled match starts.</p>
                  </div>
                  <div data-testid="illustrative-dispute-cost" className="border-l border-accent/35 pl-4 sm:pl-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">{illustrativeDisputeCostScenario.label}</p>
                    <RollingMetric value={illustrativeDisputeCost} formatter={(value, language) => `${illustrativeDisputeCostScenario.currency}${value.toLocaleString(language === "zh-Hant" ? "zh-HK" : "en-HK")}`} ariaLabel={`${illustrativeDisputeCostScenario.currency}${illustrativeDisputeCost.toLocaleString("en-HK")} illustrative active event-time cost`} className="mt-2 block font-mono text-4xl font-semibold leading-none tracking-tight text-white" />
                    <p className="mt-2 text-xs leading-5 text-white/70">{illustrativeDisputeCostScenario.qualification}</p>
                  </div>
                </div>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/70">{illustrativeDisputeCostCopy}</p>
              </div>
            </div>
          </div>
        </section>

        <section data-testid="passive-marker-panel" className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.85fr_1fr]">
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up overflow-hidden rounded-lg border border-accent/25 bg-[#171C1D] shadow-2xl">
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[4/3]">
                <img src={smartRefereeFeaturePanels.passiveMarkers.image} alt={smartRefereeFeaturePanels.passiveMarkers.imageAlt} className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#171C1D]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-accent/30 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Low-cost marker stickers</div>
              </div>
            </div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{smartRefereeFeaturePanels.passiveMarkers.eyebrow}</p>
              <h2 className="velocity-headline mb-5 text-white">{smartRefereeFeaturePanels.passiveMarkers.title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70">{smartRefereeFeaturePanels.passiveMarkers.description}</p>
              <div data-testid="passive-marker-benefit-card" data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="mt-5 aspect-[21/9] min-h-0 overflow-hidden rounded-md border border-white/10 bg-black/20 p-3 sm:aspect-auto sm:p-4">
                <div className="grid h-full gap-1.5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10">
                  {smartRefereeFeaturePanels.passiveMarkers.benefits.map((benefit, benefitIndex) => (
                    <div key={benefit} className={`flex min-w-0 items-start gap-2 py-1 ${benefitIndex < smartRefereeFeaturePanels.passiveMarkers.benefits.length - 1 ? "border-b border-white/10 sm:border-b-0" : ""} sm:px-3 sm:py-0 first:pl-0 last:pr-0`}>
                      <CircleCheck size={15} className="mt-0.5 shrink-0 text-accent sm:size-[18px]" />
                      <p className="line-clamp-2 text-[11px] leading-4 text-white/80 sm:line-clamp-none sm:text-sm sm:leading-6">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-testid="smart-referee-proof-points" className="border-y border-white/10 bg-[var(--ink-soft)] py-6 text-[var(--paper)] md:py-8">
          <div className="container grid gap-5 text-center sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((point, index) => (
              <div data-reveal key={point.value} className="reveal-up" style={{ transitionDelay: `${index * 70}ms` }}>
                <div className="text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">{point.value}</div>
                <p className="mt-2 text-sm text-[var(--mist)]">{point.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="industry-leading-precision" className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-7 lg:grid-cols-[1fr_0.85fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{smartRefereeFeaturePanels.precision.eyebrow}</p>
              <h2 className="velocity-headline mb-5 text-white">{smartRefereeFeaturePanels.precision.title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70">{smartRefereeFeaturePanels.precision.description}</p>
            </div>
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up overflow-hidden rounded-lg border border-white/10 bg-[#171C1D] shadow-2xl" style={{ transitionDelay: "90ms" }}>
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[4/3]">
                <img src={smartRefereeFeaturePanels.precision.image} alt={smartRefereeFeaturePanels.precision.imageAlt} className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(12,13,15,0.28)_100%)]" />
              </div>
            </div>
          </div>
        </section>

        <section data-testid="organiser-adoption-panels" className="velocity-section border-y border-white/10 bg-black">
          <div className="container">
            <div data-reveal className="reveal-up mb-9 grid gap-5 lg:grid-cols-[28%_1fr] lg:items-end">
              <p className="vli-section-label">Plan with confidence</p>
              <div><h2 className="velocity-headline mb-4 text-white">Make adoption as deliberate as the <span className="text-accent">decision.</span></h2><p className="max-w-2xl leading-7 text-white/70">A proposal should reduce delivery uncertainty before an organiser commits. Smart Referee scopes the physical setup, the decision workflow, and the event-day responsibilities around your competition.</p></div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {organiserAdoptionPanels.map((panel, index) => (
                <article key={panel.number} data-reveal className="reveal-up border border-white/10 bg-[#171C1D] p-6" style={{ transitionDelay: `${index * 80}ms` }}>
                  <p className="font-mono text-5xl font-semibold leading-none text-accent">{panel.number}</p>
                  <h3 className="mt-8 text-xl font-semibold text-white">{panel.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">{panel.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <RefereePricingConfigurator />

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-10 text-[var(--paper)] md:py-12">
          <div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 h-1 w-12 bg-accent" />
              <h2 className="velocity-headline mb-3 text-[var(--paper)]">Plan your next competition with confidence.</h2>
              <p className="text-lg leading-8 text-[var(--mist)]">Share your venue, match format, and schedule. We will propose the decision-support scope, event staffing, and delivery path that fit your programme.</p>
            </div>
            <a href="#pricing" className="inline-flex shrink-0 items-center gap-2 border border-white/40 px-6 py-3 font-semibold text-[var(--paper)] transition-colors hover:border-accent hover:bg-accent hover:text-black">Request event proposal <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
