import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import React from "react";

import type { ProductType } from "@/data/types";

import LikeButton from "./LikeButton";

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
      className={`transitionEffect relative rounded-2xl p-3 shadow-md ${className}`}>
      <div className='h-[250px] w-full overflow-hidden rounded-2xl lg:h-[220px] 2xl:h-[300px]'>
        {!!product?.justIn && product.justIn && (
          <div className='absolute left-6 top-0 rounded-b-lg bg-primary px-3 py-2 text-sm uppercase text-white shadow-md'>
            Just In!
          </div>
        )}
        <LikeButton className='absolute right-2 top-2' />
        <Link
          className='h-[250px] w-full lg:h-[220px]'
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
      <div className='mt-3'>
        <div className='flex items-center justify-between'>
          <h3 className='font-semibold'>{product.name}</h3>
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
          <p className='text-sm text-neutral-500'>{product.description}</p>
          <p className='text-lg font-medium text-primary'>
            ৳{product.unitPrice - product.discount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
