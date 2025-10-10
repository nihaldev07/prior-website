"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { productsSection } from "@/data/content";
import { ProductType } from "@/data/types";
import { Bird, LoaderCircle } from "lucide-react";
import useProductFetch from "@/hooks/useProductFetch";
import Heading from "@/shared/Heading/Heading";
import Filter from "@/components/Filter";
import { usePageState } from "@/context/PageStateContext";
import YukiChatWidget from "@/components/ChatWidget/yukiChatWidget";
import ProductCard from "@/shared/simpleProductCard";
import { FilterData } from "@/types/filter";

const SectionProducts = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

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
          behavior: 'instant' as ScrollBehavior,
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

  // Memoized callback for intersection observer
  const handleLoadMoreCallback = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      handleLoadMore();
    }
  }, [currentPage, totalPages, loading, handleLoadMore]);

  // Observer to detect scroll to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          handleLoadMoreCallback();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 } // Load earlier with lower threshold
    );

    const currentObserverRef = observerRef.current;

    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [handleLoadMoreCallback]);

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

      <div className='grid gap-3 sm:gap-3 md:gap-4 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:container'>
        {!!products &&
          products?.map((product: ProductType) => (
            <div
              key={product?.id}
              onClick={() => handleProductClick(product.id)}>
              <ProductCard product={product} />
            </div>
          ))}
      </div>

      {/* Observer trigger */}
      {!loading && currentPage < totalPages && (
        <div ref={observerRef} className='h-10'></div>
      )}

      {loading && (
        <div className='w-full p-12 bg-gray-200 flex justify-center items-center'>
          <span className='flex justify-center items-center gap-2 text-black'>
            Loading... <LoaderCircle className='w-5 h-5 ml-2 text-black' />
          </span>
        </div>
      )}

      {!loading && products?.length < 1 && (
        <div className='w-full flex justify-center gap-2 items-center p-10 rounded-lg bg-gray-50'>
          <Bird className='w-10 h-10 text-primary' />
          <span className='text-base font-light text-center text-gray-700'>
            No Products Found
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
