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

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pQuantity, setPQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');

  // Extract unique colors and sizes
  useEffect(() => {
    if (product) {
      setUniqueColors([
        ...new Set(
          product.variation?.filter((c) => !!c.color).map((v) => v.color) ?? []
        ),
      ]);
      setUniqueSizes([
        ...new Set(
          product.variation?.filter((s) => !!s.size).map((v) => v.size) ?? []
        ),
      ]);
    }
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
          : product.unitPrice) * Number(pQuantity)
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
    }).then(() => {
      if (isBuy) router.push("/cart");
    });
  };

  const handleQuantityChange = (change: number) => {
    const maxQty = selectedVariant?.quantity ?? product.quantity;
    const newQty = Math.max(1, Math.min(maxQty, pQuantity + change));
    setPQuantity(newQty);
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative">
              <Image
                src={shots[selectedImageIndex]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 text-sm font-bold shadow-lg">
                    <TagIcon className="mr-2 w-4 h-4" />
                    {discountPercentage}% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {shots.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {shots.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 uppercase">
                    {product.name}
                  </h1>
                  <Badge
                    variant="secondary"
                    className="bg-muted text-muted-foreground hover:bg-muted/80 text-xs font-medium uppercase tracking-wide"
                  >
                    {product.categoryName}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 ml-4">
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
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {prevPrice > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    ৳{prevPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {discountPercentage > 0 && (
                <p className="text-sm text-red-600 font-medium mb-4">
                  You save ৳{(prevPrice - currentPrice).toLocaleString()}
                </p>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-semibold text-gray-800">
                  Availability:
                </span>
                {isOutOfStock ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">In Stock</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Variant Selectors */}
            {uniqueColors.length > 0 && (
              <EnhancedVariantSelector
                type="color"
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
                type="size"
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
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Quantity
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={pQuantity <= 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {pQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={pQuantity >= maxQuantity}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Stock Warning */}
            {!isOutOfStock && maxQuantity <= 5 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-600 font-medium text-center">
                  Only {maxQuantity} left in stock!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <Button
                  onClick={() => handleCartSelection(true)}
                  disabled={pQuantity < 1}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all"
                  size="lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Buy Now
                </Button>
                <Button
                  onClick={() => handleCartSelection()}
                  disabled={pQuantity < 1}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-all"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            )}

            {/* Service Guarantees */}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 flex-shrink-0" />
                <span>Free delivery, estimated 3-5 business days</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 flex-shrink-0" />
                <span>Authentic product guarantee</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5 flex-shrink-0" />
                <span>7-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { key: 'description', label: 'Product Description' },
                { key: 'details', label: 'Specifications' },
                { key: 'reviews', label: 'Customer Reviews' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.key
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description?.replace(/\n/g, "<br />") ??
                      "No description available.",
                  }}
                />
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium text-gray-900">Product Features</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Premium quality materials for lasting comfort</li>
                    <li>Classic design, versatile for any occasion</li>
                    <li>Expert craftsmanship ensuring quality</li>
                    <li>Multiple color options to suit your preference</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Product ID:</dt>
                      <dd className="text-gray-900 font-medium">{product.id}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Category:</dt>
                      <dd className="text-gray-900 font-medium">{product.categoryName}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="text-gray-900 font-medium">{product.sku || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Available Sizes:</dt>
                      <dd className="text-gray-900 font-medium">
                        {uniqueSizes.length > 0 ? uniqueSizes.join(', ') : 'N/A'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Available Colors:</dt>
                      <dd className="text-gray-900 font-medium">
                        {uniqueColors.length > 0 ? uniqueColors.join(', ') : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Stock Information</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Availability:</dt>
                      <dd className={cn(
                        "font-medium",
                        isOutOfStock ? "text-red-600" : "text-green-600"
                      )}>
                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                      </dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-600">Stock Quantity:</dt>
                      <dd className="text-gray-900 font-medium">{product.quantity} units</dd>
                    </div>
                    {product.discount > 0 && (
                      <>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <dt className="text-gray-600">Discount:</dt>
                          <dd className="text-red-600 font-medium">
                            {product.discountType === '%'
                              ? `${discountPercentage}%`
                              : `৳${product.discount}`
                            }
                          </dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <dt className="text-gray-600">You Save:</dt>
                          <dd className="text-red-600 font-medium">
                            ৳{(prevPrice - currentPrice).toLocaleString()}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 text-lg">Customer Reviews</h4>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-5 h-5",
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating.toFixed(1)} out of 5
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center py-12 text-gray-500">
                  <p className="text-base">No reviews yet</p>
                  <p className="text-sm mt-2">Be the first to review this product!</p>
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
