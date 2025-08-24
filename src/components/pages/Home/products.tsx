"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { productsSection } from "@/data/content";
import { ProductType } from "@/data/types";
import { Bird, LoaderCircle } from "lucide-react";
import useProductFetch from "@/hooks/useProductFetch";
import Heading from "@/shared/Heading/Heading";
import Filter from "@/components/Filter";
import { usePageState } from "@/context/PageStateContext";
import YukiChatWidget from "@/components/ChatWidget/yukiChatWidget";

// Dynamically import ProductCard for better SSR support and lazy load
const ProductCard = dynamic(() => import("@/shared/simpleProductCard"), {
  ssr: false,
  loading: () => <LoaderCircle className='w-5 h-5 text-black' />,
});

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

  // Restore state on mount
  useEffect(() => {
    // Restore scroll position
    window.scrollTo(0, state.scrollPosition);

    // Restore filter and pagination data
    //@ts-ignore
    setFilterData(state.filterData);
    if (state.currentPage > 1) {
      //@ts-ignore
      handleLoadMore(state.currentPage - 1); // Load previous pages if necessary
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Observer to detect scroll to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && currentPage < totalPages && !loading) {
          handleLoadMore();
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [currentPage, totalPages, loading, handleLoadMore]);

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
        handleFilterChange={(value: any) => setFilterData(value)}
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
