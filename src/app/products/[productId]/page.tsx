"use server";
import React from "react";
import Head from "next/head";

import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import SectionProductInfo from "./SectionProductInfo";
import { Truck } from "lucide-react";
import { getProductDataById } from "@/utils/fetchFunctions";

const SingleProductPage = async ({
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const product = await getProductDataById(productId);

  if (!product) {
    return (
      <div className='container'>
        <SectionNavigation />

        <h1 className='text-center mt-10'>No Product Found</h1>

        <div className='mb-28'>
          <SectionMoreProducts categoryId='' />
        </div>
      </div>
    );
  }

  const {
    name,
    images,
    thumbnail,
    unitPrice,
    discount,
    description,
    rating,
    ratingDetails,
    categoryId,
  } = product;

  const prevPrice = discount > 0 ? unitPrice : discount;
  const currentPrice = unitPrice - discount;
  let imageData = images ?? [];
  imageData.push(thumbnail);

  return (
    <div className='container'>
      <Head>
        <title>{name} | Prior - Your Priority in Fashion </title>
        <meta name='description' content={description} />
        <meta property='og:title' content={name} />
        <meta property='og:image' content={thumbnail} />
      </Head>
      <SectionNavigation />
      <div className='mb-20'>
        <SectionProductHeader
          product={product}
          shots={imageData}
          shoeName={name}
          prevPrice={prevPrice}
          currentPrice={currentPrice}
          rating={rating}
          pieces_sold={0}
          reviews={0}
        />
      </div>
      <div className='mb-28'>
        <SectionProductInfo
          overview={description}
          shipment_details={[
            {
              icon: <Truck className='w-10 h-10' />,
              title: "Shipping",
              description:
                "Our online shop offers extensive shipping coverage throughout Bangladesh, ensuring fast and reliable delivery to every region. Shop with confidence knowing your orders will reach you promptly and securely, no matter where you are in the country. Enjoy convenient nationwide shipping with us!",
            },
          ]}
          ratings={rating}
          ratingDetails={ratingDetails}
        />
      </div>
      <div className='mb-28'>
        <SectionMoreProducts categoryId={categoryId} />
      </div>
    </div>
  );
};

export default SingleProductPage;
