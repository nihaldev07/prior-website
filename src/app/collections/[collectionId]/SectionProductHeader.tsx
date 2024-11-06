"use client";
import Image from "next/image";
import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import ImageShowCase from "@/components/ImageShowCase";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import SelectDemo from "./VariantiView";
import InputNumber from "@/shared/InputNumber/InputNumber";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { SingleProductType, Variation } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { Briefcase, Info, TagIcon } from "lucide-react";
import { trackEvent } from "@/lib/firebase-event";
import useAnalytics from "@/hooks/useAnalytics";

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
  product,
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  useAnalytics();

  const [pQuantity, setPQuantity] = useState(product?.quantity > 0 ? 1 : 0);
  const [selectedVariant, setSelectedVariant] = useState<Variation | null>(
    null
  );

  const [uniqueColors, setUniqueColors] = useState<string[]>([]);
  const [uniqueSizes, setUniqueSizes] = useState<string[]>([]);

  useEffect(() => {
    if (!!product) {
      trackEvent("select_item", {
        item_id: product?.id,
        item_name: product?.name,
      });
      trackEvent("view_item", {
        item_id: product?.id,
        item_name: product?.name,
        price: prevPrice > 0 ? prevPrice : currentPrice,
        currency: "BDT",
      });
      setUniqueColors([
        ...new Set(
          product?.variation.filter((c) => !!c.color).map((v) => v.color) ?? []
        ),
      ]);
      setUniqueSizes([
        ...new Set(
          product?.variation.filter((s) => !!s.size).map((v) => v.size) ?? []
        ),
      ]);
    }
    //eslint-disable-next-line
  }, [product]);

  const handleCartSelection = (isBuy = false) => {
    if (product.hasVariation && !selectedVariant) {
      return Swal.fire(
        "Select size & color",
        "Please select size & color",
        "warning"
      );
    } else if (pQuantity < 1) {
      return Swal.fire("Select quantity", "Please select quantity", "warning");
    }

    const price =
      product.discount > 0 && product.updatedPrice
        ? product.updatedPrice
        : product.unitPrice;
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
      maxQuantity: !!selectedVariant
        ? selectedVariant?.quantity
        : product?.quantity,
    };
    //@ts-ignore
    addToCart(productData);

    Swal.fire({
      title: "Added to Cart",
      text: `${product.name} added to cart successfully!`,
      icon: "success",
    }).then(() => {
      if (isBuy) router.push("/cart");
    });
  };

  return (
    <div className="sm:items-stretch justify-between space-y-10 lg:flex lg:space-y-0">
      <div className="basis-[50%]">
        <ImageShowCase shots={shots} />
      </div>

      <div className="basis-[50%] sm:basis-[45%] space-y-4">
        <h3 className="text-xl md:text-2xl md:mt-4 font-semibold text-primary text-left">
          {product?.name}
        </h3>

        <div className="flex items-center space-x-4">
          {!!product.discount && (
            <Badge variant="default" className="bg-blue-400 uppercase my-2">
              <TagIcon className="mr-2 w-4 h-4" />
              {product.discountType === "%"
                ? `${product.discount}%`
                : `${product.discount}৳`}{" "}
              off
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="bg-gray-700 text-white uppercase"
          >
            {product.categoryName}
          </Badge>
        </div>

        <div className="text-lg font-medium space-y-1">
          {prevPrice > 0 && (
            <p className="text-neutral-500 line-through">৳ {prevPrice}</p>
          )}
          <h1>৳ {currentPrice}</h1>
        </div>

        <div className="flex items-end justify-between mb-5">
          {(uniqueColors.length > 0 || uniqueSizes.length > 0) && (
            <p className="text-xl">
              Available colors {uniqueSizes.length > 0 && "& sizes"}
            </p>
          )}
          <Dialog>
            <DialogTrigger>
              <p className="text-sm text-neutral-500 flex items-center gap-1">
                Size guide <Info />
              </p>
            </DialogTrigger>
            <DialogContent>
              <Image
                src="https://res.cloudinary.com/emerging-it/image/upload/v1726649836/oafeegdk1zpxmgytikrl.jpg"
                width={500}
                height={500}
                alt="size-guide"
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
                setPQuantity(Math.min(pQuantity, variant.quantity));
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
                setPQuantity(Math.min(pQuantity, variant.quantity));
              }}
            />
          )}
        </div>

        {(!!selectedVariant
          ? selectedVariant?.quantity > 0
          : product?.quantity > 0) && (
          <InputNumber
            defaultValue={pQuantity}
            min={1}
            max={selectedVariant?.quantity ?? product.quantity}
            onChange={setPQuantity}
          />
        )}

        {!(
          (!!selectedVariant && selectedVariant?.quantity < 1) ||
          product.quantity < 1
        ) && (
          <div className="mt-8 flex items-center gap-5">
            <ButtonPrimary
              disabled={pQuantity < 1}
              className="w-full"
              onClick={() => handleCartSelection(true)}
            >
              Buy Now
            </ButtonPrimary>
            <ButtonSecondary
              disabled={pQuantity < 1}
              className="flex w-full items-center gap-1 border-2 border-primary text-primary"
              onClick={() => handleCartSelection()}
            >
              <Briefcase /> Add to cart
            </ButtonSecondary>
          </div>
        )}

        {((!!selectedVariant && selectedVariant?.quantity < 1) ||
          product.quantity < 1) && (
          <div className="mt-5 w-full flex items-center justify-center px-5 py-4 bg-gray-200 text-red-500 font-semibold">
            OUT OF STOCK
          </div>
        )}

        <div className="text-base font-medium text-gray-700 mt-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Description
          </h2>
          <Separator className="text-gray-300 w-full my-2" />
          <div
            dangerouslySetInnerHTML={{
              __html: product.description?.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionProductHeader;
