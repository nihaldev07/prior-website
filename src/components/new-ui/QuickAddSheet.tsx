"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Loader2, X, Zap } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useCart } from "@/context/CartContext";
import { fetchProductById } from "@/services/productServices";
import { SingleProductType, Variation } from "@/data/types";
import EnhancedVariantSelector from "@/app/collections/[collectionId]/EnhancedVariantSelector";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface QuickAddSheetProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * QuickAddSheet Component - Editorial Design
 * Magazine-quality layout with sophisticated typography and refined interactions
 * Features serif fonts, generous whitespace, and elegant composition
 */
export default function QuickAddSheet({
  productId,
  open,
  onOpenChange,
}: QuickAddSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null,
  );
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch product details when opened
  useEffect(() => {
    if (open && productId) {
      fetchProductDetails();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);
      if (data?.thumbnail && data?.images.length > 0)
        setShots([data?.thumbnail, ...data?.images]);

      // Extract unique colors and sizes
      if (data && data.variation && data.variation.length > 0) {
        setUniqueColors([
          ...new Set(
            data.variation.filter((v) => !!v.color).map((v) => v.color),
          ),
        ]);
        setUniqueSizes([
          ...new Set(data.variation.filter((v) => !!v.size).map((v) => v.size)),
        ]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      Swal.fire("Error", "Failed to load product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change: number) => {
    const maxQty = selectedVariant?.quantity ?? product?.quantity ?? 1;
    const newQty = Math.max(1, Math.min(maxQty, quantity + change));
    setQuantity(newQty);
  };

  const handleImageSelect = (index: number) => {
    if (index === selectedImageIndex) return;

    setIsImageLoading(true);

    setSelectedImageIndex(index);

    // Simulate loading time for smoother transition
  };

  const handleAddToCart = (isBuyNow = false) => {
    if (!product) return;

    if (product.hasVariation && !selectedVariant) {
      return Swal.fire(
        "Select Variant",
        "Please select size & color",
        "warning",
      );
    }

    if (quantity < 1) {
      return Swal.fire("Select Quantity", "Please select quantity", "warning");
    }

    const productData = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      active: true,
      quantity: quantity,
      unitPrice: product.unitPrice,
      manufactureId: "",
      discountType: product.discountType,
      updatedPrice: product.updatedPrice ?? 0,
      hasDiscount: product.discount > 0 && !!product.updatedPrice,
      discount: product.discount,
      description: product.description,
      thumbnail: product.thumbnail,
      productCode: product.productCode,
      totalPrice: Number(
        (product.discount > 0 && !!product.updatedPrice
          ? product.updatedPrice
          : product.unitPrice) * Number(quantity),
      ).toFixed(2),
      categoryName: product.categoryName,
      hasVariation: product.hasVariation,
      variation: selectedVariant,
      maxQuantity: !!selectedVariant
        ? selectedVariant.quantity
        : product.quantity,
    };

    // @ts-ignore
    addToCart(productData);

    if (isBuyNow) router.push("/checkout");
    else
      Swal.fire({
        title: "Added to Cart",
        text: `${product.name.toUpperCase()} added to cart successfully!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

    // Reset and close
    onOpenChange(false);
    setQuantity(1);
    setSelectedVariant(null);
  };

  const currentPrice =
    (product?.discount ?? 0) > 0 && product?.updatedPrice
      ? product.updatedPrice
      : (product?.unitPrice ?? 0);
  const prevPrice =
    (product?.discount ?? 0) > 0 && product?.updatedPrice
      ? product.unitPrice
      : 0;
  const discountPercentage =
    prevPrice > 0 && currentPrice > 0
      ? Math.round(((prevPrice - currentPrice) / prevPrice) * 100)
      : 0;

  const isOutOfStock =
    (!!selectedVariant && selectedVariant.quantity < 1) ||
    (product?.quantity ?? 0) < 1;
  const maxQuantity = selectedVariant?.quantity ?? product?.quantity ?? 1;

  const Content = () => (
    <div className='space-y-8 px-1'>
      {loading ? (
        <div className='flex flex-col items-center justify-center py-16'>
          <Loader2 className='w-10 h-10 text-neutral-400 animate-spin mb-4' />
          <p className='text-sm font-serif text-neutral-600 tracking-wide'>
            Loading product details...
          </p>
        </div>
      ) : product ? (
        <>
          {/* Product Hero Section - Editorial Style */}
          <div className='space-y-6'>
            {/* Large Product Image */}
            <div className='relative w-full aspect-square bg-neutral-50 rounded-sm overflow-hidden'>
              <Image
                src={
                  shots.length > 0
                    ? shots[selectedImageIndex]
                    : product.thumbnail
                }
                alt={product.name}
                fill
                onLoad={() => setIsImageLoading(false)}
                className={cn("object-contain")}
              />
              {discountPercentage > 0 && (
                <div className='absolute top-4 right-4'>
                  <div className='bg-white/95 backdrop-blur-sm px-4 py-2 shadow-sm'>
                    <p className='text-xs font-serif italic text-neutral-900'>
                      {discountPercentage}% Off
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {shots.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {shots.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 p-0 rounded-sm overflow-hidden border transition-all duration-300 relative",
                      selectedImageIndex === index
                        ? "border-neutral-900 "
                        : "border-neutral-200 hover:border-neutral-400",
                    )}>
                    {isImageLoading && selectedImageIndex === index && (
                      <div className='absolute inset-0 flex items-center justify-center bg-neutral-100 z-10'>
                        <div className='w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin'></div>
                      </div>
                    )}
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Title & Category - Editorial Typography */}
            <div className='space-y-3'>
              <p className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
                {product.categoryName || "Collection"}
              </p>
              <h3 className='text-2xl uppercase font-serif tracking-wide text-neutral-900 leading-tight'>
                {product.name}
              </h3>
            </div>

            {/* Price Section - Magazine Style */}
            <div className='flex items-baseline gap-3 pb-2 border-b border-neutral-200'>
              <span className='text-3xl font-serif text-neutral-900'>
                ৳{currentPrice.toLocaleString()}
              </span>
              {prevPrice > 0 && (
                <span className='text-lg font-serif text-neutral-400 line-through'>
                  ৳{prevPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Product Description - Editorial */}
          {product.description && (
            <div className='space-y-2'>
              <h4 className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                Details
              </h4>
              <p className='text-sm font-serif leading-relaxed text-neutral-600'>
                {product.description}
              </p>
            </div>
          )}

          {/* Variant Selectors - Refined */}
          {product.hasVariation && (
            <div className='space-y-6'>
              <div className='h-px bg-neutral-200' />

              {uniqueColors.length > 0 && (
                <div className='space-y-3'>
                  <label className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                    Select Color
                  </label>
                  <EnhancedVariantSelector
                    type='color'
                    selectedProduct={product}
                    list={uniqueColors}
                    selected={selectedVariant?.color ?? ""}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              )}

              {uniqueSizes.length > 0 && (
                <div className='space-y-3'>
                  <label className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                    Select Size
                  </label>
                  <EnhancedVariantSelector
                    type='size'
                    selectedProduct={product}
                    list={uniqueSizes}
                    selected={selectedVariant?.size ?? ""}
                    selectedVariant={selectedVariant}
                    onVariantChange={setSelectedVariant}
                  />
                </div>
              )}
            </div>
          )}

          {/* Quantity Selector - Editorial */}
          <div className='space-y-4'>
            <div className='h-px bg-neutral-200' />

            <div className='space-y-3'>
              <label className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                Quantity
              </label>

              <div className='flex items-center justify-center gap-6'>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className='w-10 h-10 flex items-center justify-center border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'>
                  <Minus className='h-4 w-4 text-neutral-900' />
                </button>

                <div className='min-w-[60px] text-center'>
                  <span className='text-2xl font-serif text-neutral-900'>
                    {quantity}
                  </span>
                </div>

                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className='w-10 h-10 flex items-center justify-center border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'>
                  <Plus className='h-4 w-4 text-neutral-900' />
                </button>
              </div>
            </div>
          </div>

          {/* Stock Status - Editorial Alert */}
          {isOutOfStock && (
            <div className='border border-neutral-300 bg-neutral-50 rounded-sm p-4'>
              <p className='text-sm font-serif text-center text-neutral-700 tracking-wide'>
                Currently Unavailable
              </p>
            </div>
          )}

          {/* {!isOutOfStock && maxQuantity <= 5 && (
            <div className='border border-amber-300 bg-amber-50 rounded-sm p-4'>
              <p className='text-sm font-serif text-center text-amber-900 tracking-wide'>
                Only {maxQuantity} remaining in stock
              </p>
            </div>
          )} */}

          {/* Selected Variant Display - Editorial */}
          {product.hasVariation && selectedVariant && (
            <div className='bg-neutral-50 border border-neutral-200 rounded-sm p-4'>
              <div className='flex items-center justify-center gap-4 text-sm font-serif'>
                {selectedVariant.color && (
                  <div className='flex items-center gap-2'>
                    <span className='text-neutral-600 tracking-wide'>
                      Color:
                    </span>
                    <span className='text-neutral-900 font-medium tracking-wide'>
                      {selectedVariant.color}
                    </span>
                  </div>
                )}
                {selectedVariant.size && (
                  <div className='flex items-center gap-2'>
                    <span className='text-neutral-600 tracking-wide'>
                      Size:
                    </span>
                    <span className='text-neutral-900 font-medium tracking-wide'>
                      {selectedVariant.size}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button - Editorial */}
          <div className='pt-2 space-y-3'>
            <Button
              onClick={() => handleAddToCart(true)}
              disabled={isOutOfStock}
              className='w-full h-14 text-sm font-serif tracking-[0.15em] uppercase bg-neutral-900 hover:bg-neutral-800 text-white rounded-none transition-colors duration-300'
              size='lg'>
              <Zap className='mr-2 h-5 w-5' />
              Buy Now
            </Button>
            <Button
              className='w-full h-14 text-sm font-serif tracking-[0.15em] uppercase bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white border-0 rounded-none transition-colors duration-300'
              onClick={() => handleAddToCart()}
              disabled={isOutOfStock}>
              <ShoppingCart className='w-4 h-4 mr-3' />
              Add to Cart
            </Button>
          </div>
        </>
      ) : (
        <div className='text-center py-16'>
          <p className='text-sm font-serif text-neutral-600 tracking-wide'>
            Product not found
          </p>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side='right'
          className='w-full sm:max-w-lg overflow-y-auto bg-white border-l border-neutral-200'>
          <SheetHeader className='mb-8 pb-6 border-b border-neutral-200'>
            <SheetTitle className='text-xl font-serif tracking-wide text-neutral-900'>
              Quick Add
            </SheetTitle>
            <SheetDescription className='text-sm font-serif text-neutral-600 tracking-wide'>
              Select your preferred options
            </SheetDescription>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='max-h-[90vh] bg-white'>
        <DrawerHeader className='text-left pb-6 border-b border-neutral-200'>
          <DrawerTitle className='text-xl font-serif tracking-wide text-neutral-900'>
            Quick Add
          </DrawerTitle>
          <DrawerDescription className='text-sm font-serif text-neutral-600 tracking-wide'>
            Select your preferred options
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-6 overflow-y-auto'>
          <Content />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
