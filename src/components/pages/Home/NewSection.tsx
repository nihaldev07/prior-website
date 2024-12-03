import { Separator } from "@/components/ui/separator";
import ProductCard from "@/shared/productCard";
import "swiper/css";
import { IProduct } from "@/lib/interface";
// import Heading from "@/shared/Heading/Heading";
// import { promotionTag } from "@/data/content";
import CarouselComponent from "@/components/Carosol/SwiperComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface IProps {
  products: IProduct[];
}

const NewSectionView: React.FC<IProps> = ({ products }) => {
  const renderProductCarousel = () => {
    return (
      <CarouselComponent
        slidersPerView={4}
        items={
          !products
            ? []
            : products.map((product: IProduct, index: number) => (
                <div key={index} className="mx-4">
                  <ProductCard product={product} />
                </div>
              ))
        }
      />
    );
  };
  const renderMobileCarousel = () => {
    return (
      <CarouselComponent
        slidersPerView={2}
        items={
          !products
            ? []
            : products.map((product: IProduct, index: number) => (
                <div key={index} className="mx-2">
                  <ProductCard product={product} />
                </div>
              ))
        }
      />
    );
  };
  return (
    <div className=" container px-4 my-4  md:my-10">
      {/* <Heading isCenter isMain desc={promotionTag?.description}>
        {promotionTag?.heading}
      </Heading> */}
      <div className="flex justify-between items-center p-2 md:p-4 rounded-md bg-sky-600">
        <span className=" text-base md:text-lg text-white font-semibold ">
          New Arrival
        </span>
        <Link href={`/deals`} prefetch={false}>
          <Button className="text-sm md:text-base" variant={"outline"}>
            See More
          </Button>
        </Link>
      </div>
      <Separator className="my-4 text-gray-950" />
      <div className="w-full rounded-xl hidden sm:block">
        {renderProductCarousel()}
      </div>
      <div className="w-full rounded-xl block sm:hidden">
        {renderMobileCarousel()}
      </div>
    </div>
  );
};

export default NewSectionView;
