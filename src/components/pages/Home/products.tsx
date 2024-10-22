"use client";
import React, { lazy } from "react";

import { productsSection } from "@/data/content";
import { ProductType } from "@/data/types";
import { Bird, Cat, Loader2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductFetch from "@/hooks/useProductFetch";
import Heading from "@/shared/Heading/Heading";
import Filter from "@/components/Filter";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("@/shared/productCard"));

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
    <div className="px-3 sm:mx-20 mb-4">
      <Heading isCenter isMain desc={productsSection.description}>
        {productsSection.heading}
      </Heading>
      <Filter
        sizes={distictFilterValues?.sizes}
        colors={distictFilterValues.colors}
        categories={distictFilterValues?.categories}
        filterData={filterData}
        handleFilterChange={(value: any) => setFilterData(value)}
      />

      <div className=" grid gap-3 sm:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {!!products &&
          products.map((product: ProductType) => (
            <ProductCard key={product?.id} product={product} />
          ))}
      </div>

      {!loading && currentPage < totalPages && (
        <div className="mt-14 flex items-center justify-center">
          <Button onClick={handleLoadMore}>View More</Button>
        </div>
      )}

      {loading && (
        <div className="w-full p-12 bg-gray-200 justify-center items-center flex">
          <span className=" w-full p-4 flex justify-center items-center gap-2 text-center text-black">
            loading... <LoaderCircle className="w-5 h-5 ml-2 text-black" />
          </span>
        </div>
      )}

      {!loading && products?.length < 1 && (
        <div className="w-full flex justify-center gap-2 flex-row items-center p-10 rounded-lg bg-gray-50">
          <Bird className="w-10 h-10 text-primary" />
          <span className="text-base font-light text-center text-gray-700">
            No Product Found
          </span>
        </div>
      )}
    </div>
  );
};

export default SectionProducts;
