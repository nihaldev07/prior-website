"use client";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "@/shared/productCard";
import SidebarFilters from "@/components/SidebarFilter";
import useProductFetch from "@/hooks/useProductFetch";
import { ProductType } from "@/data/types";
import { Filter, LoaderCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Heading from "@/shared/Heading/Heading";
import { collectionTag } from "@/data/content";
import { useParams } from "next/navigation";
import useAnalytics from "@/hooks/useAnalytics";

const SingleCategoryPage = () => {
  const params = useParams(); // Fetch route parameters
  const categoryId = params.categoryId;

  const {
    products,
    loading,
    totalPages,
    currentPage,
    distictFilterValues,
    setFilterData,
    filterData,
    handleLoadMore,
  } = useProductFetch(1, {
    //@ts-ignore
    categoryId,
    color: "",
    size: "",
    price: "",
  });

  useAnalytics();

  useEffect(() => {
    //@ts-ignore
    setFilterData({ ...filterData, categoryId });
    //eslint-disable-next-line
  }, [categoryId]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages && !loading) {
          handleLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [currentPage, totalPages, loading, handleLoadMore]);

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
                  showCategory={false}
                  //@ts-ignore
                  selectedCategory={categoryId}
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
          <div className="pr-4 lg:basis-1/3 xl:basis-1/4 hidden md:block">
            <SidebarFilters
              filterData={filterData}
              showCategory={false}
              //@ts-ignore
              selectedCategory={categoryId}
              selectedColor={filterData?.color}
              selectedSize={filterData?.size}
              categories={distictFilterValues.categories}
              colors={distictFilterValues.colors.filter((i) => i !== "")}
              sizes={distictFilterValues.sizes.filter((i) => i !== "")}
              handleFilterChange={(value) => {
                setFilterData(value);
              }}
            />
          </div>
          <div className="mb-4 md:mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
          <div className="relative flex-1">
            <div className="grid flex-1 gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-10 grid-cols-2 xl:grid-cols-3 ">
              {!!products &&
                products.map((item: ProductType) => (
                  <ProductCard product={item} key={item.id} />
                ))}
            </div>
            {loading && (
              <div className="w-full p-12 bg-gray-200 flex justify-center items-center">
                <span className="flex justify-center items-center gap-2 text-black">
                  Loading...{" "}
                  <LoaderCircle className="w-5 h-5 ml-2 text-black" />
                </span>
              </div>
            )}
            {/* Observer element for infinite scroll */}
            <div ref={observerRef} className="h-10" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCategoryPage;
