import { Button } from "@/components/ui/button";
import LogoCarousel from "@/components/LogoCarousel";
import LanguageToggle from "@/components/LanguageToggle";
import { headerLogoSrc, mobileHeaderLogoScaleClass } from "@/lib/brandAssets";
import { siteNavigation } from "@/lib/siteNavigation";
import { staticSitePath } from "@/lib/staticPreview";
import SiteFooter from "@/components/SiteFooter";
import { offeringCards } from "@/lib/offeringRoutes";
import { homepageHeroImageSrc } from "@/lib/heroMedia";
import { getRevealTransitionDelay } from "@/lib/revealMotion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export const collaborators = [
  { name: "Hong Kong Drone Sports Association", logo: "/manus-storage/HKDSA_9a3a9c17.jpeg" },
  { name: "Eastern District Drone Association", logo: "/manus-storage/EDD_61b82de0.jpg" },
  { name: "Hong Kong Science and Technology Parks Ideation Programme", logo: "/manus-storage/HKSTP_6e2bc852.png" },
];

export const mobileOfferingCardAspectRatio = "21:9";
export const mobileHomeHeroVideoAspectRatio = "1:1";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="vli-site-header fixed inset-x-0 top-0 z-50 border-b">
        <div className="container flex h-[4.75rem] items-center justify-between">
          <button onClick={() => scrollToSection("hero")} className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Velocity Lab Innovation home">
            <img src={headerLogoSrc} alt="Velocity Lab Innovation" className={`vli-brand-logo ${mobileHeaderLogoScaleClass}`} />
          </button>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation">
            {siteNavigation.map((item) => <a key={item.href} href={staticSitePath(item.href)} className="vli-nav-link font-medium transition-colors">{item.label}</a>)}
          </nav>

          <LanguageToggle placement="desktop" />

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageToggle placement="mobile-toolbar" />
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="text-[var(--paper)]" aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="vli-mobile-menu border-t lg:hidden">
            <nav className="container space-y-1 py-4" aria-label="Mobile navigation">
              {siteNavigation.map((item) => <a key={item.href} href={staticSitePath(item.href)} onClick={() => setMobileMenuOpen(false)} className="vli-nav-link block px-4 py-2.5 font-medium transition-colors hover:bg-white/5">{item.label}</a>)}
              <div className="mt-3 px-4"><LanguageToggle /></div>
            </nav>
          </div>
        )}
      </header>

      <main data-reveal-page>
        <section id="hero" data-mobile-video-aspect-ratio={mobileHomeHeroVideoAspectRatio} className="vli-home-hero relative isolate flex aspect-square min-h-0 items-end overflow-hidden pt-16 sm:min-h-[44rem] sm:aspect-auto sm:pt-20 md:min-h-[46rem] lg:min-h-0 lg:aspect-[21/9]">
          <img src={homepageHeroImageSrc} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 -z-10 bg-[#051018]/15" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#051018]/95 via-[#051018]/68 to-[#051018]/15" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-[#051018]/90 to-transparent" />

          <div className="container relative z-10 w-full pb-6 sm:pb-16 md:pb-20 lg:pb-24">
            <div data-reveal className="reveal-up max-w-4xl">
              <p className="vli-home-kicker mb-3 sm:mb-6">Precision drone sports systems</p>
              <h1 className="vli-home-title mb-4 text-white sm:mb-9">Every Frame Matters.<br /><span className="text-accent">Every Call Counts.</span></h1>
              <div className="grid max-w-3xl gap-3 sm:gap-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <p className="text-sm leading-5 text-[var(--mist)] sm:text-base sm:leading-7 md:text-lg">Precision-driven drone sports refereeing powered by OptiTrack motion capture. Fair play, engineered. Real-time decisions backed by data.</p>
                <p className="max-w-xs text-xs leading-4 text-[var(--mist)] sm:text-sm sm:leading-6">Choose the system, equipment, or technical support that moves your next drone-sports programme forward.</p>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:gap-4 sm:flex-row">
                <button onClick={() => scrollToSection("offerings")} className="flex items-center justify-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#7ff2e6] sm:px-6 sm:py-3 sm:text-base">Explore offerings <ArrowRight size={17} className="sm:size-5" /></button>
                <a href={staticSitePath("/contact")} className="border border-white/45 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#051018] sm:px-6 sm:py-3 sm:text-base">Talk to the team</a>
              </div>
            </div>
          </div>
          <a href="#offerings" className="absolute bottom-7 right-8 z-10 hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--mist)] transition-colors hover:text-accent lg:flex" aria-label="Scroll to offerings"><span className="h-px w-8 bg-accent" />Scroll to explore<span className="text-accent">↓</span></a>
        </section>

        <section id="offerings" className="velocity-section bg-[var(--ink)]">
          <div className="container">
            <div data-reveal className="reveal-up mb-14 grid gap-6 lg:grid-cols-[28%_1fr] lg:items-end">
              <p className="vli-section-label">VLI offerings</p>
              <div><h2 className="velocity-headline mb-5 text-white">Choose the way you want to build drone sports.</h2><p className="velocity-body max-w-2xl">From data-backed refereeing to practical equipment and specialist support, each offering is designed to work independently or together.</p></div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {offeringCards.map((offering, index) => (
                <a key={offering.href} href={staticSitePath(offering.href)} data-reveal data-mobile-aspect-ratio={mobileOfferingCardAspectRatio} className="vli-offering-card group reveal-up relative flex aspect-[21/9] min-h-0 overflow-hidden border p-5 transition-all duration-300 sm:aspect-auto sm:min-h-[29rem] sm:p-7" style={{ transitionDelay: getRevealTransitionDelay(index) }}>
                  <img src={offering.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-500 group-hover:scale-110 group-hover:opacity-85" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/72 to-black/10 transition-colors duration-300 group-hover:from-black/95 group-hover:via-black/62" />
                  <div className="relative z-10 mt-auto">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent sm:mb-4 sm:text-xs">{offering.eyebrow}</p>
                    <h3 className="mb-2 line-clamp-1 text-xl font-semibold leading-tight text-white sm:mb-3 sm:text-3xl">{offering.title}</h3>
                    <p className="sr-only max-w-sm leading-7 text-white/75 sm:not-sr-only sm:mb-7">{offering.description}</p>
                    <span className="inline-flex items-center gap-2 border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 group-hover:border-accent group-hover:text-accent sm:px-4 sm:py-2.5 sm:text-sm">{offering.cta}<ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1 sm:size-[17px]" /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="vli-partner-band velocity-section border-y">
          <div className="container"><div className="mx-auto max-w-6xl">
            <div data-reveal className="reveal-up mb-12 grid gap-6 lg:grid-cols-[28%_1fr] lg:items-end"><p className="vli-section-label">Supporting network</p><div><h2 className="velocity-headline mb-5 text-white">Partners &amp; Supporting Organizations</h2><p className="velocity-body max-w-2xl">Together, we are advancing fair, data-driven competition and growing the future of drone sports.</p></div></div>
            <div data-reveal className="reveal-up" style={{ transitionDelay: "100ms" }}><LogoCarousel logos={collaborators} compact /></div>
          </div></div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
