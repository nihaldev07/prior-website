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
        <div className='bg-gray-200 aspect-square rounded-lg mb-4'></div>
        <div className='space-y-2'>
          <div className='h-4 bg-gray-200 rounded w-3/4'></div>
          <div className='h-3 bg-gray-200 rounded w-1/2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/4'></div>
        </div>
      </div>
    ));
  };

  /**
   * Render empty state
   */
  const renderEmpty = () => (
    <div className='col-span-full flex flex-col items-center justify-center py-12'>
      <div className='text-gray-400 mb-4'>
        <Package className='w-16 h-16' strokeWidth={1} />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-1'>
        No Products Found
      </h3>
      <p className='text-gray-500 text-center max-w-sm'>
        No products match your current search or filters. Try adjusting your
        filters or browse other categories.
      </p>
    </div>
  );

  return (
    <section className={className}>
      {/* Title Section */}
      {(title || subtitle) && (
        <div className='flex items-center justify-between mb-6 md:mb-8'>
          <div>
            {title && (
              <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-1'>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className='text-gray-600 text-sm md:text-base'>{subtitle}</p>
            )}
          </div>

          {/* View All Button */}
          {showViewAll &&
            (viewAllLink || onViewAll) &&
            (viewAllLink ? (
              <Link
                href={viewAllLink}
                className='text-gray-900 hover:text-gray-700 font-medium text-sm md:text-base transition-colors duration-200 flex items-center gap-1 group'>
                View All
                <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
              </Link>
            ) : (
              <button
                onClick={onViewAll}
                className='text-gray-900 hover:text-gray-700 font-medium text-sm md:text-base transition-colors duration-200 flex items-center gap-1 group'>
                View All
                <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-200' />
              </button>
            ))}
        </div>
      )}

      {/* Product Grid */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6'>
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
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6'>
          {renderSkeleton().slice(0, 4)}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && onLoadMore && products.length > 0 && (
        <div className='flex justify-center mt-8'>
          <button
            onClick={onLoadMore}
            className='bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors duration-200'>
            Load More
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
