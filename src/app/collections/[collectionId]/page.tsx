"use client";
import React, { useEffect, useState } from "react";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import { getProductDataById } from "@/lib/fetchFunctions";
import { SingleProductType } from "@/data/types";

const SingleProductPage = ({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) => {
  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductDataById(collectionId);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [collectionId]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
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
      <head>
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
      </head>

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
