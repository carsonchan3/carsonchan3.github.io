export type ProductCart = Record<string, number>;

export const PRODUCT_CART_STORAGE_KEY = "vli-product-quote-cart-v1";

export function sanitizeProductCart(value: unknown, validSourceIds: Iterable<string>): ProductCart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const validIds = new Set(validSourceIds);
  return Object.entries(value).reduce<ProductCart>((cart, [sourceId, quantity]) => {
    if (!validIds.has(sourceId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return cart;
    cart[sourceId] = quantity;
    return cart;
  }, {});
}
