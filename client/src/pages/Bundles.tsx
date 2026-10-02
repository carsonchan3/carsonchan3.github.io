import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CartPricingDialog, { type CartPricingSelection } from "@/components/CartPricingDialog";
import ProductSectionNav from "@/components/ProductSectionNav";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { renderBundleLine, visibleBundles, type BundleContentRecord } from "@/lib/bundleContent";
import { trackConversion } from "@/lib/conversionTracking";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";
import { equipmentPricingNote } from "./Equipment";

/** The quote line sent with a bundle request, in English for the enquiry inbox. */
export function bundleQuoteLine(bundle: BundleContentRecord): CartPricingSelection {
  const option = bundle.optionPrice ? ` (option: ${bundle.optionPrice} ${bundle.optionPriceNote.en})` : "";
  return {
    sourceId: `bundle-${bundle.id}`,
    name: `${bundle.title.en} (bundle)`,
    model: bundle.tagline.en,
    category: "Bundle",
    price: `${bundle.price}${bundle.priceNote.en ? ` ${bundle.priceNote.en.toLowerCase()}` : ""}${option}`,
    quantity: 1,
  };
}

export default function Bundles() {
  const { language } = useWebsiteLanguage();
  const [requestedBundle, setRequestedBundle] = useState<BundleContentRecord | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const copy = language === "zh-Hant"
    ? {
      eyebrow: "學校無人機足球套裝",
      title: "由課室到校際賽，一步到位。",
      intro: "為學校預先配置的無人機足球套裝：器材、電池、充電、培訓及支援已配搭妥當，並附分項報價，方便採購及申請資助。",
      featured: "最受歡迎",
      included: "套裝包括",
      customEyebrow: "想自行配搭？",
      customTitle: "由產品目錄逐件揀選。",
      customBody: "每件器材都可以單獨加入報價清單，或告訴我們您的需要，我們為您配置。",
      browse: "瀏覽產品",
      talk: "與團隊商討",
    }
    : {
      eyebrow: "Drone soccer bundles for schools",
      title: "From classroom to inter-school cup.",
      intro: "Ready-to-order drone soccer packs for schools, with drones, batteries, charging, teacher training and support already matched, plus an itemised quotation for procurement and funding applications.",
      featured: "Most popular",
      included: "What's included",
      customEyebrow: "Prefer to build your own?",
      customTitle: "Pick items from the product catalogue.",
      customBody: "Every item can be added to your quote cart individually, or tell us what you need and we will configure it for you.",
      browse: "Browse products",
      talk: "Talk to the team",
    };

  const requestBundle = (bundle: BundleContentRecord) => {
    trackConversion("quote_request_start", { source: `bundle_${bundle.id}`, language });
    setRequestedBundle(bundle);
    setRequestOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="product" />
      <main className="pt-16">
        <section className="bg-black pb-20 pt-12 md:pb-28 md:pt-16">
          <div className="container">
            <ProductSectionNav active="bundles" />
            <div data-reveal className="reveal-up mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{copy.eyebrow}</p><h1 className="velocity-headline text-white">{copy.title}</h1></div><p className="max-w-lg text-white/65">{copy.intro}</p></div>
            <div className="mb-8 sm:mb-10"><p className="border-l-2 border-accent/70 bg-[#101113] px-4 py-3 text-sm leading-6 text-white/70 sm:px-5">{equipmentPricingNote[language]}</p></div>

            <div data-testid="bundle-grid" className="grid items-stretch gap-5 lg:grid-cols-3">
              {visibleBundles.map((bundle, index) => (
                <article key={bundle.id} data-testid="bundle-card" data-featured={bundle.featured} data-reveal className={`reveal-up relative flex flex-col overflow-hidden rounded-xl border bg-[#27282B] transition-all duration-300 hover:-translate-y-1 ${bundle.featured ? "border-accent/70 shadow-[0_24px_60px_rgba(64,224,208,0.14)]" : "border-white/10 hover:border-accent/50"}`} style={{ transitionDelay: `${index * 70}ms` }}>
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#161719]">
                    <img src={bundle.image} alt={bundle.imageAlt[language]} loading={index < 3 ? "eager" : "lazy"} decoding="async" className="size-full object-cover" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#27282B] via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-accent">{String(index + 1).padStart(2, "0")}</span>
                    {bundle.featured ? <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-black"><Sparkles size={13} aria-hidden="true" />{copy.featured}</span> : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-7">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{bundle.tagline[language]}</p>
                    <h2 className="mb-3 text-2xl font-bold leading-tight tracking-[-0.02em] text-white">{bundle.title[language]}</h2>
                    <p className="text-sm leading-6 text-white/70 sm:text-base sm:leading-7">{bundle.summary[language]}</p>

                    <div data-testid="bundle-price" className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4">
                      <p className="text-3xl font-bold tracking-[-0.02em] text-white">{bundle.price}</p>
                      {bundle.priceNote[language] ? <p className="mt-1 text-sm text-white/60">{bundle.priceNote[language]}</p> : null}
                      {bundle.optionPrice ? <p className="mt-3 border-t border-white/10 pt-3 text-sm text-white/75"><span className="font-semibold text-accent">{bundle.optionPrice}</span> <span className="text-white/60">{bundle.optionPriceNote[language]}</span></p> : null}
                    </div>

                    <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{copy.included}</p>
                    <ul className="mb-7 space-y-2.5">
                      {bundle.includes[language].map((line) => (
                        <li key={line} className="flex gap-3 text-sm leading-6 text-white/80">
                          <Check size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                          <span className="[&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/50 [&_a]:underline-offset-4 [&_a:hover]:text-white" dangerouslySetInnerHTML={{ __html: renderBundleLine(line, language) }} />
                        </li>
                      ))}
                    </ul>

                    <button type="button" data-testid="bundle-request" onClick={() => requestBundle(bundle)} className={`mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${bundle.featured ? "bg-accent text-black hover:opacity-90" : "border border-accent/50 text-accent hover:bg-accent hover:text-black"}`}>{bundle.cta[language]} <ArrowRight size={16} /></button>
                  </div>
                </article>
              ))}
            </div>

            <article data-reveal className="reveal-up mt-8 grid items-center gap-6 rounded-lg border border-white/10 bg-[#161719] p-6 sm:mt-10 sm:p-8 lg:grid-cols-[1fr_auto] lg:gap-10">
              <div className="max-w-2xl"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{copy.customEyebrow}</p><h2 className="velocity-subheading mb-2 text-white">{copy.customTitle}</h2><p className="leading-7 text-white/65">{copy.customBody}</p></div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a href={staticSitePath(localizedPath("/product", language))} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">{copy.browse} <ArrowRight size={17} /></a>
                <a href={staticSitePath(localizedPath("/contact", language))} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent">{copy.talk}</a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <CartPricingDialog items={requestedBundle ? [bundleQuoteLine(requestedBundle)] : []} open={requestOpen} onOpenChange={setRequestOpen} onSubmitted={() => setRequestOpen(false)} />
      <SiteFooter />
    </div>
  );
}
