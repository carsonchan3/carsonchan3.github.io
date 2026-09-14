import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Box, Check, Gauge, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { traditionalChineseTranslations } from "@/lib/zhTranslations";
import { useEffect, useMemo, useState } from "react";

export type ProductVariant = {
  sourceId: string;
  number: string;
  label: string;
  name: string;
  model: string;
  description: string;
  price: string;
  image: string;
  fallbackImage?: string;
  imageAlt: string;
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

export type PremiumTier = "builder" | "certified" | "travel";
type PremiumTierContent = {
  label: string;
  subtitle: string;
  match: RegExp;
  features: readonly string[];
};
type PremiumProductContent = {
  testId: string;
  title: string;
  pitch: string;
  platformLabel: string;
  defaultTier: PremiumTier;
  tiers: Partial<Record<PremiumTier, PremiumTierContent>>;
  specifications: readonly (readonly [string, string])[];
  inTheBox: readonly string[];
  certifiedCare?: boolean;
};

export function getPremiumVariant(product: ProductDetail, tier: PremiumTier, content: PremiumProductContent) {
  const tierContent = content.tiers[tier];
  const matchesTier = (variant: ProductVariant) => `${variant.label} ${variant.model} ${variant.name}`.toLowerCase();
  return product.variants.find((variant) => tierContent?.match.test(matchesTier(variant))) ?? product.variants[0];
}

export function getShield205Variant(product: ProductDetail, tier: "builder" | "certified") {
  return getPremiumVariant(product, tier, premiumProductContent["tops-shield-205"]);
}

export const shield205Content = {
  title: "TOPS Shield 205: The Agile Striker",
  pitch: "Engineered for high-intensity drone sports, the TOPS Shield 205 combines a lightweight 205mm spherical exoskeleton with a competition-tuned powertrain. Designed to bounce off arena walls and opponents without dropping from the sky, it is the ultimate platform for tight-quarters maneuverability.",
  tiers: {
    builder: {
      label: "Builder's Edition",
      subtitle: "For teams with in-house technicians.",
      match: /pnp|plug/,
      features: [
        "Factory default settings (requires manual PID tuning).",
        "Standard manufacturer visual inspection.",
        "Standard 14-day defect return policy (Does not cover flight crashes).",
      ],
    },
    certified: {
      label: "VLI Certified Edition",
      subtitle: "Plug-and-play for professional arenas and schools.",
      match: /rtf|ready/,
      features: [
        "Professionally tuned by VLI engineers for arena agility.",
        "15-point VLI Pre-Flight Verification (motors and ESCs stress-tested).",
        "Includes 1-Year VLI CARE: Covers heavy collision damage, water damage, and rapid replacements.",
      ],
    },
  },
  specifications: [
    ["Frame Diameter", "205 mm"],
    ["Design", "Spherical impact-resistant competition cage"],
    ["Flight Dynamics", "360-degree collision tolerance with auto-righting"],
    ["Propulsion", "High-torque brushless motors"],
    ["Telemetry", "Low-latency transmission, fully compatible with Smart Referee systems"],
  ],
  inTheBox: [
    "1x TOPS Shield 205 Competition Ball Drone",
    "1x Pre-Bound Receiver / Transmission Unit",
    "2x Sets of Competition Propellers",
    "1x High-Impact Spare Outer Shell Segment",
    "1x Custom VLI Transport Bag",
  ],
} as const;

export const premiumProductContent: Record<string, PremiumProductContent> = {
  "tops-shield-205": {
    testId: "tops-shield-205-premium-detail",
    ...shield205Content,
    platformLabel: "205 mm platform",
    defaultTier: "certified",
    certifiedCare: true,
  },
  "tops-shield-220": {
    testId: "tops-shield-220-premium-detail",
    title: "TOPS Shield 220: The Competition Workhorse",
    pitch: "The TOPS Shield 220 gives competition teams a balanced 220mm platform for repeatable training and event deployment. Choose a ready-to-fly configuration for a faster operational start, add the travel set when logistics matter, or bring your own receiver for an in-house build workflow.",
    platformLabel: "220 mm platform",
    defaultTier: "certified",
    certifiedCare: true,
    tiers: {
      certified: {
        label: "VLI Certified Edition",
        subtitle: "Ready-to-fly for competition teams and schools.",
        match: /rtf(?!.*bag)|ready/,
        features: [
          "Competition-ready receiver and flight setup.",
          "VLI pre-flight configuration check before handover.",
          "Includes 1-Year VLI CARE for approved programme deployments.",
        ],
      },
      travel: {
        label: "Certified Travel Edition",
        subtitle: "Ready-to-fly with a transport bag for touring programmes.",
        match: /bag|travel/,
        features: [
          "Ready-to-fly 220mm platform with matched flight electronics.",
          "Includes a carrying bag for training and event travel.",
          "Designed for teams moving equipment between venues.",
        ],
      },
      builder: {
        label: "Builder's Edition",
        subtitle: "PNP platform for teams with their own control system.",
        match: /pnp|plug/,
        features: [
          "Bring your own receiver and control equipment.",
          "Flexible starting point for technical teams and custom builds.",
          "Standard manufacturer inspection before dispatch.",
        ],
      },
    },
    specifications: [
      ["Frame Diameter", "220 mm"],
      ["Configuration", "RTF, travel-ready, or PNP platform options"],
      ["Use Case", "Training, competition, and touring event programmes"],
      ["Flight Setup", "Competition-ready power and control configuration"],
      ["Compatibility", "Suitable for Smart Referee-supported drone sports workflows"],
    ],
    inTheBox: [
      "1x TOPS Shield 220 Competition Ball Drone",
      "1x Receiver / Transmission Unit on RTF configurations",
      "2x Sets of Competition Propellers",
      "1x High-Impact Spare Outer Shell Segment",
      "1x Carrying Bag on Travel Edition",
    ],
  },
  "r220f": {
    testId: "r220f-premium-detail",
    title: "R220F: The Ready-to-Deploy Training Platform",
    pitch: "The R220F is a practical 220mm ball-drone platform for organisations that need a complete, portable setup. Its upgraded motor, battery, and carrying bag make it a straightforward choice for training fleets, demonstrations, and event-side replacement capacity.",
    platformLabel: "R220F platform",
    defaultTier: "certified",
    tiers: {
      certified: {
        label: "VLI Ready-to-Deploy Edition",
        subtitle: "Complete RTF setup for training, demonstration, and event support.",
        match: /rtf|ready/,
        features: [
          "Upgraded motor and matched flight battery included.",
          "Ready-to-fly configuration for faster programme setup.",
          "Includes a carrying bag for practical transport between venues.",
        ],
      },
    },
    specifications: [
      ["Frame Diameter", "220 mm"],
      ["Configuration", "Ready-to-fly ball drone platform"],
      ["Powertrain", "Upgraded motor with matched flight battery"],
      ["Deployment", "Portable setup for training, demonstration, and event support"],
      ["Transport", "Carrying bag included"],
    ],
    inTheBox: [
      "1x R220F Ready-to-Fly Ball Drone",
      "1x Upgraded Motor Configuration",
      "1x Matched Flight Battery",
      "1x Remote / Control Setup",
      "1x Carrying Bag",
    ],
  },
  "tops-shield-400": {
    testId: "tops-shield-400-premium-detail",
    title: "TOPS Shield 400: The Arena-Scale Platform",
    pitch: "The TOPS Shield 400 is built for larger-format drone sports where teams need more physical presence and endurance at the arena boundary. Select a ready-to-fly system for a complete deployment package or use the PNP platform as the foundation for your own receiver and battery workflow.",
    platformLabel: "400 mm platform",
    defaultTier: "certified",
    certifiedCare: true,
    tiers: {
      certified: {
        label: "VLI Certified Arena Edition",
        subtitle: "Ready-to-fly for larger-format matches and venue deployments.",
        match: /rtf|ready/,
        features: [
          "Complete flight-electronics configuration for arena-scale use.",
          "VLI pre-flight configuration check before handover.",
          "Designed for larger-format match operations and venue planning.",
        ],
      },
      builder: {
        label: "Arena Builder's Edition",
        subtitle: "PNP platform for technical teams with their own electronics.",
        match: /pnp|plug/,
        features: [
          "Bring your own receiver and battery workflow.",
          "Flexible foundation for venue-specific configuration.",
          "Standard manufacturer inspection before dispatch.",
        ],
      },
    },
    specifications: [
      ["Frame Diameter", "400 mm"],
      ["Design", "Large-format spherical competition cage"],
      ["Use Case", "Arena-scale matches and boundary operations"],
      ["Configuration", "RTF or PNP platform options"],
      ["Programme Fit", "Suitable for larger venues and higher-visibility deployments"],
    ],
    inTheBox: [
      "1x TOPS Shield 400 Competition Ball Drone",
      "1x Flight-Electronics Configuration on RTF Edition",
      "2x Sets of Competition Propellers",
      "1x High-Impact Outer Shell Component",
      "1x VLI Configuration Handover Checklist",
    ],
  },
};

function PremiumProductDetail({ product, selectedVariant, selectedTier, onTierChange, onAddToCart, content }: {
  product: ProductDetail;
  selectedVariant: ProductVariant;
  selectedTier: PremiumTier;
  onTierChange: (tier: PremiumTier) => void;
  onAddToCart: (variant: ProductVariant, family: ProductDetail) => void;
  content: PremiumProductContent;
}) {
  const { language } = useWebsiteLanguage();
  const isChinese = language === "zh-Hant";
  const translate = (value: string) => isChinese ? traditionalChineseTranslations[value] ?? value : value;
  const tier = content.tiers[selectedTier] ?? content.tiers[content.defaultTier]!;
  const certified = selectedTier === "certified" && content.certifiedCare;

  return (
    <div data-testid={content.testId} className="space-y-7">
      <div className="grid gap-7 md:grid-cols-[0.95fr_1.05fr] md:items-stretch">
        <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0B1419] p-6 sm:min-h-80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_36%,rgba(48,224,202,0.18),transparent_36%),linear-gradient(145deg,rgba(7,17,23,0.98),rgba(11,20,25,0.7))]" />
          <img data-testid="product-detail-image" src={selectedVariant.image} alt={selectedVariant.imageAlt} onError={(event) => { if (selectedVariant.fallbackImage && event.currentTarget.src !== selectedVariant.fallbackImage) event.currentTarget.src = selectedVariant.fallbackImage; else { event.currentTarget.style.display = "none"; event.currentTarget.alt = ""; } }} className="relative z-10 max-h-72 w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]" />
          <span className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent"><Gauge size={13} /> {translate(content.platformLabel)}</span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{translate("Drone platform · premium configuration")}</p>
          <h2 data-testid="product-detail-title" className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">{translate(content.title)}</h2>
          <p data-testid="product-detail-description" className="mt-4 text-sm leading-7 text-white/70 sm:text-base">{translate(product.description)}</p>

          <div data-testid={`${content.testId}-tier-options`} className={`mt-6 grid gap-3 ${Object.keys(content.tiers).length > 1 ? "sm:grid-cols-2" : ""}`}>
            {(Object.keys(content.tiers) as PremiumTier[]).map((option) => {
              const optionContent = content.tiers[option];
              if (!optionContent) return null;
              const optionVariant = getPremiumVariant(product, option, content);
              const selected = option === selectedTier;
              const isRecommended = option === content.defaultTier;
              return (
                <button type="button" key={option} data-testid={`${content.testId}-tier-${option}`} aria-pressed={selected} onClick={() => onTierChange(option)} className={`relative rounded-2xl border p-4 text-left transition-colors ${selected ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/30"}`}>
                  {isRecommended ? <span className="absolute -top-3 right-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black">{translate("Recommended")}</span> : null}
                  <span className="block text-sm font-semibold text-white">{translate(optionContent.label)}</span>
                  <span className="mt-1 block min-h-10 text-xs leading-5 text-white/55">{translate(optionContent.subtitle)}</span>
                  <span className="mt-3 block text-lg font-semibold text-accent">{optionVariant.price}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-white/40">{translate("Starting point")}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start gap-3"><div className="mt-0.5 rounded-full bg-accent/15 p-2 text-accent"><Wrench size={16} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{translate(tier.label)}</p><p className="mt-2 text-sm leading-6 text-white/75">{translate(tier.subtitle)}</p><ul className="mt-3 space-y-2">{tier.features.map((feature) => <li key={feature} className="flex gap-2 text-xs leading-5 text-white/65"><Check size={15} className="mt-0.5 shrink-0 text-accent" />{translate(feature)}</li>)}</ul></div></div>
          </div>

          {certified ? <div data-testid={`${content.testId}-vli-care-badge`} className="mt-4 flex items-center gap-3 rounded-2xl border border-accent/35 bg-accent/10 p-4 text-accent"><ShieldCheck size={24} className="shrink-0" /><div><p className="text-sm font-bold">{translate("Includes 1-Year VLI CARE")}</p><p className="mt-1 text-xs leading-5 text-white/65">{translate("Coverage for heavy collision damage, water damage, and rapid replacements.")}</p></div></div> : null}

          <Button type="button" data-testid="product-detail-add-to-quote" onClick={() => onAddToCart(selectedVariant, product)} className="mt-5 h-12 w-full rounded-full bg-accent font-semibold text-black hover:opacity-90"><ShoppingCart className="mr-2 size-4" />{translate("Add to Quote")}</Button>
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
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedPremiumTier, setSelectedPremiumTier] = useState<PremiumTier>("certified");
  const premiumContent = product ? premiumProductContent[product.familyId] : undefined;

  useEffect(() => {
    setSelectedPremiumTier(premiumContent?.defaultTier ?? "certified");
    setSelectedVariantId(product?.variants[0]?.sourceId ?? "");
  }, [product?.familyId]);

  const selectedVariant = useMemo(() => {
    if (!product) return undefined;
    if (premiumContent) return getPremiumVariant(product, selectedPremiumTier, premiumContent);
    return product.variants.find((variant) => variant.sourceId === selectedVariantId) ?? product.variants[0];
  }, [product, premiumContent, selectedPremiumTier, selectedVariantId]);

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white sm:max-w-5xl">
        {product && selectedVariant ? (
          premiumContent ? <PremiumProductDetail product={product} selectedVariant={selectedVariant} selectedTier={selectedPremiumTier} onTierChange={setSelectedPremiumTier} onAddToCart={onAddToCart} content={premiumContent} /> : (
            <>
              <DialogHeader><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Product information</p><DialogTitle data-testid="product-detail-title" className="text-2xl text-white sm:text-3xl">{product.name}</DialogTitle><DialogDescription className="text-white/65">Choose a version to view its listed price, then add that exact configuration to your quote request.</DialogDescription></DialogHeader>
              <div className="mt-2 grid gap-6 md:grid-cols-[0.9fr_1.1fr]"><div className="flex min-h-56 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/25 p-5"><img data-testid="product-detail-image" src={selectedVariant.image} alt={selectedVariant.imageAlt} onError={(event) => { if (selectedVariant.fallbackImage && event.currentTarget.src !== selectedVariant.fallbackImage) event.currentTarget.src = selectedVariant.fallbackImage; else { event.currentTarget.style.display = "none"; event.currentTarget.alt = ""; } }} className="max-h-72 w-full object-contain" /></div><div className="flex flex-col">{product.variants.length > 1 ? <div data-testid="product-detail-variant-options" className="mb-5"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Choose a version</p><div className="grid gap-2 sm:grid-cols-2">{product.variants.map((variant) => { const selected = variant.sourceId === selectedVariant.sourceId; return <button type="button" data-testid="product-detail-variant" key={variant.sourceId} aria-pressed={selected} onClick={() => setSelectedVariantId(variant.sourceId)} className={`rounded-md border p-3 text-left transition-colors ${selected ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/35"}`}><span className="block text-sm font-semibold text-white">{variant.label}</span><span className="mt-1 block text-xs text-white/55">{variant.model}</span><span className="mt-2 block text-sm font-semibold text-accent">{variant.price}</span></button>; })}</div></div> : null}<div className="grid grid-cols-2 gap-3 text-sm"><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Category</p><p className="mt-1 font-medium text-white">{product.category}</p></div><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Model</p><p data-testid="product-detail-model" className="mt-1 font-medium text-white">{selectedVariant.model}</p></div><div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Product ref.</p><p className="mt-1 font-medium text-white">#{selectedVariant.number}</p></div><div className="rounded-md border border-accent/25 bg-accent/10 p-3"><p className="text-xs uppercase tracking-[0.14em] text-accent">Listed price</p><p data-testid="product-detail-price" className="mt-1 font-semibold text-accent">{selectedVariant.price}</p></div></div><p data-testid="product-detail-description" className="mt-5 text-sm leading-7 text-white/75">{selectedVariant.description}</p><p className="mt-4 text-xs leading-5 text-white/50">Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.</p><Button type="button" data-testid="product-detail-add-to-cart" onClick={() => onAddToCart(selectedVariant, product)} className="mt-6 w-full bg-accent font-semibold text-black hover:opacity-90"><ShoppingCart className="mr-2 size-4" />Add {selectedVariant.label} to cart</Button></div></div>
            </>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
