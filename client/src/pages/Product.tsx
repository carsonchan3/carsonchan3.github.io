import { ArrowRight, CalendarDays, Camera, CircleCheck, Gauge, GraduationCap, SlidersHorizontal, UsersRound, Video } from "lucide-react";
import React from "react";
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

export const smartRefereeFeaturePanels = {
  infrared: {
    eyebrow: "Unobtrusive IR LED tracking",
    title: "Tracking that stays out of the way.",
    description: "Our tracking cameras use 850 nm IR LEDs that are nearly invisible, delivering unobtrusive illumination without the vision fatigue or unwanted attention that visible-spectrum light can create during competition.",
    image: "/manus-storage/smart-referee-unobtrusive-infrared-light_85c32f18.png",
    imageAlt: "Drone-sports arena with discreet infrared motion-capture tracking",
    steps: [
      "850 nm IR LED tracking coverage",
      "No visible-light disruption to play",
      "Built to blend into the match environment",
    ],
  },
  passiveMarkers: {
    eyebrow: "Passive competition markers",
    title: "Lightweight markers. Lower cost of entry.",
    description: "Lightweight, low-cost passive markers give teams a practical way to prepare drones for a tracked competition volume without adding a bulky active device to the airframe.",
    benefits: [
      "Lightweight marker layout for competition drones",
      "Low-cost hardware approach for repeat events",
      "Passive design without a powered marker module",
    ],
  },
  precision: {
    eyebrow: "Industry-Leading Precision",
    title: "Precision that holds up under pressure.",
    description: "Our 3D precision is the best in the business, outperforming even the highest-resolution competition.",
    image: "/manus-storage/smart-referee-industry-leading-precision_3b70bc45.png",
    imageAlt: "Technical visualization of precise three-dimensional motion tracking",
  },
} as const;

