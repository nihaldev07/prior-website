import { Separator } from "@/components/ui/separator";
import ProductCard from "@/shared/simpleProductCard";
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
                <div key={index} className='mx-4 my-2'>
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
                <div key={index} className='mx-2 py-2'>
                  <ProductCard product={product} />
                </div>
              ))
        }
      />
    );
  };
  return (
    <div className=' container px-4 my-4  md:my-10'>
      {/* <Heading isCenter isMain desc={promotionTag?.description}>
        {promotionTag?.heading}
      </Heading> */}
      <div className='flex justify-between items-center p-2 rounded border shadow-sm border-primary bg-white'>
        <span className=' text-base md:text-lg text-primary font-medium'>
          New Arrival🌟
        </span>
        <Link href={`/deals`} prefetch={false}>
          <Button
            className='text-sm md:text-base text-primary font-normal'
            variant={"ghost"}>
            See More
          </Button>
        </Link>
      </div>
      <Separator className='my-4 text-gray-950' />
      <div className='w-full rounded-md hidden sm:block'>
        {renderProductCarousel()}
      </div>
      <div className='w-full rounded-md block sm:hidden'>
        {renderMobileCarousel()}
      </div>
    </div>
  );
};

export default NewSectionView;
