"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import "@smastrom/react-rating/style.css";
import { IProduct, IVariation } from "@/lib/interface";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { ProductType } from "@/data/types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tag } from "lucide-react";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const hasVariation =
    product?.hasVariation &&
    product?.variation?.filter(
      (variant: IVariation) => !!variant?.quantity && variant?.quantity > 0
    ).length;
  const isOutOfStock = !product?.quantity || product?.quantity < 1;

  return (
    <Card
      className="rounded-xl shadow-none border-0 bg-transparent"
      onClick={() => router.push(`/collections/${product?.id}`)}
    >
      <CardHeader className="mb-2 relative flex justify-center items-center h-[190px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-sm px-2 overflow-hidden">
        {/* Badge for discount */}
        {!!product?.hasDiscount &&
          !!product?.discount &&
          !!product?.updatedPrice && (
            <Badge
              variant={"secondary"}
              className="absolute top-1 text-base font-semibold right-0 z-50 rounded-tr-md shadow-lg rounded-bl-lg p-2 bg-orange-100 uppercase"
            >
              <Tag className="w-4 h-4 mr-1" />
              {!!product?.discountType && product?.discountType !== "%"
                ? `${product?.discount}৳ `
                : `${product?.discount}%`}{" "}
              Off
            </Badge>
          )}

        {/* Placeholder Image */}
        {!isLoaded && (
          <Image
            alt="default-product"
            fill
            quality={1}
            className="rounded-sm object-cover" // Ensures placeholder maintains aspect ratio
            src={imagePlaceHolder} // Default image URL
            loading="lazy"
          />
        )}

        {/* Actual Image */}
        <Image
          alt="product"
          quality={60} // Optimize image quality for better load speed
          className={`rounded-sm transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={product?.thumbnail || imagePlaceHolder}
          onLoad={() => setIsLoaded(true)} // Show image when fully loaded
          priority
          loading="eager"
          fill // Ensures image fills the container
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "fill", objectPosition: "center" }}
        />
      </CardHeader>

      <CardContent className="px-0">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-base md:text-xl text-gray-900 font-semibold truncate max-w-[70%]">
              {product?.name}
            </h2>
            {!!product?.hasDiscount && !!product?.updatedPrice ? (
              <div className="ml-auto flex gap-2 items-center">
                <del className="text-xs text-gray-500 font-light">
                  ৳ {product?.unitPrice}
                </del>
                <h2 className="text-sm md:text-xl text-blue-900 font-semibold">
                  ৳ {product?.updatedPrice}
                </h2>
              </div>
            ) : (
              <h2 className="text-sm md:text-xl text-blue-900 font-semibold ml-auto">
                ৳ {product?.unitPrice}
              </h2>
            )}
          </div>
          <div className="w-full flex justify-between items-start my-1">
            {!!hasVariation && !isOutOfStock && (
              <p className="text-gray-700 text-xs md:text-base font-medium">
                Variant:{" "}
                <Badge variant={"outline"} className="ml-2">
                  {
                    product?.variation?.filter(
                      (variant: IVariation) =>
                        !!variant?.quantity && variant?.quantity > 0
                    ).length
                  }
                </Badge>{" "}
              </p>
            )}

            {!hasVariation && !isOutOfStock && (
              <p className="text-gray-700 text-xs md:text-base font-medium">
                Variant:{" "}
                <Badge variant={"outline"} className="ml-2">
                  1
                </Badge>
              </p>
            )}
            {isOutOfStock && (
              <p className="text-red-700 text-xs md:text-base font-medium">
                Out Of Stock
              </p>
            )}
            {!isOutOfStock && (
              <p className="text-gray-700 text-xs md:text-base font-medium">
                Qty:{" "}
                <Badge variant={"outline"} className="ml-2">
                  {product?.quantity}
                </Badge>
              </p>
            )}
          </div>
          <Button
            onClick={() => router.push(`/collections/${product?.id}`)}
            variant="outline"
            className="hidden px-3 py-2 text-sm text-blue-700 border-blue-300 hover:bg-blue-800 font-semibold hover:text-white"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
