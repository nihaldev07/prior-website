import React from "react";
import ProductCard from "@/shared/productCard";
import { ProductType } from "@/data/types";
import Heading from "@/shared/Heading/Heading";
import { newProductPageContent } from "@/data/content";
import axios from "axios";
import { config } from "@/lib/config";

const fetchProducts = async () => {
  try {
    const response = await axios.get(config.product.getNewProducts());
    return response?.data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const DealPage = async () => {
  const products = await fetchProducts();

  return (
    <div className="my-6">
      <Heading isCenter isMain desc={newProductPageContent?.description}>
        {newProductPageContent?.title}
      </Heading>
      <div
        className="px-4 md:container relative flex flex-col lg:flex-row"
        id="body"
      >
        <div className="mb-4 md:mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="grid flex-1 gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-10 grid-cols-2 xl:grid-cols-4">
            {products.length > 0 ? (
              products.map((item: ProductType) => (
                <ProductCard product={item} key={item.id} />
              ))
            ) : (
              <div className="text-center text-gray-500 w-full col-span-full">
                No products available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealPage;
