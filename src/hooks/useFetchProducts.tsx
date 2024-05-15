"use client";
import { useState } from "react";
import axios from "axios";
import { config } from "@/utils/config";
import useThrottledEffect from "./useThrottleEffect";

const useProductFetch = (
  initialPage = 1,
  initialFilters = { categoryId: "", color: "", size: "", price: "" }
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
      const response = await axios.get(config.product.getProducts(), {
        params: {
          page: currentPage,
          limit,
          ...filterData,
        },
      });
      if (response?.status < 300) {
        setProducts(
          currentPage > 1
            ? [...products, ...response.data.products]
            : response.data.products
        );
        setTotalPages(Math.ceil(response.data.totalProducts / limit));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const fetchFilterData = async (categoryId = "") => {
    try {
      const response = await axios.get(config.product.getFilterData(), {
        params: {
          categoryId,
        },
      });
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
    1000
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
    1000
  );

  useThrottledEffect(
    () => {
      fetchFilterData(filterData?.categoryId);
      //eslint-disable-next-line
    },
    [filterData?.categoryId],
    1000
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
    distictFilterValues,
  };
};

export default useProductFetch;
