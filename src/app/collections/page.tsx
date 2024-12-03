"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

import ProductCard from "@/shared/productCard";
import SidebarFilters from "@/components/SidebarFilter";

import useProductFetch from "@/hooks/useProductFetch";
import { ProductType } from "@/data/types";
import { Filter, LoaderCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Heading from "@/shared/Heading/Heading";
import { collectionTag } from "@/data/content";
import useAnalytics from "@/hooks/useAnalytics";

const Page = () => {
  useAnalytics();

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
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && currentPage < totalPages) {
        handleLoadMore();
      }
    },
    [loading, currentPage, totalPages, handleLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="my-6">
      <Heading isCenter isMain desc={collectionTag?.description}>
        {collectionTag?.title}
      </Heading>
      {loading && (!products || products.length < 1) && (
        <div className="w-full p-12 bg-gray-200 flex justify-center items-center">
          <span className="flex justify-center items-center gap-2 text-black">
            Loading... <LoaderCircle className="w-5 h-5 ml-2 text-black" />
          </span>
        </div>
      )}
      {(!!products || !loading) && (
        <div
          className="px-4 md:container relative flex flex-col lg:flex-row"
          id="body"
        >
          {/* Mobile Filters */}
          <div className="flex justify-between items-center p-2 md:hidden">
            <h2 className="text-primary font-semibold">Products</h2>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger>
                <Filter className="w-6 h-6 ml-auto" />
              </SheetTrigger>
              <SheetContent
                className="overflow-y-auto px-3"
                onClick={() => {
                  setSheetOpen(false);
                }}
              >
                <SidebarFilters
                  filterData={filterData}
                  selectedCategory={filterData?.categoryId}
                  selectedColor={filterData?.color}
                  selectedSize={filterData?.size}
                  categories={distictFilterValues.categories}
                  colors={distictFilterValues.colors.filter((i) => i !== "")}
                  sizes={distictFilterValues.sizes.filter((i) => i !== "")}
                  handleFilterChange={(value) => {
                    setFilterData(value);
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters */}
          <div className="pr-4 lg:basis-1/3 xl:basis-1/4 hidden md:block">
            <SidebarFilters
              filterData={filterData}
              categories={distictFilterValues.categories}
              colors={distictFilterValues.colors.filter((i) => i !== "")}
              sizes={distictFilterValues.sizes.filter((i) => i !== "")}
              handleFilterChange={(value) => {
                setFilterData(value);
              }}
            />
          </div>

          {/* Products Grid */}
          <div className="relative flex-1">
            <div className="grid flex-1 gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-10 grid-cols-2 xl:grid-cols-3">
              {!!products &&
                products.map((item: ProductType) => (
                  <ProductCard product={item} key={item.id} />
                ))}
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="w-full p-12 bg-gray-200 flex justify-center items-center">
                <span className="flex justify-center items-center gap-2 text-black">
                  Loading...{" "}
                  <LoaderCircle className="w-5 h-5 ml-2 text-black" />
                </span>
              </div>
            )}

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-10"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
