"use client";
import Image from "next/image";
import type { FC } from "react";
import React, { useState } from "react";

import ImageShowCase from "@/components/ImageShowCase";
// import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import Heading from "@/shared/Heading/Heading";
import SelectDemo from "./VariantiView";
import { SingleProductType, Variation } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { Briefcase, Info, TagIcon } from "lucide-react";
import InputNumber from "@/shared/InputNumber/InputNumber";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

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
  const router = useRouter();
  const [pQuantity, setPQuantity] = useState(product?.quantity > 0 ? 1 : 0);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null
  );
  const distinctColors = new Set<string>(); // Use Set for efficient storage of unique values
  const distinctSizes = new Set<string>();

  for (const item of product?.variation ?? []) {
    if (!!item.color) distinctColors.add(item.color);
    if (!!item.size) distinctSizes.add(item.size);
  }

  const uniqueColors: string[] = Array.from(distinctColors) ?? []; // Convert Set to array
  const uniqueSizes: string[] = Array.from(distinctSizes) ?? [];
  const handleCartSelection = (isBuy: boolean = false) => {
    if (product?.hasVariation && !!!selectedVariant) {
      return alert("Please select size & color");
    } else if (pQuantity < 1) {
      return alert("Please select quantity");
    }
    const productData = {
      id: product?.id,
      sku: product?.sku,
      name: product?.name,
      active: true,
      quantity: pQuantity,
      unitPrice: product?.unitPrice,
      manufactureId: "",
      discountType: product?.discountType,
      updatedPrice: product?.updatedPrice ?? 0,
      hasDiscount: product?.discount > 0 && !!product?.updatedPrice,
      discount: product?.discount,
      description: product?.description,
      thumbnail: product?.thumbnail,
      productCode: product?.productCode,
      totalPrice: Number(
        (product?.discount > 0 && !!product?.updatedPrice
          ? product?.updatedPrice
          : product?.unitPrice) * Number(pQuantity)
      ).toFixed(2),
      categoryName: product?.categoryName,
      hasVariation: product?.hasVariation,
      variation: selectedVariant,
      maxQuantity: product?.quantity,
    };
    //@ts-ignore
    addToCart(productData);
    Swal.fire({
      title: "Add To Cart",
      text: `${product?.name} Added To Cart SuccessFully`,
      icon: "success",
    }).then(() => {
      if (isBuy) {
        router.push("/cart");
      }
    });
  };
  return (
    <div className=" sm:items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      <div className="basis-[50%]">
        <ImageShowCase shots={shots} />
      </div>

      <div className="basis-[50%] sm:basis-[45%]">
        <Heading className="mb-0 text-left px-0" isMain title={""}>
          {shoeName}
        </Heading>

        <div className="mb-10 flex items-center">
          <div className="flex items-center gap-1">
            {/* <Button variant={"ghost"} className="overflow-hidden p-2 w-11 h-11">
              <Image
                width={100}
                height={100}
                src={!!product ? product?.categoryImg : ""}
                alt="nike_profile"
                className="h-full w-full object-cover"
              />
            </Button> */}

            {!!product?.discount && !!product?.updatedPrice && (
              <Badge
                variant={"default"}
                className=" uppercase my-2 bg-blue-400"
              >
                <TagIcon className="mr-2 w-4 h-4 " />{" "}
                {!!product?.discountType && product?.discountType !== "%"
                  ? `${product?.discount}৳ `
                  : `${product?.discount}%`}{" "}
                off
              </Badge>
            )}

            <span className="font-medium">
              <Badge
                variant={"secondary"}
                className=" uppercase bg-gray-700 text-white"
              >
                {" "}
                {!!product ? product?.categoryName : ""}
              </Badge>
            </span>
          </div>
          <div className="flex items-center ml-4">
            {/* <Star className="text-yellow-400" /> */}
            {/* <p className="text-sm">
              {rating}{" "}
              <span className="text-neutral-500">{`(${reviews})`}</span>
            </p> */}
          </div>
          {/* <GoDotFill className='mx-3 text-neutral-500' />
          <p className='text-neutral-500'>{`${pieces_sold} items sold`}</p> */}
        </div>

        <div className="mb-5 space-y-1">
          {prevPrice > 0 && (
            <div className="flex justify-start items-center gap-2">
              <p className="text-neutral-500 line-through">৳ {prevPrice}</p>
            </div>
          )}
          <h1 className="text-2xl font-medium">৳ {currentPrice}</h1>
        </div>

        <div className="mb-5 flex items-end justify-between">
          <p className="text-xl">
            Available colors {uniqueSizes.length > 0 && "& sizes"}
          </p>
          <Dialog>
            <DialogTrigger>
              <p className="flex items-center gap-1 text-sm text-neutral-500">
                Size guide <Info />
              </p>
            </DialogTrigger>
            <DialogContent>
              <Image
                src={
                  "https://res.cloudinary.com/emerging-it/image/upload/v1726649836/oafeegdk1zpxmgytikrl.jpg"
                }
                width={500}
                height={500}
                alt="size-guide"
                className="h-full w-full object-fit"
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {uniqueColors.length > 0 && (
            <SelectDemo
              type="color"
              list={uniqueColors}
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selected={!!selectedVariant ? selectedVariant?.color : ""}
              onVariantChange={(variant: Variation) => {
                setSelectedVariant(variant);
                product?.quantity < pQuantity && setPQuantity(0);
              }}
            />
          )}
          {uniqueSizes.length > 0 && (
            <SelectDemo
              type="size"
              list={uniqueSizes}
              selectedProduct={product}
              selectedVariant={selectedVariant}
              selected={!!selectedVariant ? selectedVariant?.size : ""}
              onVariantChange={(variant: Variation) => {
                setSelectedVariant(variant);
                product?.quantity < pQuantity && setPQuantity(0);
              }}
            />
          )}
        </div>

        <InputNumber
          defaultValue={pQuantity}
          min={0}
          max={product?.quantity ?? 0}
          onChange={(value) => {
            setPQuantity(value);
          }}
        />

        {product?.quantity > 0 &&
          (pQuantity > 0 ? (
            <div className="mt-8 flex items-center gap-5">
              <ButtonPrimary
                disabled={pQuantity < 1}
                className="w-full z-10"
                onClick={() => {
                  handleCartSelection(true);
                }}
              >
                Buy Now
              </ButtonPrimary>
              <ButtonSecondary
                disabled={pQuantity < 1}
                className="flex w-full items-center gap-1 border-2 border-primary text-primary z-10"
                onClick={() => handleCartSelection()}
              >
                <Briefcase /> Add to cart
              </ButtonSecondary>
            </div>
          ) : (
            <div className="mt-5 w-full flex items-center justify-center px-5 py-4 bg-gray-100 text-green-400 font-semibold">
              AVAILABLE IN STOCK
            </div>
          ))}
        {product?.quantity < 1 && (
          <div className="mt-5 w-full flex items-center justify-center px-5 py-4 bg-gray-200 text-red-500 font-semibold">
            OUT OF STOCK
          </div>
        )}

        <div className="text-base font-medium text-gray-700 text-left mt-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Description
          </h2>
          <Separator className="text-gray-300 w-full my-2" />
          <div
            dangerouslySetInnerHTML={{
              __html: product?.description?.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionProductHeader;
