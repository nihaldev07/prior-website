"use client";
// Interactive layer of the category page: toolbar (result count, filter
// sheet, sort), the product grid, and load-more. The DEFAULT (unfiltered)
// grid renders purely from server-passed products — zero fetching on mount,
// so the SSR HTML and the hydrated page are identical. A client fetch only
// starts once the shopper applies a filter.
import React, { useMemo, useState } from "react";
import { SlidersHorizontal, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductFiltersSheet from "@/components/new-ui/ProductFilterSheet";
import ProductCard from "@/components/new-ui/ProductCard";
import { Product } from "@/lib/adapters/productAdapter";
import { FilterData } from "@/types/filter";
import useFilteredProducts from "./useFilteredProducts";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "name-asc", label: "Alphabetical, A–Z" },
  { value: "name-desc", label: "Alphabetical, Z–A" },
];

interface CategoryProductBrowserProps {
  categoryId: string;
  products: Product[];
  totalProducts: number;
  currentPage: number;
  facets: { sizes: string[]; colors: string[] };
  /** Server-rendered <Pagination/> — hidden while filters are active. */
  children?: React.ReactNode;
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  if (sort === "featured") return list;
  const sorted = [...list];
  sorted.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  return sorted;
}

const CategoryProductBrowser = ({
  categoryId,
  products: serverProducts,
  totalProducts: serverTotal,
  currentPage,
  facets,
  children,
}: CategoryProductBrowserProps) => {
  const [filterData, setFilterData] = useState<FilterData>({
    categoryId,
    color: "",
    size: "",
    price: "",
  });
  const [sort, setSort] = useState<SortKey>("featured");

  // Filters stay client-state only: no new URLs, no duplicate-content pages.
  const hasActiveFilters = !!(filterData.color || filterData.size);
  const activeFilterCount =
    (filterData.color ? filterData.color.split(",").filter(Boolean).length : 0) +
    (filterData.size ? filterData.size.split(",").filter(Boolean).length : 0);

  const filtered = useFilteredProducts(categoryId, hasActiveFilters, {
    color: filterData.color,
    size: filterData.size,
    price: filterData.price,
  });

  const displayProducts = useMemo(
    () => sortProducts(hasActiveFilters ? filtered.products : serverProducts, sort),
    [hasActiveFilters, filtered.products, serverProducts, sort],
  );

  const totalProducts = hasActiveFilters ? filtered.totalProducts : serverTotal;
  const showingFrom = hasActiveFilters
    ? displayProducts.length > 0
      ? 1
      : 0
    : (currentPage - 1) * 20 + 1;
  const showingTo = hasActiveFilters
    ? displayProducts.length
    : (currentPage - 1) * 20 + displayProducts.length;

  const clearFilters = () =>
    setFilterData({ categoryId, color: "", size: "", price: "" });

  return (
    <section className='my-6 md:my-8' id='products'>
      {/* Sticky toolbar: result count · filter · sort */}
      <div className='sticky top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-neutral-200'>
        <div className='px-4 md:container flex flex-wrap items-center justify-between gap-3 py-3'>
          <p className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
            {filtered.initialLoading
              ? "Updating results…"
              : totalProducts > 0
                ? `Showing ${showingFrom}–${showingTo} of ${totalProducts}`
                : "No products"}
          </p>
          <div className='flex items-center gap-3'>
            <ProductFiltersSheet
              showCategory={false}
              trigger={
                <Button className='group relative z-50 inline-flex items-center justify-center gap-1.5 h-10 px-5 text-xs font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 rounded-none transition-all duration-300 overflow-hidden'>
                  {/* Continuous animated border */}
                  <span className='absolute inset-0 z-0'>
                    <span className='absolute top-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-top' />
                    <span className='absolute right-0 w-[2px] bg-gradient-to-b from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-right' />
                    <span className='absolute bottom-0 h-[2px] bg-gradient-to-l from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-bottom' />
                    <span className='absolute left-0 w-[2px] bg-gradient-to-t from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-left' />
                  </span>
                  {/* Static border (fallback) */}
                  <span className='absolute inset-0 border border-neutral-300 group-hover:border-transparent transition-colors duration-300 z-0' />
                  <span className='relative z-[2] flex items-center gap-2'>
                    <SlidersHorizontal className='w-4 h-4' />
                    Filter
                    {activeFilterCount > 0 && (
                      <Badge className='bg-neutral-900 text-white rounded-none'>
                        {activeFilterCount}
                      </Badge>
                    )}
                  </span>
                </Button>
              }
              sizes={facets.sizes}
              colors={facets.colors}
              categories={[]}
              filterData={filterData}
              onFilterChange={setFilterData}
              onClearFilters={clearFilters}
            />

            <div className='flex items-center gap-2'>
              <span className='hidden md:inline text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
                Sort by
              </span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className='w-[150px] sm:w-[190px] md:w-[220px] h-10 rounded-none border-neutral-300 font-serif text-sm hover:border-neutral-900 transition-colors duration-300 focus:ring-neutral-900 focus:border-neutral-900'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-none border-neutral-200'>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className='rounded-none font-serif'>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 md:container'>
        {/* Product grid */}
        {filtered.initialLoading ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='aspect-square bg-neutral-100 animate-pulse' />
            ))}
          </div>
        ) : displayProducts.length > 0 ? (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6 animate-in fade-in duration-500'>
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='py-20 text-center'>
            <div className='mx-auto h-px w-16 bg-neutral-300' />
            <p className='mt-6 font-serif tracking-wide text-neutral-900 text-xl'>
              No products match your filters
            </p>
            <p className='mt-2 text-sm text-neutral-500'>
              Try removing a colour or size to see more of this collection.
            </p>
          </div>
        )}

        {/* Filtered mode: load more + clear. Unfiltered: server pagination. */}
        {hasActiveFilters ? (
          <div className='flex flex-col items-center gap-4 mt-10'>
            {displayProducts.length > 0 && filtered.hasMore && (
            <Button
              onClick={filtered.loadMore}
              disabled={filtered.loading}
              className='group relative inline-flex items-center justify-center h-12 px-10 text-sm font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white bg-white hover:bg-neutral-900 rounded-none transition-all duration-300 overflow-hidden disabled:opacity-60'>
              <span className='absolute inset-0 z-0'>
                <span className='absolute top-0 h-[2px] bg-gradient-to-r from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-top' />
                <span className='absolute right-0 w-[2px] bg-gradient-to-b from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-right' />
                <span className='absolute bottom-0 h-[2px] bg-gradient-to-l from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-bottom' />
                <span className='absolute left-0 w-[2px] bg-gradient-to-t from-neutral-400 via-neutral-600 to-neutral-900 animate-border-draw-left' />
              </span>
              <span className='absolute inset-0 border border-neutral-300 group-hover:border-transparent transition-colors duration-300 z-0' />
              <span className='relative z-[2] flex items-center gap-2'>
                {filtered.loading && <LoaderCircle className='w-4 h-4 animate-spin' />}
                Load more
              </span>
            </Button>
          )}
            <button
              onClick={clearFilters}
              className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-500 underline underline-offset-4 hover:text-neutral-900 transition-colors duration-300'>
              Clear filters
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
};

export default CategoryProductBrowser;
