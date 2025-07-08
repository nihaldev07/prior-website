import React from "react";
import ProductCard from "@/shared/simpleProductCard";
import { ProductType } from "@/data/types";
import Heading from "@/shared/Heading/Heading";
import { newProductPageContent } from "@/data/content";
import axios from "axios";
import { config } from "@/lib/config";
import Head from "next/head";

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
      <Head>
        <title>{newProductPageContent?.title} | Prior</title>
        <meta name='description' content={newProductPageContent?.description} />
        <meta property='og:title' content={newProductPageContent?.title} />
        <meta
          property='og:description'
          content={newProductPageContent?.description}
        />
        <meta
          property='og:image'
          content='https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg'
        />
        <meta property='og:type' content='website' />
      </Head>

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
