import { ArrowRight, Bot, CircleDot, Crosshair, ShieldCheck } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const useCases = [
  {
    number: "01",
    icon: <CircleDot size={24} />,
    title: "Drone soccer",
    statement: "Bring a consistent spatial reference to high-speed play.",
    headline: "Track the moments that decide the match.",
    description: "Use a calibrated view of the flying zone to support review of goal-ring crossings, designated scoring-drone events, boundary situations, and post-match replay.",
    details: ["Track relevant in-play movement", "Review goal and boundary events", "Support clearer referee communication"],
  },
  {
    number: "02",
    icon: <Bot size={24} />,
    title: "RoboCon competition",
    statement: "Make defined tasks and zones easier to observe and validate.",
    headline: "Validate task completion with spatial evidence.",
    description: "Create an additional data layer for robotics contests where robots navigate fields, complete time-bound tasks, or interact with designated areas and objects.",
    details: ["Define task zones and milestones", "Review spatial sequence after a run", "Support technical debriefs and judging workflows"],
  },
  {
    number: "03",
    icon: <Crosshair size={24} />,
    title: "Ground truth",
    statement: "Establish a calibrated reference for testing other systems.",
    headline: "Create a reference layer for systems under test.",
    description: "Use motion-capture data as a reference layer when comparing perception, autonomy, tracking, or scoring tools in a controlled space.",
    details: ["Reference motion and position data", "Benchmark tracking approaches", "Inform model evaluation and iteration"],
  },
];

export default function UseCases() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="useCases" />
      <main data-reveal-page className="pt-16">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_22%,rgba(64,224,208,0.16),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_58%,#1C1D20)] py-24 md:py-32">
          <div className="container">
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-6 h-1 w-12 bg-accent" />
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Use cases</p>
              <h1 className="velocity-headline mb-6 text-white">One calibrated view. <span className="text-accent">More confident competition.</span></h1>
              <p className="max-w-2xl text-lg leading-8 text-white/75">Velocity Lab turns spatial motion data into a practical reference for competitions, technical validation, and evidence-led review.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#FFFFFF] py-10 text-black md:py-14">
          <div className="container grid gap-6 text-center md:grid-cols-3">
            {[
              ["Configure", "the events that matter"],
              ["Observe", "movement in a shared space"],
              ["Review", "calls with a data layer"],
            ].map(([title, text]) => (
              <div data-reveal key={title} className="reveal-up" style={{ transitionDelay: `${["Configure", "Observe", "Review"].indexOf(title) * 80}ms` }}>
                <p className="text-2xl font-bold text-black">{title}</p>
                <p className="mt-1 text-sm text-black/60">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container space-y-16 md:space-y-24">
            {useCases.map((useCase, index) => (
              <article data-reveal key={useCase.title} className="reveal-up grid items-center gap-10 border-b border-white/10 pb-16 last:border-0 last:pb-0 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16" style={{ transitionDelay: `${index * 80}ms` }}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#27282B] p-8 md:p-10">
                    <div className="absolute -right-6 -top-10 text-[10rem] font-bold leading-none tracking-[-0.08em] text-white/5">{useCase.number}</div>
                    <div className="relative">
                      <div className="mb-10 flex items-center justify-between">
                        <span className="text-sm font-bold text-accent">{useCase.number}</span>
                        <span className="rounded-full border border-accent/25 bg-accent/10 p-2 text-accent">{useCase.icon}</span>
                      </div>
                      <p className="text-xl font-semibold leading-8 text-white">{useCase.statement}</p>
                    </div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{useCase.title}</p>
                  <h2 className="velocity-headline mb-5 text-white">{useCase.headline}</h2>
                  <p className="max-w-2xl text-lg leading-8 text-white/70">{useCase.description}</p>
                  <div className="mt-7 space-y-3">
                    {useCase.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-3 text-white/80"><ShieldCheck size={18} className="shrink-0 text-accent" /> {detail}</div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="velocity-section bg-[#27282B]">
          <div className="container grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div data-reveal className="reveal-up">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Start with your scenario</p>
              <h2 className="velocity-headline mb-5 text-white">The system adapts to the rules, space, and evidence you need.</h2>
              <p className="max-w-2xl text-lg leading-8 text-white/70">Whether you are running a pilot event, refining a judging process, or testing another tracking solution, the first step is to define the moments that should be visible and reviewable.</p>
            </div>
            <div data-reveal className="reveal-up rounded-lg border border-accent/25 bg-accent/10 p-7" style={{ transitionDelay: "90ms" }}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Next conversation</p>
              <p className="mt-4 text-xl font-semibold leading-8 text-white">Tell us what you need to observe, decide, or validate.</p>
              <a href="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90">Discuss your use case <ArrowRight size={18} /></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
