"use client";
// Client-side product fetch used ONLY when the shopper applies color/size
// filters (the default, unfiltered grid is fully server-rendered and never
// calls this). Params mirror the old useProductFetch call exactly so the
// backend receives identical requests.
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { config } from "@/lib/config";
import { requestDeduper } from "@/lib/request-deduper";
import { adaptProductsToNewFormat, Product } from "@/lib/adapters/productAdapter";

const LIMIT = 20;

export interface ActiveFilters {
  color: string;
  size: string;
  price: string;
}

export function useFilteredProducts(categoryId: string, enabled: boolean, filters: ActiveFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  // Latest filters without re-creating callbacks on every keystroke.
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const filtersKey = `${filters.color}|${filters.size}|${filters.price}`;

  const fetchPage = useCallback(
    async (pageToFetch: number, append: boolean) => {
      setLoading(true);
      if (!append) setInitialLoading(true);
      try {
        const url = config.product.getProducts();
        const params = {
          page: pageToFetch,
          limit: LIMIT,
          categoryId,
          ...filtersRef.current,
        };
        const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;
        const response = await requestDeduper.fetch(cacheKey, () =>
          axios.get(url, { params, timeout: 10000 }),
        );
        if (response?.status < 300) {
          const fetched = adaptProductsToNewFormat(response.data.products || []);
          setProducts((prev) => (append ? [...prev, ...fetched] : fetched));
          setTotalProducts(
            typeof response.data.totalProducts === "number"
              ? response.data.totalProducts
              : fetched.length,
          );
          setPage(pageToFetch);
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [categoryId],
  );

  // Reset + fetch page 1 whenever the filter combination changes.
  useEffect(() => {
    if (!enabled) return;
    fetchPage(1, false);
  }, [enabled, filtersKey, fetchPage]);

  const loadMore = useCallback(() => {
    if (!enabled || loading) return;
    fetchPage(page + 1, true);
  }, [enabled, loading, page, fetchPage]);

  return {
    products,
    totalProducts,
    loading,
    initialLoading,
    hasMore: products.length < totalProducts,
    loadMore,
  };
}

export default useFilteredProducts;
