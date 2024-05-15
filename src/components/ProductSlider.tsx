"use client";
import React, { useState } from "react";

import Slider from "@/shared/Slider/Slider";

import ProductCard from "./ProductCard";
import { config } from "@/utils/config";
import useThrottledEffect from "@/hooks/useThrottleEffect";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  const getBestProducts = async () => {
    try {
      const res = await fetch(config.product.getBestProducts());
      const products = await res.json();
      if (!!products && Array.isArray(products)) {
        //@ts-ignore
        setProducts([...products]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useThrottledEffect(
    () => {
      getBestProducts();
    },
    [],
    1000
  );
  return (
    <div className=''>
      {!!products && products.length > 0 && (
        <Slider
          itemPerRow={4}
          data={products}
          renderItem={(item) => {
            if (!item) {
              return null;
            }
            return (
              <ProductCard
                showPrevPrice
                product={item}
                className='bg-white mx-2'
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductSlider;
