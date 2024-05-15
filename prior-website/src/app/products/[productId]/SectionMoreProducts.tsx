"use client";
import React, { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import { shoes } from "@/data/content";
import Heading from "@/shared/Heading/Heading";
import { ProductType } from "@/data/types";
import axios from "axios";
import { config } from "@/utils/config";
interface Props {
  categoryId: string;
}
const SectionMoreProducts: React.FC<Props> = ({ categoryId }) => {
  const [products, setproducts] = useState<ProductType[]>([]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        config.product.getProductsByCategory(categoryId)
      );
      if (response?.status < 300) {
        const productList = response?.data?.data;
        setproducts(productList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts(); //eslint-disable-next-line
  }, [categoryId]);
  return (
    <div>
      <Heading className='mb-0'>Explore more products</Heading>

      <div className='grid gap-7 md:grid-cols-2 lg:grid-cols-4'>
        {products.map((shoe) => (
          <ProductCard
            key={shoe.id}
            product={shoe}
            className='border-neutral-300'
          />
        ))}
      </div>
    </div>
  );
};

export default SectionMoreProducts;
