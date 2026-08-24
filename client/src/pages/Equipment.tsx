import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CartPricingDialog, { type CartPricingSelection } from "@/components/CartPricingDialog";
import ProductDetailDialog, { type ProductDetail, type ProductVariant } from "@/components/ProductDetailDialog";
import { PRODUCT_CART_STORAGE_KEY, sanitizeProductCart, type ProductCart } from "@/lib/productCart";
import { trpc } from "@/lib/trpc";
import { localizedPath } from "@/lib/seo";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, BatteryCharging, Cpu, Eye, Minus, Package, Plus, Radio, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export const catalogueItems = [
  {
    number: "25",
    sourceId: "25",
    model: "TZ009",
    icon: <Radio size={28} />,
    name: "TOPS Shield 205 RTF",
    category: "Drone platform",
    description: "Ready-to-fly 205 mm competition ball drone with remote, battery, and accessory kit.",
    price: "HK$3,330",
    image: "/manus-storage/excel_prod_30_a7d07b66.png",
    imageAlt: "TOPS Shield 205 competition drone kit box",
  },
  {
    number: "26",
    sourceId: "26",
    model: "TZ009",
    icon: <Radio size={28} />,
    name: "TOPS Shield 205 PNP",
    category: "Drone platform",
    description: "PNP 205 mm competition ball drone for pilots with compatible control gear.",
    price: "HK$2,110",
    image: "/manus-storage/excel_prod_31_93c6811c.png",
    imageAlt: "TOPS Shield 205 PNP competition drone product image",
  },
  {
    number: "27",
    sourceId: "27",
    model: "TZ002",
    icon: <Radio size={28} />,
    name: "TOPS Shield 220 RTF",
    category: "Drone platform",
    description: "Ready-to-fly 220 mm competition ball drone with a racing-ready setup.",
    price: "HK$2,860",
    image: "/manus-storage/excel_prod_9_417b350f.png",
    imageAlt: "TOPS Shield 220 competition drone cage illustration",
  },
  {
    number: "28",
    sourceId: "28",
    model: "TZ002",
    icon: <Radio size={28} />,
    name: "TOPS Shield 220 RTF + Bag",
    category: "Drone platform",
    description: "220 mm ready-to-fly set with a carrying bag for training and competition travel.",
    price: "HK$3,120",
    image: "/manus-storage/excel_prod_21_68f8cfe7.png",
    imageAlt: "TOPS Shield 220 drone with remote controller",
  },
  {
    number: "29",
    sourceId: "29",
    model: "TZ002",
    icon: <Radio size={28} />,
    name: "TOPS Shield 220 PNP",
    category: "Drone platform",
    description: "PNP 220 mm competition ball drone for custom receiver and control setups.",
    price: "HK$2,110",
    image: "/manus-storage/excel_prod_24_65d1f683.png",
    imageAlt: "TOPS Shield 220 PNP competition drone cage diagram",
  },
  {
    number: "30",
    sourceId: "30",
    model: "FB200",
    icon: <Radio size={28} />,
    name: "FB200 RTF Racer",
    category: "Drone platform",
    description: "200 mm RTF racer with ball guard, controller, battery, and charger.",
    price: "HK$4,040",
    image: "/manus-storage/excel_prod_10_e5fc5653.png",
    imageAlt: "FB200 RTF racer drone with remote controller",
  },
  {
    number: "31",
    sourceId: "31",
    model: "FB210",
    icon: <Radio size={28} />,
    name: "FB210 RTF Racer",
    category: "Drone platform",
    description: "210 mm RTF ball drone with upgraded motor package and carry bag.",
    price: "HK$4,610",
    image: "/manus-storage/excel_prod_11_fc95565c.png",
    imageAlt: "FB210 RTF racer drone with remote controller",
  },
  {
    number: "32",
    sourceId: "32",
    model: "R200",
    icon: <Radio size={28} />,
    name: "R200 RTF",
    category: "Drone platform",
    description: "200 mm RTF ball drone with compact 3S power setup and carry bag.",
    price: "HK$4,300",
    image: "/manus-storage/excel_prod_13_712f9740.png",
    imageAlt: "R200 RTF competition drone with remote controller",
  },
  {
    number: "33",
    sourceId: "33",
    model: "R200F",
    icon: <Radio size={28} />,
    name: "R200F RTF",
    category: "Drone platform",
    description: "200 mm RTF ball drone with higher-output motor and 3S–4S capability.",
    price: "HK$4,320",
    image: "/manus-storage/excel_prod_15_cb880557.png",
    imageAlt: "R200F RTF competition drone with remote controller",
  },
  {
    number: "34",
    sourceId: "34",
    model: "R220F",
    icon: <Radio size={28} />,
    name: "R220F RTF",
    category: "Drone platform",
    description: "220 mm RTF ball drone with upgraded motor, battery, and carry bag.",
    price: "HK$4,610",
    image: "/manus-storage/excel_prod_17_584dbd72.png",
    imageAlt: "R220F RTF competition drone with remote controller",
  },
  {
    number: "35",
    sourceId: "35",
    model: "TZ003",
    icon: <Radio size={28} />,
    name: "TOPS Shield 400 RTF",
    category: "Drone platform",
    description: "400 mm RTF competition ball drone kit with flight electronics and battery.",
    price: "HK$5,160",
    image: "/manus-storage/excel_prod_26_26e91f83.png",
    imageAlt: "TOPS Shield 400 competition drone in a blue cage",
  },
  {
    number: "36",
    sourceId: "36",
    model: "TZ003",
    icon: <Radio size={28} />,
    name: "TOPS Shield 400 PNP",
    category: "Drone platform",
    description: "400 mm PNP competition ball drone for teams with their own receiver and battery.",
    price: "HK$4,150",
    image: "/manus-storage/excel_prod_19_2844a82e.png",
    imageAlt: "TOPS Shield 400 PNP competition drone",
  },
  {
    number: "69",
    sourceId: "69",
    model: "3S battery",
    icon: <BatteryCharging size={28} />,
    name: "ACE 3S 1100 mAh Battery",
    category: "Drone power",
    description: "3S 1100 mAh LiPo battery for 200/220 mm ball drones and FPV builds.",
    price: "HK$180",
    image: "/manus-storage/excel_prod_3_aa72f902.png",
    imageAlt: "ACE 3S 1100 mAh LiPo battery",
  },
  {
    number: "70",
    sourceId: "70",
    model: "4S battery",
    icon: <BatteryCharging size={28} />,
    name: "ACE 4S 3000 mAh Battery",
    category: "Drone power",
    description: "4S 3000 mAh 120C LiPo battery for 400 mm ball drones and FPV builds.",
    price: "HK$400",
    image: "/manus-storage/excel_prod_27_854f107d.png",
    imageAlt: "ACE 4S 3000 mAh LiPo battery",
  },
  {
    number: "71",
    sourceId: "71",
    model: "6S battery",
    icon: <BatteryCharging size={28} />,
    name: "ACE 6S 3000 mAh Battery",
    category: "Drone power",
    description: "6S 3000 mAh 120C LiPo battery for higher-voltage 400 mm builds.",
    price: "HK$580",
    image: "/manus-storage/excel_prod_28_5edbfa4d.png",
    imageAlt: "ACE 6S 3000 mAh LiPo battery",
  },
  {
    number: "75",
    sourceId: "75",
    model: "10-port USB charger",
    icon: <Cpu size={28} />,
    name: "10-Port USB Charger",
    category: "Charging equipment",
    description: "10-port USB charger for charging multiple compatible batteries together.",
    price: "HK$90",
    image: "/manus-storage/excel_prod_6_81781e24.png",
    imageAlt: "10-port white USB charger",
  },
  {
    number: "76",
    sourceId: "76",
    model: "B3 20W",
    icon: <Cpu size={28} />,
    name: "B3 20W Balance Charger",
    category: "Charging equipment",
    description: "20 W balance charger for 2S and 3S LiPo batteries.",
    price: "HK$50",
    image: "/manus-storage/excel_prod_1_f4a517d6.png",
    imageAlt: "B3 balance charger",
  },
  {
    number: "77",
    sourceId: "77",
    model: "B3 10W",
    icon: <Cpu size={28} />,
    name: "B3 10W Balance Charger",
    category: "Charging equipment",
    description: "10 W balance charger for smaller 2S and 3S model batteries.",
    price: "HK$40",
    image: "/manus-storage/excel_prod_4_5d33c966.png",
    imageAlt: "B3 10W balance charger",
  },
  {
    number: "78",
    sourceId: "78",
    model: "D6 PRO",
    icon: <Cpu size={28} />,
    name: "D6 PRO Smart Charger",
    category: "Charging equipment",
    description: "Dual-channel smart balance charger for 1S–6S battery systems.",
    price: "HK$1,050",
    image: "/manus-storage/excel_prod_25_422ab006.png",
    imageAlt: "D6 PRO smart balance charger",
  },
  {
    number: "91",
    sourceId: "91",
    model: "3 × 3 × 3 m",
    icon: <Package size={28} />,
    name: "Inflatable Drone Soccer Field 3 × 3 × 3 m",
    category: "Competition venue",
    description: "Inflatable 3 × 3 × 3 m competition field with two goals and pump.",
    price: "HK$4,410",
    image: "/manus-storage/excel_prod_7_7475981f.png",
    imageAlt: "Inflatable drone soccer field with two goals",
  },
  {
    number: "94",
    sourceId: "94",
    model: "6 × 3 × 3 m",
    icon: <Package size={28} />,
    name: "Inflatable Drone Soccer Field 6 × 3 × 3 m",
    category: "Competition venue",
    description: "Inflatable 6 × 3 × 3 m field with two goals, pump, and custom branding option.",
    price: "HK$6,010",
    image: "/manus-storage/excel_prod_8_903cb396.png",
    imageAlt: "Large inflatable drone soccer field with two goals",
  },
];

