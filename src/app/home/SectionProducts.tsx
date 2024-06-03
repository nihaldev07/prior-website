"use client";
import React from "react";

import Filter from "@/components/Filter";
import useProductFetch from "@/hooks/useFetchProducts";
import ProductCard from "@/components/ProductCard";
import { productsSection, shoes } from "@/data/content";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Heading from "@/shared/Heading/Heading";
import { ProductType } from "@/data/types";
import { LoaderCircle } from "lucide-react";

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
            <ProductCard
              key={product.id}
              product={product}
              className='border-neutral-300'
            />
          ))}
      </div>

      {!loading && currentPage < totalPages && (
        <div className='mt-14 flex items-center justify-center'>
          <ButtonPrimary onClick={handleLoadMore}>View More</ButtonPrimary>
        </div>
      )}

      {loading && (
        <span className='flex justify-center items-center gap-2 text-center text-black'>
          loading... <LoaderCircle className='w-5 h-5 ml-2 text-black' />
        </span>
      )}
    </div>
  );
};

export default SectionProducts;
