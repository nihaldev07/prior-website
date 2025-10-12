import React from "react";
import ProductCard from "@/shared/simpleProductCard";
import { ProductType } from "@/data/types";
import Heading from "@/shared/Heading/Heading";
import { newProductPageContent } from "@/data/content";
import axios from "axios";
import { config } from "@/lib/config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${newProductPageContent?.title} | Prior`,
  description: newProductPageContent?.description,
  openGraph: {
    title: newProductPageContent?.title,
    description: newProductPageContent?.description,
    images: ['https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: newProductPageContent?.title,
    description: newProductPageContent?.description,
    images: ['https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg'],
  },
};

export const revalidate = 3600; // ISR: Revalidate every 1 hour

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
    <div className='my-6'>
      <Heading isCenter isMain desc={newProductPageContent?.description}>
        {newProductPageContent?.title}
      </Heading>
      <div
        className='px-4 md:container relative flex flex-col lg:flex-row'
        id='body'>
        <div className='mb-4 md:mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0' />
        <div className='relative flex-1'>
          <div className='grid flex-1 gap-3 md:gap-x-8 md:gap-y-10 grid-cols-2 xl:grid-cols-4'>
            {products.length > 0 ? (
              products.map((item: ProductType) => (
                <ProductCard product={item} key={item.id} />
              ))
            ) : (
              <div className='text-center text-gray-500 w-full col-span-full'>
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