const catalogueItemById = new Map(catalogueItems.map((item) => [item.sourceId, item]));

function createVariant(sourceId: string, label: string): ProductVariant {
  const item = catalogueItemById.get(sourceId);
  if (!item) throw new Error(`Missing catalogue item ${sourceId}`);

  return {
    sourceId: item.sourceId,
    number: String(catalogueItems.findIndex((catalogueItem) => catalogueItem.sourceId === item.sourceId) + 1),
    label,
    name: item.name,
    model: item.model,
    description: item.description,
    price: item.price,
    image: item.image,
    imageAlt: item.imageAlt,
  };
}

export const productFamilies: ProductDetail[] = [
  { familyId: "tops-shield-205", reference: "25–26", name: "TOPS Shield 205", category: "Drone platform", description: "205 mm competition ball drone platform.", variants: [createVariant("25", "RTF"), createVariant("26", "PNP")] },
  { familyId: "tops-shield-220", reference: "27–29", name: "TOPS Shield 220", category: "Drone platform", description: "220 mm competition ball drone platform.", variants: [createVariant("27", "RTF"), createVariant("28", "RTF + Bag"), createVariant("29", "PNP")] },
  { familyId: "fb200-racer", reference: "30", name: "FB200 Racer", category: "Drone platform", description: "200 mm ready-to-fly racer with ball guard and essential flying kit.", variants: [createVariant("30", "RTF")] },
  { familyId: "fb210-racer", reference: "31", name: "FB210 Racer", category: "Drone platform", description: "210 mm ready-to-fly ball drone with upgraded motor package and carry bag.", variants: [createVariant("31", "RTF")] },
  { familyId: "r200", reference: "32", name: "R200", category: "Drone platform", description: "Compact 200 mm ball drone platform with 3S power setup.", variants: [createVariant("32", "RTF")] },
  { familyId: "r200f", reference: "33", name: "R200F", category: "Drone platform", description: "Higher-output 200 mm ball drone platform with 3S–4S capability.", variants: [createVariant("33", "RTF")] },
  { familyId: "r220f", reference: "34", name: "R220F", category: "Drone platform", description: "220 mm ball drone platform with upgraded motor, battery, and carry bag.", variants: [createVariant("34", "RTF")] },
  { familyId: "tops-shield-400", reference: "35–36", name: "TOPS Shield 400", category: "Drone platform", description: "400 mm competition ball drone platform for larger-format matches.", variants: [createVariant("35", "RTF"), createVariant("36", "PNP")] },
  { familyId: "ace-lipo-battery", reference: "69–71", name: "ACE LiPo Battery", category: "Drone power", description: "LiPo battery options for 200 mm, 220 mm, and higher-voltage 400 mm builds.", variants: [createVariant("69", "3S · 1100 mAh"), createVariant("70", "4S · 3000 mAh"), createVariant("71", "6S · 3000 mAh")] },
  { familyId: "usb-charger", reference: "75", name: "10-Port USB Charger", category: "Charging equipment", description: "Multi-port USB charger for compatible battery workflows.", variants: [createVariant("75", "10-port") ] },
  { familyId: "b3-balance-charger", reference: "76–77", name: "B3 Balance Charger", category: "Charging equipment", description: "Compact balance charger options for 2S and 3S LiPo batteries.", variants: [createVariant("76", "20 W"), createVariant("77", "10 W")] },
  { familyId: "d6-pro", reference: "78", name: "D6 PRO Smart Charger", category: "Charging equipment", description: "Dual-channel smart balance charger for 1S–6S battery systems.", variants: [createVariant("78", "Dual-channel") ] },
  { familyId: "inflatable-drone-soccer-field", reference: "91, 94", name: "Inflatable Drone Soccer Field", category: "Competition venue", description: "Inflatable drone soccer field options with goals and pump.", variants: [createVariant("91", "3 × 3 × 3 m"), createVariant("94", "6 × 3 × 3 m")] },
];

