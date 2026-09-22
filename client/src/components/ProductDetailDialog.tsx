import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Box, Check, Gauge, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";
import { getPremiumProductContent } from "@/lib/productContent";
import { useEffect, useMemo, useState } from "react";

export type ProductVariant = {
  sourceId: string;
  number: string;
  label: string;
  name: string;
  model: string;
  description: string;
  price: string;
  tier1Price?: string;
  tier2Price?: string;
  vliCarePrice?: string;
  image: string;
  fallbackImage?: string;
  imageAlt: string;
  /** Premium package this variant is sold as, set with variant.<id>.tier in content/products. */
  tier?: string;
};

export type ProductDetail = {
  familyId: string;
  reference: string;
  name: string;
  category: string;
  description: string;
  variants: ProductVariant[];
};

type ProductDetailDialogProps = {
  product: ProductDetail | null;
  onOpenChange: (open: boolean) => void;
  onAddToCart: (variant: ProductVariant, family: ProductDetail) => void;
};

export type PremiumTier = string;
export type PremiumTierContent = {
  label: string;
  subtitle: string;
  features: readonly string[];
};
export type PremiumProductContent = {
  testId: string;
  title: string;
  pitch: string;
  platformLabel: string;
  defaultTier: PremiumTier;
  tiers: Record<PremiumTier, PremiumTierContent>;
  specifications: readonly (readonly [string, string])[];
  inTheBox: readonly string[];
  /** Tiers that show the VLI CARE badge and activation code. */
  careTiers: readonly PremiumTier[];
  careTitle: string;
  careDescription: string;
};

export function getPremiumVariant(product: ProductDetail, tier: PremiumTier) {
  return product.variants.find((variant) => variant.tier === tier) ?? product.variants[0];
}

type EquipmentTier = "parts" | "verified";

function getDisplayedVariant(variant: ProductVariant, tier: EquipmentTier): ProductVariant {
  if (tier === "verified" && variant.tier2Price) return { ...variant, price: variant.tier2Price, label: `${variant.label} · Tier 2` };
  return { ...variant, price: variant.tier1Price ?? variant.price, label: tier === "parts" ? `${variant.label} · Tier 1` : variant.label };
}

