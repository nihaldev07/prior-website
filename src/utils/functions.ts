import { ProductType, SingleProductType, Variation } from "@/data/types";
import { Product } from "@/lib/adapters/productAdapter";
import { adaptProductToNewFormat } from "@/lib/adapters/productAdapter";

export const convertProductTypeToProduct = (
  productType: ProductType,
): Product => {
  return adaptProductToNewFormat(productType);
};

export const formatVariant = (variant: Variation) => {
  if (!variant || (!variant.color && !variant.size)) {
    return "No variant";
  }

  const { color, size } = variant;

  if (color && size) {
    return `${color} - ${size}`;
  }

  return color || size || "No variant";
};

export const isValidBDPhoneNumber = (number: string): boolean => {
  // Regular Expression for BD phone numbers
  const bdNumberRegex = /^(?:\+88)?01[3-9]\d{8}$/;

  // Remove extra spaces or dashes if any
  const sanitizedNumber = number.trim();

  // Test the number with regex
  return bdNumberRegex.test(sanitizedNumber);
};

// Format number to 2 decimal places
export const formatPrice = (amount: number): number => {
  return Number(amount.toFixed(2));
};

// Ceil the total amount (round up)
export const ceilPrice = (amount: number): number => {
  return Math.ceil(amount);
};

// Floor the discount amount (round down)
export const floorPrice = (amount: number): number => {
  return Math.floor(amount);
};

/* ------------------------------------------------------------------ */
/* Discount math — single source of truth for all cart/order pricing.  */
/* Canonical convention:                                               */
/*   updatedPrice       = effective (discounted) unit price; NEVER 0   */
/*                        for non-discounted products — that is        */
/*   unitPrice          = original list price                          */
/*   discount           = perUnitDiscount * quantity  (LINE TOTAL)     */
/*   totalPrice         = unitPrice * quantity        (GROSS)          */
/* ------------------------------------------------------------------ */

interface PricedLike {
  unitPrice: number;
  updatedPrice?: number;
  hasDiscount?: boolean;
  quantity?: number;
}

/**
 * The price the customer actually pays per unit.
 * Falls back to unitPrice when there is no discount or when legacy cart
 * data has updatedPrice === 0 (a historical bug — never treat 0 as a price).
 */
export const getEffectiveUnitPrice = (item: PricedLike): number => {
  if (
    item.hasDiscount &&
    typeof item.updatedPrice === "number" &&
    item.updatedPrice > 0 &&
    item.updatedPrice < item.unitPrice
  ) {
    return item.updatedPrice;
  }
  return item.unitPrice;
};

/** Discount per single unit (>= 0). */
export const getPerUnitDiscount = (item: PricedLike): number => {
  return Math.max(0, item.unitPrice - getEffectiveUnitPrice(item));
};

/**
 * Discount LINE TOTAL for an item: perUnitDiscount * quantity.
 * Pass an explicit qty to recompute after a quantity change.
 */
export const getLineDiscount = (item: PricedLike, qty?: number): number => {
  const quantity = qty ?? item.quantity ?? 1;
  return getPerUnitDiscount(item) * quantity;
};

/**
 * Recompute derived pricing fields (updatedPrice / discount / totalPrice /
 * hasDiscount) on an existing cart item. Used to sanitize legacy localStorage
 * carts and to keep line fields consistent after quantity changes.
 */
export const sanitizeCartItem = <T extends PricedLike>(item: T): T => {
  const unitPrice = Number(item.unitPrice) || 0;
  const hasDiscount =
    !!item.hasDiscount &&
    typeof item.updatedPrice === "number" &&
    item.updatedPrice > 0 &&
    item.updatedPrice < unitPrice;
  const updatedPrice = hasDiscount ? Number(item.updatedPrice) : unitPrice;
  const quantity = Number(item.quantity) || 0;

  return {
    ...item,
    unitPrice,
    hasDiscount,
    updatedPrice,
    discount: (unitPrice - updatedPrice) * quantity,
    totalPrice: unitPrice * quantity,
  };
};

/**
 * Build a canonical cart item from a product. The single source of truth for
 * add-to-cart payloads — never set updatedPrice to 0 for non-discounted
 * products and never store the raw API `discount` value (which is a percent
 * number for % discounts, not an amount).
 */
export const buildCartProduct = (
  product: SingleProductType,
  quantity: number,
  selectedVariant?: Variation | null,
) => {
  const unitPrice = Number(product.unitPrice) || 0;
  const hasDiscount =
    Number(product.discount) > 0 &&
    !!product.updatedPrice &&
    product.updatedPrice < unitPrice;
  const updatedPrice = hasDiscount ? Number(product.updatedPrice) : unitPrice;
  const safeQuantity = Number(quantity) || 0;

  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    active: true,
    quantity: safeQuantity,
    unitPrice,
    manufactureId: "",
    discountType: product.discountType,
    updatedPrice,
    hasDiscount,
    discount: (unitPrice - updatedPrice) * safeQuantity,
    description: product.description,
    thumbnail: product.thumbnail,
    productCode: product.productCode,
    totalPrice: Number((unitPrice * safeQuantity).toFixed(2)),
    categoryName: product.categoryName,
    hasVariation: product.hasVariation,
    variation: selectedVariant,
    maxQuantity: selectedVariant
      ? selectedVariant.quantity
      : product.quantity,
  };
};
