"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Zap,
  TagIcon,
  CheckCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import TiptapRenderer from "../TiptapRenderer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { SingleProductType, Variation } from "@/data/types";
import EnhancedVariantSelector from "@/app/collections/[collectionId]/EnhancedVariantSelector";
import ShareButton from "@/shared/ShareButton";
import Swal from "sweetalert2";
import { cn } from "@/lib/utils";
import { EnhancedProductImage } from "@/shared/EnhancedProductImage";
interface ProductDetailSectionProps {
  product: SingleProductType;
  shots: string[];
}

// ─── Animation keyframes (injected once) ─────────────────────────────────────

const GALLERY_STYLES = `
  @keyframes gallery-fade-scale-in {
    from { opacity: 0; transform: scale(1.03); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes gallery-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modal-backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes modal-content-in {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }
  @keyframes modal-thumb-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hint-float-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .gallery-main-image {
    animation: gallery-fade-scale-in 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  .modal-backdrop {
    animation: modal-backdrop-in 0.25s ease both;
  }
  .modal-content {
    animation: modal-content-in 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  }
  .modal-image {
    animation: gallery-fade-scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  .gallery-hint {
    animation: hint-float-in 0.4s ease 0.6s both;
  }
  .modal-thumb {
    animation: modal-thumb-in 0.3s ease both;
  }
  .gallery-thumb-btn {
    transition: border-color 0.25s ease, opacity 0.2s ease, transform 0.15s ease;
  }
  .gallery-thumb-btn:active {
    transform: scale(0.93);
  }
  .modal-nav-btn {
    transition: background-color 0.2s ease, transform 0.15s ease;
  }
  .modal-nav-btn:hover {
    transform: scale(1.08);
  }
  .modal-nav-btn:active {
    transform: scale(0.95);
  }
  .modal-close-btn {
    transition: background-color 0.2s ease, transform 0.2s ease, color 0.2s ease;
  }
  .modal-close-btn:hover {
    transform: rotate(90deg) scale(1.1);
  }
`;

function GalleryStyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: GALLERY_STYLES }} />;
}

// ─── Hook: detect touch-primary device ───────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Full-Screen Modal ────────────────────────────────────────────────────────

interface GalleryModalProps {
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}

