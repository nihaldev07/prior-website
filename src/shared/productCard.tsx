import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { Tag, Heart, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface IProp {
  product: IProduct | ProductType;
  variant?: "luxury" | "minimal" | "bold" | "editorial";
}

const ProductCard: React.FC<IProp> = ({ product, variant = "luxury" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const isOutOfStock = !product?.quantity || product?.quantity < 1;

  // Luxury Fashion Variant
  if (variant === "luxury") {
    return (
      <Link href={`/collections/${product?.id}`} prefetch={false}>
        <div
          className='group relative overflow-hidden'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {/* Image Container with Overlay */}
          <div className='relative aspect-[3/4] overflow-hidden rounded-none bg-neutral-100'>
            {/* Product Image */}
            <Image
              alt={product?.name ?? "Fashion product"}
              src={product?.thumbnail || imagePlaceHolder}
              fill
              quality={90}
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
              className={cn(
                "object-cover object-center transition-all duration-700 ease-out",
                isHovered ? "scale-105" : "scale-100",
              )}
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
              {/* Discount Badge */}
              {product?.hasDiscount && product?.discount && (
                <Badge
                  variant='secondary'
                  className='bg-white/95 backdrop-blur-sm text-black border-0 px-3 py-1 text-xs font-medium tracking-wider'>
                  -
                  {product?.discountType !== "%"
                    ? `৳${product?.discount}`
                    : `${product?.discount}%`}
                </Badge>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsWishlisted(!isWishlisted);
                }}
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
                    QUICK SHOP
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
            {product?.categoryName && (
              <p className='text-xs text-neutral-500 tracking-wider uppercase'>
                {product.categoryName}
              </p>
            )}

            {/* Rating */}
            {product?.rating && (
              <div className='flex items-center gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(product.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300",
                    )}
                  />
                ))}
                <span className='text-xs text-neutral-500 ml-1'>
                  ({product.rating})
                </span>
              </div>
            )}

            {/* Price */}
            <div className='flex items-baseline gap-2'>
              {product?.hasDiscount && product?.updatedPrice ? (
                <>
                  <span className='text-base font-semibold text-neutral-900'>
                    ৳{product.updatedPrice.toLocaleString()}
                  </span>
                  <span className='text-sm text-neutral-400 line-through'>
                    ৳{product.unitPrice?.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className='text-base font-semibold text-neutral-900'>
                  ৳{product.unitPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Minimal Elegant Variant
  if (variant === "minimal") {
    return (
      <Link href={`/collections/${product?.id}`} prefetch={false}>
        <div className='group relative'>
          {/* Image Container */}
          <div className='relative aspect-[2/3] overflow-hidden bg-neutral-50'>
            <Image
              alt={product?.name ?? "Fashion product"}
              src={product?.thumbnail || imagePlaceHolder}
              fill
              quality={90}
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
              className='object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]'
            />

            {/* Minimal Badge */}
            {product?.hasDiscount && product?.discount && (
              <div className='absolute top-4 right-4'>
                <div className='w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xs font-light'>
                  -{product?.discount}
                  {product?.discountType === "%" ? "%" : "৳"}
                </div>
              </div>
            )}

            {/* Wishlist - Minimal */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className='absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <Heart
                className={cn(
                  "w-5 h-5 transition-all",
                  isWishlisted ? "fill-black text-black" : "text-black",
                )}
              />
            </button>
          </div>

          {/* Minimal Info */}
          <div className='mt-6 space-y-1'>
            <h3 className='text-sm font-light tracking-wider text-neutral-800 uppercase'>
              {product.name}
            </h3>
            <div className='flex items-baseline gap-3'>
              {product?.hasDiscount && product?.updatedPrice ? (
                <>
                  <span className='text-sm font-medium text-neutral-900'>
                    ৳{product.updatedPrice.toLocaleString()}
                  </span>
                  <span className='text-xs text-neutral-400 line-through font-light'>
                    ৳{product.unitPrice?.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className='text-sm font-medium text-neutral-900'>
                  ৳{product.unitPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Bold Modern Variant
  if (variant === "bold") {
    return (
      <Link href={`/collections/${product?.id}`} prefetch={false}>
        <div
          className='group relative overflow-hidden'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {/* Image with Bold Border */}
          <div className='relative aspect-square overflow-hidden border-4 border-black transition-all duration-500 group-hover:border-neutral-600'>
            <Image
              alt={product?.name ?? "Fashion product"}
              src={product?.thumbnail || imagePlaceHolder}
              fill
              quality={90}
              sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
              className={cn(
                "object-cover object-center transition-all duration-700",
                isHovered ? "scale-110 rotate-2" : "scale-100 rotate-0",
              )}
            />

            {/* Bold Discount Tag */}
            {product?.hasDiscount && product?.discount && (
              <div className='absolute top-0 right-0 bg-yellow-400 text-black px-6 py-3 font-bold text-sm transform rotate-3 shadow-xl'>
                SAVE {product?.discount}
                {product?.discountType === "%" ? "%" : "৳"}!
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
                  disabled={isOutOfStock}
                  className='flex-1 bg-white text-black hover:bg-yellow-400 font-bold rounded-none'>
                  {isOutOfStock ? "SOLD OUT" : "ADD TO BAG"}
                </Button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsWishlisted(!isWishlisted);
                  }}
                  className='ml-3 p-3 bg-white text-black hover:bg-yellow-400 transition-colors'>
                  <Heart
                    className={cn("w-5 h-5", isWishlisted && "fill-current")}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bold Typography */}
          <div className='mt-4'>
            <h3 className='text-lg font-black uppercase tracking-tight text-black'>
              {product.name}
            </h3>
            <div className='mt-2 flex items-center gap-3'>
              {product?.hasDiscount && product?.updatedPrice ? (
                <>
                  <span className='text-2xl font-black text-black'>
                    ৳{product.updatedPrice.toLocaleString()}
                  </span>
                  <span className='text-lg text-neutral-400 line-through font-bold'>
                    ৳{product.unitPrice?.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className='text-2xl font-black text-black'>
                  ৳{product.unitPrice?.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Editorial Magazine Variant
  if (variant === "editorial") {
    return (
      <Link href={`/collections/${product?.id}`} prefetch={false}>
        <div className='group relative'>
          {/* Image Container with Editorial Layout */}
          <div className='relative'>
            <div className='aspect-[4/5] overflow-hidden bg-neutral-100'>
              <Image
                alt={product?.name ?? "Fashion product"}
                src={product?.thumbnail || imagePlaceHolder}
                fill
                quality={90}
                sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
                className='object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700'
              />
            </div>

            {/* Editorial Overlay Text */}
            <div className='absolute inset-0 flex flex-col justify-between p-6'>
              {/* Top Corner Info */}
              <div className='flex justify-between items-start'>
                {product?.hasDiscount && (
                  <div className='bg-white/95 backdrop-blur-sm px-4 py-2'>
                    <p className='text-xs font-serif italic text-black'>
                      Special Price
                    </p>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsWishlisted(!isWishlisted);
                  }}
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

              {/* Bottom Price Banner */}
              <div className='bg-white/95 backdrop-blur-sm p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500'>
                <p className='text-xs font-serif tracking-widest uppercase text-neutral-600 mb-1'>
                  {product?.categoryName || "New Arrival"}
                </p>
                <div className='flex items-baseline justify-between'>
                  <div>
                    {product?.hasDiscount && product?.updatedPrice ? (
                      <div className='flex items-baseline gap-2'>
                        <span className='text-xl font-serif text-black'>
                          ৳{product.updatedPrice.toLocaleString()}
                        </span>
                        <span className='text-sm text-neutral-400 line-through'>
                          ৳{product.unitPrice?.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className='text-xl font-serif text-black'>
                        ৳{product.unitPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {!isOutOfStock && (
                    <ShoppingBag className='w-5 h-5 text-black' />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Title */}
          <div className='mt-5'>
            <h3 className='text-base font-serif tracking-wide text-neutral-900'>
              {product.name}
            </h3>
            {isOutOfStock && (
              <p className='text-xs text-red-600 mt-1 font-medium tracking-wider uppercase'>
                Currently Unavailable
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default fallback to luxury variant
  return null;
};

export default ProductCard;
