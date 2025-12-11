"use client";

/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import React, { useState } from "react";

interface IProp {
  product: IProduct | ProductType;
}

const DesktopViewCard: React.FC<IProp> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } =
    useWishlist();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isOutOfStock = !product?.quantity || product?.quantity < 1;
  const isInUserWishlist = isInWishlist(String(product?.slug || product?.id));

  // Get all available images (thumbnail + additional images)
  const productImages = React.useMemo(() => {
    const images: string[] = [];
    if (product?.thumbnail) images.push(product.thumbnail);
    if (product?.images && product.images.length > 0) {
      // Add additional images, avoiding duplicates
      product.images.forEach((img) => {
        if (img && !images.includes(img)) images.push(img);
      });
    }
    return images.length > 0 ? images : [imagePlaceHolder];
  }, [product?.thumbnail, product?.images]);

  const currentImage = productImages[currentImageIndex] || imagePlaceHolder;

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToWishlist(!isInUserWishlist);

    try {
      if (isInUserWishlist) {
        await removeFromWishlist(String(product?.id));
      } else {
        const wishlistItem: WishlistItem = {
          id: String(product.id),
          name: product.name || "",
          price: product?.updatedPrice || product.unitPrice || 0,
          thumbnail: product?.thumbnail || "",
          category:
            (product as any)?.category || (product as any)?.categoryId || "",
          inStock: !isOutOfStock,
          dateAdded: new Date().toISOString(),
          sku: (product as any)?.sku || "",
          description: product?.description || "",
          originalPrice: product.unitPrice || 0,
          variation: {
            id: "",
            size: "",
            color: "",
            sku: (product as any)?.sku || "",
            unitPrice: product?.updatedPrice || product.unitPrice || 0,
            quantity: 1,
          },
          slug: product?.slug,
          discountPercentage:
            product?.hasDiscount && product?.unitPrice && product?.updatedPrice
              ? Math.round(
                  ((product.unitPrice - product.updatedPrice) /
                    product.unitPrice) *
                    100
                )
              : undefined,
        };

        await addToWishlist(wishlistItem);
      }
    } catch (error) {
      console.error("Error handling wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <Card className='group relative overflow-hidden bg-white transition-all duration-300 ease-out rounded-xl shadow  p-0'>
      {/* Decorative Gradient Glow on Hover */}

      {/* Discount Badge - Clean Style */}
      {!!product.discount && (
        <div className='absolute top-2 left-2 z-20'>
          <Badge className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-semibold shadow-md rounded-xl'>
            {product.discountType === "%" &&
            !!product?.unitPrice &&
            !!product?.updatedPrice
              ? `-${Math.round(
                  ((product.unitPrice - product.updatedPrice) /
                    product.unitPrice) *
                    100
                )}%`
              : `-${product.discount}৳`}
          </Badge>
        </div>
      )}

      {/* Wishlist Heart Button - Clean Style */}
      <div className='absolute top-2 right-2 z-20'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleWishlistClick}
          disabled={isAddingToWishlist || isLoading}
          className={cn(
            "p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md",
            isInUserWishlist
              ? "text-red-500 hover:text-red-600"
              : "text-gray-500 hover:text-red-500"
          )}>
          <Heart
            className={cn(
              "w-4 h-4 transition-all duration-200",
              isInUserWishlist ? "fill-current" : "",
              isAddingToWishlist && "animate-pulse"
            )}
          />
        </Button>
      </div>

      {/* Product Image Carousel with Enhanced Hover */}
      <div className='relative overflow-hidden rounded-t-md '>
        <img
          alt={product?.name ?? "product"}
          src={currentImage}
          className='aspect-square w-full object-cover transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-gray-50 to-gray-100'
        />

        {/* Image Navigation Dots - Only show if multiple images */}
        {productImages.length > 1 && (
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm'>
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  index === currentImageIndex
                    ? "bg-gray-800 w-3"
                    : "bg-gray-400 hover:bg-gray-600"
                )}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className='px-4 pb-4 pt-3 space-y-1 relative'>
        {/* Product Name - Left Aligned */}
        <div className='w-full flex justify-between items-center pt-2'>
          <h4 className='text-lg md:text-xl font-bold text-gray-900 line-clamp-2 leading-snug uppercase'>
            <a
              href={`/collections/${product?.slug}`}
              className='block hover:text-gray-700 transition-colors uppercase'>
              <span aria-hidden='true' className='absolute inset-0' />
              {product.name}
            </a>
          </h4>
          <Badge
            variant='secondary'
            className='bg-muted text-muted-foreground hover:bg-muted/80 text-xs font-medium uppercase tracking-wide'>
            {product?.categoryName || "Uncategorized"}
          </Badge>
        </div>

        {/* Price Section - Left Aligned */}
        <div className='flex items-center justify-between py-2'>
          <div className='text-sm font-semibold flex justify-start items-center'>
            <Star className=' w-4 h-4 text-orange-300 mr-2' />
            {product?.rating || 5.0}/5.0
          </div>
          {product?.hasDiscount && product?.updatedPrice ? (
            <div className='gap-1 justify-end flex items-center'>
              <del className='text-sm text-red-400 font-normal mr-1'>
                ৳{product?.unitPrice?.toLocaleString()}
              </del>
              <p className=' text-base md:text-lg font-bold text-primary'>
                ৳{product?.updatedPrice?.toLocaleString()}
              </p>
            </div>
          ) : (
            <p className='text-base md:text-lg font-bold text-primary'>
              ৳{product.unitPrice?.toLocaleString()}
            </p>
          )}
        </div>

        {/* Action Button - Clean Default Styling */}
        <Button
          variant={isOutOfStock ? "outline" : "default"}
          size='default'
          className={cn(
            "w-full font-semibold text-lg rounded h-12",
            isOutOfStock && "text-gray-500"
          )}
          disabled={isOutOfStock}>
          {isOutOfStock ? (
            <span>Out Of Stock</span>
          ) : (
            <>
              <ShoppingCart className='mr-2 w-5 h-5' />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default React.memo(DesktopViewCard, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.quantity === nextProps.product.quantity &&
    prevProps.product.updatedPrice === nextProps.product.updatedPrice
  );
});
