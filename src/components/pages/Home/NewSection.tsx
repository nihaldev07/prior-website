import { Separator } from "@/components/ui/separator";
import ProductCard from "@/shared/simpleProductCard";
import "swiper/css";
import { IProduct } from "@/lib/interface";
// import Heading from "@/shared/Heading/Heading";
// import { promotionTag } from "@/data/content";
import CarouselComponent from "@/components/Carosol/SwiperComponent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
      <div className='relative flex justify-between items-center p-2 rounded-md bg-white overflow-hidden group'>
        {/* Animated gradient border */}
        <div className='absolute inset-0 rounded-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 animate-gradient-x'></div>
        <div className='absolute inset-[1px] rounded-md bg-white'></div>

        {/* Content */}
        <div className='relative z-10 flex-1'>
          <span className='text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x'>
            New Arrival ✨
          </span>
        </div>
        <Link href={`/deals`} prefetch={false} className='relative z-10'>
          <Button
            className='text-sm md:text-base font-medium hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group'
            variant={"ghost"}>
            <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold'>
              See More
            </span>
            <div className='ml-[2px] relative inline-flex items-center'>
              <svg width='0' height='0' className='absolute'>
                <defs>
                  <linearGradient
                    id='arrow-gradient'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='0%'>
                    <stop offset='0%' className='animate-gradient-icon'>
                      <animate
                        attributeName='stop-color'
                        values='#2563eb;#9333ea;#ec4899;#2563eb'
                        dur='3s'
                        repeatCount='indefinite'
                      />
                    </stop>
                    <stop offset='50%' className='animate-gradient-icon'>
                      <animate
                        attributeName='stop-color'
                        values='#9333ea;#ec4899;#2563eb;#9333ea'
                        dur='3s'
                        repeatCount='indefinite'
                      />
                    </stop>
                    <stop offset='100%' className='animate-gradient-icon'>
                      <animate
                        attributeName='stop-color'
                        values='#ec4899;#2563eb;#9333ea;#ec4899'
                        dur='3s'
                        repeatCount='indefinite'
                      />
                    </stop>
                  </linearGradient>
                </defs>
              </svg>
              <ArrowRight
                className='h-5 w-5 group-hover:translate-x-1 transition-transform'
                style={{ stroke: "url(#arrow-gradient)" }}
              />
            </div>
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
