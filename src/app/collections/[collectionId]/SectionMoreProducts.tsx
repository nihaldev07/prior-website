"use client";
import React, { useEffect, useState } from "react";

import Heading from "@/shared/Heading/Heading";
import { ProductType } from "@/data/types";
import axios from "axios";
import { config } from "@/lib/config";
import ProductCard from "@/shared/productCard";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex-col justify-center items-center">
      <Heading className="mt-6 " isCenter={true} isMain={true}>
        Explore more products
      </Heading>

      <Separator className="my-4" />

      <div className="grid gap-2 md:gap-7 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {products.map((shoe) => (
          <ProductCard key={shoe.id} product={shoe} />
        ))}
      </div>
    </div>
  );
};

export default SectionMoreProducts;
