"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@/lib/config";
import HomePage from "@/components/pages/Home";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(true); // For loading state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading
        setLoading(true);
        const [categoryResponse, productResponse] = await Promise.all([
          axios.get(config.product.getCategories()),
          axios.get(config.product.getNewProducts()),
        ]);

        // Handle responses
        const categoriesData = categoryResponse?.data?.success
          ? categoryResponse.data.data
          : [];
        const productsData = productResponse?.data ?? [];

        // Set state
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true); // Handle error state
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <main className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="flex justify-center items-center flex-col animate-out">
          <Image
            src="https://prior-image.s3.eu-north-1.amazonaws.com/cat-chase-loading-animation.gif"
            width={512}
            height={512}
            alt="loading..."
          />
        </div>
      </main>
    );
  }

  // Show error message if fetch fails
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Error loading data</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HomePage categories={categories} products={products} />
    </main>
  );
}
