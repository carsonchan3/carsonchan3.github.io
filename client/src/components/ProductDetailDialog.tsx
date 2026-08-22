import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

export default function ProductDetailDialog({ product, onOpenChange, onAddToCart }: ProductDetailDialogProps) {
  const [selectedVariantId, setSelectedVariantId] = useState("");

  useEffect(() => {
    setSelectedVariantId(product?.variants[0]?.sourceId ?? "");
  }, [product?.familyId]);

  const selectedVariant = product?.variants.find((variant) => variant.sourceId === selectedVariantId) ?? product?.variants[0];

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white sm:max-w-3xl">
        {product && selectedVariant ? (
          <>
            <DialogHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Product information</p>
              <DialogTitle data-testid="product-detail-title" className="text-2xl text-white sm:text-3xl">{product.name}</DialogTitle>
              <DialogDescription className="text-white/65">Choose a version to view its listed price, then add that exact configuration to your quote request.</DialogDescription>
            </DialogHeader>

            <div className="mt-2 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-56 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/25 p-5">
                <img
                  data-testid="product-detail-image"
                  src={selectedVariant.image}
                  alt={selectedVariant.imageAlt}
                  onError={(event) => {
                    if (selectedVariant.fallbackImage && event.currentTarget.src !== selectedVariant.fallbackImage) {
                      event.currentTarget.src = selectedVariant.fallbackImage;
                    } else {
                      event.currentTarget.style.display = "none";
                      event.currentTarget.alt = "";
                    }
                  }}
                  className="max-h-72 w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                {product.variants.length > 1 ? (
                  <div data-testid="product-detail-variant-options" className="mb-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Choose a version</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {product.variants.map((variant) => {
                        const selected = variant.sourceId === selectedVariant.sourceId;
                        return (
                          <button
                            type="button"
                            data-testid="product-detail-variant"
                            key={variant.sourceId}
                            aria-pressed={selected}
                            onClick={() => setSelectedVariantId(variant.sourceId)}
                            className={`rounded-md border p-3 text-left transition-colors ${selected ? "border-accent bg-accent/10" : "border-white/10 bg-black/20 hover:border-white/35"}`}
                          >
                            <span className="block text-sm font-semibold text-white">{variant.label}</span>
                            <span className="mt-1 block text-xs text-white/55">{variant.model}</span>
                            <span className="mt-2 block text-sm font-semibold text-accent">{variant.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Category</p><p className="mt-1 font-medium text-white">{product.category}</p></div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Model</p><p data-testid="product-detail-model" className="mt-1 font-medium text-white">{selectedVariant.model}</p></div>
                  <div className="rounded-md border border-white/10 bg-black/20 p-3"><p className="text-xs uppercase tracking-[0.14em] text-white/45">Product ref.</p><p className="mt-1 font-medium text-white">#{selectedVariant.number}</p></div>
                  <div className="rounded-md border border-accent/25 bg-accent/10 p-3"><p className="text-xs uppercase tracking-[0.14em] text-accent">Listed price</p><p data-testid="product-detail-price" className="mt-1 font-semibold text-accent">{selectedVariant.price}</p></div>
                </div>
                <p data-testid="product-detail-description" className="mt-5 text-sm leading-7 text-white/75">{selectedVariant.description}</p>
                <p className="mt-4 text-xs leading-5 text-white/50">Listed prices provide a starting point. Final availability, shipping, and programme requirements are confirmed in your tailored quote.</p>
                <Button type="button" data-testid="product-detail-add-to-cart" onClick={() => onAddToCart(selectedVariant, product)} className="mt-6 w-full bg-accent font-semibold text-black hover:opacity-90"><ShoppingCart className="mr-2 size-4" />Add {selectedVariant.label} to cart</Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
