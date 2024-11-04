"use client";
import React, { useEffect, useState } from "react";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import { getProductDataById } from "@/lib/fetchFunctions";
import { SingleProductType } from "@/data/types";
import Head from "next/head";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import { Cat, LoaderPinwheel } from "lucide-react";
import { useParams } from "next/navigation";

const SingleProductPage = () => {
  // Fetch product data directly in the server component

  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const params = useParams(); // Fetch route parameters
  const collectionId = params.collectionId;

  const fetchProduct = async () => {
    setLoading(true);
    try {
      //@ts-ignore
      const productdata = await getProductDataById(collectionId ?? "");
      setProduct(productdata);
    } catch (err) {
      console.error("Failed to fetch product data:", err);
      setError("Failed to load product. Please try again later.");
    }
    setLoading(false);
  };

  useThrottledEffect(
    () => {
      fetchProduct();
    },
    [collectionId],
    1500
  );

  if (loading) {
    return (
      <div className="rounded-lg w-full p-28 h-auto sm:h-[50vh] text-base sm:text-lg bg-white flex justify-center items-center">
        <Cat className="size-10 mr-2" /> Loading please wait...{" "}
        <LoaderPinwheel className="size-5 ml-2 text-primary animate-spin" />
      </div>
    );
  }

  if (!!error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="container">
        <SectionNavigation />
        <h1 className="text-center mt-10">No Product Found</h1>
        <div className="mb-28">
          <SectionMoreProducts categoryId="" />
        </div>
      </div>
    );
  }

  const {
    id,
    name,
    images,
    thumbnail,
    unitPrice,
    discount,
    updatedPrice,
    description,
    rating,
    categoryId,
  } = product;

  const prevPrice = discount && updatedPrice ? unitPrice : 0;
  const currentPrice = discount && updatedPrice ? updatedPrice : unitPrice;
  const imageData =
    images && images.length > 0 ? [thumbnail, ...images] : [thumbnail];

  const title = `${name} | Prior - Your Priority in Fashion`;
  const metaDescription = `${description} Get it now at Prior!`;
  const ogImage = thumbnail;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="product" />
        <meta
          property="og:url"
          content={`https://priorbd.com/collections/${id}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className="px-4 sm:px-0 sm:container">
        <div className="mt-4 mb-4 sm:mb-20">
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

        <div className="mt-16 md:mt-5">
          <SectionMoreProducts categoryId={categoryId} />
        </div>
      </div>
    </>
  );
};

export default SingleProductPage;
