import React, { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ServiceEnquiryDialog from "@/components/ServiceEnquiryDialog";
import { localizedPath } from "@/lib/seo";
import { renderServiceMarkdown, visibleServices, type ServiceContentRecord } from "@/lib/serviceContent";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Camera, ChevronDown, ExternalLink, GraduationCap, SlidersHorizontal, Wrench } from "lucide-react";

const serviceIcons = {
  wrench: Wrench,
  sliders: SlidersHorizontal,
  graduation: GraduationCap,
  camera: Camera,
} as const;

/** Service cards come from content/services/*.md. `title.en` is also the value sent with service enquiries. */
export const serviceBanners = visibleServices.map((service, index) => ({
  id: service.id,
  number: String(index + 1).padStart(2, "0"),
  title: service.title.en,
  enquiryForm: service.enquiryForm,
  thumbnail: service.image,
  record: service,
}));

export const mobileServiceCardAspectRatio = "1:1";
export const serviceImagePanelClassName = "absolute inset-0 h-full overflow-hidden sm:relative sm:h-72 lg:h-full";
export const serviceImageClassName = "h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105";
export const publicServiceCatalogueSource = "markdown-content-services";
export const serviceCardInteraction = "click-toggles-markdown-description";
export const servicesHeroPresentation = {
  introductoryParagraph: "removed",
} as const;

export const detailedServicePricingSheet = {
  serviceTitle: "Drone Photo / Cinematography",
  embedHref: "https://docs.google.com/spreadsheets/d/1pgINM3xf6ZbeMtfgLgd6kfBXSpe33T6iwcAmqn1T3-g/preview?rm=minimal",
  href: "https://docs.google.com/spreadsheets/d/1pgINM3xf6ZbeMtfgLgd6kfBXSpe33T6iwcAmqn1T3-g/edit?usp=sharing",
  label: "Detailed service pricing",
  description: "View the current public price book directly below.",
  ariaLabel: "Open detailed service pricing in Google Sheets (opens in a new tab)",
} as const;

