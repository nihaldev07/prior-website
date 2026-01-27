"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
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

interface QuickAddSheetProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * QuickAddSheet Component
 * Shows product variants in a Sheet (desktop) or Drawer (mobile)
 * Allows quick add to cart without navigating to product page
 */
export default function QuickAddSheet({
  productId,
  open,
  onOpenChange,
}: QuickAddSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addToCart } = useCart();

  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null
  );
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);

  // Fetch product details when opened
  useEffect(() => {
    if (open && productId) {
      fetchProductDetails();
    }
  }, [open, productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchProductById(productId);
      setProduct(data);

      // Extract unique colors and sizes
      if (data && data.variation && data.variation.length > 0) {
        setUniqueColors([
          ...new Set(
            data.variation.filter((v) => !!v.color).map((v) => v.color)
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

  const handleAddToCart = () => {
    if (!product) return;

    if (product.hasVariation && !selectedVariant) {
      return Swal.fire(
        "Select Variant",
        "Please select size & color",
        "warning"
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
          : product.unitPrice) * Number(quantity)
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

    Swal.fire({
      title: "Added to Cart",
      text: `${product.name} added to cart successfully!`,
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
      : product?.unitPrice ?? 0;
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
    <div className='space-y-6 px-1'>
      {loading ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <Loader2 className='w-12 h-12 text-gray-400 animate-spin mb-4' />
          <p className='text-gray-600'>Loading product details...</p>
        </div>
      ) : product ? (
        <>
          {/* Product Image and Info */}
          <div className='flex gap-4'>
            <div className='relative w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0'>
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className='object-contain'
              />
              {discountPercentage > 0 && (
                <div className='absolute top-1 right-1'>
                  <Badge className='bg-red-500 text-white text-xs px-1.5 py-0.5'>
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-gray-900 text-base line-clamp-2 mb-2'>
                {product.name}
              </h3>
              <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-gray-900'>
                  ৳{currentPrice.toLocaleString()}
                </span>
                {prevPrice > 0 && (
                  <span className='text-sm text-gray-400 line-through'>
                    ৳{prevPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Variant Selectors */}
          {product.hasVariation && (
            <div className='space-y-4'>
              {uniqueColors.length > 0 && (
                <EnhancedVariantSelector
                  type='color'
                  selectedProduct={product}
                  list={uniqueColors}
                  selected={selectedVariant?.color ?? ""}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              )}

              {uniqueSizes.length > 0 && (
                <EnhancedVariantSelector
                  type='size'
                  selectedProduct={product}
                  list={uniqueSizes}
                  selected={selectedVariant?.size ?? ""}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              )}
            </div>
          )}

          <Separator />

          {/* Quantity Selector */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-medium text-sm text-gray-900'>
                Quantity
              </span>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10'
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}>
                <Minus className='h-4 w-4' />
              </Button>

              <div className='flex-1 text-center'>
                <span className='text-lg font-semibold text-gray-900'>
                  {quantity}
                </span>
              </div>

              <Button
                variant='outline'
                size='icon'
                className='h-10 w-10'
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Stock Status */}
          {isOutOfStock && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-sm text-red-600 font-medium text-center'>
                Out of Stock
              </p>
            </div>
          )}

          {/* {!isOutOfStock && maxQuantity <= 5 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-600 font-medium text-center">
                Only {maxQuantity} left in stock!
              </p>
            </div>
          )} */}

          {/* Selected Variant Display */}
          {product.hasVariation && selectedVariant && (
            <div className='items-center justify-between text-sm text-muted-foreground bg-zinc-100 rounded-lg p-3 '>
              <div className='flex items-center justify-center gap-3 text-sm'>
                {selectedVariant.color && (
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-800'>Color:</span>
                    <Badge
                      variant='default'
                      className='font-medium bg-orange-800'>
                      {selectedVariant.color.toUpperCase()}
                    </Badge>
                  </div>
                )}
                {selectedVariant.size && (
                  <div className='flex items-center space-x-2'>
                    <span className='text-gray-800'>Size:</span>
                    <Badge
                      variant='default'
                      className='font-medium bg-orange-800'>
                      {selectedVariant.size.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            className='w-full h-12 text-base font-semibold'
            onClick={handleAddToCart}
            disabled={isOutOfStock}>
            <ShoppingCart className='w-5 h-5 mr-2' />
            Add to Cart
          </Button>
        </>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-600'>Product not found</p>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side='right'
          className='w-full sm:max-w-md overflow-y-auto'>
          <SheetHeader className='mb-6'>
            <SheetTitle>Quick Add to Cart</SheetTitle>
            <SheetDescription>
              Select your preferred options and add to cart
            </SheetDescription>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='max-h-[90vh]'>
        <DrawerHeader className='text-left'>
          <DrawerTitle>Quick Add to Cart</DrawerTitle>
          <DrawerDescription>
            Select your preferred options and add to cart
          </DrawerDescription>
        </DrawerHeader>
        <div className='px-4 pb-6 overflow-y-auto'>
          <Content />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