export type DatabaseProductRow = {
  familyId: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  refNumber: string;
  variants: Array<{ name: string; model: string; price: string; imageUrl?: string }>;
};

export const isValidCatalogImageUrl = (value: string) =>
  /^https:\/\/\S+$/i.test(value) || /^\/manus-storage\/[^/\s].+/.test(value);

export function mergeCatalogueWithDatabase(
  databaseRows: DatabaseProductRow[],
  fallbackFamilies: ProductDetail[] = productFamilies,
): ProductDetail[] {
  if (!databaseRows.length) return fallbackFamilies;

  const dbByFamilyId = new Map(databaseRows.map((row) => [row.familyId, row]));
  const toDetail = (row: DatabaseProductRow, fallback?: ProductDetail): ProductDetail => ({
    familyId: row.familyId,
    reference: row.refNumber,
    name: row.name,
    category: row.category,
    description: row.description,
    variants: row.variants.map((variant, variantIndex) => {
      const fallbackVariant = fallback?.variants[variantIndex] ?? fallback?.variants[0];
      return {
        sourceId: `${row.familyId}-${variantIndex}`,
        number: String(variantIndex + 1),
        label: variant.name,
        name: row.name,
        model: variant.model,
        description: row.description,
        price: variant.price,
        image: variant.imageUrl && isValidCatalogImageUrl(variant.imageUrl) ? variant.imageUrl : (isValidCatalogImageUrl(row.imageUrl) ? row.imageUrl : fallbackVariant?.image ?? ""),
        fallbackImage: fallbackVariant?.image,
        imageAlt: row.imageAlt || fallbackVariant?.imageAlt || row.name,
      };
    }),
  });

  const mergedExistingFamilies = fallbackFamilies.map((fallback) => {
    const databaseRow = dbByFamilyId.get(fallback.familyId);
    return databaseRow ? toDetail(databaseRow, fallback) : fallback;
  });
  const newDatabaseFamilies = databaseRows
    .filter((row) => !fallbackFamilies.some((fallback) => fallback.familyId === row.familyId))
    .map((row) => toDetail(row));

  return [...mergedExistingFamilies, ...newDatabaseFamilies].map((family, familyIndex) => ({
    ...family,
    variants: family.variants.map((variant) => ({ ...variant, number: String(familyIndex + 1) })),
  }));
}

