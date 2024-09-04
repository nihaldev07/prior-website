"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { IProduct, IVariation } from "@/lib/interface";
import { defaultProdcutImg } from "@/lib/utils";
import { ProductType } from "@/data/types";
import CarouselComponent from "@/components/Carosol/SwiperComponent";
import { useRouter } from "next/navigation";

interface IProp {
  product: IProduct | ProductType;
}
const ProductCard: React.FC<IProp> = ({ product }) => {
  const router = useRouter();
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
      <CardHeader className="mb-2 relative flex justify-center items-center bg-gray-100 h-56 md:h-80 lg:h-[400px] rounded-xl px-2">
        {!!product?.images && product?.images?.length > 1 && (
          <CarouselComponent
            delay={5000}
            items={[...product?.images, product?.thumbnail ?? ""]
              .filter((str) => !!str)
              .map((img: string, index: number) => (
                <Image
                  key={index}
                  alt="product"
                  fill
                  quality={100}
                  className="rounded-xl object-fill object-center"
                  src={img || defaultProdcutImg}
                  priority
                />
              ))}
          />
        )}
        {(!product?.images || product?.images?.length < 2) && (
          <Image
            alt="product"
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-xl object-fill object-center"
            src={product?.thumbnail || defaultProdcutImg}
            priority
          />
        )}
      </CardHeader>
      <CardContent className="px-0">
        <div className=" w-full">
          <div className="flex justify-between items-center">
            <h2 className=" text-base md:text-xl text-gray-900 font-semibold truncate max-w-[70%]">
              {product?.name}
            </h2>
            <h2 className=" text-sm md:text-xl text-blue-900 font-semibold ml-auto float-right">
              ৳ {product?.unitPrice}
            </h2>
          </div>
          {!!hasVariation && !isOutOfStock && (
            <p className="text-gray-700 text-xs md:text-base font-medium my-1">
              Available Variations:{" "}
              {
                product?.variation?.filter(
                  (variant: IVariation) =>
                    !!variant?.quantity && variant?.quantity > 0
                ).length
              }{" "}
            </p>
          )}

          {!hasVariation && !isOutOfStock && (
            <p className="text-gray-700 text-xs md:text-base font-medium my-1">
              Available Variations:1
            </p>
          )}
          {isOutOfStock && (
            <p className="text-red-700 text-xs md:text-base font-medium my-1">
              Out Of Stock
            </p>
          )}
          <div className="mt-2 mb-4 hidden">
            <Rating
              style={{ maxWidth: 100 }}
              value={product?.rating ?? 5}
              readOnly
              onChange={(val: any) => console.log("rating:", val)}
            />
          </div>

          <Button
            onClick={() => router.push(`/collections/${product?.id}`)}
            variant="outline"
            className={` hidden px-3 py-2 text-sm text-blue-700 border-blue-300 hover:bg-blue-800 font-semibold  hover:text-white `}
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
