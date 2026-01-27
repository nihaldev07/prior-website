"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, X, Loader2, Grid3x3, List, TrendingUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/new-ui/ProductCard";
import ProductFilters from "@/components/new-ui/ProductFilters";
import { adaptProductsToNewFormat } from "@/lib/adapters/productAdapter";
import useProductFetch from "@/hooks/useProductFetch";
import { usePageState } from "@/context/PageStateContext";
import { cn } from "@/lib/utils";

/**
 * Collections Page - Modern Product Listing with Filters
 * Features infinite scroll, responsive filters, and elegant UI
 */
export default function CollectionsPage() {
  const {
    products,
    loading,
    totalPages,
    currentPage,
    distictFilterValues,
    setFilterData,
    filterData,
    handleLoadMore,
  } = useProductFetch();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { state, setState } = usePageState();

  /**
   * Intersection Observer for infinite scroll
   */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && currentPage < totalPages) {
        handleLoadMore();
      }
    },
    [loading, currentPage, totalPages, handleLoadMore],
  );

  /**
   * Restore state on mount (scroll position, filters, page)
   */
  useEffect(() => {
    window.scrollTo(0, state.scrollPosition);

    if (state.filterData) {
      // @ts-ignore - PageState type mismatch
      setFilterData(state.filterData);
    }

    if (state.currentPage > 1) {
      // @ts-ignore - handleLoadMore type
      handleLoadMore(state.currentPage - 1);
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Setup intersection observer for infinite scroll
   */
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    const currentLoadMoreRef = loadMoreRef.current;

    if (currentLoadMoreRef) observer.observe(currentLoadMoreRef);

    return () => {
      if (currentLoadMoreRef) observer.unobserve(currentLoadMoreRef);
    };
  }, [handleObserver]);

  /**
   * Save state before navigation
   */
  const saveNavigationState = () => {
    setState((prev) => ({
      ...prev,
      scrollPosition: window.scrollY,
      filterData,
      currentPage,
    }));
  };

  /**
   * Handle filter changes
   */
  const handleFilterChange = (newFilterData: any) => {
    setFilterData(newFilterData);
    setSheetOpen(false);
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setFilterData({
      categoryId: "",
      color: "",
      size: "",
      price: "",
    });
  };

  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (filterData?.categoryId) count++;
    if (filterData?.color)
      count += filterData.color.split(",").filter(Boolean).length;
    if (filterData?.size)
      count += filterData.size.split(",").filter(Boolean).length;
    return count;
  };

  // Adapt products to new UI format
  const adaptedProducts = adaptProductsToNewFormat(products || []);
  const activeFilterCount = getActiveFilterCount();
  const hasFiltersAvailable =
    distictFilterValues.categories.length > 0 ||
    distictFilterValues.colors.length > 0 ||
    distictFilterValues.sizes.length > 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Page Header */}
      <div className='bg-white border-b border-gray-200 hidden md:block'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            All Products
          </h1>
          <p className='text-gray-600'>
            Discover our complete collection of premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Desktop Filters Sidebar */}
          {hasFiltersAvailable && (
            <aside className='hidden lg:block w-80 flex-shrink-0'>
              <div className='sticky top-24'>
                <ProductFilters
                  sizes={distictFilterValues.sizes.filter((i) => i !== "")}
                  colors={distictFilterValues.colors.filter((i) => i !== "")}
                  categories={distictFilterValues.categories}
                  filterData={filterData}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>
          )}

          {/* Products Section */}
          <main className='flex-1 min-w-0'>
            {/* Toolbar: Filter Button, Results Count, View Toggle */}
            <div className='flex items-center justify-between mb-2 md:mb-6 bg-white p-4 shadow-md md:shadow rounded-lg border border-gray-200'>
              <div className='flex md:hidden justify-center items-center w-full'>
                All Collections
              </div>
              <div className='flex items-center gap-4'>
                {/* Mobile Filter Button */}
                {hasFiltersAvailable && (
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant='outline'
                        size='sm'
                        className='lg:hidden fixed bottom-5 right-3 z-50'>
                        <Filter className='w-4 h-4 mr-2' />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className='ml-2 px-1.5 py-0.5 text-xs bg-gray-900 text-white rounded-full'>
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side='left' className='w-full sm:w-96 p-0'>
                      <SheetHeader className='px-6 py-4 border-b border-gray-200'>
                        <div className='flex items-center justify-between'>
                          <SheetTitle>Filters</SheetTitle>
                          {activeFilterCount > 0 && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={handleClearFilters}
                              className='text-sm'>
                              Clear All
                            </Button>
                          )}
                        </div>
                      </SheetHeader>
                      <div className='px-6 py-4 overflow-y-auto h-[calc(100vh-80px)]'>
                        <ProductFilters
                          sizes={distictFilterValues.sizes.filter(
                            (i) => i !== "",
                          )}
                          colors={distictFilterValues.colors.filter(
                            (i) => i !== "",
                          )}
                          categories={distictFilterValues.categories}
                          filterData={filterData}
                          onFilterChange={handleFilterChange}
                          onClearFilters={handleClearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                {/* Results Count */}
                <div className='hidden md:block'>
                  <p className='text-sm text-gray-600'>
                    {loading && !products?.length ? (
                      "Loading products..."
                    ) : (
                      <>
                        Showing{" "}
                        <span className='font-medium text-gray-900'>
                          {products?.length || 0}
                        </span>{" "}
                        products
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className=' items-center gap-1 bg-gray-100 rounded-md p-1 hidden md:flex'>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded transition-all duration-200",
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                  aria-label='Grid view'>
                  <Grid3x3 className='w-4 h-4' />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded transition-all duration-200",
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700",
                  )}
                  aria-label='List view'>
                  <List className='w-4 h-4' />
                </button>
              </div>
            </div>

            {/* Loading State - Initial */}
            {loading && (!products || products.length === 0) && (
              <div className='flex flex-col items-center justify-center py-20'>
                <Loader2 className='w-12 h-12 text-gray-400 animate-spin mb-4' />
                <p className='text-gray-600'>Loading products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products && products.length === 0 && (
              <div className='flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200'>
                <div className='text-center'>
                  <X className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    No products found
                  </h3>
                  <p className='text-gray-600 mb-4'>
                    Try adjusting your filters or search criteria
                  </p>
                  {activeFilterCount > 0 && (
                    <Button variant='outline' onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {products && products.length > 0 && (
              <>
                {/* Grid View */}
                {viewMode === "grid" && (
                  <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3  gap-2 md:gap-6'>
                    {adaptedProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/collections/${product.id}`}
                        onClick={saveNavigationState}>
                        <ProductCard product={product} />
                      </Link>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === "list" && (
                  <div className='space-y-4'>
                    {adaptedProducts.map((product) => (
                      <Link
                        key={product.id}
                        className='mb-2'
                        href={`/collections/${product.id}`}
                        onClick={saveNavigationState}>
                        <ProductListCard product={product} />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Loading More Indicator */}
                {loading && products.length > 0 && (
                  <div className='flex items-center justify-center py-12'>
                    <Loader2 className='w-8 h-8 text-gray-400 animate-spin mr-3' />
                    <p className='text-gray-600'>Loading more products...</p>
                  </div>
                )}

                {/* Load More Trigger */}
                <div ref={loadMoreRef} className='h-20' />

                {/* End of Results */}
                {!loading &&
                  currentPage >= totalPages &&
                  products.length > 0 && (
                    <div className='text-center py-12'>
                      <p className='text-gray-500'>
                        You&apos;ve reached the end of the list
                      </p>
                    </div>
                  )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * ProductListCard Component - Horizontal layout for list view
 */
function ProductListCard({ product }: { product: any }) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <div className='group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 mb-2'>
      <div className='flex flex-col sm:flex-row gap-4 p-4'>
        {/* Product Image */}
        <div className='relative w-full sm:w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100 rounded-md border border-gray-50 '>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className='object-cover group-hover:scale-105 transition-transform duration-300 shadow'
              sizes='(max-width: 640px) 100vw, 192px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400'>
              <span className='text-sm'>No image</span>
            </div>
          )}
          {discount > 0 && (
            <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
              -{discount}%
            </div>
          )}
          {product.rating >= 4 && (
            <div className='absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1'>
              <TrendingUp className='w-3 h-3' />
              Popular
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='flex-1 flex flex-col justify-between min-w-0'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2'>
              {product.name}
            </h3>

            {product.description && (
              <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                {product.description}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-xs text-gray-500'>Colors:</span>
                <div className='flex gap-1'>
                  {product.colors.slice(0, 5).map((color: any, idx: number) => (
                    <div
                      key={idx}
                      className='w-4 h-4 rounded-full border border-gray-300'
                      style={{ backgroundColor: color.value || "#ccc" }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className='text-xs text-gray-500'>
                      +{product.colors.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-xs text-gray-500'>Sizes:</span>
                <div className='flex flex-wrap gap-1'>
                  {product.sizes.slice(0, 6).map((size: any, idx: number) => (
                    <span
                      key={idx}
                      className='text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded'>
                      {size.name}
                    </span>
                  ))}
                  {product.sizes.length > 6 && (
                    <span className='text-xs text-gray-500'>
                      +{product.sizes.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price and CTA */}
          <div className='flex items-center justify-between mt-auto pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-3'>
              <span className='text-2xl font-bold text-gray-900'>
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-400 line-through'>
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                  <span className='text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded'>
                    Save ৳
                    {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant='default'
              size='sm'
              className='hidden sm:flex items-center gap-2'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