const catalogueVariants = productFamilies.flatMap((family) => family.variants);
const catalogueSourceIds = catalogueVariants.map((variant) => variant.sourceId);

function getPriceNumber(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

function getFamilyPriceLabel(family: ProductDetail) {
  const lowestVariant = family.variants.reduce((lowest, variant) => getPriceNumber(variant.price) < getPriceNumber(lowest.price) ? variant : lowest);
  return family.variants.length > 1 ? `From ${lowestVariant.price}` : lowestVariant.price;
}

function getFamilyReference(family: ProductDetail) {
  const first = family.variants[0]?.number;
  const last = family.variants[family.variants.length - 1]?.number;
  return family.variants.length > 1 ? `${first}–${last}` : first;
}

export const quoteCartTopRightClasses = {
  trigger: "fixed right-4 top-20 z-40 inline-flex size-14 items-center justify-center rounded-full border border-accent/50 bg-[#1C1D20]/95 text-white shadow-[0_16px_42px_rgba(0,0,0,0.42)] backdrop-blur transition-[transform,opacity,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_18px_44px_rgba(64,224,208,0.24)] active:scale-95 disabled:cursor-not-allowed disabled:border-white/15 disabled:opacity-55 sm:right-6 sm:top-24 sm:size-auto sm:min-w-44 sm:rounded-lg sm:px-4 sm:py-3",
  panel: "fixed inset-x-4 top-36 z-50 max-h-[calc(100svh-10rem)] overflow-y-auto rounded-xl border border-accent/35 bg-[#1C1D20]/98 p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur sm:inset-x-auto sm:right-6 sm:top-36 sm:w-80 sm:p-5",
} as const;

function readSavedCart(): ProductCart {
  if (typeof window === "undefined") return {};

  try {
    const storedCart = window.localStorage.getItem(PRODUCT_CART_STORAGE_KEY);
    return storedCart ? sanitizeProductCart(JSON.parse(storedCart), catalogueSourceIds) : {};
  } catch {
    return {};
  }
}

export default function Equipment() {
  const { language } = useWebsiteLanguage();
  const dbProductsQuery = trpc.products.list.useQuery();
  const [cart, setCart] = useState<ProductCart>(readSavedCart);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [cartPricingOpen, setCartPricingOpen] = useState(false);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);

  const activeProductFamilies: ProductDetail[] = useMemo(() => {
    return mergeCatalogueWithDatabase(dbProductsQuery.data ?? []);
  }, [dbProductsQuery.data]);

  const activeCatalogueVariants = useMemo(() => activeProductFamilies.flatMap((f) => f.variants), [activeProductFamilies]);
  const activeCatalogueSourceIds = useMemo(() => activeCatalogueVariants.map((v) => v.sourceId), [activeCatalogueVariants]);

  const cartItems: CartPricingSelection[] = activeCatalogueVariants.flatMap((variant) => {
    const quantity = cart[variant.sourceId];
    return quantity ? [{ sourceId: variant.sourceId, name: variant.name, model: variant.model, category: "Equipment", price: variant.price, quantity }] : [];
  });
  const cartUnitCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    try {
      if (Object.keys(cart).length) {
        window.localStorage.setItem(PRODUCT_CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        window.localStorage.removeItem(PRODUCT_CART_STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browser sessions.
    }
  }, [cart]);

  const addToCart = (variant: ProductVariant, family: ProductDetail) => {
    setCart((current) => ({ ...current, [variant.sourceId]: current[variant.sourceId] ?? 1 }));
    toast.success(`${family.name} · ${variant.label} added to your cart.`);
  };
  const changeCartQuantity = (sourceId: string, adjustment: number) => {
    setCart((current) => {
      const nextQuantity = Math.min(99, Math.max(1, (current[sourceId] ?? 1) + adjustment));
      return { ...current, [sourceId]: nextQuantity };
    });
  };
  const removeFromCart = (sourceId: string) => {
    setCart((current) => {
      const { [sourceId]: _removed, ...remaining } = current;
      return remaining;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="product" />
      <main className="pt-16">
        <section className="bg-black pb-20 pt-12 md:pb-28 md:pt-16">
          <div className="container">
            <div data-reveal className="reveal-up mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Equipment catalogue</p><h1 className="velocity-headline text-white">Select a starting point.</h1></div><p className="max-w-lg text-white/65">Browse equipment, power, charging, and venue systems from the supplied product list, then let us help configure the details around your programme.</p></div>
            <article data-reveal data-testid="product-custom-request-card" className="reveal-up relative mb-8 overflow-hidden rounded-lg border border-accent/35 bg-[linear-gradient(115deg,rgba(64,224,208,0.16),rgba(39,40,43,0.94)_42%,rgba(22,23,25,1))] p-6 shadow-[0_20px_50px_rgba(64,224,208,0.08)] sm:mb-10 sm:p-8 lg:p-10">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-accent/20 bg-accent/10 blur-2xl" />
              <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
                <div className="max-w-3xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Need something specific?</p>
                  <h2 className="velocity-subheading mb-3 text-white sm:text-3xl">Start with a custom equipment request.</h2>
                  <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">Share your preferred equipment, event format, technical constraints, and quantities. We will scope the right configuration before you compare standard catalogue items.</p>
                </div>
                <a href={localizedPath("/contact", language)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-black transition-opacity hover:opacity-90">Request custom quote <ArrowRight size={18} /></a>
              </div>
            </article>
            <div data-testid="product-cart-summary" className="mb-8 flex flex-col gap-4 rounded-lg border border-white/10 bg-[#27282B] p-5 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Quote cart</p><p className="mt-1 font-semibold text-white">{cartItems.length ? `${cartItems.length} item type${cartItems.length === 1 ? "" : "s"} · ${cartUnitCount} unit${cartUnitCount === 1 ? "" : "s"}` : "Add products to request pricing"}</p><p className="mt-1 text-sm text-white/60">Select quantities below. We will confirm final availability and pricing with you.</p></div>
              <button type="button" data-testid="product-ask-pricing" disabled={!cartItems.length} onClick={() => setCartPricingOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"><ShoppingCart size={17} />Ask for pricing</button>
            </div>
            <div data-testid="product-catalogue-grid" className="grid grid-cols-2 items-start gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {activeProductFamilies.map((family, index) => {
                const primaryVariant = family.variants[0];
                return (
                <article data-testid="product-catalogue-card" key={family.familyId} className={`group min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#27282B] transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_20px_48px_rgba(64,224,208,0.12)] ${index % 2 === 1 ? "mt-7 sm:mt-0" : ""}`}>
                  <button type="button" data-testid="product-detail-trigger" onClick={() => setSelectedProduct(family)} aria-label={`View options for ${family.name}`} className={`relative flex w-full items-center justify-center overflow-hidden border-b border-white/10 bg-[#161719] text-left ${index % 2 === 0 ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-square sm:aspect-[16/10]"}`}>
                    <img
                      data-testid="product-image"
                      src={primaryVariant.image}
                      alt={primaryVariant.imageAlt}
                      loading={index < 4 ? "eager" : "lazy"}
                      onError={(event) => {
                        if (primaryVariant.fallbackImage && event.currentTarget.src !== primaryVariant.fallbackImage) {
                          event.currentTarget.src = primaryVariant.fallbackImage;
                        } else {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.alt = "";
                        }
                      }}
                      className="size-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-5"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#161719]/35 via-transparent to-transparent" />
                    <div className="absolute inset-3 rounded-md border border-dashed border-white/20 transition-transform duration-300 group-hover:scale-105 sm:inset-5" />
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-accent sm:left-5 sm:top-5 sm:text-xs">#{getFamilyReference(family)}</span>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[10px] font-semibold text-white sm:bottom-5 sm:right-5 sm:text-xs"><Eye size={12} />{family.variants.length > 1 ? `${family.variants.length} options` : "Details"}</span>
                  </button>
                  <div className="p-3.5 sm:p-6"><p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent sm:mb-2 sm:text-xs sm:tracking-[0.18em]">{family.category}</p><h3 className="mb-2 text-base font-semibold leading-5 text-white sm:velocity-subheading sm:mb-3">{family.name}</h3><p className="line-clamp-2 text-xs leading-5 text-white/70 sm:text-base sm:leading-7">{family.description}</p><p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45 sm:mt-3 sm:text-xs">{family.variants.length > 1 ? `${family.variants.length} versions available` : primaryVariant.model}</p><p data-testid="product-price-tag" className="mt-3 inline-flex rounded-full border border-accent/35 bg-accent/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent sm:mt-4 sm:px-3 sm:text-xs sm:tracking-[0.12em]">{getFamilyPriceLabel(family)}</p><button type="button" data-testid="product-view-details" onClick={() => setSelectedProduct(family)} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-accent/40 px-3 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-black sm:mt-5 sm:text-sm">{family.variants.length > 1 ? "Choose version" : "View details"} <ArrowRight size={14} /></button></div>
                </article>
              );
              })}
            </div>
          </div>
        </section>
      </main>
      <button
        type="button"
        data-testid="floating-product-cart"
        aria-label={cartItems.length ? `Open quote cart with ${cartItems.length} item type${cartItems.length === 1 ? "" : "s"} and ${cartUnitCount} unit${cartUnitCount === 1 ? "" : "s"}` : "Quote cart is empty"}
        disabled={!cartItems.length}
        aria-expanded={cartPanelOpen}
        aria-controls="floating-product-cart-panel"
        onClick={() => setCartPanelOpen(true)}
        className={quoteCartTopRightClasses.trigger}
      >
        <ShoppingCart size={19} className="text-accent" />
        <span className="sr-only sm:not-sr-only sm:ml-2 sm:text-left"><span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Quote cart</span><span className="block text-sm font-semibold text-white">{cartItems.length ? `${cartUnitCount} unit${cartUnitCount === 1 ? "" : "s"} selected` : "Empty"}</span></span>
        <span data-testid="floating-product-cart-count" className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-black sm:relative sm:right-auto sm:top-auto sm:ml-3 sm:size-6">{cartUnitCount}</span>
      </button>
      {cartPanelOpen ? (
        <section id="floating-product-cart-panel" data-testid="floating-product-cart-panel" role="dialog" aria-label="Quote cart" className={quoteCartTopRightClasses.panel}>
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">Quote cart</p><h2 className="mt-1 text-lg font-semibold text-white">Review your selection</h2></div>
            <button type="button" data-testid="floating-cart-close" onClick={() => setCartPanelOpen(false)} aria-label="Close quote cart" className="grid size-9 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-accent hover:text-accent"><X size={17} /></button>
          </div>
          {cartItems.length ? (
            <>
              <ul className="my-3 divide-y divide-white/10">
                {cartItems.map((item) => (
                  <li data-testid="floating-cart-item" key={item.sourceId} className="py-3 first:pt-0">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{item.name}</p><p className="mt-1 text-xs text-accent">{item.price}</p></div><button type="button" data-testid="floating-cart-remove" onClick={() => removeFromCart(item.sourceId)} aria-label={`Remove ${item.name} from quote cart`} className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-red-400/70 hover:text-red-300"><Trash2 size={14} /></button></div>
                    <div className="mt-3 inline-flex h-9 items-center rounded-md border border-white/15 bg-black/20"><button type="button" data-testid="floating-cart-decrease" onClick={() => changeCartQuantity(item.sourceId, -1)} disabled={item.quantity === 1} aria-label={`Decrease ${item.name} quantity`} className="grid size-9 place-items-center text-white/70 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"><Minus size={14} /></button><span data-testid="floating-cart-quantity" className="min-w-7 text-center text-sm font-semibold text-white">{item.quantity}</span><button type="button" data-testid="floating-cart-increase" onClick={() => changeCartQuantity(item.sourceId, 1)} aria-label={`Increase ${item.name} quantity`} className="grid size-9 place-items-center text-white/70 transition-colors hover:text-accent"><Plus size={14} /></button></div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-3"><p className="text-sm text-white/70"><span className="font-semibold text-white">{cartItems.length}</span> item type{cartItems.length === 1 ? "" : "s"} · <span className="font-semibold text-white">{cartUnitCount}</span> unit{cartUnitCount === 1 ? "" : "s"}</p><button type="button" data-testid="floating-cart-ask-pricing" onClick={() => { setCartPanelOpen(false); setCartPricingOpen(true); }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"><ShoppingCart size={16} />Ask for pricing</button></div>
            </>
          ) : <p data-testid="floating-cart-empty" className="py-6 text-sm leading-6 text-white/65">Your quote cart is empty. Add an item from the catalogue to build a pricing request.</p>}
        </section>
      ) : null}
      <ProductDetailDialog product={selectedProduct} onOpenChange={(open) => { if (!open) setSelectedProduct(null); }} onAddToCart={addToCart} />
      <CartPricingDialog items={cartItems} open={cartPricingOpen} onOpenChange={setCartPricingOpen} onSubmitted={() => { setCart({}); setCartPanelOpen(false); }} />
      <SiteFooter />
    </div>
  );
}
