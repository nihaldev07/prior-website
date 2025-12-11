"use client";

import React, { useEffect } from "react";
import { productsSection } from "@/data/content";
import { ProductType } from "@/data/types";
import { Bird, LoaderCircle, ChevronDown, Sparkles } from "lucide-react";
import useProductFetch from "@/hooks/useProductFetch";
import Heading from "@/shared/Heading/Heading";
import Filter from "@/components/Filter";
import { usePageState } from "@/context/PageStateContext";
import ProductCard from "@/shared/simpleProductCard";
import { FilterData } from "@/types/filter";

const SectionProducts = () => {
  // Fetching functions and state from custom hooks
  const {
    products,
    loading,
    totalPages,
    currentPage,
    handleLoadMore,
    filterData,
    setFilterData,
    distictFilterValues,
  } = useProductFetch();

  const { state, setState } = usePageState();

  // Restore filter data on mount
  useEffect(() => {
    // Restore filter data first
    if (state.filterData && Object.keys(state.filterData).length > 0) {
      setFilterData(state.filterData as FilterData);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll position only after products are loaded
  useEffect(() => {
    if (products.length > 0 && state.scrollPosition > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: state.scrollPosition,
          behavior: "instant" as ScrollBehavior,
        });
        // Clear the saved position to avoid repeated scrolling
        setState((prev) => ({ ...prev, scrollPosition: 0 }));
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  // Save state before navigation
  const handleProductClick = (productId: string) => {
    setState((prev) => ({
      ...prev,
      scrollPosition: window.scrollY,
      filterData,
      currentPage,
    }));
    window.location.href = `/collections/${productId}`; // Navigate to product page
  };

  return (
    <div className='px-3 lg:mx-20 mb-4'>
      <Heading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </Heading>

      <Filter
        sizes={distictFilterValues?.sizes}
        colors={distictFilterValues?.colors}
        categories={distictFilterValues?.categories}
        filterData={filterData}
        handleFilterChange={(value: FilterData) => setFilterData(value)}
      />

      <div className='grid gap-2 sm:gap-3 md:gap-4 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 sm:container'>
        {!!products &&
          products?.map((product: ProductType) => (
            <div
              key={product?.id}
              onClick={() => handleProductClick(product.id)}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {!loading && currentPage < totalPages && products.length > 0 && (
        <div className='flex justify-center items-center mt-12 mb-8'>
          <button
            onClick={handleLoadMore}
            className='group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:from-primary/90 hover:to-blue-600/90 overflow-hidden'>
            {/* Animated background effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

            {/* Button content */}
            <span className='relative flex items-center gap-2 text-base sm:text-lg'>
              <Sparkles className='w-5 h-5 animate-pulse' />
              Load More Products
              <ChevronDown className='w-5 h-5 group-hover:translate-y-1 transition-transform duration-300' />
            </span>

            {/* Shine effect */}
            <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className='w-full p-12 mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col justify-center items-center shadow-inner'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse'></div>
            <LoaderCircle className='relative w-12 h-12 text-primary animate-spin' />
          </div>
          <span className='mt-4 text-gray-700 font-medium text-lg'>
            Loading amazing products...
          </span>
        </div>
      )}

      {/* No Products Found */}
      {!loading && products?.length < 1 && (
        <div className='w-full flex flex-col justify-center gap-4 items-center p-12 mt-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-lg'>
          <div className='relative'>
            <div className='absolute inset-0 bg-primary/10 blur-2xl rounded-full'></div>
            <Bird className='relative w-16 h-16 text-primary animate-bounce' />
          </div>
          <div className='text-center space-y-2'>
            <h3 className='text-xl font-bold text-gray-900'>
              No Products Found
            </h3>
            <p className='text-base text-gray-600'>
              Try adjusting your filters to see more products
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
