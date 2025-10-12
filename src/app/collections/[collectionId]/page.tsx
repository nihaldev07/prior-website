import React from "react";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import { getProductDataById } from "@/lib/fetchFunctions";
import { Metadata } from "next";

export const revalidate = 90; // ISR: Revalidate every 90 seconds

interface PageProps {
  params: {
    collectionId: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collectionId } = params;
  const product = await getProductDataById(collectionId);

  if (!product) {
    return {
      title: "Product Not Found | Prior",
      description: "The product you're looking for could not be found.",
    };
  }

  const calculateDiscountPercentage = (
    originalPrice: number,
    discountedPrice: number
  ) => {
    if (originalPrice > 0 && discountedPrice > 0) {
      return Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100
      );
    }
    return 0;
  };

  const message =
    (product.discount > 0
      ? `This ${product?.categoryName} is now ${
          product.discountType === "%"
            ? `${calculateDiscountPercentage(
                product.unitPrice,
                product.updatedPrice ?? 0
              )}%`
            : `${product.discount}৳`
        } OFF. Don't miss out!`
      : `This ${product?.categoryName} has only ৳${product?.quantity} item left. Don't miss out!`) +
    " " +
    (product.description ||
      `Buy ${product.name} at Prior. Get the best deals on quality products.`);

  const title = `${product.name} | Prior - Your Priority in Fashion`;
  const description = message;
  const ogImage =
    product.thumbnail ||
    "https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg";
  const url = `https://priorbd.com/collections/${product.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const SingleProductPage = async ({ params }: PageProps) => {
  const { collectionId } = params;
  const product = await getProductDataById(collectionId);

  if (!product) {
    return (
      <div className='container'>
        <SectionNavigation />
        <h1 className='text-center mt-10 text-2xl text-gray-600'>
          No Product Found
        </h1>
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
    updatedPrice,
    rating,
    categoryId,
  } = product;

  const prevPrice = !!discount && !!updatedPrice ? unitPrice : 0;
  const currentPrice = !!discount && !!updatedPrice ? updatedPrice : unitPrice;

  let imageData = [thumbnail];
  if (images && images.length > 0) imageData = [...imageData, ...images];

  return (
    <div className='px-4 sm:px-0 sm:container'>
      <div className='mt-4 mb-4 sm:mb-20'>
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

      <div className='mt-16 md:mt-5'>
        <SectionMoreProducts categoryId={categoryId} />
      </div>
    </div>
  );
};

export default SingleProductPage;
