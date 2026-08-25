import { ArrowRight, Cpu, Wrench } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage, type WebsiteLanguage } from "@/contexts/LanguageContext";
import { staticSitePath } from "@/lib/staticPreview";
import { localizedPath } from "@/lib/seo";

type Founder = {
  name: string;
  role: string;
  image: string;
  alt: string;
  introduction: string;
  specialties: string[];
};

type PeoplePageContent = {
  eyebrow: string;
  title: string;
  introduction: string;
  founders: Founder[];
  principles: Array<{ label: string; title: string; body: string }>;
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
};

export const peopleContent: Record<WebsiteLanguage, PeoplePageContent> = {
  en: {
    eyebrow: "About VLI",
    title: "People behind the precision.",
    introduction: "Velocity Lab Innovation is built by engineers and drone-sports practitioners working across UAV systems, motion technology, robotics, and competition delivery.",
    founders: [
      {
        name: "Carson Chan",
        role: "Co-Founder · Systems & Drone Operations",
        image: "/manus-storage/CarsonChan_2ddbd847.png",
        alt: "Carson Chan at a drone sports event",
        introduction: "Carson brings together electrical and mechanical design, drone operations, and competition experience to help turn technical systems into practical event delivery.",
        specialties: ["UAV systems", "Electrical design", "Mechanical design", "Drone operations"],
      },
      {
        name: "Max Yau",
        role: "Co-Founder · Software & Mechanical Systems",
        image: "/manus-storage/MaxYau_d31bdae0.png",
        alt: "Max Yau working on an engineering project",
        introduction: "Max combines mechanical engineering, computer vision, and high-speed systems experience to develop reliable, data-driven tools for demanding environments.",
        specialties: ["Computer vision", "Mechanical design", "Software systems", "Engineering workflow"],
      },
    ],
    principles: [
      { label: "01", title: "Competition-aware", body: "We start with the people, venue, rules, and schedule around a real event—not only the technology in isolation." },
      { label: "02", title: "Engineering-led", body: "Our work connects practical hardware, motion technology, software, and operational detail into one delivery path." },
      { label: "03", title: "Built for the next step", body: "We scope the right technical route with the organiser or programme team, then make the next decision clear." },
    ],
    ctaTitle: "Discuss the right route for your programme.",
    ctaBody: "Share your event, technical objective, or delivery constraint. We will start by understanding the practical next step.",
    ctaLabel: "Plan your next step",
  },
  "zh-Hant": {
    eyebrow: "關於速研創新",
    title: "精準背後的團隊。",
    introduction: "速研創新由工程師及無人機運動實踐者組成，結合無人機系統、動作技術、機械人及賽事執行的實務經驗。",
    founders: [
      {
        name: "Carson Chan",
        role: "共同創辦人 · 系統與無人機營運",
        image: "/manus-storage/CarsonChan_2ddbd847.png",
        alt: "Carson Chan 於無人機運動賽事",
        introduction: "Carson 結合電子與機械設計、無人機營運及賽事經驗，協助把技術系統轉化為可實際執行的賽事交付。",
        specialties: ["無人機系統", "電子設計", "機械設計", "無人機營運"],
      },
      {
        name: "Max Yau",
        role: "共同創辦人 · 軟件與機械系統",
        image: "/manus-storage/MaxYau_d31bdae0.png",
        alt: "Max Yau 正在進行工程項目",
        introduction: "Max 結合機械工程、電腦視覺及高速系統經驗，為要求嚴謹的環境開發可靠、以數據為本的工具。",
        specialties: ["電腦視覺", "機械設計", "軟件系統", "工程流程"],
      },
    ],
    principles: [
      { label: "01", title: "以賽事為本", body: "我們先了解真實賽事中的人員、場地、規則及時間表，而非只從孤立的技術角度出發。" },
      { label: "02", title: "工程主導", body: "我們把實用硬件、動作技術、軟件及營運細節連結成一條清晰的交付路徑。" },
      { label: "03", title: "為下一步而設", body: "我們與主辦方或項目團隊界定合適的技術方向，然後讓下一個決定更清晰。" },
    ],
    ctaTitle: "一起規劃適合您項目的路徑。",
    ctaBody: "分享您的賽事、技術目標或交付限制。我們會先了解最實際的下一步。",
    ctaLabel: "規劃下一步",
  },
};

export default function People() {
  const { language } = useWebsiteLanguage();
  const copy = peopleContent[language];

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader />
      <main data-reveal-page className="pt-16">
        <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_10%,rgba(64,224,208,0.16),transparent_28%),linear-gradient(135deg,#191A1C,#2A2C30_58%,#191A1C)] py-20 md:py-28">
          <div className="container relative">
            <div data-reveal className="reveal-up max-w-3xl">
              <div className="mb-5 h-1 w-12 bg-accent" />
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
              <h1 className="velocity-headline mb-6 text-white">{copy.title}</h1>
              <p className="max-w-2xl text-lg leading-8 text-white/70">{copy.introduction}</p>
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container space-y-16 md:space-y-24">
            {copy.founders.map((founder, index) => (
              <article key={founder.name} data-reveal className="reveal-up grid items-center gap-10 border-b border-white/10 pb-16 last:border-0 last:pb-0 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16" style={{ transitionDelay: `${index * 80}ms` }}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative overflow-hidden border border-white/10 bg-white/5">
                    <img src={founder.image} alt={founder.alt} className="aspect-[4/5] w-full object-cover" loading={index === 0 ? "eager" : "lazy"} />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
                    <div className="absolute bottom-5 left-5 border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{language === "zh-Hant" ? "共同創辦人" : "Co-Founder"}</div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="mb-5 flex items-center gap-3"><span className="text-sm font-bold text-accent">0{index + 1}</span><span className="h-px w-10 bg-accent" /></div>
                  <h2 className="velocity-headline mb-2 text-white">{founder.name}</h2>
                  <p className="mb-6 text-base font-semibold text-accent">{founder.role}</p>
                  <p className="max-w-2xl text-lg leading-8 text-white/75">{founder.introduction}</p>
                  <div className="mt-7 flex flex-wrap gap-2" aria-label={`${founder.name} specialties`}>
                    {founder.specialties.map((specialty) => <span key={specialty} className="border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/70">{specialty}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--ink-soft)] py-16 text-[var(--paper)] md:py-20">
          <div className="container grid gap-8 lg:grid-cols-[28%_1fr] lg:items-start">
            <p className="vli-section-label text-accent">{language === "zh-Hant" ? "我們的工作方式" : "How we work"}</p>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
              {copy.principles.map((principle) => <article key={principle.label} data-reveal className="reveal-up bg-[var(--ink-soft)] p-6" style={{ transitionDelay: `${Number(principle.label) * 60}ms` }}><p className="mb-6 text-xs font-semibold tracking-[0.18em] text-accent">{principle.label}</p><h2 className="mb-3 text-xl font-semibold text-white">{principle.title}</h2><p className="leading-7 text-[var(--mist)]">{principle.body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black">
          <div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-8 border border-white/10 bg-white/[0.03] p-7 md:flex-row md:items-end md:p-10">
            <div className="max-w-2xl"><div className="mb-4 h-1 w-12 bg-accent" /><h2 className="velocity-headline mb-3 text-white">{copy.ctaTitle}</h2><p className="text-lg leading-8 text-white/70">{copy.ctaBody}</p></div>
            <a href={staticSitePath(localizedPath("/contact", language))} className="inline-flex shrink-0 items-center gap-2 bg-accent px-6 py-3 font-semibold text-black transition-colors hover:bg-[#7ff2e6]">{copy.ctaLabel}<ArrowRight size={17} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
