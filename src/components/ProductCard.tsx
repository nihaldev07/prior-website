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
  showPrevPrice?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  product,
  className,
  showPrevPrice = false,
}) => {
  return (
    <div
      className={`transitionEffect border relative rounded-md sm:rounded-2xl p-1 sm:p-3 sm:shadow-md ${className}`}>
      <div className=' h-[200px] sm:h-[250px] w-full overflow-hidden rounded-md sm:rounded-2xl lg:h-[220px] 2xl:h-[300px]'>
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
            width={120}
            height={150}
            src={product.thumbnail}
            alt={`${product.name} cover photo`}
            className='h-full w-full object-cover object-bottom'
          />
        </Link>
      </div>
      <div className=' mt-1  sm:mt-3 flex sm:block justify-between items-center p-1 sm:px-0'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold text-gray-700 subpixel-antialiased font-serif'>
            <ShoppingBag className='w-4 h-4 sm:hidden inline mr-1 text-pink-400' />
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
          <p className='text-sm sm:text-lg font-medium text-gray-600 sm:text-primary'>
            ৳{product.unitPrice - product.discount}
          </p>
        </div>
      </div>
      <div className='border-t border-gray-100 my-1 text-primary text-sm flex justify-center items-center text-center font-medium sm:hidden'>
        <ShoppingCartIcon className='w-5 h-5 mr-2' /> Add To Cart
      </div>
    </div>
  );
};

export default ProductCard;