function GalleryModal({
  images,
  initialIndex,
  productName,
  onClose,
}: GalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [imageKey, setImageKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const isMobile = useIsMobile();

  // ── NEW: modal zoom state ──
  const [modalZoom, setModalZoom] = useState({ active: false, x: 50, y: 50 });
  const modalImageRef = useRef<HTMLDivElement>(null);

  const handleModalMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = modalImageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setModalZoom({ active: true, x, y });
    },
    [isMobile],
  );

  const handleModalMouseLeave = useCallback(() => {
    setModalZoom({ active: false, x: 50, y: 50 });
  }, []);
  // ── END NEW ──

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
    setImageKey((k) => k + 1);
    setModalZoom({ active: false, x: 50, y: 50 }); // reset zoom on nav
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
    setImageKey((k) => k + 1);
    setModalZoom({ active: false, x: 50, y: 50 }); // reset zoom on nav
  }, [images.length]);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === activeIndex) return;
      setActiveIndex(idx);
      setImageKey((k) => k + 1);
      setModalZoom({ active: false, x: 50, y: 50 }); // reset zoom on nav
    },
    [activeIndex],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) delta < 0 ? goNext() : goPrev();
    touchStartX.current = null;
  };

  return (
    <div
      className='modal-backdrop fixed inset-0 z-[100] bg-black/95 flex flex-col'
      role='dialog'
      aria-modal='true'
      aria-label={`${productName} image gallery`}>
      {/* Top bar */}
      <div className='modal-content flex items-center justify-between px-4 py-3 flex-shrink-0'>
        <span className='text-white/50 text-sm font-serif tracking-[0.2em]'>
          {activeIndex + 1}{" "}
          <span className='text-white/25'>/ {images.length}</span>
        </span>
        <button
          onClick={onClose}
          className='modal-close-btn text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10'
          aria-label='Close gallery'>
          <X className='w-5 h-5' />
        </button>
      </div>

      {/* Main image */}
      <div
        className='relative flex-1 flex items-center justify-center overflow-hidden'
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        {/* Zoom container — tracks mouse, clips overflow */}
        <div
          ref={modalImageRef}
          onMouseMove={handleModalMouseMove}
          onMouseLeave={handleModalMouseLeave}
          className='relative w-full h-full overflow-hidden'
          style={{
            cursor: isMobile
              ? "default"
              : modalZoom.active
                ? "zoom-in"
                : "zoom-in",
            touchAction: isMobile ? "pinch-zoom" : "none",
          }}>
          {/* Animation wrapper — keyed for fade-in on image change */}
          <div key={imageKey} className='modal-image absolute inset-0'>
            {/* Zoom transform wrapper — stable, never remounts */}
            <div
              className='absolute inset-0'
              style={
                modalZoom.active && !isMobile
                  ? {
                      transform: "scale(2.5)",
                      transformOrigin: `${modalZoom.x}% ${modalZoom.y}%`,
                      transition: "transform 0.08s ease-out",
                    }
                  : {
                      transform: "scale(1)",
                      transformOrigin: "center center",
                      transition: "transform 0.25s ease-out",
                    }
              }>
              <Image
                src={images[activeIndex]}
                alt={`${productName} — image ${activeIndex + 1}`}
                fill
                className='object-contain select-none'
                sizes='100vw'
                priority
                draggable={false}
              />
            </div>
          </div>

          {/* Zoom hint — desktop only, fades when zooming */}
          {!isMobile && (
            <div
              className={cn(
                "absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/60 text-xs px-2.5 py-1.5 rounded-full pointer-events-none transition-opacity duration-300",
                modalZoom.active ? "opacity-0" : "opacity-100",
              )}>
              <ZoomIn className='w-3 h-3' />
              <span className='font-serif tracking-wide'>Hover to zoom</span>
            </div>
          )}
        </div>

        {/* Nav arrows — rendered outside zoom container so they don't zoom */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className='modal-nav-btn absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2.5 backdrop-blur-sm z-10'
              aria-label='Previous image'>
              <ChevronLeft className='w-5 h-5' />
            </button>
            <button
              onClick={goNext}
              className='modal-nav-btn absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-2.5 backdrop-blur-sm z-10'
              aria-label='Next image'>
              <ChevronRight className='w-5 h-5' />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip — unchanged */}
      {images.length > 1 && (
        <div className='modal-content flex-shrink-0 px-4 py-3 overflow-x-auto'>
          <div className='flex gap-2 justify-center min-w-max mx-auto'>
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  "modal-thumb flex-shrink-0 w-14 h-14 overflow-hidden border-2 rounded-sm gallery-thumb-btn",
                  activeIndex === idx
                    ? "border-white opacity-100"
                    : "border-transparent opacity-35 hover:opacity-65",
                )}
                style={{ animationDelay: `${idx * 40}ms` }}
                aria-label={`View image ${idx + 1}`}>
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={56}
                  height={56}
                  className='w-full h-full object-cover'
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

interface ImageGalleryProps {
  displayImages: string[];
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
  productName: string;
  discountPercentage: number;
  currentAttributeLabel: string;
}

function ImageGallery({
  displayImages,
  selectedImageIndex,
  onImageSelect,
  productName,
  discountPercentage,
  currentAttributeLabel,
}: ImageGalleryProps) {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoom({ active: true, x, y });
    },
    [isMobile],
  );

  const handleMouseLeave = useCallback(() => {
    setZoom({ active: false, x: 50, y: 50 });
  }, []);

  return (
    <>
      <GalleryStyleInjector />
      <div className='space-y-4'>
        {/* Main image */}
        <div
          ref={containerRef}
          onClick={() => setIsModalOpen(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "aspect-square bg-neutral-50 rounded-sm overflow-hidden relative border border-neutral-200 select-none",
            !isMobile && "cursor-zoom-in",
            isMobile && "cursor-pointer",
          )}>
          {/* key drives the fade+scale animation on every image switch */}
          <div
            key={selectedImageIndex}
            className='gallery-main-image absolute inset-0'
            style={
              zoom.active
                ? {
                    transform: `scale(2.2)`,
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                    transition: "transform 0.1s ease-out",
                  }
                : {
                    transform: "scale(1)",
                    transformOrigin: "center center",
                    transition: "transform 0.25s ease-out",
                  }
            }>
            <EnhancedProductImage
              src={displayImages[selectedImageIndex]}
              alt={productName}
              className='object-cover w-full h-full'
              sizes='(max-width: 1024px) 100vw, 50vw'
              sharpenStrength={0.45} // tweak 0.3–0.7 to taste
              enableSharpening={true}
            />
          </div>

          {/* Hint badge */}
          <div
            className={cn(
              "gallery-hint absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-neutral-600 text-xs px-2.5 py-1.5 rounded-full pointer-events-none transition-opacity duration-300",
              zoom.active ? "opacity-0" : "opacity-100",
            )}>
            <ZoomIn className='w-3.5 h-3.5' />
            <span className='font-serif tracking-wide'>
              {isMobile ? "Tap to expand" : "Click to expand"}
            </span>
          </div>

          {/* Badges */}
          {discountPercentage > 0 && (
            <div className='absolute top-4 left-4 z-10'>
              <Badge className='bg-red-600 text-white px-4 py-2 text-xs font-serif tracking-[0.15em] uppercase rounded-none border-0'>
                <TagIcon className='mr-2 w-4 h-4' />
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}
          {currentAttributeLabel && (
            <div className='absolute top-4 right-4 z-10'>
              <Badge className='bg-blue-600 text-white px-4 py-2 text-xs font-serif tracking-[0.15em] uppercase rounded-none border-0'>
                {currentAttributeLabel}
              </Badge>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {displayImages.length > 1 && (
          <div className='flex gap-3 overflow-x-auto pb-2'>
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={cn(
                  "gallery-thumb-btn flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border relative",
                  selectedImageIndex === index
                    ? "border-neutral-900 opacity-100"
                    : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100",
                )}
                aria-label={`View image ${index + 1}`}>
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className='w-full h-full object-cover'
                />
                {/* Active indicator bar */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 transition-transform duration-300 origin-left",
                    selectedImageIndex === index ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <GalleryModal
          images={displayImages}
          initialIndex={selectedImageIndex}
          productName={productName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

// ─── Main Component (unchanged logic) ────────────────────────────────────────

const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({
  product,
  shots,
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pQuantity, setPQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null,
  );
  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "description" | "details" | "reviews"
  >("description");
  const [currentImageGroupId, setCurrentImageGroupId] = useState<string | null>(
    null,
  );
  const [currentAttributeLabel, setCurrentAttributeLabel] =
    useState<string>("");

  useEffect(() => {
    if (product) {
      const colors = product.variation?.map((v) => v.color || "") ?? [];
      setUniqueColors([...new Set(colors)]);
      const sizes = product.variation?.map((v) => v.size || "") ?? [];
      setUniqueSizes([...new Set(sizes)]);
    }
  }, [product]);

  const masterShots = useMemo(() => {
    const allImages: string[] = [];
    allImages.push(...shots);
    if (product.variation) {
      product.variation.forEach((variant) => {
        if (variant.images?.length) allImages.push(...variant.images);
      });
    }
    if (product.imageGroups) {
      product.imageGroups.forEach((group) => {
        if (group.images?.length) allImages.push(...group.images);
      });
    }
    return allImages;
  }, [product, shots]);

  // UNCHANGED — variant auto-select logic
  useEffect(() => {
    if (!product || !selectedVariant) return;
    if (selectedVariant.images?.length) {
      const idx = masterShots.findIndex(
        (img) => img === selectedVariant.images![0],
      );
      if (idx !== -1) setSelectedImageIndex(idx);
    } else if (selectedVariant.imageGroupId) {
      const group = product.imageGroups?.find(
        (g) => g.id === selectedVariant.imageGroupId,
      );
      if (group?.images?.length) {
        const idx = masterShots.findIndex((img) => img === group.images[0]);
        if (idx !== -1) setSelectedImageIndex(idx);
      }
    }
  }, [product, selectedVariant, masterShots]);

  const handleCartSelection = (isBuy = false) => {
    if (product.hasVariation && !selectedVariant)
      return Swal.fire(
        "Select size & color",
        "Please select size & color",
        "warning",
      );
    if (pQuantity < 1)
      return Swal.fire("Select quantity", "Please select quantity", "warning");

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
      maxQuantity: selectedVariant
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
    setPQuantity((q) => Math.max(1, Math.min(maxQty, q + change)));
  };

  // UNCHANGED
  const handleImageSelect = (index: number) => {
    if (index === selectedImageIndex) return;
    setSelectedImageIndex(index);
  };

  // UNCHANGED
  const handleImageGroupChange = (
    attribute: string,
    value: string,
    groupId: string,
  ) => {
    const group = product?.imageGroups?.find((g) => g.id === groupId);
    if (group?.images?.length) {
      const idx = masterShots.findIndex((img) => img === group.images[0]);
      if (idx !== -1) {
        setSelectedImageIndex(idx);
        setCurrentImageGroupId(groupId);
        setCurrentAttributeLabel(group.displayLabel);
      }
    }
  };

  const currentPrice =
    product.discount > 0 && product.updatedPrice
      ? product.updatedPrice
      : product.unitPrice;
  const prevPrice =
    product.discount > 0 && product.updatedPrice ? product.unitPrice : 0;

  const discountPercentage = useMemo(() => {
    if (prevPrice > 0 && currentPrice > 0)
      return Math.round(((prevPrice - currentPrice) / prevPrice) * 100);
    return 0;
  }, [prevPrice, currentPrice]);

  const isOutOfStock =
    (!!selectedVariant && selectedVariant.quantity < 1) || product.quantity < 1;
  const maxQuantity = selectedVariant?.quantity ?? product.quantity;

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-4 py-12 lg:py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          <ImageGallery
            displayImages={masterShots}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={handleImageSelect}
            productName={product.name}
            discountPercentage={discountPercentage}
            currentAttributeLabel={currentAttributeLabel}
          />

          {/* Product info — unchanged */}
          <div className='space-y-6'>
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

            {product.hasVariation && uniqueColors.length > 0 && (
              <EnhancedVariantSelector
                type='color'
                list={uniqueColors}
                selectedProduct={product}
                selectedVariant={selectedVariant}
                selected={selectedVariant?.color ?? ""}
                onVariantChange={(variant: Variation) => {
                  setSelectedVariant(variant);
                  setPQuantity((q) => Math.min(q, variant.quantity));
                }}
                onImageGroupChange={handleImageGroupChange}
              />
            )}

            {product.hasVariation && uniqueSizes.length > 0 && (
              <EnhancedVariantSelector
                type='size'
                list={uniqueSizes}
                selectedProduct={product}
                selectedVariant={selectedVariant}
                selected={selectedVariant?.size ?? ""}
                onVariantChange={(variant: Variation) => {
                  setSelectedVariant(variant);
                  setPQuantity((q) => Math.min(q, variant.quantity));
                }}
              />
            )}

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

            <Separator />
          </div>
        </div>

        {/* Tabs */}
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
                <TiptapRenderer
                  content={product.description ?? "No description available."}
                  className='text-sm font-serif text-neutral-600 leading-relaxed'
                />
              </div>
            )}
            {activeTab === "details" && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div>
                  <h4 className='text-sm font-serif tracking-[0.2em] uppercase text-neutral-700 mb-4'>
                    Basic Information
                  </h4>
                  <dl className='space-y-2'>
                    {[
                      { label: "Product ID:", value: product.id },
                      { label: "Category:", value: product.categoryName },
                      { label: "SKU:", value: product.sku || "N/A" },
                      {
                        label: "Available Sizes:",
                        value:
                          uniqueSizes.length > 0
                            ? uniqueSizes.join(", ")
                            : "N/A",
                      },
                      {
                        label: "Available Colors:",
                        value:
                          uniqueColors.length > 0
                            ? uniqueColors.join(", ")
                            : "N/A",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className='flex justify-between py-2 border-b border-neutral-100'>
                        <dt className='text-sm font-serif text-neutral-600'>
                          {label}
                        </dt>
                        <dd className='text-sm font-serif text-neutral-900 font-medium tracking-wide'>
                          {value}
                        </dd>
                      </div>
                    ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSection;
