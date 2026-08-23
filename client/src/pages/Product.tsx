import { ArrowRight, CalendarDays, CircleCheck, Clock3, Gauge, GraduationCap, UsersRound } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import RefereePricingConfigurator from "@/components/RefereePricingConfigurator";

export const proofPoints = [
  { value: "OptiTrack", label: "industry leading motion capture technology" },
  { value: "Unity", label: "decision interface" },
  { value: "±0.20 mm", label: "3D accuracy" },
  { value: "10 ms", label: "decision making end to end" },
];

export const mobileSmartRefereeRevealPolicy = "always-visible";
export const mobileSmartRefereeCardAspectRatio = "21:9";
export const technicalSpecificationPresentation = "proof-points-only";
export const disputeTimerPolicy = {
  initialSeconds: 13 * 60 + 4,
  activeScrollMillisecondsPerSecond: 10_000,
};

export const getDisputeTimeIncrements = (activeScrollMilliseconds: number) =>
  Math.floor(activeScrollMilliseconds / disputeTimerPolicy.activeScrollMillisecondsPerSecond);

export const smartRefereeMedia = {
  humanReferee: "/manus-storage/referee-angle_083e0bbc.webp",
  rulebook: "/manus-storage/FAI-rulebook_f63443a8.jpg",
  dispute: "/manus-storage/dispute_6f42a381.webp",
  stickers: "/manus-storage/cheapstickers_6b71bf1e.jpg",
  precision: "/manus-storage/flex13camerasys_aa73a4e5.jpg",
  trackingVideo: "/manus-storage/vli-tracking-test-video_f82aa6d7.mp4",
} as const;

export const smartRefereeFeaturePanels = {
  passiveMarkers: {
    eyebrow: "Passive competition markers",
    title: "Simple marker stickers. Practical deployment.",
    description: "Low-cost passive marker stickers give teams a fast, lightweight way to prepare competition drones for a tracked volume—without bulky active hardware or a powered marker module.",
    image: smartRefereeMedia.stickers,
    imageAlt: "Circular passive marker stickers for competition drones",
    benefits: [
      "Lightweight sticker layout for competition drones",
      "Low-cost preparation for repeat events",
      "Passive design without a powered marker module",
    ],
  },
  precision: {
    eyebrow: "Industry-Leading Precision",
    title: "Precision that holds up under pressure.",
    description: "Our 3D precision is the best in the business, outperforming even the highest-resolution competition.",
    image: smartRefereeMedia.precision,
    imageAlt: "OptiTrack Flex 13 camera positioned at a drone-sports arena",
  },
} as const;

