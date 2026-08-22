import React, { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ServiceEnquiryDialog from "@/components/ServiceEnquiryDialog";
import { trpc } from "@/lib/trpc";
import { ArrowRight, GraduationCap, SlidersHorizontal, Wrench } from "lucide-react";

export const serviceBanners = [
  {
    number: "01",
    title: "Drone Repair Service",
    description: "Mail in your drone for a repair assessment and quotation before any repair work begins, whether it needs diagnosis, component replacement, or rebuild support.",
    detail: "We will reply with mail-in instructions, assess the issue, and provide a repair solution and quotation before proceeding. Delivery fees can be waived if the proposed repair is accepted and completed.",
    icon: <Wrench size={34} />,
    visual: "bg-[radial-gradient(circle_at_24%_30%,rgba(64,224,208,0.25),transparent_0_26%),linear-gradient(115deg,#303136,#161719)]",
    thumbnail: "/manus-storage/vli-service-repair_13ee3faf.png",
    duration: "Mail-in assessment followed by quotation; repair timing depends on diagnosis and parts availability.",
    pricing: "Repair solution and quotation are provided first; delivery fees can be waived if the proposal is accepted and the repair is completed. Parts are separate.",
  },
  {
    number: "02",
    title: "PID tuning service",
    description: "A structured tuning session for refining flight behaviour around your drone, components, and intended flying environment.",
    detail: "Bring an existing build or a technical brief, then define a practical tuning and test path.",
    icon: <SlidersHorizontal size={34} />,
    visual: "bg-[radial-gradient(circle_at_78%_30%,rgba(64,224,208,0.28),transparent_0_24%),linear-gradient(115deg,#151619,#27282B)]",
    thumbnail: "/manus-storage/vli-service-pid-tuning_e541b71d.png",
    duration: "2–4 hours, including setup and test flight.",
    pricing: "Quoted after a build review; parts or venue costs are separate.",
  },
  {
    number: "03",
    title: "Drone Building Course",
    description: "Hands-on building guidance covering component selection, assembly workflow, basic checks, and confident workshop habits.",
    detail: "Designed for learners who want to understand what sits behind a dependable drone build.",
    icon: <Wrench size={34} />,
    visual: "bg-[radial-gradient(circle_at_24%_72%,rgba(64,224,208,0.24),transparent_0_28%),linear-gradient(115deg,#27282B,#161719)]",
    thumbnail: "/manus-storage/vli-service-building-skills_c32759ba.png",
    duration: "Half-day workshop; multi-session formats are available.",
    pricing: "Quoted by group size, required parts, and workshop format.",
  },
  {
    number: "04",
    title: "Advanced drone course for adults",
    description: "A focused course for adult learners ready to build stronger technical judgement, controlled flight practice, and operational confidence.",
    detail: "Course structure and prerequisites can be shaped around the group’s existing experience and objectives.",
    icon: <GraduationCap size={34} />,
    visual: "bg-[radial-gradient(circle_at_78%_62%,rgba(64,224,208,0.26),transparent_0_27%),linear-gradient(115deg,#161719,#303136)]",
    thumbnail: "/manus-storage/vli-service-advanced-course_d14dd579.png",
    duration: "One full day or a multi-session course, depending on objectives.",
    pricing: "Quoted by group size, venue, and selected training modules.",
  },
];

export const mobileServiceCardAspectRatio = "1:1";
export const serviceImagePanelClassName = "absolute inset-0 h-full overflow-hidden sm:relative sm:h-72 lg:h-full";
export const serviceImageClassName = "h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105";
export const resolvedServiceCatalogueRevealPolicy = "show-database-results-immediately";

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const servicesQuery = trpc.services.list.useQuery();
  const hasResolvedServiceCatalogue = Boolean(servicesQuery.data?.length);

  const openServiceEnquiry = (serviceTitle: string) => setSelectedService(serviceTitle);

  const banners = servicesQuery.data && servicesQuery.data.length > 0
    ? servicesQuery.data.map((s, idx) => ({
        number: String(idx + 1).padStart(2, "0"),
        title: s.title,
        description: s.description,
        detail: s.details,
        icon: idx === 0 ? <Wrench size={34} /> : idx === 1 ? <SlidersHorizontal size={34} /> : idx === 2 ? <Wrench size={34} /> : <GraduationCap size={34} />,
        thumbnail: s.imageUrl || serviceBanners[idx % serviceBanners.length].thumbnail,
        duration: s.duration,
        pricing: s.pricingText,
      }))
    : serviceBanners;

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="services" />
      <main data-reveal-page className="pt-16">
        <section data-testid="services-page-hero" className="border-b border-white/10 bg-[radial-gradient(circle_at_28%_20%,rgba(64,224,208,0.17),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)] py-8"><div className="container"><div data-reveal className="reveal-up max-w-3xl"><div className="mb-3 h-1 w-12 bg-accent" /><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">VLI services</p><h1 className="velocity-headline mb-3 !text-4xl text-white md:!text-5xl">Build skill.<br /><span className="text-accent">Fly with purpose.</span></h1><p className="max-w-2xl text-base leading-6 text-white/75 md:text-lg md:leading-8">Start with a practical mail-in repair assessment, then explore technical tuning and drone-building support for more confident flying outcomes.</p></div></div></section>

        <section className="velocity-section bg-black">
          <div className="container">
            <div data-reveal className="reveal-up mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Service options</p>
              <h2 className="velocity-headline text-white">Choose the support that fits your next step.</h2>
            </div>
            <div className="space-y-4">
              {banners.map((service, index) => (
                <article data-reveal data-revealed={hasResolvedServiceCatalogue ? "" : undefined} key={service.title} data-testid={`service-card-${service.number}`} data-mobile-aspect-ratio={mobileServiceCardAspectRatio} tabIndex={0} onClick={() => openServiceEnquiry(service.title)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openServiceEnquiry(service.title); } }} className="group reveal-up relative aspect-square min-h-0 cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#1C1D20] transition-all duration-300 hover:border-accent/60 hover:shadow-[0_18px_48px_rgba(64,224,208,0.1)] focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:aspect-auto sm:min-h-[30rem] lg:min-h-[20rem]" style={{ transitionDelay: `${index * 70}ms` }}>
                  <div className="grid h-full lg:h-[20rem] lg:grid-cols-2 lg:items-stretch">
                    <div data-testid="service-image-panel" className={`${serviceImagePanelClassName} ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <img src={service.thumbnail} alt="" loading="lazy" decoding="async" className={serviceImageClassName} />
                      <div data-testid="service-image-fade" className={`absolute inset-0 ${index % 2 === 1 ? "bg-gradient-to-b from-black/10 via-[#1C1D20]/20 to-[#1C1D20] lg:bg-gradient-to-l lg:from-transparent lg:via-[#1C1D20]/25 lg:to-[#1C1D20]" : "bg-gradient-to-b from-black/10 via-[#1C1D20]/20 to-[#1C1D20] lg:bg-gradient-to-r lg:from-transparent lg:via-[#1C1D20]/25 lg:to-[#1C1D20]"}`} />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute left-4 top-4 inline-flex rounded-full border border-accent/40 bg-black/70 p-2 text-accent shadow-lg shadow-black/20">{service.icon}</div>
                      <p className="absolute right-4 top-4 text-xs font-bold text-accent drop-shadow-sm">{service.number}</p>
                    </div>
                    <div className={`relative z-10 mt-auto bg-gradient-to-t from-[#1C1D20] via-[#1C1D20]/94 to-transparent px-5 pb-5 pt-20 sm:mt-0 sm:bg-[#1C1D20] sm:px-5 sm:py-6 lg:flex lg:flex-col lg:justify-center lg:px-8 lg:py-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent sm:mb-1.5 sm:text-xs">VLI service</p>
                      <h3 className="mb-2 text-xl font-bold leading-tight tracking-[-0.03em] text-white md:text-3xl">{service.title}</h3>
                      <p className="line-clamp-3 max-w-2xl text-sm leading-6 text-white/80 sm:line-clamp-2 md:line-clamp-3 md:text-base md:leading-7">{service.description}</p>
                      <dl data-testid="service-guidance" className="sr-only sm:mt-3 sm:grid sm:max-w-2xl sm:grid-cols-2 sm:gap-1.5 sm:text-[0.68rem] sm:leading-4 md:text-xs">
                        <div className="rounded-md border border-white/10 bg-black/15 px-2 py-1.5"><dt className="font-semibold uppercase tracking-[0.1em] text-accent">Estimated duration</dt><dd className="mt-1 text-white/75">{service.duration}</dd></div>
                        <div className="rounded-md border border-white/10 bg-black/15 px-2 py-1.5"><dt className="font-semibold uppercase tracking-[0.1em] text-accent">Pricing guidance</dt><dd className="mt-1 text-white/75">{service.pricing}</dd></div>
                      </dl>
                      <button type="button" data-testid={`service-enquiry-trigger-${service.number}`} onClick={(event) => { event.stopPropagation(); openServiceEnquiry(service.title); }} className="sr-only sm:mt-3 sm:inline-flex sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-white/50 sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-white sm:transition-colors sm:hover:border-accent sm:hover:bg-accent sm:hover:text-black">Discuss this service <ArrowRight size={17} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#27282B] py-16 md:py-24"><div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div className="max-w-2xl"><div className="mb-4 h-1 w-12 bg-accent" /><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Start a conversation</p><h2 className="velocity-headline mb-4 text-white">Not sure which service is right?</h2><p className="text-lg leading-8 text-white/70">Tell us where you are now and what you want to improve. We can help shape the next practical step.</p></div><a href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Talk to the team <ArrowRight size={18} /></a></div></section>
      </main>
      <ServiceEnquiryDialog service={selectedService} onOpenChange={(open) => { if (!open) setSelectedService(null); }} />
      <SiteFooter />
    </div>
  );
}
