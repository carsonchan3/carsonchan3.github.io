import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CartPricingDialog, { type CartPricingSelection } from "@/components/CartPricingDialog";
import ProductDetailDialog, { type ProductDetail, type ProductVariant } from "@/components/ProductDetailDialog";
import { PRODUCT_CART_STORAGE_KEY, sanitizeProductCart, type ProductCart } from "@/lib/productCart";
import { localizedPath } from "@/lib/seo";
import { trackConversion } from "@/lib/conversionTracking";
import { applyProductContent, buildProductFamilies, hiddenProductFamilyIds } from "@/lib/productContent";
import { availableServiceOptions, cartKey, minimumQuantity, parseCartKey, serviceOptionLabel, servicePrice, type ServiceOption } from "@/lib/productPricing";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Eye, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export const equipmentPricingNote = {
  en: "Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.",
  "zh-Hant": "所列價格僅供參考起點。最終供貨情況、運費及賽事計劃要求，將於為您度身訂造的報價中確認。",
} as const;

/** Every product family, prices, variants and images come from content/products/*.md. */
export const productFamilies: ProductDetail[] = buildProductFamilies();

export const excludedProductFamilyIds = hiddenProductFamilyIds;

export function getVisibleProductFamilies(families: ProductDetail[]) {
  return families.filter((family) => !excludedProductFamilyIds.has(family.familyId));
}

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
        ...(fallbackVariant?.tier ? { tier: fallbackVariant.tier } : {}),
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

const catalogueVariants = getVisibleProductFamilies(productFamilies).flatMap((family) => family.variants);
const catalogueVariantById = new Map(catalogueVariants.map((variant) => [variant.sourceId, variant]));
const catalogueCartKeys = catalogueVariants.flatMap((variant) => availableServiceOptions(variant).map((option) => cartKey(variant.sourceId, option)));

/** Minimum quantity for a cart line (Tier 1 min. qty from content/pricing.md; 1 otherwise). */
export function cartLineMinimum(key: string) {
  const parsed = parseCartKey(key);
  const variant = parsed ? catalogueVariantById.get(parsed.sourceId) : undefined;
  return parsed && variant ? minimumQuantity(variant, parsed.option) : 1;
}

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
    return storedCart ? sanitizeProductCart(JSON.parse(storedCart), catalogueCartKeys, cartLineMinimum) : {};
  } catch {
    return {};
  }
}

export default function Equipment() {
  const { language } = useWebsiteLanguage();
  const productContentUrl = "https://github.com/carsonchan3/carsonchan3.github.io/tree/main/content/products";
  const [cart, setCart] = useState<ProductCart>(readSavedCart);
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null);
  const [cartPricingOpen, setCartPricingOpen] = useState(false);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);

  const activeProductFamilies: ProductDetail[] = useMemo(() => {
    return getVisibleProductFamilies(productFamilies).map((family) => applyProductContent(family, language));
  }, [language]);

  const activeCatalogueVariants = useMemo(() => activeProductFamilies.flatMap((f) => f.variants), [activeProductFamilies]);

  // One line per variant and service option, in catalogue order; the option label and price travel with the quote request.
  const cartItems: CartPricingSelection[] = activeCatalogueVariants.flatMap((variant) => availableServiceOptions(variant).flatMap((option) => {
    const key = cartKey(variant.sourceId, option);
    const quantity = cart[key];
    if (!quantity) return [];
    const optionLabel = serviceOptionLabel(variant, option);
    return [{ sourceId: key, name: optionLabel ? `${variant.name} · ${optionLabel}` : variant.name, model: variant.model, category: "Equipment", price: servicePrice(variant, option), quantity, minQuantity: minimumQuantity(variant, option) }];
  }));
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

  const addToCart = (variant: ProductVariant, family: ProductDetail, option: ServiceOption = "t1") => {
    const key = cartKey(variant.sourceId, option);
    const minimum = minimumQuantity(variant, option);
    setCart((current) => ({ ...current, [key]: Math.max(current[key] ?? minimum, minimum) }));
    const optionLabel = serviceOptionLabel(variant, option);
    toast.success(`${family.name} · ${variant.label}${optionLabel ? ` · ${optionLabel}` : ""}${minimum > 1 ? ` (×${minimum} minimum)` : ""} added to your cart.`);
  };
  const changeCartQuantity = (key: string, adjustment: number) => {
    setCart((current) => {
      const nextQuantity = Math.min(99, Math.max(cartLineMinimum(key), (current[key] ?? 1) + adjustment));
      return { ...current, [key]: nextQuantity };
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
            <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6"><p data-testid="equipment-pricing-note" data-reveal className="reveal-up border-l-2 border-accent/70 bg-[#101113] px-4 py-3 text-sm leading-6 text-white/70 sm:px-5">{equipmentPricingNote[language]}</p><a href={productContentUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-white">{language === "zh-Hant" ? "在 GitHub 編輯產品內容" : "Edit product content on GitHub"}<ArrowRight size={15} /></a></div>
            <article data-reveal data-testid="product-custom-request-card" className="reveal-up relative mb-8 overflow-hidden rounded-lg border border-accent/35 bg-[linear-gradient(115deg,rgba(64,224,208,0.16),rgba(39,40,43,0.94)_42%,rgba(22,23,25,1))] p-6 shadow-[0_20px_50px_rgba(64,224,208,0.08)] sm:mb-10 sm:p-8 lg:p-10">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-accent/20 bg-accent/10 blur-2xl" />
              <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
                <div className="max-w-3xl">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Need something specific?</p>
                  <h2 className="velocity-subheading mb-3 text-white sm:text-3xl">Start with a custom equipment request.</h2>
                  <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">Share your requirements and questions and we will help find the best equipment for you.</p>
                </div>
                <a href={localizedPath("/contact", language)} onClick={() => trackConversion("quote_request_start", { source: "custom_equipment", language })} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-black transition-opacity hover:opacity-90">Request custom quote <ArrowRight size={18} /></a>
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
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-semibold leading-5 text-white">{item.name}</p><p className="mt-1 text-xs text-accent">{item.price}</p>{(item.minQuantity ?? 1) > 1 ? <p data-testid="floating-cart-minimum" className="mt-1 text-[11px] text-amber-200/80">{language === "zh-Hant" ? `最少訂購 ${item.minQuantity} 件` : `Minimum order: ${item.minQuantity} pcs`}</p> : null}</div><button type="button" data-testid="floating-cart-remove" onClick={() => removeFromCart(item.sourceId)} aria-label={`Remove ${item.name} from quote cart`} className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-red-400/70 hover:text-red-300"><Trash2 size={14} /></button></div>
                    <div className="mt-3 inline-flex h-9 items-center rounded-md border border-white/15 bg-black/20"><button type="button" data-testid="floating-cart-decrease" onClick={() => changeCartQuantity(item.sourceId, -1)} disabled={item.quantity <= (item.minQuantity ?? 1)} aria-label={`Decrease ${item.name} quantity`} className="grid size-9 place-items-center text-white/70 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"><Minus size={14} /></button><span data-testid="floating-cart-quantity" className="min-w-7 text-center text-sm font-semibold text-white">{item.quantity}</span><button type="button" data-testid="floating-cart-increase" onClick={() => changeCartQuantity(item.sourceId, 1)} aria-label={`Increase ${item.name} quantity`} className="grid size-9 place-items-center text-white/70 transition-colors hover:text-accent"><Plus size={14} /></button></div>
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
