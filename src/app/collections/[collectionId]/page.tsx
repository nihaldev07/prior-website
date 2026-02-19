"use client";

import React, { useEffect, useState } from "react";
import SectionMoreProducts from "./SectionMoreProducts";
import ProductDetailSection from "@/components/new-ui/ProductDetailSection";
import { fetchProductById } from "@/services/productServices";
import { SingleProductType } from "@/data/types";

interface PageProps {
  params: {
    collectionId: string;
  };
}

const SingleProductPage = ({ params }: PageProps) => {
  const { collectionId } = params;
  const [product, setProduct] = useState<SingleProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetchProductById(collectionId);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [collectionId]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl text-gray-600 mb-8'>No Product Found</h1>
          <SectionMoreProducts categoryId='' />
        </div>
      </div>
    );
  }

  const { images, thumbnail, categoryId } = product;

  // Prepare image array
  let imageData = [thumbnail];
  if (images && images.length > 0) imageData = [...imageData, ...images];

  return (
    <>
      <ProductDetailSection product={product} shots={imageData} />

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='border-t border-gray-200 pt-12'>
          <SectionMoreProducts categoryId={categoryId} />
        </div>
      </div>
    </>
  );
};

export default SingleProductPage;
