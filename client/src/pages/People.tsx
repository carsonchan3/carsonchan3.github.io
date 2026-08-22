import { ArrowLeft, Award, Cpu, GraduationCap, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const founders = [
  {
    name: "Carson Chan",
    role: "Co-Founder · Systems & Drone Operations",
    image: "/manus-storage/CarsonChan_2ddbd847.png",
    alt: "Carson Chan at a drone sports event",
    introduction:
      "Carson brings together electrical and mechanical design, drone operations, and competition experience to build practical, high-performance sports technology.",
    education: "BSc in Integrative Systems and Design, The Hong Kong University of Science and Technology (2020–2024)",
    experience: "Team Lead and Co-Founder of the UAV Team under the HKUST Robotics Team (2023–2024); Assistant Engineer at Loedige Asia.",
    expertise: "Electrical and mechanical design with KiCad, Fusion, Inventor, and AutoCAD.",
    droneSports:
      "Collaborates with HKDSA, holds a HKCAD Advanced Rated Drone Operator certification, and serves as a part-time coach and technical advisor for EDDAHKC.",
    highlight: "Competed in drone events from 2023 to 2025, including a third-place result at the FIDA World Championship.",
    specialties: ["UAV systems", "Electrical design", "Mechanical design", "Drone operations"],
  },
  {
    name: "Max Yau",
    role: "Co-Founder · Software & Mechanical Systems",
    image: "/manus-storage/MaxYau_d31bdae0.png",
    alt: "Max Yau working on an engineering project",
    introduction:
      "Max combines mechanical engineering, computer vision, and motorsport systems experience to develop reliable, data-driven tools for high-speed environments.",
    education: "BSc in Integrative Systems and Design, The Hong Kong University of Science and Technology (2022–2026); MPhil in Computer Science and Engineering (2026–2028).",
    experience: "Co-Founder and UAV Team member under the HKUST Robotics Team (2023–2025); Accumulator Team PIC for the HKUST Red Bird Racing FSAE Team (2022–2025).",
    expertise: "Mechanical and software design with SolidWorks and AutoCAD, with computer vision coding experience.",
    droneSports: "Active in drone sports and collaboration with HKDSA.",
    highlight: "Participated in drone competitions from 2019 to 2025.",
    specialties: ["Computer vision", "Mechanical design", "Software systems", "FSAE engineering"],
  },
];

export default function People() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="people" />

      <main data-reveal-page className="pt-16">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(64,224,208,0.16),transparent_28%),linear-gradient(135deg,#191A1C,#2A2C30_58%,#191A1C)] py-20 md:py-28">
          <div className="container relative">
            <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-white/65 transition-colors hover:text-accent">
              <ArrowLeft size={16} /> Back to home
            </a>
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">Velocity Lab Innovation</p>
              <h1 className="velocity-headline mb-6 text-white">People behind the precision.</h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70">
                Velocity Lab Innovation is built by engineers and drone-sports practitioners with hands-on experience across UAV systems, motion technology, robotics, and competitive engineering.
              </p>
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container space-y-16 md:space-y-24">
            {founders.map((founder, index) => (
              <article
                key={founder.name}
                data-reveal
                style={{ transitionDelay: `${index * 80}ms` }}
                className="reveal-up grid items-start gap-10 border-b border-white/10 pb-16 last:border-0 last:pb-0 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    <img src={founder.image} alt={founder.alt} className="aspect-[4/5] w-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
                    <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      Co-Founder
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-sm font-bold text-accent">0{index + 1}</span>
                    <span className="h-px w-10 bg-accent" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Co-Founder Profile</span>
                  </div>
                  <h2 className="velocity-headline mb-2 text-white">{founder.name}</h2>
                  <p className="mb-6 text-base font-semibold text-accent">{founder.role}</p>
                  <p className="mb-8 max-w-2xl text-lg leading-8 text-white/75">{founder.introduction}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileDetail icon={<GraduationCap size={19} />} label="Education" content={founder.education} />
                    <ProfileDetail icon={<Wrench size={19} />} label="Engineering experience" content={founder.experience} />
                    <ProfileDetail icon={<Cpu size={19} />} label="Technical focus" content={founder.expertise} />
                    <ProfileDetail icon={<Award size={19} />} label="Drone sports" content={founder.droneSports} />
                  </div>

                  <div className="mt-7 rounded-lg border border-accent/25 bg-accent/10 p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Competition highlight</p>
                    <p className="leading-7 text-white/80">{founder.highlight}</p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2" aria-label={`${founder.name} specialties`}>
                    {founder.specialties.map((specialty) => (
                      <span key={specialty} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-16 text-[var(--paper)] md:py-20">
          <div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 h-1 w-12 bg-accent" />
              <h2 className="velocity-headline mb-3 text-[var(--paper)]">Build the next standard of fair play.</h2>
              <p className="text-lg leading-8 text-[var(--mist)]">Explore how Velocity Lab Innovation can support your sport, competition, or technology programme.</p>
            </div>
            <a href="/contact" className="inline-flex shrink-0 items-center gap-2 border border-white/40 px-6 py-3 font-semibold text-[var(--paper)] transition-colors hover:border-accent hover:bg-accent hover:text-black">
              Request a Demo <ArrowLeft size={17} className="rotate-180" />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProfileDetail({ icon, label, content }: { icon: ReactNode; label: string; content: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-5">
      <div className="mb-3 flex items-center gap-2 text-accent">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">{label}</h3>
      </div>
      <p className="text-sm leading-6 text-white/70">{content}</p>
    </div>
  );
}