export const modules = [
  {
    icon: <Camera size={22} />,
    title: "Live spatial tracking",
    text: "Follow motion events inside a calibrated competition volume and turn position data into a shared view of play.",
  },
  {
    icon: <SlidersHorizontal size={22} />,
    title: "Configurable match logic",
    text: "Translate the rules that matter to your format into a clear event model, from boundaries to scoring conditions.",
  },
  {
    icon: <Video size={22} />,
    title: "Evidence for every decision",
    text: "Return to the data behind a call through replay-ready match context, supporting timely review, technical analysis, and athlete learning.",
  },
];

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
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">A shared reference</p>
              <h2 className="velocity-headline text-white">A decisive moment should not rest on a single viewpoint.</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
                Officials remain central to the game. Smart Referee gives them a common evidence layer to support timely, explainable decisions when fast drone play makes a moment difficult to see or review.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <article data-testid="traditional-officiating-panel" data-reveal className="reveal-up rounded-lg border border-white/10 bg-black/25 p-5 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Human-only officiating</p>
                    <h3 className="velocity-subheading mt-3 text-white">One fast moment. One finite view.</h3>
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-sm text-white/30">01</span>
                </div>

                <div data-testid="traditional-officiating-flow" className="relative overflow-hidden rounded-md border border-white/10 bg-[#161719] p-4">
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <svg aria-hidden="true" viewBox="0 0 560 210" className="relative h-36 w-full sm:h-40" preserveAspectRatio="xMidYMid meet">
                    <path d="M80 156 L255 44" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeDasharray="7 7" />
                    <path d="M80 156 L250 108" stroke="rgba(255,255,255,0.11)" strokeWidth="2" strokeDasharray="7 7" />
                    <path d="M80 156 L240 174" stroke="rgba(255,255,255,0.11)" strokeWidth="2" strokeDasharray="7 7" />
                    <circle cx="80" cy="156" r="22" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                    <circle cx="80" cy="156" r="6" fill="white" />
                    <circle cx="315" cy="74" r="11" fill="rgba(255,255,255,0.82)" />
                    <circle cx="370" cy="136" r="11" fill="rgba(255,255,255,0.42)" />
                    <circle cx="323" cy="176" r="11" fill="rgba(255,255,255,0.23)" />
                    <path d="M438 74h66" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
                    <path d="M438 136h66" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
                    <path d="M438 176h66" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
                    <text x="452" y="68" fill="rgba(255,255,255,0.6)" fontSize="12" fontFamily="sans-serif">possible view</text>
                    <text x="452" y="130" fill="rgba(255,255,255,0.46)" fontSize="12" fontFamily="sans-serif">blind spot</text>
                    <text x="452" y="170" fill="rgba(255,255,255,0.34)" fontSize="12" fontFamily="sans-serif">uncertain</text>
                  </svg>
                  <div className="relative mt-2 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                    <div data-testid="traditional-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">01 · One sightline</span></div>
                    <div data-testid="traditional-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">02 · Interpretation</span></div>
                    <div data-testid="traditional-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">03 · Disputed call</span></div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/65">Limited angles and different strict-versus-loose thresholds can make a close call difficult to explain or revisit.</p>
              </article>

              <article data-testid="smart-referee-support-panel" data-reveal className="reveal-up rounded-lg border border-accent/25 bg-accent/10 p-5 sm:p-6" style={{ transitionDelay: "90ms" }}>
                <div className="mb-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Smart Referee decision support</p>
                    <h3 className="velocity-subheading mt-3 text-white">One shared reference for the final call.</h3>
                  </div>
                  <span className="mt-1 shrink-0 font-mono text-sm text-accent/65">02</span>
                </div>

                <div data-testid="smart-referee-support-flow" className="relative overflow-hidden rounded-md border border-accent/25 bg-[#171C1D] p-4 shadow-[inset_0_0_50px_rgba(64,224,208,0.06)]">
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(64,224,208,0.16),transparent_0_56%),linear-gradient(rgba(64,224,208,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,208,0.055)_1px,transparent_1px)] bg-[size:auto,24px_24px,24px_24px]" />
                  <svg aria-hidden="true" viewBox="0 0 560 210" className="relative h-36 w-full sm:h-40" preserveAspectRatio="xMidYMid meet">
                    <path d="M95 58 C180 58 190 105 280 105 S380 150 470 150" stroke="rgba(64,224,208,0.72)" strokeWidth="3" fill="none" />
                    <path d="M95 150 C180 150 192 105 280 105 S382 58 470 58" stroke="rgba(64,224,208,0.36)" strokeWidth="3" fill="none" />
                    <circle cx="95" cy="58" r="13" fill="#40E0D0" /><circle cx="95" cy="150" r="13" fill="#40E0D0" opacity="0.65" />
                    <circle cx="280" cy="105" r="38" fill="rgba(64,224,208,0.08)" stroke="#40E0D0" strokeWidth="2" />
                    <circle cx="280" cy="105" r="16" fill="#40E0D0" opacity="0.92" />
                    <path d="M270 105h20M280 95v20" stroke="#111416" strokeWidth="2" />
                    <circle cx="470" cy="58" r="13" fill="#40E0D0" opacity="0.65" /><circle cx="470" cy="150" r="13" fill="#40E0D0" />
                    <rect x="432" y="81" width="76" height="48" rx="10" fill="rgba(64,224,208,0.18)" stroke="#40E0D0" strokeWidth="2" />
                    <path d="M451 105l11 11 24-26" stroke="#40E0D0" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="57" y="188" fill="#40E0D0" fontSize="12" fontFamily="sans-serif">tracked views</text>
                    <text x="237" y="188" fill="#40E0D0" fontSize="12" fontFamily="sans-serif">rule reference</text>
                    <text x="436" y="188" fill="#40E0D0" fontSize="12" fontFamily="sans-serif">reviewable call</text>
                  </svg>
                  <div className="relative mt-2 grid grid-cols-3 gap-2 border-t border-accent/20 pt-3 text-center">
                    <div data-testid="smart-referee-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">01 · Capture</span></div>
                    <div data-testid="smart-referee-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">02 · Rule reference</span></div>
                    <div data-testid="smart-referee-flow-step" className="min-w-0"><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">03 · Clear call</span></div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/75">Calibrated data and configurable event logic give officials useful evidence for a clearer, more consistent decision.</p>
              </article>
            </div>

            <p data-reveal className="reveal-up mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-white/55" style={{ transitionDelay: "150ms" }}>
              Smart Referee is designed to support—not replace—official judgement. It gives referees stronger shared context so the game can remain transparent, consistent, and fair.
            </p>
          </div>
        </section>

        <section className="velocity-section bg-[#27282B]">
          <div className="container">
            <div data-reveal className="reveal-up mx-auto mb-8 max-w-2xl text-center">
              <div className="mx-auto mb-4 h-1 w-12 bg-accent" />
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Core modules</p>
              <h2 className="velocity-headline text-white">A system shaped around the way events actually run.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
            {modules.map((module, index) => (
                <article data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} key={module.title} className="reveal-up aspect-[21/9] min-h-0 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-4 sm:aspect-auto sm:p-5" style={{ transitionDelay: `${index * 80}ms` }}>
                  <div className="mb-2 text-accent sm:mb-4">{module.icon}</div>
                  <h3 className="mb-1 text-lg font-semibold leading-tight text-white sm:velocity-subheading sm:mb-2">{module.title}</h3>
                  <p className="line-clamp-2 text-sm leading-5 text-white/70 sm:line-clamp-none sm:leading-6">{module.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container grid items-center gap-7 lg:grid-cols-[1fr_0.85fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{smartRefereeFeaturePanels.infrared.eyebrow}</p>
              <h2 className="velocity-headline mb-5 text-white">{smartRefereeFeaturePanels.infrared.title}</h2>
              <p className="max-w-2xl text-sm leading-6 text-white/70">{smartRefereeFeaturePanels.infrared.description}</p>
            </div>
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up overflow-hidden rounded-lg border border-accent/25 bg-accent/10" style={{ transitionDelay: "90ms" }}>
              <div className="relative aspect-[21/9] overflow-hidden border-b border-accent/20 bg-[#171C1D] sm:aspect-[4/3]">
                <img src={smartRefereeFeaturePanels.infrared.image} alt={smartRefereeFeaturePanels.infrared.imageAlt} className="h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(12,13,15,0.75)_100%)]" />
                <p className="absolute bottom-4 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Infrared tracking layer</p>
              </div>
              <div className="p-5">
              {smartRefereeFeaturePanels.infrared.steps.map((step) => (
                <div key={step} className="flex gap-3 border-b border-accent/15 py-3 last:border-0 last:pb-0 first:pt-0">
                  <CircleCheck className="mt-0.5 shrink-0 text-accent" size={19} />
                  <p className="text-white/80">{step}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        <section data-testid="passive-marker-panel" className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-7 lg:grid-cols-[0.85fr_1fr]">
            <div data-reveal data-mobile-aspect-ratio={mobileSmartRefereeCardAspectRatio} className="reveal-up overflow-hidden rounded-lg border border-accent/25 bg-[#171C1D] shadow-2xl">
              <div className="relative aspect-[21/9] overflow-hidden bg-[radial-gradient(circle_at_30%_24%,rgba(64,224,208,0.25),transparent_0_16%),radial-gradient(circle_at_72%_70%,rgba(64,224,208,0.16),transparent_0_20%),linear-gradient(135deg,#0E1214,#1C282A)] sm:aspect-[4/3]">
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(64,224,208,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(64,224,208,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xl border border-accent/55 bg-accent/10 shadow-[0_0_32px_rgba(64,224,208,0.18)]" />
                <span aria-hidden="true" className="absolute left-[28%] top-[27%] h-5 w-5 rounded-full border-2 border-accent bg-[#171C1D] shadow-[0_0_18px_rgba(64,224,208,0.45)]" />
                <span aria-hidden="true" className="absolute right-[25%] top-[30%] h-5 w-5 rounded-full border-2 border-accent bg-[#171C1D] shadow-[0_0_18px_rgba(64,224,208,0.45)]" />
                <span aria-hidden="true" className="absolute bottom-[25%] left-[31%] h-5 w-5 rounded-full border-2 border-accent bg-[#171C1D] shadow-[0_0_18px_rgba(64,224,208,0.45)]" />
                <span aria-hidden="true" className="absolute bottom-[27%] right-[29%] h-5 w-5 rounded-full border-2 border-accent bg-[#171C1D] shadow-[0_0_18px_rgba(64,224,208,0.45)]" />
                <div className="absolute bottom-5 left-5 rounded-full border border-accent/30 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">Passive marker layout</div>
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
              <p className="max-w-xl text-lg leading-8 text-white/70">See how motion capture can become a practical reference for competition, review, and technical learning.</p>
            </div>
            <div data-reveal className="reveal-up aspect-video overflow-hidden rounded-lg border border-white/10 bg-black shadow-2xl" style={{ transitionDelay: "90ms" }}>
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/fvWfJNlV5S8"
                title="Velocity Lab Innovation OptiTrack demo"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
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
