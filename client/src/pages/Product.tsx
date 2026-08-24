import { ArrowRight, CircleCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
export const smartRefereePageHierarchy = [
  "organiser-promise",
  "organiser-outcomes",
  "system-replay",
  "event-workflow",
  "organiser-impact-detail",
  "technical-confidence",
  "event-delivery-options",
] as const;

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
  durationMilliseconds: 900,
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
  precision: "/manus-storage/flex13camerasys_aa73a4e5.jpg",
  trackingVideo: "/manus-storage/vli-tracking-test-video_f82aa6d7.mp4",
  trackingPoster: "/manus-storage/vli-tracking-test-first-frame_2dca2577.jpg",
} as const;

export const technicalConfidence = {
  title: "Technical confidence, when your team needs it.",
  description: "The Smart Referee system is designed to turn high-speed position data into a shared reference that can be prepared consistently for an event.",
  markerTitle: "Repeatable team preparation",
  markerDescription: "Low-cost passive marker stickers help organisers standardise tracked-drone preparation across teams without adding powered marker hardware to the event inventory.",
  referenceCaption: "Supplied rule and federation references are shown for event-context discussion only; their display does not indicate endorsement.",
} as const;

export default function Product() {
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
          <div className="container grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
            {organiserOutcomeCards.map((outcome, index) => (
              <article data-reveal key={outcome.id} className="reveal-up bg-[#0B1419] p-5 md:p-6" style={{ transitionDelay: `${index * 70}ms` }}>
                <p className="font-mono text-sm font-semibold text-accent">{outcome.number}</p>
                <h2 className="mt-5 text-xl font-semibold tracking-tight text-white">{outcome.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{outcome.detail}</p>
              </article>
            ))}
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
          <div className="container grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Built for event scale</p>
              <h2 className="velocity-headline max-w-xl text-white">{technicalConfidence.title}</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">{technicalConfidence.description}</p>
            </div>
            <div data-reveal className="reveal-up overflow-hidden rounded-lg border border-white/10 bg-black/20 p-5" style={{ transitionDelay: "90ms" }}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {proofPoints.map((point) => <div key={point.value} className="border-l border-accent/40 pl-4"><p className="text-xl font-semibold text-white">{point.value}</p><p className="mt-1 text-xs leading-5 text-white/60">{point.label}</p></div>)}
                </div>
                <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[0.72fr_1.28fr]">
                  <img src={smartRefereeMedia.stickers} alt="Circular passive marker stickers for competition drones" className="aspect-[21/9] h-full w-full rounded-md object-cover sm:aspect-[4/3]" />
                  <div><h3 className="font-semibold text-white">{technicalConfidence.markerTitle}</h3><p className="mt-2 text-sm leading-6 text-white/65">{technicalConfidence.markerDescription}</p></div>
                </div>
                <div className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-[0.72fr_1.28fr]">
                  <div className="flex items-center justify-center gap-3 rounded-md bg-white p-4 sm:gap-5">
                    {smartRefereeMedia.ruleSupportLogos.map((logo) => <img key={logo.id} src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="h-14 min-w-0 max-w-[29%] flex-1 object-contain sm:h-16" />)}
                  </div>
                  <p className="text-xs leading-6 text-white/50">{technicalConfidence.referenceCaption}</p>
                </div>
                <img src={smartRefereeMedia.precision} alt="OptiTrack Flex 13 camera positioned at a drone-sports arena" loading="lazy" className="mt-6 aspect-[21/9] w-full rounded-md object-cover sm:aspect-[16/7]" />
            </div>
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
