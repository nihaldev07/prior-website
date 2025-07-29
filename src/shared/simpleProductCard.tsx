/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { Tag, TagIcon } from "lucide-react";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const isOutOfStock = !product?.quantity || product?.quantity < 1;

  return (
    <div
      key={product.id}
      className='group relative bg-transparent cursor-pointer  rounded-md hover:p-2 hover:border  hover:shadow-lg transition-shadow duration-200 ease-in-out'>
      {!!product.discount && (
        <div className='absolute top-1 left-1 z-10'>
          <Badge className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-semibold shadow-lg animate-pulse'>
            <TagIcon className='mr-2 w-3 h-3' />
            {product.discountType === "%" &&
            !!product?.unitPrice &&
            !!product?.updatedPrice
              ? `${Math.round(
                  ((product.unitPrice - product.updatedPrice) /
                    product.unitPrice) *
                    100
                )}%`
              : `${product.discount}৳`}{" "}
            OFF
          </Badge>
        </div>
      )}
      <img
        alt={product?.name ?? "product"}
        src={product?.thumbnail ?? imagePlaceHolder}
        className='aspect-square w-full rounded md:rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80'
      />

      {/* mobile view only */}
      <div className='mt-2 md:mt-4 flex flex-col justify-center items-center '>
        <div>
          <h4 className='text-lg font-semibold text-primary uppercase'>
            <a href={`/collections/${product?.id}`}>
              <span aria-hidden='true' className='absolute inset-0' />
              {product.name}
            </a>
          </h4>
        </div>

        {product?.hasDiscount && product?.updatedPrice ? (
          <div className=' flex flex-row justify-center gap-2 items-center'>
            <del className='text-sm text-red-500 font-light'>
              ৳ {product?.unitPrice}
            </del>
            <p className='text-sm font-medium text-gray-900'>
              ৳ {product?.updatedPrice}
            </p>
          </div>
        ) : (
          <p className='text-sm font-medium text-gray-900'>
            ৳ {product.unitPrice}
          </p>
        )}

        {/* <p className="text-sm font-medium text-gray-900">{product.price}</p> */}
        <Button
          variant={isOutOfStock ? "outline" : "default"}
          className={
            isOutOfStock
              ? "w-full rounded md:rounded-md border-gray-300 text-gray-500"
              : "w-full rounded md:rounded-md border-blue-200 text-white bg-primary hover:bg-blue-200"
          }>
          {isOutOfStock ? "Out Of Stock" : "Shop Now"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