export default function Services() {
  const { language } = useWebsiteLanguage();
  const [selectedService, setSelectedService] = useState<{ title: string; enquiryForm: ServiceContentRecord["enquiryForm"] } | null>(null);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const copy = language === "zh-Hant"
    ? { service: "VLI 服務", duration: "預計所需時間", pricing: "價格指引", discuss: "討論此服務", showDetails: "查看詳情", hideDetails: "收起詳情" }
    : { service: "VLI service", duration: "Estimated duration", pricing: "Pricing guidance", discuss: "Discuss this service", showDetails: "View details", hideDetails: "Hide details" };

  const toggleService = (id: string) => setExpandedServiceId((current) => current === id ? null : id);
  const openServiceEnquiry = (service: (typeof serviceBanners)[number]) => setSelectedService({ title: service.title, enquiryForm: service.enquiryForm });

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="services" />
      <main data-reveal-page className="pt-16">
        <section data-testid="services-page-hero" className="border-b border-white/10 bg-[radial-gradient(circle_at_28%_20%,rgba(64,224,208,0.17),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)] py-8"><div className="container"><div data-reveal className="reveal-up max-w-3xl"><div className="mb-3 h-1 w-12 bg-accent" /><p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">VLI services</p><h1 className="velocity-headline !text-4xl text-white md:!text-5xl">Build skill.<br /><span className="text-accent">Fly with purpose.</span></h1></div></div></section>

        <section className="velocity-section bg-black">
          <div className="container">
            <div data-reveal className="reveal-up mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Service options</p>
              <h2 className="velocity-headline text-white">Choose the support that fits your next step.</h2>
            </div>
            <div className="space-y-4">
              {serviceBanners.map((service, index) => {
                const { record } = service;
                const Icon = serviceIcons[record.icon as keyof typeof serviceIcons] ?? Wrench;
                const expanded = expandedServiceId === service.id;
                const detailId = `service-detail-${service.id}`;
                return (
                  <div key={service.id} data-reveal data-revealed="" data-testid={`service-item-${service.number}`} className="reveal-up" style={{ transitionDelay: `${index * 70}ms` }}>
                    <article data-testid={`service-card-${service.number}`} data-mobile-aspect-ratio={mobileServiceCardAspectRatio} data-expanded={expanded} onClick={() => toggleService(service.id)} className={`group relative aspect-square min-h-0 cursor-pointer overflow-hidden rounded-lg border bg-[#1C1D20] transition-all duration-300 hover:border-accent/60 hover:shadow-[0_18px_48px_rgba(64,224,208,0.1)] sm:aspect-auto sm:min-h-[30rem] lg:min-h-[20rem] ${expanded ? "border-accent/60" : "border-white/10"}`}>
                      <div className="grid h-full lg:h-[20rem] lg:grid-cols-2 lg:items-stretch">
                        <div data-testid="service-image-panel" className={`${serviceImagePanelClassName} ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                          <img src={record.image} alt={record.imageAlt[language]} loading="lazy" decoding="async" className={serviceImageClassName} />
                          <div data-testid="service-image-fade" className={`absolute inset-0 ${index % 2 === 1 ? "bg-gradient-to-b from-black/10 via-[#1C1D20]/20 to-[#1C1D20] lg:bg-gradient-to-l lg:from-transparent lg:via-[#1C1D20]/25 lg:to-[#1C1D20]" : "bg-gradient-to-b from-black/10 via-[#1C1D20]/20 to-[#1C1D20] lg:bg-gradient-to-r lg:from-transparent lg:via-[#1C1D20]/25 lg:to-[#1C1D20]"}`} />
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute left-4 top-4 inline-flex rounded-full border border-accent/40 bg-black/70 p-2 text-accent shadow-lg shadow-black/20"><Icon size={34} /></div>
                          <p className="absolute right-4 top-4 text-xs font-bold text-accent drop-shadow-sm">{service.number}</p>
                        </div>
                        <div className={`relative z-10 mt-auto bg-gradient-to-t from-[#1C1D20] via-[#1C1D20]/94 to-transparent px-5 pb-5 pt-20 sm:mt-0 sm:bg-[#1C1D20] sm:px-5 sm:py-6 lg:flex lg:flex-col lg:justify-center lg:px-8 lg:py-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent sm:mb-1.5 sm:text-xs">{copy.service}</p>
                          <h3 className="mb-2 text-xl font-bold leading-tight tracking-[-0.03em] text-white md:text-3xl">{record.title[language]}</h3>
                          <p className="line-clamp-3 max-w-2xl text-sm leading-6 text-white/80 sm:line-clamp-2 md:line-clamp-3 md:text-base md:leading-7">{record.summary[language]}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button type="button" data-testid={`service-detail-toggle-${service.number}`} aria-expanded={expanded} aria-controls={detailId} onClick={(event) => { event.stopPropagation(); toggleService(service.id); }} className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-black">{/* Keyed so React swaps the element; WebsiteTranslationObserver restores edited text nodes to their first value. */}<span key={expanded ? "hide" : "show"}>{expanded ? copy.hideDetails : copy.showDetails}</span><ChevronDown size={17} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} /></button>
                            <button type="button" data-testid={`service-enquiry-trigger-${service.number}`} onClick={(event) => { event.stopPropagation(); openServiceEnquiry(service); }} className="sr-only sm:not-sr-only sm:inline-flex sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-white/50 sm:px-4 sm:py-2 sm:text-sm sm:font-semibold sm:text-white sm:transition-colors sm:hover:border-accent sm:hover:bg-accent sm:hover:text-black">{copy.discuss} <ArrowRight size={17} /></button>
                          </div>
                        </div>
                      </div>
                    </article>
                    <div id={detailId} data-testid={`service-detail-${service.number}`} aria-hidden={!expanded} inert={!expanded} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <div className="mt-2 rounded-lg border border-accent/30 bg-[#111215] p-5 sm:p-7 lg:p-8">
                          <div className="blog-prose max-w-3xl !text-base" dangerouslySetInnerHTML={{ __html: renderServiceMarkdown(record.body[language]) }} />
                          {(record.duration[language] || record.pricing[language]) ? (
                            <dl data-testid="service-guidance" className="mt-6 grid max-w-3xl gap-3 text-sm leading-6 sm:grid-cols-2">
                              {record.duration[language] ? <div className="rounded-md border border-white/10 bg-black/20 px-4 py-3"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{copy.duration}</dt><dd className="mt-1 text-white/75">{record.duration[language]}</dd></div> : null}
                              {record.pricing[language] ? <div className="rounded-md border border-white/10 bg-black/20 px-4 py-3"><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{copy.pricing}</dt><dd className="mt-1 text-white/75">{record.pricing[language]}</dd></div> : null}
                            </dl>
                          ) : null}
                          <button type="button" data-testid={`service-detail-enquiry-${service.number}`} onClick={() => openServiceEnquiry(service)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">{copy.discuss} <ArrowRight size={17} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <section data-testid="service-pricing-sheet-viewer" data-reveal className="reveal-up relative z-10 overflow-hidden rounded-lg border border-white/10 bg-[#111215] p-4 sm:p-6 lg:p-8">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{detailedServicePricingSheet.label}</p><p className="mt-1 text-sm leading-6 text-white/65">{detailedServicePricingSheet.description}</p></div>
                  <a data-testid="service-pricing-sheet-fallback" href={detailedServicePricingSheet.href} target="_blank" rel="noopener noreferrer" aria-label={detailedServicePricingSheet.ariaLabel} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-accent/60 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111215]">Open in Google Sheets <ExternalLink size={16} aria-hidden="true" /></a>
                </div>
                <div className="overflow-hidden rounded-md border border-white/10 bg-white">
                  <iframe data-testid="service-pricing-sheet-iframe" src={detailedServicePricingSheet.embedHref} title={language === "zh-Hant" ? "詳細服務價目表試算表" : "Detailed service pricing spreadsheet"} loading="eager" className="h-[32rem] w-full border-0 sm:h-[38rem]" />
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#27282B] py-16 md:py-24"><div data-reveal className="container reveal-up flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"><div className="max-w-2xl"><div className="mb-4 h-1 w-12 bg-accent" /><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Start a conversation</p><h2 className="velocity-headline mb-4 text-white">Not sure which service is right?</h2><p className="text-lg leading-8 text-white/70">Tell us where you are now and what you want to improve. We can help shape the next practical step.</p></div><a href={localizedPath("/contact", language)} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">Talk to the team <ArrowRight size={18} /></a></div></section>
      </main>
      <ServiceEnquiryDialog service={selectedService?.title ?? null} enquiryForm={selectedService?.enquiryForm} onOpenChange={(open) => { if (!open) setSelectedService(null); }} />
      <SiteFooter />
    </div>
  );
}
