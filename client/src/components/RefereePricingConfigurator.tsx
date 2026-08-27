import { ArrowRight, CheckCircle2, ChevronDown, Settings2, Trophy, Users } from "lucide-react";
import { useState } from "react";
import PricingRequestDialog from "@/components/PricingRequestDialog";
import { getPricingSelectionLabel, pricingTiers, type PricingTierId } from "@/lib/pricingConfig";
import { pricingVisibilityClass } from "@/lib/pricingPresentation";

export const pricingCardDetailPresentation = "scenario-led-progressive-details";
export const pricingTierCardPresentation = "rounded-option-cards";
export const pricingFamilyPresentation = "light-utility-service-family";
export const pricingTierIconPresentation = ["Settings2", "Users", "Trophy"] as const;
export const eventFitPlanningInputs = ["Venue and cage count", "Match format", "Programme schedule", "Delivery support"] as const;

const pricingTierIcons = {
  assist: Settings2,
  managed: Users,
  "evidence-pro": Trophy,
} as const;

export default function RefereePricingConfigurator() {
  const [selectedTier, setSelectedTier] = useState<PricingTierId>("managed");
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedTierDetails = pricingTiers.find((tier) => tier.id === selectedTier) ?? pricingTiers[0];
  const selectionLabel = getPricingSelectionLabel(selectedTier);
  const openPricingRequest = () => setDialogOpen(true);

  return (
    <section id="pricing" className={`${pricingVisibilityClass} border-y border-[#071117]/10 bg-white py-14 text-[#071117] md:py-24`}>
      <div className="container">
        <div data-reveal className="reveal-up mx-auto mb-9 max-w-3xl text-center">
          <div className="mb-4 flex justify-center"><div className="h-1 w-12 bg-accent" /></div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Event delivery options</p>
          <h2 className="velocity-headline text-[#071117]">Choose the support your <span className="text-accent">event needs.</span></h2>
          <p className="mt-4 leading-7 text-[#071117]/70">Start with the delivery outcome that best fits your venue, event team, and level of decision support.</p>
        </div>

        <aside data-testid="event-fit-panel" data-reveal className="reveal-up mx-auto mb-8 max-w-5xl rounded-[1.5rem] border border-[#071117]/10 bg-[#EEF5F3] p-5 sm:p-7">
          <div className="grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Event fit</p><h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#071117] sm:text-3xl">Scope your event before the quote.</h3></div><p className="text-sm leading-7 text-[#071117]/70">Share your venue, cage count, match format, programme schedule, and required level of delivery support. Your selected package remains part of the request.</p></div>
          <div className="mt-6 grid gap-2 border-t border-[#071117]/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">{eventFitPlanningInputs.map((input, index) => <div key={input} className="flex items-center gap-2 text-sm font-semibold text-[#071117]/80"><span className="font-mono text-xs text-accent">0{index + 1}</span>{input}</div>)}</div>
        </aside>

        <div data-presentation={pricingFamilyPresentation} className="rounded-[1.75rem] border border-[#071117]/10 bg-[#EEF5F3] p-3 shadow-[0_20px_55px_rgba(7,17,23,0.12)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-3">
            {pricingTiers.map((tier) => {
              const selected = selectedTier === tier.id;
              const Icon = pricingTierIcons[tier.id];
              return (
                <button key={tier.id} type="button" data-testid={`pricing-tier-${tier.id}`} data-detail-presentation={pricingCardDetailPresentation} data-card-presentation={pricingTierCardPresentation} aria-pressed={selected} onClick={() => setSelectedTier(tier.id)} className={`group relative min-h-0 overflow-hidden rounded-[1.25rem] border p-5 text-left transition-all duration-200 ${selected ? "border-accent bg-[#DDF7F1] shadow-[0_0_0_1px_rgba(64,224,208,0.24)]" : "border-[#071117]/10 bg-white hover:border-[#071117]/25 hover:bg-[#FBFDFC]"}`}>
                  {selected && <span className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-black">Selected</span>}
                  <div className="mb-5 flex size-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"><Icon aria-hidden="true" size={19} strokeWidth={1.8} /></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tier.eyebrow}</p>
                  <h3 className="mt-3 max-w-[16rem] text-xl font-semibold tracking-tight text-[#071117]">{tier.scenario}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#071117]/65">{tier.description}</p>
                  <div className="mt-6 flex items-end gap-2"><p data-testid={`pricing-price-${tier.id}`} className="text-2xl font-bold tracking-tight text-[#071117]">{tier.price}</p><p className="pb-0.5 text-sm text-[#071117]/55">{tier.priceUnit}</p></div>
                  <ul className="mt-5 space-y-2 border-t border-[#071117]/10 pt-4">
                    {tier.features.slice(0, 3).map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-5 text-[#071117]/75"><CheckCircle2 aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-accent" />{feature}</li>)}
                  </ul>
                  <p className={`mt-6 text-sm font-semibold ${selected ? "text-[#071117]" : "text-[#071117]/65 group-hover:text-[#071117]"}`}>{selected ? "Selected support" : `Select ${tier.name}`}</p>
                </button>
              );
            })}
          </div>
        </div>

        <details data-reveal className="reveal-up group mt-6 overflow-hidden rounded-xl border border-[#071117]/10 bg-[#EEF5F3]" style={{ transitionDelay: "70ms" }}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-left"><span><span className="block text-xs font-semibold uppercase tracking-[0.18em] text-accent">For detailed planning</span><span className="mt-1.5 block font-semibold text-[#071117]">Compare all service inclusions</span></span><ChevronDown aria-hidden="true" className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" /></summary>
          <div className="grid gap-px border-t border-[#071117]/10 bg-[#071117]/10 lg:grid-cols-3">
            {pricingTiers.map((tier) => <div key={tier.id} className="bg-white p-5"><h3 className="font-semibold text-[#071117]">{tier.name}</h3><p className="mt-1 text-xs text-[#071117]/55">{tier.scenario}</p><div className="mt-5 space-y-3">{tier.details.map((detail) => <div key={detail.title} className="flex items-start gap-2"><CheckCircle2 aria-hidden="true" size={15} className={`mt-0.5 shrink-0 ${detail.included ? "text-accent" : "text-[#071117]/30"}`} /><p className={`text-xs leading-5 ${detail.included ? "text-[#071117]/70" : "text-[#071117]/45"}`}><span className="font-semibold text-[#071117]/90">{detail.title}.</span> {detail.text}</p></div>)}</div></div>)}
          </div>
        </details>

        <div data-reveal className="reveal-up mt-6 grid gap-5 rounded-[1.5rem] bg-[#071117] p-5 text-white lg:grid-cols-[1fr_auto] lg:items-center md:p-7">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Selected event support</p><h3 className="velocity-headline text-white">{selectionLabel}</h3><p className="mt-3 max-w-2xl text-lg leading-8 text-white/70">{selectedTierDetails.scenario}. Share your venue, cage count, format, and schedule so we can scope the right delivery path.</p></div>
          <button type="button" onClick={openPricingRequest} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90">Request an event scope <ArrowRight size={18} /></button>
        </div>
      </div>
      <PricingRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} tierId={selectedTier} onTierChange={setSelectedTier} />
    </section>
  );
}
