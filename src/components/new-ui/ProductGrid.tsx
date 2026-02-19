"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Product } from "@/lib/adapters/productAdapter";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  className?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  onViewAll?: () => void;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

/**
 * Product Grid Component
 * Displays products in a responsive grid with loading states and empty states
 */
const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  subtitle,
  className = "",
  showViewAll = false,
  viewAllLink,
  onViewAll,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  /**
   * Render loading skeleton
   */
  const renderSkeleton = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className='animate-pulse'>
        <div className='bg-neutral-100 aspect-square rounded-sm mb-4'></div>
        <div className='space-y-3'>
          <div className='h-4 bg-neutral-200 rounded-none w-3/4'></div>
          <div className='h-3 bg-neutral-200 rounded-none w-1/2'></div>
          <div className='h-4 bg-neutral-200 rounded-none w-1/4'></div>
        </div>
      </div>
    ));
  };

  /**
   * Render empty state
   */
  const renderEmpty = () => (
    <div className='col-span-full flex flex-col items-center justify-center py-16 md:py-24'>
      <div className='w-20 h-20 bg-neutral-100 rounded-sm flex items-center justify-center mb-6'>
        <Package className='w-10 h-10 text-neutral-400' strokeWidth={1.5} />
      </div>
      <h3 className='text-xl md:text-2xl font-serif text-neutral-900 tracking-wide mb-3'>
        No Products Found
      </h3>
      <p className='text-sm md:text-base font-serif text-neutral-600 leading-relaxed text-center max-w-md tracking-wide'>
        No products match your current search or filters. Try adjusting your
        filters or browse other categories.
      </p>
    </div>
  );

  return (
    <section className={className}>
      {/* Title Section with Improved Layout */}
      {(title || subtitle) && (
        <div className='mb-6 md:mb-8'>
          <div className='flex items-start md:items-center justify-between gap-3 md:gap-6'>
            {/* Title and Subtitle */}
            <div className='flex-1 space-y-1 md:space-y-2'>
              {title && (
                <h2 className='text-xl md:text-2xl lg:text-3xl font-serif tracking-wide text-neutral-900 leading-tight'>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className='hidden md:block text-sm md:text-base font-serif text-neutral-600 tracking-wide leading-relaxed max-w-2xl'>
                  {subtitle}
                </p>
              )}
            </div>

            {/* View All Button - Right Aligned */}
            {showViewAll &&
              (viewAllLink || onViewAll) &&
              (viewAllLink ? (
                <Link
                  href={viewAllLink}
                  className='relative inline-flex z-20 items-center justify-center gap-1.5 h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 rounded-none transition-all duration-300 group whitespace-nowrap flex-shrink-0 overflow-hidden'>
                  {/* Continuous Animated Border */}
                  <span className='absolute inset-0 z-0'>
                    {/* Top Border */}
                    <span className='absolute top-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-top' />

                    {/* Right Border */}
                    <span className='absolute right-0 w-[2px] bg-gradient-to-b from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-right' />

                    {/* Bottom Border */}
                    <span className='absolute bottom-0 h-[2px] bg-gradient-to-l from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-bottom' />

                    {/* Left Border */}
                    <span className='absolute left-0 w-[2px] bg-gradient-to-t from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-left' />
                  </span>

                  {/* Static Border (fallback) */}
                  <span className='absolute inset-0 border border-neutral-300 group-hover:border-transparent transition-colors duration-300 z-0' />

                  {/* Hover Overlay - appears on hover */}
                  <span className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]'>
                    <span className='absolute inset-0 border-2 border-neutral-900' />
                  </span>
                  <span className='relative z-10'>View All</span>
                  <ChevronRight
                    className='w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300'
                    strokeWidth={2}
                  />
                </Link>
              ) : (
                <button
                  onClick={onViewAll}
                  className='inline-flex items-center gap-1.5 h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 border border-neutral-300 hover:border-neutral-900 rounded-none transition-all duration-300 group whitespace-nowrap flex-shrink-0'>
                  <span>View All</span>
                  <ChevronRight
                    className='w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300'
                    strokeWidth={2}
                  />
                </button>
              ))}
          </div>

          {/* Decorative Line */}
          <div className='h-px bg-neutral-200 mt-4 md:mt-6'></div>
        </div>
      )}

      {/* Product Grid with Better Spacing */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
        {loading && products.length === 0
          ? renderSkeleton()
          : products.length === 0
            ? renderEmpty()
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className='h-full'
                />
              ))}
      </div>

      {/* Loading More Indicator */}
      {loading && products.length > 0 && (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6'>
          {renderSkeleton().slice(0, 4)}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && onLoadMore && products.length > 0 && (
        <div className='flex justify-center mt-8 md:mt-12'>
          <button
            onClick={onLoadMore}
            className='h-11 md:h-12 px-8 md:px-10 text-xs md:text-sm font-serif tracking-[0.15em] uppercase bg-neutral-900 hover:bg-neutral-800 text-white border-0 rounded-none transition-colors duration-300'>
            Load More Products
          </button>
        </div>
      )}

      {/* Optional: No More Products Message */}
      {!loading && !hasMore && products.length > 0 && (
        // Add this to your component or create a separate AnimatedBorderButton component

        <div className='flex justify-center mt-8 relative'>
          <div className='absolute inset-0 h-[1px] bg-neutral-300 w-full top-[50%] z-10' />

          {showViewAll &&
            (viewAllLink || onViewAll) &&
            (viewAllLink ? (
              <Link
                href={viewAllLink}
                className='relative inline-flex z-20 w-[30%] items-center justify-center gap-1.5 h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 rounded-none transition-all duration-300 group whitespace-nowrap flex-shrink-0 overflow-hidden'>
                {/* Continuous Animated Border */}
                <span className='absolute inset-0 z-0'>
                  {/* Top Border */}
                  <span className='absolute top-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-top' />

                  {/* Right Border */}
                  <span className='absolute right-0 w-[2px] bg-gradient-to-b from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-right' />

                  {/* Bottom Border */}
                  <span className='absolute bottom-0 h-[2px] bg-gradient-to-l from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-bottom' />

                  {/* Left Border */}
                  <span className='absolute left-0 w-[2px] bg-gradient-to-t from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-left' />
                </span>

                {/* Static Border (fallback) */}
                <span className='absolute inset-0 border border-neutral-300 group-hover:border-transparent transition-colors duration-300 z-0' />

                {/* Hover Overlay - appears on hover */}
                <span className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]'>
                  <span className='absolute inset-0 border-2 border-neutral-900' />
                </span>

                {/* Content */}
                <span className='relative z-10'>View All</span>
                <ChevronRight
                  className='relative z-10 w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300'
                  strokeWidth={2}
                />
              </Link>
            ) : (
              <button
                onClick={onViewAll}
                className='relative inline-flex z-20 w-[30%] items-center justify-center gap-1.5 h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 rounded-none transition-all duration-300 group whitespace-nowrap flex-shrink-0 overflow-hidden'>
                {/* Animated Border Effect */}
                <span className='absolute inset-0 z-0'>
                  {/* Top Border */}
                  <span className='absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 group-hover:w-full transition-all duration-700 ease-out' />

                  {/* Right Border */}
                  <span className='absolute top-0 right-0 w-[2px] h-0 bg-gradient-to-b from-neutral-400 via-neutral-600 to-neutral-900 group-hover:h-full transition-all duration-700 ease-out delay-200' />

                  {/* Bottom Border */}
                  <span className='absolute bottom-0 right-0 w-0 h-[2px] bg-gradient-to-l from-neutral-400 via-neutral-600 to-neutral-900 group-hover:w-full transition-all duration-700 ease-out delay-400' />

                  {/* Left Border */}
                  <span className='absolute bottom-0 left-0 w-[2px] h-0 bg-gradient-to-t from-neutral-400 via-neutral-600 to-neutral-900 group-hover:h-full transition-all duration-700 ease-out delay-600' />
                </span>

                {/* Static Border (fallback) */}
                <span className='absolute inset-0 border border-neutral-300 group-hover:border-transparent transition-colors duration-300 z-0' />

                {/* Content */}
                <span className='relative z-10'>View All</span>
                <ChevronRight
                  className='relative z-10 w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform duration-300'
                  strokeWidth={2}
                />
              </button>
            ))}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
