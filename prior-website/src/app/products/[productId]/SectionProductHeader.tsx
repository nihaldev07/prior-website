"use client";
import Image from "next/image";
import type { FC } from "react";
import React, { useState } from "react";
import { BsBag } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { LuInfo } from "react-icons/lu";
import { MdStar } from "react-icons/md";
import { PiSealCheckFill } from "react-icons/pi";

import ImageShowCase from "@/components/ImageShowCase";
import nike_profile from "@/images/nike_profile.jpg";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Heading from "@/shared/Heading/Heading";
import SelectDemo from "./VariantiView";
import { SingleProductType, Variation } from "@/data/types";
import { useCart } from "@/context/CartContext";

interface SectionProductHeaderProps {
  shots: string[];
  shoeName: string;
  prevPrice: number;
  currentPrice: number;
  rating: number;
  pieces_sold: number;
  reviews: number;
  product: SingleProductType;
}

const SectionProductHeader: FC<SectionProductHeaderProps> = ({
  shots,
  shoeName,
  prevPrice,
  currentPrice,
  rating,
  pieces_sold,
  reviews,
  product,
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null
  );
  const distinctColors = new Set<string>(); // Use Set for efficient storage of unique values
  const distinctSizes = new Set<string>();

  for (const item of product.variation) {
    if (!!item.color) distinctColors.add(item.color);
    if (!!item.size) distinctSizes.add(item.size);
  }

  const uniqueColors: string[] = Array.from(distinctColors) ?? []; // Convert Set to array
  const uniqueSizes: string[] = Array.from(distinctSizes) ?? [];
  const handleCartSelection = () => {
    if (product?.hasVariation && !!!selectedVariant) {
      return alert("Please select size & color");
    }
    const productData = {
      id: product?.id,
      sku: product?.sku,
      name: product?.name,
      active: true,
      quantity: 1,
      unitPrice: product?.unitPrice,
      manufactureId: "",
      discount: product?.discount,
      description: product?.description,
      thumbnail: product?.thumbnail,
      productCode: product?.productCode,
      totalPrice: Number(product?.unitPrice * 1).toFixed(2),
      categoryName: product?.categoryName,
      hasVariation: product?.hasVariation,
      variation: selectedVariant,
    };
    //@ts-ignore
    addToCart(productData);
  };
  return (
    <div className='items-stretch justify-between space-y-10 lg:flex lg:space-y-0'>
      <div className='basis-[50%]'>
        <ImageShowCase shots={shots} />
      </div>

      <div className='basis-[45%]'>
        <Heading className='mb-0' isMain title={""}>
          {shoeName}
        </Heading>

        <div className='mb-10 flex items-center'>
          <div className='flex items-center gap-1'>
            <ButtonCircle3
              className='overflow-hidden border border-neutral-400'
              size='w-11 h-11'>
              <Image
                width={100}
                height={100}
                src={!!product ? product?.categoryImg : ""}
                alt='nike_profile'
                className='h-full w-full object-cover'
              />
            </ButtonCircle3>
            <span className='font-medium'>
              {!!product ? product?.categoryName : ""}
            </span>
            <PiSealCheckFill className='text-blue-600' />
          </div>
          <GoDotFill className='mx-3 text-neutral-500' />
          <div className='flex items-center gap-1'>
            <MdStar className='text-yellow-400' />
            <p className='text-sm'>
              {rating}{" "}
              <span className='text-neutral-500'>{`(${reviews} Reviews)`}</span>
            </p>
          </div>
          <GoDotFill className='mx-3 text-neutral-500' />
          <p className='text-neutral-500'>{`${pieces_sold} items sold`}</p>
        </div>

        <div className='mb-5 space-y-1'>
          {prevPrice > 0 && (
            <p className='text-neutral-500 line-through'>৳{prevPrice}</p>
          )}
          <h1 className='text-3xl font-medium'>৳{currentPrice}</h1>
        </div>

        <div className='mb-5 flex items-end justify-between'>
          <p className='text-xl'>
            Available colors {uniqueSizes.length > 0 && "& sizes"}
          </p>
          <p className='flex items-center gap-1 text-sm text-neutral-500'>
            Size guide <LuInfo />
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {uniqueColors.length > 0 && (
            <SelectDemo
              type='color'
              list={uniqueColors}
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selected={!!selectedVariant ? selectedVariant?.color : ""}
              onVariantChange={(variant: Variation) =>
                setSelectedVariant(variant)
              }
            />
          )}
          {uniqueSizes.length > 0 && (
            <SelectDemo
              type='size'
              list={uniqueSizes}
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selected={!!selectedVariant ? selectedVariant?.size : ""}
              onVariantChange={(variant: Variation) =>
                setSelectedVariant(variant)
              }
            />
          )}
        </div>

        <div className='mt-5 flex items-center gap-5'>
          <ButtonPrimary className='w-full'>Buy Now</ButtonPrimary>
          <ButtonSecondary
            className='flex w-full items-center gap-1 border-2 border-primary text-primary'
            onClick={() => handleCartSelection()}>
            <BsBag /> Add to cart
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
};

export default SectionProductHeader;
