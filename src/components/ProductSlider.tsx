"use client";
import React, { useState, lazy, Suspense } from "react";

import Slider from "@/shared/Slider/Slider";
import { config } from "@/utils/config";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import Carousel from "./Carosol/SwiperComponent";
import { ProductType } from "@/data/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("./ProductCard"));

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
                //@ts-ignore
                <Suspense
                  fallback={
                    <div>
                      Loading...
                      <Loader2 className='w-5 h-5 animate-spin' />
                    </div>
                  }
                  //@ts-ignore
                  key={item?.id}>
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
          items={
            !!products
              ? products.map((p: ProductType, index: number) => (
                  <Link href={`/products/${p?.id}`} key={index}>
                    <Image
                      src={p?.thumbnail}
                      alt={`Image ${index}`}
                      width={640}
                      height={480}
                      quality={90}
                      className='w-full h-auto object-fill rounded-3xl'
                    />
                  </Link>
                ))
              : []
          }
          delay={2000}
        />
      </div>
    </div>
  );
};

export default ProductSlider;
