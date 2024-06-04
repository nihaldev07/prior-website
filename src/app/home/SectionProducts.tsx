"use client";
import React, { Suspense, lazy } from "react";

import Filter from "@/components/Filter";
import useProductFetch from "@/hooks/useFetchProducts";
import { productsSection } from "@/data/content";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";
import { ProductType } from "@/data/types";
import { Bird, Loader2, LoaderCircle } from "lucide-react";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("@/components/ProductCard"));

const SectionProducts = () => {
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

  return (
    <div className='px-3 sm:container'>
      <Heading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </Heading>
      <Filter
        sizes={distictFilterValues?.sizes}
        colors={distictFilterValues.colors}
        categories={distictFilterValues?.categories}
        filterData={filterData}
        handleFilterChange={(value) => setFilterData(value)}
      />

      <div className='grid gap-2 gap-y-5 sm:gap-7 grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {!!products &&
          products.map((product: ProductType) => (
            <Suspense
              fallback={
                <div>
                  Loading...
                  <Loader2 className='w-5 h-5 animate-spin' />
                </div>
              }
              key={product.id}>
              <ProductCard product={product} className='border-neutral-300' />
            </Suspense>
          ))}
      </div>

      {!loading && currentPage < totalPages && (
        <div className='mt-14 flex items-center justify-center'>
          <ButtonPrimary onClick={handleLoadMore}>View More</ButtonPrimary>
        </div>
      )}

      {loading && (
        <span className=' w-full p-4 flex justify-center items-center gap-2 text-center text-black'>
          loading... <LoaderCircle className='w-5 h-5 ml-2 text-black' />
        </span>
      )}

      {!loading && products?.length < 1 && (
        <div className='w-full flex justify-center gap-2 flex-row items-center p-10 rounded-lg bg-gray-50'>
          <Bird className='w-10 h-10 text-primary' />
          <span className='text-base font-light text-center text-gray-700'>
            No Product Found
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
