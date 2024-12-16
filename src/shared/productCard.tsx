import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { Tag } from "lucide-react";
import Link from "next/link";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";
import { cn } from "@/lib/utils";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const isOutOfStock = !product?.quantity || product?.quantity < 1;

  const test = () => {
    return (
      <Card className="rounded-xl shadow-none border-0 bg-transparent">
        <CardHeader className="relative p-0  flex justify-center items-center h-[190px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-sm px-2 space-y-0">
          {/* Badge for Discount */}
          {product?.hasDiscount &&
            product?.discount &&
            product?.updatedPrice && (
              <Badge
                variant="secondary"
                className="absolute mt-0 top-1 right-1 z-50 text-xs sm:text-base font-semibold sm:p-2  uppercase rounded-tr-md rounded-bl-lg shadow-lg"
              >
                <Tag className=" w-3 sm:w-4 h-4 mr-1" />
                {product?.discountType !== "%"
                  ? `${product?.discount}৳`
                  : `${product?.discount}%`}{" "}
                Off
              </Badge>
            )}

          {/* Product Thumbnail Image */}
          <Image
            alt="product"
            src={product?.thumbnail || imagePlaceHolder}
            quality={60}
            placeholder="blur" // Optimized for server-side blur placeholder
            blurDataURL={product?.thumbnail || imagePlaceHolder.src} // Blur placeholder for improved LCP
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              marginTop: "0px !important",
            }}
            className="rounded-sm space-y-0"
          />
        </CardHeader>

        <CardContent className=" px-1 md:px-0">
          <div className="w-full">
            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm text-gray-700">{product.name}</h3>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    isOutOfStock ? "text-red-700" : "text-gray-500"
                  )}
                >
                  {isOutOfStock ? "Out of Stock" : "In Stock"}
                </p>
              </div>
              {product?.hasDiscount && product?.updatedPrice ? (
                <div className=" flex flex-col justify-end gap-2 items-start">
                  <del className="text-sm text-gray-500 font-light">
                    ৳ {product?.unitPrice}
                  </del>
                  <p className="text-sm font-medium text-gray-900">
                    ৳ {product?.updatedPrice}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-900">
                  ৳ {product.unitPrice}
                </p>
              )}
            </div>

            {/* <div className="w-full flex justify-center items-start my-1">
              {isOutOfStock && (
                <p className="text-red-700 text-xs md:text-base font-medium">
                  Out Of Stock
                </p>
              )}
            </div> */}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Link href={`/collections/${product?.id}`} prefetch={false}>
      <div key={product.id} className="group relative">
        <img
          alt={product?.name ?? "product"}
          src={product?.thumbnail ?? imagePlaceHolder}
          className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
        />
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-primary uppercase">
              <a href={`/collections/${product?.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </a>
            </h3>
            <p
              className={cn(
                "mt-1 text-sm",
                isOutOfStock ? "text-red-700" : "text-gray-500"
              )}
            >
              {isOutOfStock ? "Out of Stock" : "In Stock"}
            </p>
          </div>
          {product?.hasDiscount && product?.updatedPrice ? (
            <div className=" flex flex-col justify-end gap-2 items-start">
              <del className="text-sm text-gray-500 font-light">
                ৳ {product?.unitPrice}
              </del>
              <p className="text-sm font-medium text-gray-900">
                ৳ {product?.updatedPrice}
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-900">
              ৳ {product.unitPrice}
            </p>
          )}
          {/* <p className="text-sm font-medium text-gray-900">{product.price}</p> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
