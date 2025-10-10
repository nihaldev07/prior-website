"use client";
import { useState } from "react";
import axios from "axios";
import useThrottledEffect from "./useThrottleEffect";
import { config } from "@/lib/config";
import { FilterData } from "@/types/filter";
import { requestDeduper } from "@/lib/request-deduper";

const useProductFetch = (
  initialPage = 1,
  initialFilters: FilterData = { categoryId: "", color: "", size: "", price: "" }
) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [filterData, setFilterData] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [distictFilterValues, setDistictFilterValues] = useState({
    sizes: [],
    colors: [],
    categories: [],
  });
  const limit = 20;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = config.product.getProducts();
      const params = { page: currentPage, limit, ...filterData };
      const cacheKey = `${url}?${new URLSearchParams(params as any).toString()}`;

      const response = await requestDeduper.fetch(
        cacheKey,
        () => axios.get(url, { params, timeout: 10000 })
      );

      if (response?.status < 300) {
        setProducts(
          currentPage > 1
            ? [...products, ...response.data.products]
            : response.data.products
        );
        setTotalPages(Math.ceil(response.data.totalProducts / limit));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      const url = config.product.getNewProducts();
      const cacheKey = `${url}?limit=100`;

      const response = await requestDeduper.fetch(
        cacheKey,
        () => axios.get(url, { params: { limit: 100 }, timeout: 10000 })
      );

      if (response?.status < 300) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async (categoryId = "") => {
    try {
      const url = config.product.getFilterData();
      const cacheKey = `${url}?categoryId=${categoryId}`;

      const response = await requestDeduper.fetch(
        cacheKey,
        () => axios.get(url, { params: { categoryId }, timeout: 10000 })
      );

      if (response?.status < 300) {
        setDistictFilterValues({ ...response.data });
      }
    } catch (error) {
      console.error("Error fetching product filter data:", error);
    }
  };

  useThrottledEffect(
    () => {
      fetchProducts();
      //eslint-disable-next-line
    },
    [currentPage],
    300 // Reduced from 1000ms to 300ms
  );

  const changeCurrentpageToFetchProduct = () => {
    if (currentPage > 1) setCurrentPage(1);
    else fetchProducts();
  };

  useThrottledEffect(
    () => {
      changeCurrentpageToFetchProduct();
      //eslint-disable-next-line
    },
    [filterData],
    300 // Reduced from 1000ms to 300ms
  );

  useThrottledEffect(
    () => {
      fetchFilterData(filterData?.categoryId);
      //eslint-disable-next-line
    },
    [filterData?.categoryId],
    300 // Reduced from 1000ms to 300ms
  );

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return {
    products,
    loading,
    totalPages,
    currentPage,
    handleLoadMore,
    filterData,
    setFilterData,
    fetchNewProducts,
    distictFilterValues,
  };
};

export default useProductFetch;
