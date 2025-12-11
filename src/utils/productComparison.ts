import { CartItem } from "@/context/CartContext";
import { SingleProductType } from "@/data/types";

export interface ProductChange {
  productId: string;
  productName: string;
  changes: {
    priceChanged?: {
      old: number;
      new: number;
      difference: number;
    };
    discountChanged?: {
      old: number;
      new: number;
      difference: number;
    };
    discountedPriceChanged?: {
      old: number;
      new: number;
      difference: number;
    };
    quantityChanged?: {
      old: number;
      new: number;
      available: number;
    };
    productRemoved?: boolean;
    productInactive?: boolean;
  };
}

export interface ComparisonResult {
  hasChanges: boolean;
  changes: ProductChange[];
  updatedCart: CartItem[];
}

/**
 * Compare cart items with fresh product data from API
 * @param cartItems - Current items in cart
 * @param freshProducts - Latest product data from bulk API
 * @returns Comparison result with changes and updated cart
 */
export const compareProducts = (
  cartItems: CartItem[],
  freshProducts: SingleProductType[]
): ComparisonResult => {
  const changes: ProductChange[] = [];
  const updatedCart: CartItem[] = [];

  cartItems.forEach((cartItem) => {
    const freshProduct = freshProducts.find(
      (p) => String(p.id) === String(cartItem.id)
    );

    // Product removed or not found
    if (!freshProduct) {
      changes.push({
        productId: cartItem.id,
        productName: cartItem.name,
        changes: {
          productRemoved: true,
        },
      });
      return; // Don't add to updated cart
    }

    // Product inactive (check if quantity is 0 or product seems unavailable)
    if (freshProduct.quantity === 0) {
      changes.push({
        productId: cartItem.id,
        productName: cartItem.name,
        changes: {
          productInactive: true,
        },
      });
      return; // Don't add to updated cart
    }

    const productChanges: ProductChange["changes"] = {};
    let hasProductChanges = false;

    // Check price changes
    if (cartItem.unitPrice !== freshProduct.unitPrice) {
      productChanges.priceChanged = {
        old: cartItem.unitPrice,
        new: freshProduct.unitPrice,
        difference: freshProduct.unitPrice - cartItem.unitPrice,
      };
      hasProductChanges = true;
    }

    // Calculate discount amounts from unitPrice and updatedPrice
    const oldDiscountAmount = cartItem.updatedPrice
      ? cartItem.unitPrice - cartItem.updatedPrice
      : 0;
    const newDiscountAmount = freshProduct.updatedPrice
      ? freshProduct.unitPrice - freshProduct.updatedPrice
      : 0;

    // Check discount changes
    if (oldDiscountAmount !== newDiscountAmount) {
      productChanges.discountChanged = {
        old: oldDiscountAmount,
        new: newDiscountAmount,
        difference: newDiscountAmount - oldDiscountAmount,
      };
      hasProductChanges = true;
    }

    // Check discounted price changes
    const oldDiscountedPrice = cartItem.updatedPrice || cartItem.unitPrice;
    const newDiscountedPrice =
      freshProduct.updatedPrice || freshProduct.unitPrice;

    if (oldDiscountedPrice !== newDiscountedPrice) {
      productChanges.discountedPriceChanged = {
        old: oldDiscountedPrice,
        new: newDiscountedPrice,
        difference: newDiscountedPrice - oldDiscountedPrice,
      };
      hasProductChanges = true;
    }

    // Check quantity availability
    const availableQuantity = freshProduct.quantity || 0;
    if (cartItem.quantity > availableQuantity) {
      productChanges.quantityChanged = {
        old: cartItem.quantity,
        new: Math.min(cartItem.quantity, availableQuantity),
        available: availableQuantity,
      };
      hasProductChanges = true;
    }

    // Add to changes if any changes detected
    if (hasProductChanges) {
      changes.push({
        productId: cartItem.id,
        productName: cartItem.name,
        changes: productChanges,
      });
    }

    // Create updated cart item
    const updatedQuantity = Math.min(
      cartItem.quantity,
      availableQuantity || cartItem.quantity
    );

    // Calculate discount per item (unitPrice - updatedPrice)
    const discountPerItem = freshProduct.updatedPrice
      ? freshProduct.unitPrice - freshProduct.updatedPrice
      : 0;

    updatedCart.push({
      ...cartItem,
      unitPrice: freshProduct.unitPrice,
      discount: discountPerItem * updatedQuantity, // Total discount for all quantities
      updatedPrice: newDiscountedPrice,
      quantity: updatedQuantity,
      maxQuantity: availableQuantity,
      totalPrice: newDiscountedPrice * updatedQuantity,
      hasDiscount: discountPerItem > 0,
      discountType: freshProduct.discountType,
    });
  });

  return {
    hasChanges: changes.length > 0,
    changes,
    updatedCart,
  };
};

/**
 * Format price change for display
 */
export const formatPriceChange = (change: number): string => {
  const sign = change > 0 ? "+" : "";
  return `${sign}৳${Math.abs(change).toFixed(2)}`;
};

/**
 * Get change type label
 */
export const getChangeTypeLabel = (
  change: ProductChange["changes"]
): string => {
  if (change.productRemoved) return "Product Removed";
  if (change.productInactive) return "Product Unavailable";
  if (change.priceChanged) return "Price Changed";
  if (change.discountChanged) return "Discount Changed";
  if (change.discountedPriceChanged) return "Discounted Price Changed";
  if (change.quantityChanged) return "Quantity Adjusted";
  return "Updated";
};
