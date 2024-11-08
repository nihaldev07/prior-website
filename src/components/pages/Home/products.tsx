// Import necessary hooks and components
"use client";
import React, { memo } from "react";
import dynamic from "next/dynamic";
import { productsSection } from "@/data/content";
import { ProductType } from "@/data/types";
import { Bird, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductFetch from "@/hooks/useProductFetch";
import Heading from "@/shared/Heading/Heading";
import Filter from "@/components/Filter";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

// Dynamically import ProductCard for better SSR support and lazy load
const ProductCard = dynamic(() => import("@/shared/productCard"), {
  ssr: false,
  loading: () => <LoaderCircle className="w-5 h-5 text-black" />,
});

// Memoize Filter and Heading to avoid unnecessary re-renders
const MemoizedFilter = memo(Filter);
const MemoizedHeading = memo(Heading);

const SectionProducts = () => {
  useScrollRestoration();
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
    <div className="px-3 lg:mx-20 mb-4">
      <MemoizedHeading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </MemoizedHeading>

      <MemoizedFilter
        sizes={distictFilterValues?.sizes}
        colors={distictFilterValues?.colors}
        categories={distictFilterValues?.categories}
        filterData={filterData}
        handleFilterChange={(value: any) => setFilterData(value)}
      />

      <div className="grid gap-3 sm:gap-2 md:gap-4 lg:gap-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {!!products &&
          products?.map((product: ProductType) => (
            <ProductCard key={product?.id} product={product} />
          ))}
      </div>

      {!loading && currentPage < totalPages && (
        <div className="mt-14 flex items-center justify-center">
          <Button onClick={handleLoadMore}>View More</Button>
        </div>
      )}

      {loading && (
        <div className="w-full p-12 bg-gray-200 flex justify-center items-center">
          <span className="flex justify-center items-center gap-2 text-black">
            Loading... <LoaderCircle className="w-5 h-5 ml-2 text-black" />
          </span>
        </div>
      )}

      {!loading && products?.length < 1 && (
        <div className="w-full flex justify-center gap-2 items-center p-10 rounded-lg bg-gray-50">
          <Bird className="w-10 h-10 text-primary" />
          <span className="text-base font-light text-center text-gray-700">
            No Products Found
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(SectionProducts);
