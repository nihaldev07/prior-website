import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import imagePlaceHolder from "@/images/imagePlaceholder.svg";
import { Tag } from "lucide-react";
import Link from "next/link";
import { IProduct } from "@/lib/interface";
import { ProductType } from "@/data/types";

interface IProp {
  product: IProduct | ProductType;
}

const ProductCard: React.FC<IProp> = ({ product }) => {
  const isOutOfStock = !product?.quantity || product?.quantity < 1;

  return (
    <Link href={`/collections/${product?.id}`} prefetch={false}>
      <Card className="rounded-xl shadow-none border-0 bg-transparent">
        <CardHeader className="relative flex justify-center items-center h-[190px] sm:h-[300px] md:h-[350px] lg:h-[400px] rounded-sm px-2 overflow-hidden">
          {/* Badge for Discount */}
          {product?.hasDiscount &&
            product?.discount &&
            product?.updatedPrice && (
              <Badge
                variant="secondary"
                className="absolute top-1 right-0 z-50 text-base font-semibold p-2 bg-orange-100 uppercase rounded-tr-md rounded-bl-lg shadow-lg"
              >
                <Tag className="w-4 h-4 mr-1" />
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
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="rounded-sm"
          />
        </CardHeader>

        <CardContent className="px-0">
          <div className="w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-base md:text-xl text-gray-900 font-semibold truncate max-w-[70%]">
                {product?.name}
              </h2>
              {product?.hasDiscount && product?.updatedPrice ? (
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
              {isOutOfStock && (
                <p className="text-red-700 text-xs md:text-base font-medium">
                  Out Of Stock
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
