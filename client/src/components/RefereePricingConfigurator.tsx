import { ArrowRight, CheckCircle2, CircleX, Sparkles } from "lucide-react";
import { useState } from "react";
import PricingRequestDialog from "@/components/PricingRequestDialog";
import { getPricingSelectionLabel, pricingTiers, type PricingTierId } from "@/lib/pricingConfig";
import { pricingVisibilityClass } from "@/lib/pricingPresentation";

export const pricingCardDetailPresentation = "included-and-excluded-details";

export default function RefereePricingConfigurator() {
  const [selectedTier, setSelectedTier] = useState<PricingTierId>("managed");
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedTierDetails = pricingTiers.find((tier) => tier.id === selectedTier) ?? pricingTiers[0];
  const selectionLabel = getPricingSelectionLabel(selectedTier);

  const openPricingRequest = () => setDialogOpen(true);

  return (
    <section id="pricing" className={`${pricingVisibilityClass} border-y border-white/10 bg-black py-12 md:py-16`}>
      <div className="container">
        <div data-reveal className="reveal-up mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-4 flex justify-center"><div className="h-1 w-12 bg-accent" /></div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Event delivery options</p>
          <h2 className="velocity-headline mb-4 text-white">Choose the operating model that fits <span className="text-accent">your event.</span></h2>
          <p className="leading-7 text-white/75">Select a delivery model, then request an event proposal for your venue, number of cages, competition format, and timeline.</p>
        </div>

        <div data-reveal className="reveal-up mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">1. Select an event delivery model</p><h3 className="velocity-headline text-white">Choose your operating starting point.</h3></div>
          <button type="button" onClick={() => openPricingRequest()} className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/60 px-5 py-3 font-semibold text-accent transition-colors hover:bg-accent hover:text-black">Request event proposal <ArrowRight size={18} /></button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const selected = selectedTier === tier.id;
            return (
              <button key={tier.id} type="button" data-testid={`pricing-tier-${tier.id}`} data-detail-presentation={pricingCardDetailPresentation} aria-pressed={selected} onClick={() => setSelectedTier(tier.id)} className={`group relative min-h-0 overflow-hidden border p-5 text-left transition-all ${selected ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(64,224,208,0.15)]" : "border-white/10 bg-[#27282B] hover:border-white/35"}`}>
                {selected && <span className="absolute right-3 top-3 rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-black sm:right-5 sm:top-5 sm:px-2.5 sm:py-1 sm:text-[0.7rem]">Selected</span>}
                <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"><Sparkles size={19} /></div>
                <div className="mb-2 flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{tier.eyebrow}</p>{tier.recommended && <span className="rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-accent">Recommended</span>}</div>
                <h4 className="text-3xl font-bold tracking-tight text-white">{tier.name}</h4>
                <div className="mt-4 flex items-end gap-2"><p data-testid={`pricing-price-${tier.id}`} className="text-2xl font-bold tracking-tight text-accent">{tier.price}</p><p className="pb-0.5 text-sm text-white/55">{tier.priceUnit}</p></div>
                <p className="mt-3 leading-6 text-white/70">{tier.description}</p>
                <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  {tier.details.map((detail) => (
                    <div key={detail.title} className="flex items-start gap-3 text-left">
                      {detail.included ? <CheckCircle2 aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-accent" /> : <CircleX aria-hidden="true" size={19} className="mt-0.5 shrink-0 text-white/35" />}
                      <div><p className={`text-sm font-semibold ${detail.included ? "text-white" : "text-white/55"}`}>{detail.title}</p><p className={`mt-0.5 text-xs leading-5 ${detail.included ? "text-white/70" : "text-white/45"}`}>{detail.text}</p></div>
                    </div>
                  ))}
                </div>
                <div className={`mt-5 text-sm font-semibold ${selected ? "text-accent" : "text-white/65 group-hover:text-white"}`}>{selected ? "Selected starting point" : `Select ${tier.name}`}</div>
              </button>
            );
          })}
        </div>

        <div data-reveal className="reveal-up mt-8 grid gap-5 rounded-lg bg-white p-5 text-black lg:grid-cols-[1fr_auto] lg:items-center md:p-7">
          <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-black/55">Selected delivery model</p><h3 className="velocity-headline mb-4 text-black">{selectionLabel}</h3><p className="max-w-2xl text-lg leading-8 text-black/65">You are reviewing {selectedTierDetails.name}. Request an event proposal to align the package with your venue, number of cages, programme timeline, and decision-support requirements.</p></div>
          <button type="button" onClick={openPricingRequest} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 font-semibold text-white transition-colors hover:bg-accent hover:text-black">Request event proposal <ArrowRight size={18} /></button>
        </div>
      </div>
      <PricingRequestDialog open={dialogOpen} onOpenChange={setDialogOpen} tierId={selectedTier} onTierChange={setSelectedTier} />
    </section>
  );
}
