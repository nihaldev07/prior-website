"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/adapters/productAdapter";
import { cn } from "@/lib/utils";
import QuickAddSheet from "./QuickAddSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ProductCardProps {
  product: Product;
  className?: string;
}

/**
 * ProductCard Component - Matches reference design exactly
 * - 4:5 aspect ratio
 * - object-contain for full product display
 * - No hover effects on image
 * - Neutral background fallback
 * - Consistent card heights
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  /**
   * Format price with Bangladeshi Taka symbol
   */
  const formatPrice = (price: number) => {
    return `৳ ${price.toFixed(0)}`;
  };

  /**
   * Format color name - remove underscores and capitalize
   */
  const formatColorName = (color: string) => {
    return color
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  /**
   * Determine if product is shoes/sandals (show sizes) or bags (show colors)
   */
  const isFootwear =
    product.category?.toLowerCase().includes("sandal") ||
    product.category?.toLowerCase().includes("shoe");

  /**
   * Get display variants based on category
   */
  const getDisplayVariants = () => {
    if (isFootwear && product.sizes.length > 0) {
      // Show sizes for footwear
      return {
        type: "sizes" as const,
        items: product.sizes.map((s) => s.name),
        maxDisplay: 5,
      };
    } else if (product.colors.length > 0) {
      // Show colors for bags and other items
      return {
        type: "colors" as const,
        items: product.colors.map((c) => formatColorName(c.name)),
        maxDisplay: 3,
      };
    }
    return null;
  };

  const variants = getDisplayVariants();

  /**
   * Handle add to cart button click - prevent link navigation
   */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  return (
    <>
      <div className={cn("group block relative", className)}>
        <div className='bg-transparent rounded-md overflow-hidden transition-shadow duration-200 flex flex-col h-full'>
          <Link href={`/collections/${product.slug || product.id}`}>
            {/* Product Image Container - Wrapper matches image dimensions */}
            <div className='relative w-full aspect-square bg-white overflow-hidden rounded-md shadow-sm'>
              {/* Image - object-contain, wrapper same aspect as image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className='object-contain rounded-md shadow-md'
                sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
                loading='lazy'
                priority={isMobile}
                quality={100}
              />

              {/* Discount Badge */}
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm'>
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    %
                  </div>
                )}

              {/* Out of Stock Overlay */}
              {product.stock === 0 && (
                <div className='absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]'>
                  <span className='bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg shadow-md'>
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Product Info Section - Consistent heights */}
            <div className='py-1 flex flex-col'>
              <div className='w-full relative flex justify-between items-center gap-1 border-gray-200 py-1 px-1 mt-2'>
                {/* Product Name - Fixed 2 lines */}
                <h3 className='text-xl font-bold text-gray-900   leading-tight uppercase'>
                  {product.name}
                </h3>
                {/* Price Section - Bottom aligned */}
                <div className='flex justify-end items-center gap-1'>
                  <div className='flex items-baseline gap-2'>
                    <span className='text-base font-medium text-primary'>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className='text-sm text-gray-400 line-through font-medium'>
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              <Badge
                variant='secondary'
                className='bg-muted text-muted-foreground hover:bg-muted/80 text-xs mb-4 font-medium uppercase tracking-wide max-w-[fit-content]'>
                {product?.category || "Uncategorized"}
              </Badge>
            </div>
          </Link>
        </div>

        <Button
          onClick={handleQuickAdd}
          className='w-full h-10 text-xs font-semibold uppercase mb-3'
          disabled={product.stock === 0}>
          <ShoppingCart className='h-4 w-4 mr-2' />
          Add to cart
        </Button>
      </div>

      {/* Quick Add Sheet/Drawer */}
      <QuickAddSheet
        productId={product.id}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </>
  );
};

export default ProductCard;
