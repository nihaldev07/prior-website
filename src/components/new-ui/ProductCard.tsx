"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, ShoppingBag, Tag } from "lucide-react";
import { Product } from "@/lib/adapters/productAdapter";
import { cn } from "@/lib/utils";
import QuickAddSheet from "./QuickAddSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface ProductCardProps {
  product: Product;
  className?: string;
  variant?: "luxury" | "minimal" | "bold" | "editorial";
}

/**
 * ProductCard Component - Beautiful fashion-focused design with 4 variants
 * - Luxury: Sophisticated high-end aesthetic with elegant animations
 * - Minimal: Clean Scandinavian design with generous whitespace
 * - Bold: Eye-catching energetic design with dramatic effects
 * - Editorial: Magazine-style layout with artistic presentation
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  variant = "editorial",
}) => {
  // Add rainbow border animation styles
  const rainbowBorderStyles = `
    @keyframes rainbow-pulse {
      0% {
        filter: hue-rotate(0deg) brightness(1);
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
      }
      16.66% {
        filter: hue-rotate(60deg) brightness(1.2);
        box-shadow: 0 0 20px rgba(255, 127, 0, 0.5);
      }
      33.33% {
        filter: hue-rotate(120deg) brightness(1);
        box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
      }
      50% {
        filter: hue-rotate(180deg) brightness(1.2);
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
      }
      66.66% {
        filter: hue-rotate(240deg) brightness(1);
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      }
      83.33% {
        filter: hue-rotate(300deg) brightness(1.2);
        box-shadow: 0 0 20px rgba(0, 0, 255, 0.5);
      }
      100% {
        filter: hue-rotate(360deg) brightness(1);
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
      }
    }
    .rainbow-border-wrapper {
      position: relative;
      padding: 2px;
      border-radius: 4px;
      background: linear-gradient(
        90deg,
        #ff0000,
        #ff7f00,
        #ffff00,
        #00ff00,
        #00ffff,
        #0000ff,
        #8b00ff,
        #ff0000
      );
      background-size: 400% 400%;
      animation: rainbow-pulse 6s ease-in-out infinite;
    }
  `;
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const isOutOfStock = product.stock === 0 || !product.inStock;
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  /**
   * Format price with Bangladeshi Taka symbol
   */
  const formatPrice = (price: number) => {
    return typeof price === "number"
      ? `৳${price.toLocaleString()}`
      : `৳${Number(price).toLocaleString()}`;
  };

  /**
   * Handle quick add button click
   */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  /**
   * Handle wishlist toggle
   */
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // Add your wishlist logic here
  };

  // ========== LUXURY VARIANT ==========
  if (variant === "luxury") {
    return (
      <>
        <div className={cn("group relative", className)}>
          <Link href={`/collections/${product.slug || product.id}`}>
            <div
              className='relative overflow-hidden'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              {/* Image Container with Overlay */}
              <div className='relative aspect-[3/4] overflow-hidden rounded-none bg-neutral-100'>
                {/* Product Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                  className={cn(
                    "object-cover object-center transition-all duration-700 ease-out",
                    isHovered ? "scale-105" : "scale-100",
                  )}
                  priority={isMobile}
                />

                {/* Gradient Overlay on Hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-500",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                />

                {/* Top Badges & Actions */}
                <div className='absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10'>
                  {/* Discount or New/Hot Badge */}
                  <div className='flex gap-2'>
                    {hasDiscount && (
                      <Badge
                        variant='secondary'
                        className='bg-white/95 backdrop-blur-sm text-black border-0 px-3 py-1 text-xs font-medium tracking-wider'>
                        -{discountPercentage}%
                      </Badge>
                    )}
                    {product.isNew && !hasDiscount && (
                      <Badge
                        variant='secondary'
                        className='bg-white/95 backdrop-blur-sm text-black border-0 px-3 py-1 text-xs font-medium tracking-wider'>
                        NEW
                      </Badge>
                    )}
                    {product.isHot && !hasDiscount && !product.isNew && (
                      <Badge
                        variant='secondary'
                        className='bg-rose-500/95 backdrop-blur-sm text-white border-0 px-3 py-1 text-xs font-medium tracking-wider'>
                        HOT
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={handleWishlist}
                    className={cn(
                      "ml-auto p-2 rounded-full backdrop-blur-sm transition-all duration-300",
                      isWishlisted
                        ? "bg-rose-500 text-white"
                        : "bg-white/90 text-neutral-800 hover:bg-white",
                    )}>
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-all",
                        isWishlisted && "fill-current",
                      )}
                    />
                  </button>
                </div>

                {/* Quick Shop Overlay */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-6 transition-all duration-500 ease-out",
                    isHovered
                      ? "translate-y-0 opacity-100"
                      : "translate-y-full opacity-0",
                  )}>
                  <Button
                    onClick={handleQuickAdd}
                    disabled={isOutOfStock}
                    className={cn(
                      "w-full rounded-none font-medium tracking-wider text-sm transition-all duration-300",
                      isOutOfStock
                        ? "bg-neutral-800 text-white cursor-not-allowed"
                        : "bg-white text-black hover:bg-neutral-100",
                    )}>
                    {isOutOfStock ? (
                      "OUT OF STOCK"
                    ) : (
                      <>
                        <ShoppingBag className='w-4 h-4 mr-2' />
                        QUICK SHOPify
                      </>
                    )}
                  </Button>
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className='absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center'>
                    <p className='text-neutral-900 font-medium tracking-widest text-sm'>
                      SOLD OUT
                    </p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className='mt-4 space-y-2'>
                {/* Product Name */}
                <h3 className='text-sm font-medium tracking-wide text-neutral-900 uppercase transition-colors group-hover:text-neutral-600'>
                  {product.name}
                </h3>

                {/* Category */}
                {product.category && (
                  <p className='text-xs text-neutral-500 tracking-wider uppercase'>
                    {product.category}
                  </p>
                )}

                {/* Rating */}
                {product.rating > 0 && (
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300",
                        )}
                      />
                    ))}
                    <span className='text-xs text-neutral-500 ml-1'>
                      ({product.reviewCount})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className='flex items-baseline gap-2'>
                  {hasDiscount ? (
                    <>
                      <span className='text-base font-semibold text-neutral-900'>
                        {formatPrice(product.price)}
                      </span>
                      <span className='text-sm text-neutral-400 line-through'>
                        {formatPrice(product.originalPrice!)}
                      </span>
                    </>
                  ) : (
                    <span className='text-base font-semibold text-neutral-900'>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Color/Size Indicators */}
                {product.colors.length > 0 && (
                  <div className='flex items-center gap-1'>
                    {product.colors.slice(0, 4).map((color, idx) => (
                      <div
                        key={idx}
                        className='w-4 h-4 rounded-full border border-neutral-300'
                        style={{ backgroundColor: color.hex || "#ccc" }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className='text-xs text-neutral-500'>
                        +{product.colors.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Add Sheet */}
        <QuickAddSheet
          productId={product.id}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
        />
      </>
    );
  }

  // ========== MINIMAL VARIANT ==========
  if (variant === "minimal") {
    return (
      <>
        <div className={cn("group relative", className)}>
          <Link href={`/collections/${product.slug || product.id}`}>
            <div className='relative'>
              {/* Image Container */}
              <div className='relative aspect-[2/3] overflow-hidden bg-neutral-50'>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                  className='object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]'
                  priority={isMobile}
                />

                {/* Minimal Badge */}
                {hasDiscount && (
                  <div className='absolute top-4 right-4'>
                    <div className='w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xs font-light'>
                      -{discountPercentage}%
                    </div>
                  </div>
                )}

                {product.isNew && !hasDiscount && (
                  <div className='absolute top-4 right-4'>
                    <div className='w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xs font-light'>
                      NEW
                    </div>
                  </div>
                )}

                {/* Wishlist - Minimal */}
                <button
                  onClick={handleWishlist}
                  className='absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all",
                      isWishlisted ? "fill-black text-black" : "text-black",
                    )}
                  />
                </button>

                {/* Out of Stock */}
                {isOutOfStock && (
                  <div className='absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center'>
                    <p className='text-neutral-900 font-light tracking-widest text-xs'>
                      OUT OF STOCK
                    </p>
                  </div>
                )}
              </div>

              {/* Minimal Info */}
              <div className='mt-6 space-y-1'>
                <h3 className='text-sm font-light tracking-wider text-neutral-800 uppercase'>
                  {product.name}
                </h3>
                <p className='text-xs text-neutral-500 tracking-wider uppercase'>
                  {product.category}
                </p>
                <div className='flex items-baseline gap-3 pt-1'>
                  {hasDiscount ? (
                    <>
                      <span className='text-sm font-medium text-neutral-900'>
                        {formatPrice(product.price)}
                      </span>
                      <span className='text-xs text-neutral-400 line-through font-light'>
                        {formatPrice(product.originalPrice!)}
                      </span>
                    </>
                  ) : (
                    <span className='text-sm font-medium text-neutral-900'>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Minimal Quick Add Button */}
          <Button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className='w-full mt-4 rounded-none font-light tracking-wider text-xs border border-neutral-300 bg-transparent text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300'
            variant='outline'>
            {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </Button>
        </div>

        <QuickAddSheet
          productId={product.id}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
        />
      </>
    );
  }

  // ========== BOLD VARIANT ==========
  if (variant === "bold") {
    return (
      <>
        <div className={cn("group relative", className)}>
          <Link href={`/collections/${product.slug || product.id}`}>
            <div
              className='relative overflow-hidden'
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              {/* Image with Bold Border */}
              <div className='relative aspect-square overflow-hidden border-4 border-black transition-all duration-500 group-hover:border-neutral-600'>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={90}
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                  className={cn(
                    "object-cover object-center transition-all duration-700",
                    isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0",
                  )}
                  priority={isMobile}
                />

                {/* Bold Discount Tag */}
                {hasDiscount && (
                  <div className='absolute top-0 right-0 bg-yellow-400 text-black px-6 py-3 font-bold text-sm transform rotate-3 shadow-xl'>
                    SAVE {discountPercentage}%!
                  </div>
                )}

                {product.isHot && !hasDiscount && (
                  <div className='absolute top-0 right-0 bg-red-500 text-white px-6 py-3 font-bold text-sm transform rotate-3 shadow-xl'>
                    HOT!
                  </div>
                )}

                {product.isNew && !hasDiscount && !product.isHot && (
                  <div className='absolute top-0 right-0 bg-blue-500 text-white px-6 py-3 font-bold text-sm transform rotate-3 shadow-xl'>
                    NEW!
                  </div>
                )}

                {/* Bold Action Bar */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-black text-white p-4 transition-transform duration-500",
                    isHovered ? "translate-y-0" : "translate-y-full",
                  )}>
                  <div className='flex items-center justify-between'>
                    <Button
                      onClick={handleQuickAdd}
                      disabled={isOutOfStock}
                      className='flex-1 bg-white text-black hover:bg-yellow-400 font-bold rounded-none h-12'>
                      {isOutOfStock ? "SOLD OUT" : "ADD TO BAG"}
                    </Button>
                    <button
                      onClick={handleWishlist}
                      className='ml-3 p-3 bg-white text-black hover:bg-yellow-400 transition-colors'>
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isWishlisted && "fill-current",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Out of Stock */}
                {isOutOfStock && (
                  <div className='absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center'>
                    <p className='bg-white text-black font-bold px-6 py-3 text-lg'>
                      SOLD OUT
                    </p>
                  </div>
                )}
              </div>

              {/* Bold Typography */}
              <div className='mt-4'>
                <h3 className='text-lg font-black uppercase tracking-tight text-black'>
                  {product.name}
                </h3>
                <p className='text-xs font-bold text-neutral-600 uppercase mt-1'>
                  {product.category}
                </p>
                <div className='mt-2 flex items-center gap-3'>
                  {hasDiscount ? (
                    <>
                      <span className='text-2xl font-black text-black'>
                        {formatPrice(product.price)}
                      </span>
                      <span className='text-lg text-neutral-400 line-through font-bold'>
                        {formatPrice(product.originalPrice!)}
                      </span>
                    </>
                  ) : (
                    <span className='text-2xl font-black text-black'>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <QuickAddSheet
          productId={product.id}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
        />
      </>
    );
  }

  // ========== EDITORIAL VARIANT ==========
  if (variant === "editorial") {
    return (
      <>
        <style>{rainbowBorderStyles}</style>
        <div className={cn("group relative", className)}>
          <Link href={`/collections/${product.slug || product.id}`}>
            <div className='relative'>
              <div className='aspect-square  border-4 transition-all relative border-neutral-300 group-hover:border-neutral-100 overflow-hidden bg-neutral-100'>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={95}
                  sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                  className={cn(
                    "object-cover object-center  transition-all duration-700 will-change-transform",
                    isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0",
                  )}
                  priority={isMobile}
                />
              </div>

              {/* Editorial Overlay Text */}
              <div className='absolute inset-0 flex flex-col justify-between p-1'>
                {/* Top Corner Info */}
                <div className='flex justify-between items-start  '>
                  {(hasDiscount || product.isNew || product.isHot) && (
                    <div className='absolute -top-[5px] -left-[10px] md:-top-[10px] md:-left-[20px] z-20'>
                      <div className='relative bg-primary animate-pulse backdrop-blur-md px-4 py-2'>
                        {/* Continuous Animated Border */}
                        <span className='absolute inset-0 z-0'>
                          {/* Top Border */}
                          <span className='absolute top-0 h-[2px] bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 animate-border-draw-top' />

                          {/* Right Border */}
                          <span className='absolute right-0 w-[2px] bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 animate-border-draw-right' />

                          {/* Bottom Border */}
                          <span className='absolute bottom-0 h-[2px] bg-gradient-to-l from-blue-50 via-blue-100 to-blue-200 animate-border-draw-bottom' />

                          {/* Left Border */}
                          <span className='absolute left-0 w-[2px] bg-gradient-to-t from-blue-50 via-blue-100 to-blue-200 animate-border-draw-left' />
                        </span>
                        <p className='text-xs font-serif italic text-white tracking-wide'>
                          {hasDiscount && `${discountPercentage}% OFF`}
                          {!hasDiscount && product.isNew && "NEW ARRIVAL"}
                          {!hasDiscount &&
                            !product.isNew &&
                            product.isHot &&
                            "TRENDING"}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleWishlist}
                    className={cn(
                      "p-2 transition-all",
                      isWishlisted
                        ? "text-rose-600"
                        : "text-white opacity-0 group-hover:opacity-100",
                    )}>
                    <Heart
                      className={cn("w-5 h-5", isWishlisted && "fill-current")}
                    />
                  </button>
                </div>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className='absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center'>
                    <p className='text-neutral-900 font-serif tracking-widest text-sm'>
                      Currently Unavailable
                    </p>
                  </div>
                )}
              </div>

              <div className=' md:hidden  left-0 right-0 py-1'>
                <div className='relative flex items-baseline justify-between gap-1 p-1 overflow-hidden'>
                  {/* Animated gradient border */}

                  {/* Inner content container */}
                  <div className='relative z-10 flex flex-col items-center justify-center w-full p-0'>
                    <p className='text-base md:text-xs font-serif font-bold tracking-widest uppercase text-black'>
                      {product?.name}
                    </p>
                    <div>
                      {hasDiscount ? (
                        <div className='flex items-baseline gap-2'>
                          <span className='text-sm md:text-xl font-serif text-black'>
                            {formatPrice(product.price)}
                          </span>
                          <span className='text-sm text-red-500 line-through'>
                            {formatPrice(product.originalPrice!)}
                          </span>
                        </div>
                      ) : (
                        <span className='text-sm md:text-xl font-serif text-black'>
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Price Banner - desktop */}
              <div className='mt-2 w-full hidden md:block  backdrop-blur-sm py-4 px-2 transform  translate-y-0 opacity-100 transition-all duration-500'>
                <p className='text-sm md:text-xs font-serif tracking-widest uppercase text-neutral-600 mb-1'>
                  {product?.name} * {product.category}
                </p>
                <div className='flex items-baseline justify-between'>
                  <div>
                    {hasDiscount ? (
                      <div className='flex items-baseline gap-2'>
                        <span className='text-sm md:text-xl font-serif text-black'>
                          {formatPrice(product.price)}
                        </span>
                        <span className='text-sm text-neutral-400 line-through'>
                          {formatPrice(product.originalPrice!)}
                        </span>
                      </div>
                    ) : (
                      <span className='text-sm md:text-xl font-serif text-black'>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  {!isOutOfStock && (
                    <ShoppingBag className='w-5 h-5 text-black' />
                  )}
                </div>
              </div>

              {/* Editorial Title */}
              <div className='mt-5 hidden'>
                <h3 className='text-base font-serif tracking-wide text-neutral-900'>
                  {product.name}
                </h3>
                {product.rating > 0 && (
                  <div className='flex items-center gap-1 mt-2'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-3 h-3",
                          i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300",
                        )}
                      />
                    ))}
                    <span className='text-xs text-neutral-500 ml-1 font-serif'>
                      ({product.reviewCount})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>

          {/* Editorial Quick Add */}
          <Button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className='w-full mt-0 md:mt-2 rounded-none font-serif tracking-wider text-xs border border-neutral-300 bg-transparent text-neutral-900 hover:bg-primary hover:text-white transition-all duration-300'
            variant='outline'>
            {isOutOfStock ? "OUT OF STOCK" : "QUICK VIEW"}
          </Button>
        </div>

        <QuickAddSheet
          productId={product.id}
          open={quickAddOpen}
          onOpenChange={setQuickAddOpen}
        />
      </>
    );
  }

  // Default fallback to luxury variant
  return null;
};

export default ProductCard;
