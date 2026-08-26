import { ArrowRight, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import PricingRequestDialog from "@/components/PricingRequestDialog";
import { getPricingSelectionLabel, pricingTiers, type PricingTierId } from "@/lib/pricingConfig";
import { pricingVisibilityClass } from "@/lib/pricingPresentation";

export const pricingCardDetailPresentation = "scenario-led-progressive-details";
export const pricingTierCardPresentation = "rounded-option-cards";
export const pricingFamilyPresentation = "unified-quiet-service-family";

export default function RefereePricingConfigurator() {
  const [selectedTier, setSelectedTier] = useState<PricingTierId>("managed");
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedTierDetails = pricingTiers.find((tier) => tier.id === selectedTier) ?? pricingTiers[0];
  const selectionLabel = getPricingSelectionLabel(selectedTier);
  const openPricingRequest = () => setDialogOpen(true);

  return (
    <section id="pricing" className={`${pricingVisibilityClass} border-y border-white/10 bg-black py-12 md:py-16`}>
      <div className="container">
        <div data-reveal className="reveal-up mx-auto mb-9 max-w-3xl text-center">
          <div className="mb-4 flex justify-center"><div className="h-1 w-12 bg-accent" /></div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Event delivery options</p>
          <h2 className="velocity-headline text-white">Choose the support your <span className="text-accent">event needs.</span></h2>
          <p className="mt-4 leading-7 text-white/75">Start with the delivery outcome that best fits your venue, event team, and level of decision support.</p>
        </div>

        <div data-presentation={pricingFamilyPresentation} className="rounded-[1.75rem] border border-white/10 bg-[#0B1419] p-3 shadow-[0_20px_55px_rgba(0,0,0,0.22)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-3">
            {pricingTiers.map((tier) => {
              const selected = selectedTier === tier.id;
              return (
                <button key={tier.id} type="button" data-testid={`pricing-tier-${tier.id}`} data-detail-presentation={pricingCardDetailPresentation} data-card-presentation={pricingTierCardPresentation} aria-pressed={selected} onClick={() => setSelectedTier(tier.id)} className={`group relative min-h-0 overflow-hidden rounded-[1.25rem] border p-5 text-left transition-all duration-200 ${selected ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(64,224,208,0.15)]" : "border-white/8 bg-black/10 hover:border-white/25 hover:bg-white/[0.035]"}`}>
                  {selected && <span className="absolute right-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-black">Selected</span>}
                  <div className="mb-5 flex size-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"><Sparkles size={19} /></div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tier.eyebrow}</p>
                  <h3 className="mt-3 max-w-[16rem] text-xl font-semibold tracking-tight text-white">{tier.scenario}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">{tier.description}</p>
                  <div className="mt-6 flex items-end gap-2"><p data-testid={`pricing-price-${tier.id}`} className="text-2xl font-bold tracking-tight text-accent">{tier.price}</p><p className="pb-0.5 text-sm text-white/55">{tier.priceUnit}</p></div>
                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                    {tier.features.slice(0, 3).map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-5 text-white/75"><CheckCircle2 aria-hidden="true" size={16} className="mt-0.5 shrink-0 text-accent" />{feature}</li>)}
                  </ul>
                  <p className={`mt-6 text-sm font-semibold ${selected ? "text-accent" : "text-white/65 group-hover:text-white"}`}>{selected ? "Selected support" : `Select ${tier.name}`}</p>
                </button>
              );
            })}
          </div>
        </div>

        <details data-reveal className="reveal-up group mt-6 overflow-hidden rounded-lg border border-white/10 bg-[#171C1D]" style={{ transitionDelay: "70ms" }}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-left"><span><span className="block text-xs font-semibold uppercase tracking-[0.18em] text-accent">For detailed planning</span><span className="mt-1.5 block font-semibold text-white">Compare all service inclusions</span></span><ChevronDown aria-hidden="true" className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180" /></summary>
          <div className="grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-3">
            {pricingTiers.map((tier) => <div key={tier.id} className="bg-[#171C1D] p-5"><h3 className="font-semibold text-white">{tier.name}</h3><p className="mt-1 text-xs text-white/55">{tier.scenario}</p><div className="mt-5 space-y-3">{tier.details.map((detail) => <div key={detail.title} className="flex items-start gap-2"><CheckCircle2 aria-hidden="true" size={15} className={`mt-0.5 shrink-0 ${detail.included ? "text-accent" : "text-white/30"}`} /><p className={`text-xs leading-5 ${detail.included ? "text-white/70" : "text-white/45"}`}><span className="font-semibold text-white/90">{detail.title}.</span> {detail.text}</p></div>)}</div></div>)}
          </div>
        </details>

        <div data-reveal className="reveal-up mt-6 grid gap-5 rounded-lg bg-white p-5 text-black lg:grid-cols-[1fr_auto] lg:items-center md:p-7">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/55">Selected event support</p><h3 className="velocity-headline text-black">{selectionLabel}</h3><p className="mt-3 max-w-2xl text-lg leading-8 text-black/65">{selectedTierDetails.scenario}. Share your venue, cage count, format, and schedule so we can scope the right delivery path.</p></div>
          <button type="button" onClick={openPricingRequest} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-semibold text-white transition-colors hover:bg-accent hover:text-black">Plan your event <ArrowRight size={18} /></button>
        </div>
      </div>
      <PricingRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} tierId={selectedTier} onTierChange={setSelectedTier} />
    </section>
  );
}