function EquipmentTierOptions({ variant, selectedTier, onChange }: { variant: ProductVariant; selectedTier: EquipmentTier; onChange: (tier: EquipmentTier) => void }) {
  const { language } = useWebsiteLanguage();
  const isChinese = language === "zh-Hant";
  if (!variant.tier2Price) return null;
  const options = [
    { id: "parts" as const, label: isChinese ? "Tier 1 · 僅零件" : "Tier 1 · PARTS only", description: isChinese ? "僅供應零件，有限保養期最長 7 天。" : "Parts-only supply with a limited warranty up to 7 days.", price: variant.tier1Price ?? variant.price },
    { id: "verified" as const, label: isChinese ? "Tier 2 · VLI 驗證" : "Tier 2 · VLI-verified", description: isChinese ? "完成檢查及報告，並進行 PID 微調，保養期 21 天。" : "Checked, reported, and PID-tuned with a 21-day warranty.", price: variant.tier2Price },
  ];
  return <div className="mt-5" data-testid="equipment-tier-options"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{isChinese ? "選擇服務級別" : "Choose service tier"}</p><div className="grid gap-2 sm:grid-cols-2">{options.map((option) => <button type="button" key={option.id} aria-pressed={selectedTier === option.id} onClick={() => onChange(option.id)} className={`rounded-2xl border p-3 text-left transition-colors ${selectedTier === option.id ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}><span className="block text-sm font-semibold text-white">{option.label}</span><span className="mt-1 block min-h-10 text-xs leading-5 text-white/55">{option.description}</span><span className="mt-2 block text-sm font-semibold text-accent">{option.price}</span></button>)}</div>{variant.vliCarePrice ? <p className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-3 text-xs leading-5 text-white/65">{isChinese ? `VLI CARE 附加計劃：一年保障（最多兩次更換）及免費維修，涵蓋意外損壞、操作失誤、碰撞、進水及飛失事故。請透過支援電郵提交維修申請；運費不包括在內。價格：${variant.vliCarePrice}` : `VLI-CARE add-on: a 1-year service plan with up to 2 replacements and free repair for accidental damage, user error, collisions, water damage, and flyaway incidents. Submit a repair request through support email; shipping is not included. Price: ${variant.vliCarePrice}`}</p> : null}</div>;
}

function PremiumProductDetail({ product, selectedVariant, selectedTier, onTierChange, equipmentTier, onEquipmentTierChange, onAddToCart, content }: {
  product: ProductDetail;
  selectedVariant: ProductVariant;
  selectedTier: PremiumTier;
  onTierChange: (tier: PremiumTier) => void;
  equipmentTier: EquipmentTier;
  onEquipmentTierChange: (tier: EquipmentTier) => void;
  onAddToCart: (variant: ProductVariant, family: ProductDetail) => void;
  content: PremiumProductContent;
}) {
  const { language } = useWebsiteLanguage();
  const isChinese = language === "zh-Hant";
  const translate = (value: string) => isChinese ? traditionalChineseTranslations[value] ?? value : value;
  const tier = content.tiers[selectedTier] ?? content.tiers[content.defaultTier];
  const certified = content.careTiers.includes(selectedTier) && equipmentTier === "verified";
  const { careTitle, careDescription } = content;

  return (
    <div data-testid={content.testId} className="space-y-7">
      <div className="grid gap-7 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
        <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0B1419] p-6 sm:min-h-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_36%,rgba(48,224,202,0.18),transparent_36%),linear-gradient(145deg,rgba(7,17,23,0.98),rgba(11,20,25,0.7))]" />
          <img data-testid="product-detail-image" src={selectedVariant.image} alt={selectedVariant.imageAlt} onError={(event) => { if (selectedVariant.fallbackImage && event.currentTarget.src !== selectedVariant.fallbackImage) event.currentTarget.src = selectedVariant.fallbackImage; else { event.currentTarget.style.display = "none"; event.currentTarget.alt = ""; } }} className="relative z-10 max-h-72 w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]" />
          <span className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent"><Gauge size={13} /> {translate(content.platformLabel)}</span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{translate(product.category)}</p>
          <h2 data-testid="product-detail-title" className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">{translate(content.title)}</h2>
          <p data-testid="product-detail-description" className="mt-4 text-sm leading-7 text-white/70 sm:text-base">{translate(product.description)}</p>

          <div data-testid={`${content.testId}-tier-options`} className={`mt-6 grid gap-3 ${Object.keys(content.tiers).length > 1 ? "sm:grid-cols-2" : ""}`}>
            {(Object.keys(content.tiers) as PremiumTier[]).map((option) => {
              const optionContent = content.tiers[option];
              if (!optionContent) return null;
              const optionVariant = getPremiumVariant(product, option);
              const selected = option === selectedTier;
              const isRecommended = option === content.defaultTier;
              return (
                <button type="button" key={option} data-testid={`${content.testId}-tier-${option}`} aria-pressed={selected} onClick={() => onTierChange(option)} className={`relative rounded-2xl border p-4 text-left transition-colors ${selected ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}>
                  {isRecommended ? <span className="absolute -top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black">{translate("Recommended")}</span> : null}
                  <span className="block text-sm font-semibold text-white">{translate(optionContent.label)}</span>
                  <span className="mt-1 block min-h-10 text-xs leading-5 text-white/55">{translate(optionContent.subtitle)}</span>
                  <span className="mt-3 block text-lg font-semibold text-accent">{getDisplayedVariant(optionVariant, equipmentTier).price}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/40">{translate("Starting point")}</span>
                </button>
              );
            })}
          </div>

          <EquipmentTierOptions variant={selectedVariant} selectedTier={equipmentTier} onChange={onEquipmentTierChange} />

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3"><div className="mt-0.5 rounded-full bg-accent/15 p-2 text-accent"><Wrench size={16} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{translate(tier.label)}</p><p className="mt-2 text-sm leading-6 text-white/75">{translate(tier.subtitle)}</p><ul className="mt-3 space-y-2">{tier.features.map((feature) => <li key={feature} className="flex gap-2 text-xs leading-5 text-white/65"><Check size={15} className="mt-0.5 shrink-0 text-accent" />{translate(feature)}</li>)}</ul></div></div>
          </div>

          {certified ? <div data-testid={`${content.testId}-vli-care-badge`} className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/35 bg-accent/10 p-4 text-accent"><ShieldCheck size={24} className="shrink-0" /><div><p className="text-sm font-bold">{translate(careTitle)}{selectedVariant.vliCarePrice ? ` · ${selectedVariant.vliCarePrice}` : ""}</p><p className="mt-1 text-xs leading-5 text-white/65">{translate(careDescription)}</p></div></div> : null}

          <Button type="button" data-testid="product-detail-add-to-quote" onClick={() => onAddToCart(getDisplayedVariant(selectedVariant, equipmentTier), product)} className="mt-5 h-12 w-full rounded-full bg-accent font-semibold text-black hover:opacity-90"><ShoppingCart className="mr-2 size-4" />{translate("Add to Quote")}</Button>
          <p className="mt-3 text-center text-xs leading-5 text-white/45">{translate("Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section data-testid={`${content.testId}-specifications`} className="rounded-2xl border border-white/10 bg-black/20 p-5"><div className="mb-4 flex items-center gap-2"><Gauge size={17} className="text-accent" /><h3 className="text-lg font-semibold text-white">{translate("Technical Specifications")}</h3></div><dl className="space-y-3">{content.specifications.map(([label, value]) => <div key={label} className="grid grid-cols-[0.8fr_1.2fr] gap-3 border-t border-white/10 pt-3 text-sm"><dt className="text-white/45">{translate(label)}</dt><dd className="text-right text-white/75">{translate(value)}</dd></div>)}</dl></section>
        <section data-testid={`${content.testId}-in-the-box`} className="rounded-2xl border border-white/10 bg-black/20 p-5"><div className="mb-4 flex items-center gap-2"><Box size={17} className="text-accent" /><h3 className="text-lg font-semibold text-white">{translate("In the Box")}</h3></div><ul className="space-y-3">{[...content.inTheBox, ...(certified ? ["1x VLI CARE Activation Code"] : [])].map((item) => <li key={item} className="flex gap-2 text-sm leading-6 text-white/75"><Check size={15} className="mt-1 shrink-0 text-accent" />{translate(item)}</li>)}</ul></section>
      </div>
    </div>
  );
}

export default function ProductDetailDialog({ product, onOpenChange, onAddToCart }: ProductDetailDialogProps) {
  const { language } = useWebsiteLanguage();
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedPremiumTier, setSelectedPremiumTier] = useState<PremiumTier>("certified");
  const [selectedEquipmentTier, setSelectedEquipmentTier] = useState<EquipmentTier>("parts");
  const premiumContent = product ? getPremiumProductContent(product.familyId, language) : undefined;

  useEffect(() => {
    setSelectedPremiumTier(premiumContent?.defaultTier ?? "certified");
    setSelectedEquipmentTier("parts");
    setSelectedVariantId(product?.variants[0]?.sourceId ?? "");
  }, [product?.familyId]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    if (premiumContent) return getPremiumVariant(product, selectedPremiumTier);
    return product.variants.find((variant) => variant.sourceId === selectedVariantId) ?? product.variants[0];
  }, [product, premiumContent, selectedPremiumTier, selectedVariantId]);

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white sm:max-w-5xl">
        {product && selectedVariant ? (
          premiumContent ? <PremiumProductDetail product={product} selectedVariant={selectedVariant} selectedTier={selectedPremiumTier} onTierChange={setSelectedPremiumTier} equipmentTier={selectedEquipmentTier} onEquipmentTierChange={setSelectedEquipmentTier} onAddToCart={onAddToCart} content={premiumContent} /> : (
            <>
              <DialogHeader><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Product information</p><DialogTitle data-testid="product-detail-title" className="text-2xl text-white sm:text-3xl">{product.name}</DialogTitle><DialogDescription className="text-white/65">Choose a version to view its listed price, then add that exact configuration to your quote request.</DialogDescription></DialogHeader>
              <div className="mt-2 grid gap-6 md:grid-cols-[0.9fr_1.1fr]"><div className="flex min-h-56 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/25 p-5"><img data-testid="product-detail-image" src={selectedVariant.image} alt={selectedVariant.imageAlt} onError={(event) => { if (selectedVariant.fallbackImage && event.currentTarget.src !== selectedVariant.fallbackImage) event.currentTarget.src = selectedVariant.fallbackImage; else { event.currentTarget.style.display = "none"; event.currentTarget.alt = ""; } }} className="max-h-72 w-full object-contain" /></div><div className="flex flex-col">{product.variants.length > 1 ? <div data-testid="product-detail-variant-options" className="mb-5"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Choose a version</p><div className="grid gap-2 sm:grid-cols-2">{product.variants.map((variant) => { const selected = variant.sourceId === selectedVariant.sourceId; return <button type="button" data-testid="product-detail-variant" key={variant.sourceId} aria-pressed={selected} onClick={() => setSelectedVariantId(variant.sourceId)} className={`rounded-md border p-3 text-left transition-colors ${selected ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/35"}`}><span className="block text-sm font-semibold text-white">{variant.label}</span><span className="mt-1 block text-xs text-white/55">{variant.model}</span><span className="mt-2 block text-sm font-semibold text-accent">{variant.price}</span></button>; })}</div></div> : null}<EquipmentTierOptions variant={selectedVariant} selectedTier={selectedEquipmentTier} onChange={setSelectedEquipmentTier} /><div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Category</p><p className="mt-1 font-medium text-white">{product.category}</p></div><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Model</p><p data-testid="product-detail-model" className="mt-1 font-medium text-white">{selectedVariant.model}</p></div><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Product ref.</p><p className="mt-1 font-medium text-white">#{selectedVariant.number}</p></div><div className="rounded-md border border-accent/25 bg-accent/10 p-3"><p className="text-xs uppercase tracking-[0.14em] text-accent">Listed price</p><p data-testid="product-detail-price" className="mt-1 font-semibold text-accent">{getDisplayedVariant(selectedVariant, selectedEquipmentTier).price}</p></div></div><p data-testid="product-detail-description" className="mt-5 text-sm leading-7 text-white/75">{selectedVariant.description}</p><p className="mt-4 text-xs leading-5 text-white/50">Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.</p><Button type="button" data-testid="product-detail-add-to-cart" onClick={() => onAddToCart(getDisplayedVariant(selectedVariant, selectedEquipmentTier), product)} className="mt-6 w-full bg-accent font-semibold text-black hover:opacity-90"><ShoppingCart className="mr-2 size-4" />Add {selectedVariant.label} to cart</Button></div></div>
            </>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
