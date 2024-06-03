"use client";
import React, { useState, lazy, Suspense } from "react";

import Slider from "@/shared/Slider/Slider";
import { config } from "@/utils/config";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import Carousel from "./Carosol/Swiper";
import { ProductType } from "@/data/types";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("./ProductCard"));

const ProductSlider = () => {
  const [products, setProducts] = useState([]);

  const getBestProducts = async () => {
    try {
      const res = await fetch(config.product.getBestProducts());
      const products = await res.json();
      if (!!products && Array.isArray(products)) {
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
      <div className='hidden sm:block'>
        {!!products && products.length > 0 && (
          <Slider
            itemPerRow={4}
            data={products}
            renderItem={(item) => {
              if (!item) {
                return null;
              }
              return (
                <Suspense fallback={<div>Loading...</div>} key={item.id}>
                  <ProductCard
                    imageSize='250px'
                    showPrevPrice
                    product={item}
                    className='bg-white mx-2'
                  />
                </Suspense>
              );
            }}
          />
        )}
      </div>
      <div className='w-full sm:hidden'>
        <Carousel
          images={
            !!products ? products.map((p: ProductType) => p?.thumbnail) : []
          }
          delay={1500}
        />
      </div>
    </div>
  );
};

export default ProductSlider;
