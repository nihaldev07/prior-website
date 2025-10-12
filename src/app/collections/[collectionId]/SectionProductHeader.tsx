"use client";
import Image from "next/image";
import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import ImageShowCase from "@/components/ImageShowCase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { SingleProductType, Variation } from "@/data/types";
import { useCart } from "@/context/CartContext";
import {
  Info,
  TagIcon,
  ShoppingCart,
  Zap,
  Package,
  CheckCircle,
  XCircle,
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { trackEvent } from "@/lib/firebase-event";
import useAnalytics from "@/hooks/useAnalytics";
import EnhancedVariantSelector from "./EnhancedVariantSelector";
import ShareButton from "@/shared/ShareButton";

interface SectionProductHeaderProps {
  shots: string[];
  shoeName: string;
  prevPrice: number;
  currentPrice: number;
  rating: number;
  pieces_sold: number;
  reviews: number;
  product: SingleProductType;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  shots,
  shoeName,
  prevPrice,
  currentPrice,
  rating,
  pieces_sold,
  reviews,
  product,
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  useAnalytics();

  const [pQuantity, setPQuantity] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);

  useEffect(() => {
    if (!!product) {
      trackEvent("select_item", {
        item_id: product?.id,
        item_name: product?.name,
      });
      trackEvent("view_item", {
        item_id: product?.id,
        item_name: product?.name,
        price: prevPrice > 0 ? prevPrice : currentPrice,
        currency: "BDT",
      });
      setUniqueColors([
        ...new Set(
          product?.variation.filter((c) => !!c.color).map((v) => v.color) ?? []
        ),
      ]);
      setUniqueSizes([
        ...new Set(
          product?.variation.filter((s) => !!s.size).map((v) => v.size) ?? []
        ),
      ]);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleCartSelection = (isBuy = false) => {
    if (product.hasVariation && !selectedVariant) {
      return Swal.fire(
        "Select size & color",
        "Please select size & color",
        "warning"
      );
    } else if (pQuantity < 1) {
      return Swal.fire("Select quantity", "Please select quantity", "warning");
    }

    const productData = {
      id: product?.id,
      sku: product?.sku,
      name: product?.name,
      active: true,
      quantity: pQuantity,
      unitPrice: product?.unitPrice,
      manufactureId: "",
      discountType: product?.discountType,
      updatedPrice: product?.updatedPrice ?? 0,
      hasDiscount: product?.discount > 0 && !!product?.updatedPrice,
      discount: product?.discount,
      description: product?.description,
      thumbnail: product?.thumbnail,
      productCode: product?.productCode,
      totalPrice: Number(
        (product?.discount > 0 && !!product?.updatedPrice
          ? product?.updatedPrice
          : product?.unitPrice) * Number(pQuantity)
      ).toFixed(2),
      categoryName: product?.categoryName,
      hasVariation: product?.hasVariation,
      variation: selectedVariant,
      maxQuantity: !!selectedVariant
        ? selectedVariant?.quantity
        : product?.quantity,
    };
    //@ts-ignore
    addToCart(productData);

    Swal.fire({
      title: "Added to Cart",
      text: `${product.name} added to cart successfully!`,
      icon: "success",
    }).then(() => {
      if (isBuy) router.push("/cart");
    });
  };

  const handleQuantityChange = (change: number) => {
    const maxQty = selectedVariant?.quantity ?? product.quantity;
    const newQty = Math.max(1, Math.min(maxQty, pQuantity + change));
    setPQuantity(newQty);
  };

  const discountPercentage = useMemo(() => {
    if (prevPrice > 0 && currentPrice > 0) {
      return Math.round(((prevPrice - currentPrice) / prevPrice) * 100);
    }
    return 0;
  }, [prevPrice, currentPrice]);

  const isOutOfStock =
    (!!selectedVariant && selectedVariant?.quantity < 1) ||
    product.quantity < 1;
  const maxQuantity = selectedVariant?.quantity ?? product.quantity;

  return (
    <div className=' bg-background'>
      <div className='md:container mx-auto  md:px-2 max-w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
          {/* Image Gallery Section */}
          <div className='space-y-4'>
            <div className='relative'>
              <ImageShowCase shots={shots} />
              {product.discount > 0 && (
                <div className='absolute top-4 left-4 z-10'>
                  <Badge className='bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg'>
                    <TagIcon className='mr-2 w-4 h-4' />
                    {product.discountType === "%"
                      ? `${discountPercentage}%`
                      : `${product.discount}৳`}{" "}
                    OFF
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Information Section */}
          <div className='space-y-8'>
            {/* Header */}
            <div className='space-y-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1 space-y-3'>
                  <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight  uppercase price'>
                    {product?.name}
                  </h1>
                  <Badge
                    variant='secondary'
                    className='bg-muted text-muted-foreground hover:bg-muted/80 text-xs font-medium uppercase tracking-wide'>
                    {product.categoryName}
                  </Badge>
                  {/* Stock Status */}
                  <div className='flex justify-start items-center space-x-2'>
                    <span className='text-sm font-semibold text-zinc-800'>
                      Availability:{" "}
                    </span>
                    {isOutOfStock ? (
                      <div className='flex items-center space-x-2 text-red-600 px-3 py-1.5 rounded-md'>
                        <XCircle className='h-4 w-4' />
                        <span className='text-sm font-medium'>
                          Out of Stock
                        </span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-2 text-green-600'>
                        <CheckCircle className='h-4 w-4' />
                        <span className='text-sm font-medium'>In Stock</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className=' flex items-center space-x-2 ml-4 float-right'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsFavorite(!isFavorite)}
                    className='hover:scale-110 transition-transform duration-200 text-muted-foreground hover:text-foreground hidden'>
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <ShareButton
                    linkToShare={`https://priorbd.com/collections/${product?.slug}`}
                    title={`Check out this awesome product: ${product?.name}`}
                    text={
                      product.discount > 0
                        ? `This ${product?.categoryName} is now ${
                            product.discountType === "%"
                              ? `${discountPercentage}%`
                              : `${product.discount}৳`
                          } OFF. Don't miss out!`
                        : `This ${product?.categoryName} is only have ${maxQuantity} item left. Don't miss out!`
                    }
                  />
                </div>
              </div>

              {/* Rating and Sales 
               todo : need to add flex replace of hidden
              */}
              {/* {(rating > 0 || pieces_sold > 0) && (
                <div className=' items-center space-x-6 text-sm hidden'>
                  {rating > 0 && (
                    <div className='flex items-center space-x-2'>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-muted-foreground'>
                        ({reviews} reviews)
                      </span>
                    </div>
                  )}
                  {pieces_sold > 0 && (
                    <div className='flex items-center space-x-1 text-muted-foreground'>
                      <Package className='h-4 w-4' />
                      <span>{pieces_sold} sold</span>
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Price Section */}
            <div className='space-y-1'>
              <div className='flex items-center space-x-4'>
                <span className='text-3xl md:text-4xl font-bold text-foreground price'>
                  ৳{currentPrice.toLocaleString()}
                </span>
                {prevPrice > 0 && (
                  <span className='text-xl text-red-600 line-through price'>
                    ৳{prevPrice.toLocaleString()}
                  </span>
                )}
                {!!product.discount && (
                  <Badge className='bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 price'>
                    <TagIcon className='mr-1 w-3 h-3' />
                    {product.discountType === "%"
                      ? `${discountPercentage}%`
                      : `${product.discount}৳`}{" "}
                    OFF
                  </Badge>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className='text-sm text-rose-600 font-medium'>
                  You save ৳{(prevPrice - currentPrice).toLocaleString()}
                </p>
              )}
            </div>

            {/* Variant Selection */}
            {uniqueColors.length > 0 && (
              <EnhancedVariantSelector
                type='color'
                list={uniqueColors}
                selectedProduct={product}
                selectedVariant={selectedVariant}
                selected={!!selectedVariant ? selectedVariant?.color : ""}
                onVariantChange={(variant: Variation) => {
                  setSelectedVariant(variant);
                  setPQuantity(Math.min(pQuantity, variant.quantity));
                }}
              />
            )}

            {uniqueSizes.length > 0 && (
              <div className='space-y-4'>
                <div className=' relative '>
                  <EnhancedVariantSelector
                    type='size'
                    list={uniqueSizes}
                    selectedProduct={product}
                    selectedVariant={selectedVariant}
                    selected={!!selectedVariant ? selectedVariant?.size : ""}
                    onVariantChange={(variant: Variation) => {
                      setSelectedVariant(variant);
                      setPQuantity(Math.min(pQuantity, variant.quantity));
                    }}
                  />
                  <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
                    <DialogTrigger
                      asChild
                      className=' absolute top-[-5px] right-1 '>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-primary hover:text-primary/80 text-sm'>
                        <Info className='h-4 w-4 mr-1' />
                        Size Guide
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <DialogHeader>
                        <DialogTitle>Size Guide</DialogTitle>
                      </DialogHeader>
                      <div className='mt-4'>
                        <Image
                          src='https://res.cloudinary.com/emerging-it/image/upload/v1726649836/oafeegdk1zpxmgytikrl.jpg'
                          width={600}
                          height={400}
                          alt='size-guide'
                          className='w-full h-auto rounded-lg'
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {!isOutOfStock && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-800 uppercase tracking-wide'>
                    Quantity
                  </span>
                  <span className='text-xs text-gray-700'>
                    {maxQuantity} available
                  </span>
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='flex items-center border rounded-lg'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleQuantityChange(-1)}
                      disabled={pQuantity <= 1}
                      className='h-10 w-10 rounded-r-none border-r hover:bg-muted'>
                      <Minus className='h-4 w-4' />
                    </Button>
                    <div className='flex items-center justify-center w-16 h-10 text-lg font-semibold bg-background'>
                      {pQuantity}
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleQuantityChange(1)}
                      disabled={pQuantity >= maxQuantity}
                      className='h-10 w-10 rounded-l-none border-l hover:bg-muted'>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOutOfStock && (
              <div className='space-y-3 pt-4'>
                <Button
                  onClick={() => handleCartSelection(true)}
                  disabled={pQuantity < 1}
                  className='w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200 shadow-lg'
                  size='lg'>
                  <Zap className='mr-2 h-5 w-5' />
                  Buy Now
                </Button>
                <Button
                  onClick={() => handleCartSelection()}
                  disabled={pQuantity < 1}
                  variant='outline'
                  className='w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-200'
                  size='lg'>
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  Add to Cart
                </Button>
              </div>
            )}
            <div className='mt-2 hidden md:block'>
              <div className='max-w-4xl'>
                <h2 className='text-2xl font-bold text-foreground mb-6'>
                  Product Details
                </h2>
                <Separator className='mb-6' />
                <div className='prose prose-gray max-w-none'>
                  <div
                    className='text-foreground font-medium leading-relaxed text-base'
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description?.replace(/\n/g, "<br />") ??
                        "No description available.",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className='mt-6 md:hidden'>
          <div className='max-w-4xl'>
            <h2 className='text-2xl font-bold text-foreground mb-6'>
              Product Details
            </h2>
            <Separator className='mb-6' />
            <div className='prose prose-gray max-w-none'>
              <div
                className='text-foreground font-medium leading-relaxed text-base'
                dangerouslySetInnerHTML={{
                  __html:
                    product.description?.replace(/\n/g, "<br />") ??
                    "No description available.",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionProductHeader;
