import { ProductType, SingleProductType, Variation } from "@/data/types";
import { IProduct } from "@/lib/interface";

// New UI types
export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Size {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  slug: string;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  isNew?: boolean;
  isHot?: boolean;
  colors: Color[];
  sizes: Size[];
  tags?: string[];
  createdAt: string;
}

// Color name to hex mapping
const colorMap: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  yellow: "#FFFF00",
  pink: "#FFC0CB",
  purple: "#800080",
  orange: "#FFA500",
  brown: "#A52A2A",
  gray: "#808080",
  grey: "#808080",
  beige: "#F5F5DC",
  navy: "#000080",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00FF00",
  aqua: "#00FFFF",
  teal: "#008080",
  silver: "#C0C0C0",
  gold: "#FFD700",
};

// Helper function to convert color name to hex
const colorNameToHex = (colorName: string): string => {
  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || "#CCCCCC"; // Default gray if color not found
};

// Helper function to check if product is new (created within last 30 days)
const isNewProduct = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(createdAt) > thirtyDaysAgo;
};

// Extract unique colors from variations
const extractColors = (variations?: Variation[]): Color[] => {
  if (!variations || variations.length === 0) return [];

  const colorMap = new Map<string, Color>();

  variations.forEach((variation, idx) => {
    if (variation.color && !colorMap.has(variation.color)) {
      colorMap.set(variation.color, {
        id: `color-${idx}`,
        name: variation.color,
        hex: colorNameToHex(variation.color),
      });
    }
  });

  return Array.from(colorMap.values());
};

// Extract unique sizes from variations
const extractSizes = (variations?: Variation[]): Size[] => {
  if (!variations || variations.length === 0) return [];

  const sizeMap = new Map<string, Size>();

  variations.forEach((variation) => {
    if (variation.size && !sizeMap.has(variation.size)) {
      sizeMap.set(variation.size, {
        id: `size-${variation.size}`,
        name: variation.size,
      });
    }
  });

  return Array.from(sizeMap.values());
};

// Adapt Prior ProductType to new UI Product format
export const adaptProductToNewFormat = (
  currentProduct: ProductType | SingleProductType,
): Product => {
  const hasDiscount =
    currentProduct.hasDiscount &&
    currentProduct.updatedPrice !== undefined &&
    currentProduct.updatedPrice !== null;

  return {
    id: currentProduct.id,
    name: currentProduct.name,
    price: hasDiscount
      ? currentProduct.updatedPrice!
      : currentProduct.unitPrice,
    originalPrice: hasDiscount ? currentProduct.unitPrice : undefined,
    image: currentProduct.thumbnail,
    slug: currentProduct.slug || String(currentProduct.id),
    images: currentProduct.images || [],
    category: currentProduct.categoryName || "",
    description: currentProduct.description || "",
    rating: currentProduct.rating || 0,
    reviewCount: currentProduct.rating || 0,
    inStock: currentProduct.quantity > 0,
    stock: currentProduct.quantity,
    isNew: false,
    isHot: currentProduct.hasDiscount, // Products with discount are "hot"
    colors: extractColors(currentProduct.variation),
    sizes: extractSizes(currentProduct.variation),
    tags: [],
    createdAt: new Date().toISOString(),
  };
};

// Adapt IProduct to new UI Product format
export const adaptIProductToNewFormat = (product: IProduct): Product => {
  const hasDiscount =
    product.hasDiscount &&
    product.updatedPrice !== undefined &&
    product.updatedPrice !== null;

  return {
    id: String(product.id || ""),
    name: product.name || "",
    slug: product.slug || String(product.id || ""),
    price: hasDiscount ? product.updatedPrice! : product.unitPrice || 0,
    originalPrice: hasDiscount ? product.unitPrice : undefined,
    image: product.thumbnail || "",
    images: product.images || [],
    category: product.categoryName || "",
    description: product.description || "",
    rating: product.rating || 0,
    reviewCount: product.rating || 0,
    inStock: (product.quantity || 0) > 0,
    stock: product.quantity || 0,
    isNew: false,
    isHot: product.hasDiscount || false,
    colors: extractColors(product.variation as Variation[] | undefined),
    sizes: extractSizes(product.variation as Variation[] | undefined),
    tags: [],
    createdAt: new Date().toISOString(),
  };
};

// Adapt array of products
export const adaptProductsToNewFormat = (
  products: ProductType[] | SingleProductType[] | IProduct[],
): Product[] => {
  return products.map((product) => {
    // Check if it's IProduct type (has optional id property as number)
    if ("id" in product && typeof product.id === "number") {
      return adaptIProductToNewFormat(product as IProduct);
    }
    // Otherwise treat as ProductType or SingleProductType
    return adaptProductToNewFormat(product as ProductType | SingleProductType);
  });
};
