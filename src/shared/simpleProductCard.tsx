"use client";

/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { TagIcon, Heart, ShoppingCart } from "lucide-react";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import React, { useState } from "react";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } =
    useWishlist();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const isOutOfStock = !product?.quantity || product?.quantity < 1;
  const isInUserWishlist = isInWishlist(String(product?.slug || product?.id));

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
    <Card className='group relative overflow-hidden bg-white  transition-all duration-300 ease-in-out transform border-0 rounded-sm shadow-none p-0'>
      {/* Discount Badge */}
      {!!product.discount && (
        <div className='absolute top-3 left-3 z-20'>
          <Badge className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-1 text-xs font-bold shadow-lg animate-pulse rounded-full'>
            <TagIcon className='mr-1 w-3 h-3' />
            {product.discountType === "%" &&
            !!product?.unitPrice &&
            !!product?.updatedPrice
              ? `${Math.round(
                  ((product.unitPrice - product.updatedPrice) /
                    product.unitPrice) *
                    100
                )}%`
              : `${product.discount}৳`}{" "}
            OFF
          </Badge>
        </div>
      )}

      {/* Wishlist Heart Button */}
      <div className='absolute top-3 right-3 z-20'>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleWishlistClick}
          disabled={isAddingToWishlist || isLoading}
          className={cn(
            "p-2 rounded-full backdrop-blur-sm bg-white/80 hover:bg-white/90 transition-all duration-200",
            "shadow-md hover:shadow-lg",
            isInUserWishlist
              ? "text-red-500 hover:text-red-600"
              : "text-gray-600 hover:text-red-500"
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

      {/* Product Image */}
      <div className='relative overflow-hidden'>
        <img
          alt={product?.name ?? "product"}
          src={product?.thumbnail ?? imagePlaceHolder}
          className='aspect-square w-full object-cover rounded-sm transition-transform duration-300 group-hover:scale-105 bg-gray-100'
        />

        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>

      <CardContent className='px-0 py-1.5 space-y-[2px]'>
        {/* Product Name */}
        <div>
          <h4
            className={`text-lg font-semibold text-primary  price line-clamp-2 group-hover:text-primary transition-colors duration-200 text-center uppercase`}>
            <a href={`/collections/${product?.slug}`} className='block'>
              <span aria-hidden='true' className='absolute inset-0' />
              {product.name}
            </a>
          </h4>
        </div>

        {/* Price Section */}
        <div className='flex items-center justify-center gap-2'>
          {product?.hasDiscount && product?.updatedPrice ? (
            <>
              <del className='text-sm text-red-500 font-medium price'>
                ৳ {product?.unitPrice?.toLocaleString()}
              </del>
              <p className='text-base md:text-lg  font-bold text-gray-900 price'>
                ৳ {product?.updatedPrice?.toLocaleString()}
              </p>
            </>
          ) : (
            <p className='text-base md:text-lg  font-bold text-gray-900 price'>
              ৳ {product.unitPrice?.toLocaleString()}
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          variant={isOutOfStock ? "outline" : "default"}
          size='lg'
          className={cn(
            "w-full font-semibold transition-all duration-200 rounded-sm",
            isOutOfStock
              ? "border-gray-300 text-gray-500 hover:bg-gray-50"
              : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md"
          )}
          disabled={isOutOfStock}>
          {isOutOfStock ? (
            "Out Of Stock"
          ) : (
            <>
              <ShoppingCart className='mr-2 w-4 h-4' />
              Shop Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.quantity === nextProps.product.quantity &&
    prevProps.product.updatedPrice === nextProps.product.updatedPrice
  );
});
