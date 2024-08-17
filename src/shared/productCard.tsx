"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { IProduct } from "@/lib/interface";
import { defaultProdcutImg } from "@/lib/utils";
import { ProductType } from "@/data/types";
import CarouselComponent from "@/components/Carosol/SwiperComponent";
import { useRouter } from "next/navigation";

interface IProp {
  product: IProduct | ProductType;
}
const ProductCard: React.FC<IProp> = ({ product }) => {
  const router = useRouter();

  return (
    <Card className="rounded-xl shadow-none border-0 bg-transparent">
      <CardHeader className="mb-2 relative flex justify-center items-center bg-gray-100 h-52 md:h-80 lg:h-[400px] rounded-xl px-2">
        {!!product?.images && product?.images?.length > 1 && (
          <CarouselComponent
            delay={5000}
            items={product?.images.map((img: string, index: number) => (
              <Image
                key={index}
                alt="product"
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          <p className="text-gray-700 text-xs md:text-base font-medium my-1">
            {product?.description}
          </p>
          <div className="mt-2 mb-4">
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
            className="px-3 py-2 text-sm text-blue-700 font-semibold border-blue-300 hover:text-white hover:bg-blue-800"
          >
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
