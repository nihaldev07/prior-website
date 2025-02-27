"use client";
import React, { useState, useEffect } from "react";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import { getProductDataById } from "@/lib/fetchFunctions";
import { useParams } from "next/navigation";
import { SingleProductType } from "@/data/types";

const SingleProductPage = () => {
  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams(); // Fetch route parameters
  //@ts-ignore
  const collectionId: string = params.collectionId;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductDataById(collectionId);
        if (productData) {
          setProduct(productData);
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [collectionId]);

  if (loading) {
    return (
      <div className="container">
        <SectionNavigation />
        <h1 className="text-center mt-10">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <SectionNavigation />
        <h1 className="text-center mt-10">{error}</h1>
        <div className="mb-28">
          <SectionMoreProducts categoryId="" />
        </div>
      </div>
    );
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

  const prevPrice = !!discount && !!updatedPrice ? unitPrice : 0;
  const currentPrice = !!discount && !!updatedPrice ? updatedPrice : unitPrice;

  let imageData = [thumbnail];
  if (images && images.length > 0) imageData = [...imageData, ...images];

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
        <meta name="twitter:card" content={ogImage} />
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