const ecosystemAudiences = [
  {
    title: "Event organizers",
    eyebrow: "Match-day control",
    text: "Bring a clearer evidence layer to moments that shape tournament confidence.",
    image: "/manus-storage/vli-ecosystem-event-organizers_f82296b8.png",
    icon: CalendarDays,
  },
  {
    title: "Clubs",
    eyebrow: "Shared progress",
    text: "Create a consistent setting for practice, competition, and constructive review.",
    image: "/manus-storage/vli-ecosystem-clubs-replacement_e3af6edd.png",
    icon: UsersRound,
  },
  {
    title: "Educators",
    eyebrow: "Visible learning",
    text: "Turn match moments into practical material for technical and sporting growth.",
    image: "/manus-storage/vli-ecosystem-educators-replacement_3c55b4c5.png",
    icon: GraduationCap,
  },
];

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

  const disputeTimerLabel = `${Math.floor(disputeSeconds / 60).toString().padStart(2, "0")}:${(disputeSeconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="smart-referee-page min-h-screen bg-black text-white" data-mobile-reveal-policy={mobileSmartRefereeRevealPolicy}>
      <SiteHeader active="referee" />
      <main data-reveal-page className="pt-16">
        <section data-testid="smart-referee-hero" className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_78%_36%,rgba(64,224,208,0.18),transparent_0_26%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)]">
          <div className="container grid min-h-[calc(66svh-4rem)] items-center gap-7 py-8 lg:min-h-[calc(66vh-4rem)] lg:grid-cols-[0.92fr_1.08fr] lg:py-10">
            <div data-reveal className="reveal-up relative z-10 max-w-xl">
              <div className="mb-4 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Smart Referee</p>
              <h1 className="velocity-headline mb-4 text-white">Make every call <span className="text-accent">defensible.</span></h1>
              <p className="leading-7 text-white/75">
                An integrated referee layer for drone sports: OptiTrack motion capture, Unity-based match views, and configurable decision logic built around your competition format.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a data-testid="smart-referee-hero-service-action" href="#pricing" className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Explore service <ArrowRight size={18} /></a>
              </div>
            </div>

            <div data-reveal className="reveal-up relative" style={{ transitionDelay: "90ms" }}>
              <div className="absolute -inset-5 rounded-full bg-accent/15 blur-3xl" />
              <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white p-3 shadow-2xl md:p-5">
                <img src="/manus-storage/Competition-readydecisionlayerthumb_69fad072.jpeg" alt="Drone-soccer arena prepared for competition" className="w-full rounded-md object-cover" />
                <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-3 text-black/65">
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Competition-ready decision layer</span>
                  <Gauge size={19} className="text-accent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-6 text-[var(--paper)] md:py-8">
          <div className="container grid gap-5 text-center sm:grid-cols-2 lg:grid-cols-4">
            {proofPoints.map((point, index) => (
              <div data-reveal key={point.value} className="reveal-up" style={{ transitionDelay: `${index * 70}ms` }}>
                <div className="text-3xl font-bold tracking-tight text-[var(--paper)] md:text-4xl">{point.value}</div>
                <p className="mt-2 text-sm text-[var(--mist)]">{point.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="officiating-comparison" className="velocity-section bg-[#27282B]">
          <div className="container">
            <div data-reveal className="reveal-up mx-auto mb-8 max-w-3xl text-center">
              <div className="mx-auto mb-4 h-1 w-12 bg-accent" />
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">A shared experience</p>
              <h2 className="velocity-headline text-white">A decisive moment should feel shared—not subjective.</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
                Officials remain central to the game. Smart Referee gives them a shared evidence layer for timely, explainable decisions when fast drone play makes a scoring moment difficult to see or review.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article data-testid="traditional-officiating-panel" data-reveal className="reveal-up rounded-lg border border-white/10 bg-black/25 p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Human officiating</p>
                    <h3 className="velocity-subheading mt-3 text-white">Judgement matters. So do sightlines.</h3>
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-sm text-white/30">01</span>
                </div>

                <div data-testid="traditional-officiating-flow" className="relative overflow-hidden rounded-md border border-white/10 bg-[#161719]">
                  <img src={smartRefereeMedia.humanReferee} alt="Scoring officials viewing a drone-sports goal through the arena net" className="aspect-[21/9] w-full object-cover sm:aspect-[16/9]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#161719] via-[#161719]/20 to-transparent" />
                  <p className="absolute bottom-3 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">One angle, real-time pressure</p>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/65">No official should be expected to provide 100% positional certainty from a single, partially obscured view. When a drone ball is pressed around the goal ring, it can be difficult to establish whether the entire ball crossed in the required direction before play moves on.</p>
              </article>

              <article data-testid="smart-referee-support-panel" data-reveal className="reveal-up rounded-lg border border-accent/25 bg-accent/10 p-5 sm:p-6" style={{ transitionDelay: "90ms" }}>
                <div className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Smart Referee decision support</p>
                    <h3 className="velocity-subheading mt-3 text-white">One shared reference for the final call.</h3>
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-sm text-accent/65">02</span>
                </div>

                <div data-testid="smart-referee-support-flow" className="overflow-hidden rounded-md border border-accent/25 bg-[#171C1D] shadow-[inset_0_0_50px_rgba(64,224,208,0.06)]">
                  <img src={smartRefereeMedia.rulebook} alt="Drone-sport scoring rule excerpt specifying the entire drone ball must cross the opposing goal ring" className="aspect-[21/9] w-full object-cover object-left sm:aspect-[16/9]" />
                  <div className="grid gap-2 border-t border-accent/20 p-4 sm:grid-cols-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">01 · Tracked position</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">02 · Rule condition</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">03 · Reviewable call</span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/75">Calibrated spatial data gives officials a practical evidence layer against rule-defined scoring conditions—supporting a clearer, more consistent decision without removing human authority.</p>
              </article>
            </div>

            <p data-reveal className="reveal-up mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-white/55" style={{ transitionDelay: "150ms" }}>
              Smart Referee is designed to support—not replace—official judgement. It gives referees stronger shared context so the game can remain transparent, consistent, and fair.
            </p>
          </div>
        </section>

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
              <h2 className="velocity-headline mb-5 text-white">Protect match momentum—and your event economics.</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70">A reviewable evidence layer helps organisers resolve contested moments with greater confidence, so referees, team representatives, and operations staff can focus on the next match instead of an extended debate.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
                  <div className="flex items-center gap-2 text-accent"><Clock3 size={18} /><p className="text-[10px] font-semibold uppercase tracking-[0.15em]">Average time wasted on a dispute</p></div>
                  <time data-testid="dispute-time-counter" className="mt-3 block font-mono text-4xl font-semibold tracking-tight text-white" aria-label={`${disputeTimerLabel} on the dispute time counter`}>{disputeTimerLabel}</time>
                  <p className="mt-2 text-xs leading-5 text-white/60">Illustrative event-flow counter: it advances by one second for every ten seconds of active scrolling.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">Human cost</p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white">Every unresolved call can absorb officials, captains, venue time, and the schedule buffer that keeps an event on track.</p>
                  <p className="mt-2 text-sm leading-6 text-white/65">Clearer evidence helps protect staffing capacity, audience confidence, and the operating margin behind every competition day.</p>
                </div>
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

        <section className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.85fr_1fr]">
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up overflow-hidden rounded-lg border border-white/10 bg-[#171C1D] shadow-2xl">
              <div className="relative aspect-[21/9] overflow-hidden sm:aspect-[4/3]">
                <img src={smartRefereeFeaturePanels.precision.image} alt={smartRefereeFeaturePanels.precision.imageAlt} className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(12,13,15,0.28)_100%)]" />
              </div>
            </div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "90ms" }}>
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{smartRefereeFeaturePanels.precision.eyebrow}</p>
              <h2 className="velocity-headline mb-5 text-white">{smartRefereeFeaturePanels.precision.title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70">{smartRefereeFeaturePanels.precision.description}</p>
            </div>
          </div>
        </section>

        <section className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.82fr_1.18fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">See the system in action</p>
              <h2 className="velocity-headline mb-5 text-white">Bring the decision layer to the match.</h2>
              <p className="max-w-xl text-lg leading-8 text-white/70">See how live tracking can become a practical reference for competition, review, and technical learning.</p>
            </div>
            <div data-reveal className="reveal-up aspect-video overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl" style={{ transitionDelay: "90ms" }}>
              <video className="h-full w-full object-cover" src={smartRefereeMedia.trackingVideo} controls playsInline preload="metadata">Your browser does not support embedded video.</video>
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.95fr_1.05fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Built for the ecosystem</p>
              <h2 className="velocity-headline mb-5 text-white">From the arena to the training room.</h2>
              <p className="max-w-xl text-lg leading-8 text-white/70">The referee system is designed for the people who run, grow, and teach drone sports: event organizers, clubs, and educators.</p>
            </div>
            <div data-reveal className="reveal-up grid gap-4 sm:grid-cols-3" style={{ transitionDelay: "90ms" }}>
              {ecosystemAudiences.map((audience, index) => {
                const Icon = audience.icon;
                return (
                  <article data-testid="ecosystem-audience-card" data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} key={audience.title} className="group relative aspect-[21/9] min-h-0 overflow-hidden rounded-lg border border-white/10 bg-white/5 sm:aspect-auto">
                    <div className="absolute inset-0 overflow-hidden bg-[#151719] sm:relative sm:aspect-square sm:border-b sm:border-white/10">
                      <img src={audience.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_25%,rgba(12,13,15,0.82)_100%)]" />
                      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/40 text-[11px] font-bold text-white/75">0{index + 1}</span>
                      <span className="absolute bottom-4 left-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">{audience.eyebrow}</span>
                    </div>
                    <div className="relative z-10 mt-auto bg-gradient-to-t from-[#151719] via-[#151719]/90 to-transparent p-3.5 pt-10 sm:bg-white/5 sm:p-4">
                      <Icon aria-hidden="true" size={18} className="mb-1 text-accent sm:mb-3 sm:size-[21px]" />
                      <h3 className="text-base font-semibold text-white sm:mb-2 sm:text-lg">{audience.title}</h3>
                      <p className="sr-only sm:not-sr-only sm:text-sm sm:leading-6 sm:text-white/65">{audience.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <RefereePricingConfigurator />

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-10 text-[var(--paper)] md:py-12">
          <div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 h-1 w-12 bg-accent" />
              <h2 className="velocity-headline mb-3 text-[var(--paper)]">Build the right system for your next event.</h2>
              <p className="text-lg leading-8 text-[var(--mist)]">Tell us about your competition format and we will help define the right pilot, rental, or permanent setup.</p>
            </div>
            <a href="#pricing" className="inline-flex shrink-0 items-center gap-2 border border-white/40 px-6 py-3 font-semibold text-[var(--paper)] transition-colors hover:border-accent hover:bg-accent hover:text-black">Configure your system <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
