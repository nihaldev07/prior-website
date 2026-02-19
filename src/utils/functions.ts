import { ProductType, Variation } from "@/data/types";
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
