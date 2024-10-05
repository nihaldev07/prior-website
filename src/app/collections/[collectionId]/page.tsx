import React from "react";
import Head from "next/head";
import SectionMoreProducts from "./SectionMoreProducts";
import SectionNavigation from "./SectionNavigation";
import SectionProductHeader from "./SectionProductHeader";
import { getProductDataById } from "@/lib/fetchFunctions";

const SingleProductPage = async ({
  params: { collectionId },
}: {
  params: { collectionId: string };
}) => {
  const product = await getProductDataById(collectionId);

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
    description,
    rating,
    categoryId,
  } = product;

  const prevPrice = discount > 0 ? unitPrice : discount;
  const currentPrice = unitPrice - discount;

  // Creating image data array
  let imageData = images ?? [];
  imageData.push(thumbnail);

  // SEO Metadata
  const title = `${name} | Prior - Your Priority in Fashion`;
  const metaDescription = `${description} Get it now at Prior!`;
  const ogImage = thumbnail || images[0];

  // Return metadata in the form of an object
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
