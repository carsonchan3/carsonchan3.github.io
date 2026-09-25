export type ProductCart = Record<string, number>;

/** v2 keys are `${sourceId}-${serviceOption}` (see productPricing.cartKey) so Tier 1, Tier 2 and VLI-CARE lines are kept apart. */
export const PRODUCT_CART_STORAGE_KEY = "vli-product-quote-cart-v2";

export function sanitizeProductCart(value: unknown, validCartKeys: Iterable<string>, minimumFor: (key: string) => number = () => 1): ProductCart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const validKeys = new Set(validCartKeys);
  return Object.entries(value).reduce<ProductCart>((cart, [key, quantity]) => {
    if (!validKeys.has(key) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return cart;
    cart[key] = Math.max(quantity, minimumFor(key));
    return cart;
  }, {});
}
