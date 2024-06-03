import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { ProductType } from "@/data/types";

import LikeButton from "./LikeButton";
import { Eye, ShoppingBag, ShoppingCartIcon } from "lucide-react";

interface ProductCardProps {
  product: ProductType;
  className?: string;
  imageSize?: string;
  showPrevPrice?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  className,
  imageSize = null,
  showPrevPrice = false,
}) => {
  return (
    <div
      className={`transitionEffect relative  bg-white rounded-bl-3xl rounded-tl-lg rounded-tr-3xl sm:border sm:rounded-2xl p-1 sm:p-3 sm:shadow-md ${className}`}>
      <div
        className={` h-[${
          imageSize || "250px"
        }] sm:h-[250px] w-full overflow-hidden rounded-bl-3xl rounded-tl-lg rounded-tr-3xl sm:rounded-2xl lg:h-[220px] 2xl:h-[300px]`}>
        {!!product?.justIn && product.justIn && (
          <div className='absolute left-6 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md'>
            Just In!
          </div>
        )}
        <LikeButton className='absolute right-2 top-2 hidden' />
        <Link
          className='h-[100px] sm:h-[250px] w-full lg:h-[220px]'
          href={`/products/${product.id}`}>
          <Image
            width={1920}
            height={1080}
            quality={100}
            src={product.thumbnail}
            alt={`${product.name} cover photo`}
            className='h-full w-full object-fill object-bottom'
          />
        </Link>
      </div>
      <div className=' mt-1  sm:mt-3 flex sm:block justify-between items-center p-1 sm:px-0'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-gray-800 sm:text-gray-700 '>
            <ShoppingBag className='w-4 h-4 sm:hidden inline mr-1 text-primary' />
            {product.name}
          </h3>
          {!!product.discount && (
            <p
              className={`text-neutral-500 ${
                showPrevPrice ? "block" : "hidden"
              } text-sm line-through`}>
              ${product.unitPrice}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-xs hidden sm:block sm:text-sm text-neutral-500'>
            {product.description}
          </p>
          <p className='text-sm sm:text-lg font-medium text-gray-900 sm:text-primary'>
            ৳{product.unitPrice - product.discount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
