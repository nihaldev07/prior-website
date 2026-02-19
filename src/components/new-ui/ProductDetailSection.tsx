"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Zap,
  TagIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { SingleProductType, Variation } from "@/data/types";
import EnhancedVariantSelector from "@/app/collections/[collectionId]/EnhancedVariantSelector";
import ShareButton from "@/shared/ShareButton";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";

interface ProductDetailSectionProps {
  product: SingleProductType;
  shots: string[];
}

/**
 * ProductDetailSection Component - New UI Design
 * Modern, clean product detail layout matching the new-ui reference
 */
const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({
  product,
  shots,
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pQuantity, setPQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null,
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");

  // Extract unique colors and sizes
  useEffect(() => {
    if (product) {
      setUniqueColors([
        ...new Set(
          product.variation?.filter((c) => !!c.color).map((v) => v.color) ?? [],
        ),
      ]);
      setUniqueSizes([
        ...new Set(
          product.variation?.filter((s) => !!s.size).map((v) => v.size) ?? [],
        ),
      ]);
    }
  }, [product]);

  const handleCartSelection = (isBuy = false) => {
    if (product.hasVariation && !selectedVariant) {
      return Swal.fire(
        "Select size & color",
        "Please select size & color",
        "warning",
      );
    } else if (pQuantity < 1) {
      return Swal.fire("Select quantity", "Please select quantity", "warning");
    }

    const productData = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      active: true,
      quantity: pQuantity,
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
          : product.unitPrice) * Number(pQuantity),
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

    if (isBuy) router.push("/checkout");
    else
      Swal.fire({
        title: "Added to Cart",
        text: `${product.name} added to cart successfully!`,
        icon: "success",
      });
  };

  const handleQuantityChange = (change: number) => {
    const maxQty = selectedVariant?.quantity ?? product.quantity;
    const newQty = Math.max(1, Math.min(maxQty, pQuantity + change));
    setPQuantity(newQty);
  };

  const handleImageSelect = (index: number) => {
    if (index === selectedImageIndex) return;

    setIsImageLoading(true);

    const img = new window.Image();
    img.src = shots[index];

    img.onload = () => {
      setSelectedImageIndex(index);
      setIsImageLoading(false);
    };

    // Simulate loading time for smoother transition
  };

  const currentPrice =
    product.discount > 0 && product.updatedPrice
      ? product.updatedPrice
      : product.unitPrice;
  const prevPrice =
    product.discount > 0 && product.updatedPrice ? product.unitPrice : 0;

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
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-12 lg:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          {/* Image Gallery Section */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='aspect-square bg-neutral-50 rounded-sm overflow-hidden relative border border-neutral-200'>
              {isImageLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-neutral-100 z-10'>
                  <div className='w-12 h-12 border-3 border-neutral-300 border-t-neutral-600 rounded-full animate-spin'></div>
                </div>
              )}
              <Image
                src={shots[selectedImageIndex]}
                alt={product.name}
                fill
                className={cn("object-cover transition-opacity duration-300")}
                sizes='(max-width: 1024px) 100vw, 50vw'
                priority
              />
              {discountPercentage > 0 && (
                <div className='absolute top-4 left-4 z-10'>
                  <Badge className='bg-red-600 text-white px-4 py-2 text-xs font-serif tracking-[0.15em] uppercase rounded-none border-0'>
                    <TagIcon className='mr-2 w-4 h-4' />
                    {discountPercentage}% OFF
                  </Badge>
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
                      "flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border transition-all duration-300 relative",
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
          </div>

          {/* Product Information Section */}
          <div className='space-y-6'>
            {/* Product Header */}
            <div>
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <h1 className='text-2xl lg:text-3xl font-serif uppercase tracking-wide text-neutral-900 leading-tight mb-4'>
                    {product.name}
                  </h1>
                  <Badge
                    variant='secondary'
                    className='bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-serif tracking-[0.2em] uppercase rounded-none border border-neutral-200'>
                    {product.categoryName}
                  </Badge>
                </div>
                <div className='flex items-center space-x-2 ml-4'>
                  <ShareButton
                    linkToShare={`https://priorbd.com/collections/${product.slug}`}
                    title={`Check out this awesome product: ${product.name}`}
                    text={
                      product.discount > 0
                        ? `This ${product.categoryName} is now ${discountPercentage}% OFF. Don't miss out!`
                        : `This ${product.categoryName} - don't miss out!`
                    }
                  />
                </div>
              </div>

              {/* Rating */}
              {product.rating > 0 && (
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating)
                            ? "text-amber-500 fill-current"
                            : "text-neutral-300",
                        )}
                      />
                    ))}
                  </div>
                  <span className='text-sm font-serif text-neutral-600 tracking-wide'>
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className='flex items-baseline gap-3 mb-4'>
                <span className='text-3xl lg:text-4xl font-serif text-neutral-900 tracking-wide'>
                  ৳{currentPrice.toLocaleString()}
                </span>
                {prevPrice > 0 && (
                  <span className='text-lg text-neutral-400 line-through font-serif'>
                    ৳{prevPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <p className='text-sm font-serif text-red-600 tracking-wide mb-4'>
                  You save ৳{(prevPrice - currentPrice).toLocaleString()}
                </p>
              )}

              {/* Stock Status */}
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-sm font-serif text-neutral-700 tracking-wide'>
                  Availability:
                </span>
                {isOutOfStock ? (
                  <div className='flex items-center gap-2 text-red-600'>
                    <XCircle className='h-4 w-4' />
                    <span className='text-sm font-medium'>Out of Stock</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 text-emerald-600'>
                    <CheckCircle className='h-4 w-4' />
                    <span className='text-sm font-medium'>In Stock</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Variant Selectors */}
            {uniqueColors.length > 0 && (
              <EnhancedVariantSelector
                type='color'
                list={uniqueColors}
                selectedProduct={product}
                selectedVariant={selectedVariant}
                selected={selectedVariant?.color ?? ""}
                onVariantChange={(variant: Variation) => {
                  setSelectedVariant(variant);
                  setPQuantity(Math.min(pQuantity, variant.quantity));
                }}
              />
            )}

            {uniqueSizes.length > 0 && (
              <EnhancedVariantSelector
                type='size'
                list={uniqueSizes}
                selectedProduct={product}
                selectedVariant={selectedVariant}
                selected={selectedVariant?.size ?? ""}
                onVariantChange={(variant: Variation) => {
                  setSelectedVariant(variant);
                  setPQuantity(Math.min(pQuantity, variant.quantity));
                }}
              />
            )}

            {/* Quantity Selection */}
            {!isOutOfStock && (
              <div className='space-y-3'>
                <h3 className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                  Quantity
                </h3>
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={pQuantity <= 1}
                    className='p-3 border border-neutral-300 rounded-none hover:border-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'>
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='text-lg font-serif w-12 text-center text-neutral-900'>
                    {pQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={pQuantity >= maxQuantity}
                    className='p-3 border border-neutral-300 rounded-none hover:border-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300'>
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
              </div>
            )}

            {/* Stock Warning */}
            {/* {!isOutOfStock && maxQuantity <= 5 && (
              <div className='bg-amber-50 border border-amber-200 rounded-none p-4'>
                <p className='text-sm font-serif text-amber-900 text-center tracking-wide'>
                  Only {maxQuantity} left in stock!
                </p>
              </div>
            )} */}

            {/* Action Buttons */}
            {!isOutOfStock && (
              <div className='space-y-3'>
                <Button
                  onClick={() => handleCartSelection(true)}
                  disabled={pQuantity < 1}
                  className='w-full h-14 text-sm font-serif tracking-[0.15em] uppercase bg-primary hover:bg-neutral-800 text-white rounded-none transition-colors duration-300'
                  size='lg'>
                  <Zap className='mr-2 h-5 w-5' />
                  Buy Now
                </Button>
                <Button
                  onClick={() => handleCartSelection()}
                  disabled={pQuantity < 1}
                  variant='outline'
                  className='w-full h-14 text-sm font-serif tracking-[0.15em] uppercase border border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-none transition-all duration-300'
                  size='lg'>
                  <ShoppingCart className='mr-2 h-5 w-5' />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Service Guarantees */}
            <Separator />
            {/* <div className='space-y-3'>
              <div className='flex items-center gap-3 text-sm font-serif text-neutral-600 tracking-wide'>
                <Truck className='w-5 h-5 flex-shrink-0 text-neutral-700' />
                <span>Free delivery, estimated 3-5 business days</span>
              </div>
              <div className='flex items-center gap-3 text-sm font-serif text-neutral-600 tracking-wide'>
                <Shield className='w-5 h-5 flex-shrink-0 text-neutral-700' />
                <span>Authentic product guarantee</span>
              </div>
              <div className='flex items-center gap-3 text-sm font-serif text-neutral-600 tracking-wide'>
                <RotateCcw className='w-5 h-5 flex-shrink-0 text-neutral-700' />
                <span>7-day return policy</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='mt-16'>
          <div className='border-b border-neutral-200'>
            <nav className='flex gap-8'>
              {[
                { key: "description", label: "Product Description" },
                { key: "details", label: "Specifications" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "py-4 px-1 border-b-2 text-sm font-serif transition-colors duration-300",
                    activeTab === tab.key
                      ? "border-neutral-900 text-neutral-900 tracking-wide"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 tracking-wide",
                  )}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className='py-8'>
            {activeTab === "description" && (
              <div className='prose max-w-none'>
                <div
                  className='text-sm font-serif text-neutral-600 leading-relaxed'
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description?.replace(/\n/g, "<br />") ??
                      "No description available.",
                  }}
                />
                {/* <div className='mt-6 space-y-4'>
                  <h4 className='text-base font-serif text-neutral-900 tracking-wide'>
                    Product Features
                  </h4>
                  <ul className='list-disc list-inside space-y-2 text-sm font-serif text-neutral-600'>
                    <li>Premium quality materials for lasting comfort</li>
                    <li>Classic design, versatile for any occasion</li>
                    <li>Expert craftsmanship ensuring quality</li>
                    <li>Multiple color options to suit your preference</li>
                  </ul>
                </div> */}
              </div>
            )}

            {activeTab === "details" && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h4 className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700 mb-4'>
                    Basic Information
                  </h4>
                  <dl className='space-y-2'>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Product ID:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {product.id}
                      </dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Category:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {product.categoryName}
                      </dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        SKU:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {product.sku || "N/A"}
                      </dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Available Sizes:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {uniqueSizes.length > 0
                          ? uniqueSizes.join(", ")
                          : "N/A"}
                      </dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Available Colors:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {uniqueColors.length > 0
                          ? uniqueColors.join(", ")
                          : "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700 mb-4'>
                    Stock Information
                  </h4>
                  <dl className='space-y-2'>
                    <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Availability:
                      </dt>
                      <dd
                        className={cn(
                          "font-medium text-sm font-serif",
                          isOutOfStock ? "text-red-600" : "text-emerald-600",
                        )}>
                        {isOutOfStock ? "Out of Stock" : "In Stock"}
                      </dd>
                    </div>
                    {/* <div className='flex justify-between py-2 border-b border-neutral-100'>
                      <dt className='text-sm font-serif text-neutral-600'>
                        Stock Quantity:
                      </dt>
                      <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                        {product.quantity} units
                      </dd>
                    </div> */}
                    {product.discount > 0 && (
                      <>
                        <div className='flex justify-between py-2 border-b border-neutral-100'>
                          <dt className='text-sm font-serif text-neutral-600'>
                            Discount:
                          </dt>
                          <dd className='text-sm font-serif text-red-600 font-medium'>
                            {product.discountType === "%"
                              ? `${discountPercentage}%`
                              : `৳${product.discount}`}
                          </dd>
                        </div>
                        <div className='flex justify-between py-2 border-b border-neutral-100'>
                          <dt className='text-sm font-serif text-neutral-600'>
                            You Save:
                          </dt>
                          <dd className='text-sm font-serif text-red-600 font-medium'>
                            ৳{(prevPrice - currentPrice).toLocaleString()}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-lg font-serif text-neutral-900 tracking-wide'>
                      Customer Reviews
                    </h4>
                    <div className='flex items-center mt-2'>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-5 h-5",
                              i < Math.floor(product.rating)
                                ? "text-amber-500 fill-current"
                                : "text-neutral-300",
                            )}
                          />
                        ))}
                      </div>
                      <span className='ml-2 text-sm font-serif text-neutral-600 tracking-wide'>
                        {product.rating.toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className='text-center py-12 text-neutral-500'>
                  <p className='text-base font-serif'>No reviews yet</p>
                  <p className='text-sm mt-2 font-serif'>
                    Be the first to review this product!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSection;
