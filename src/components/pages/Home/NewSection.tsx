import { Separator } from "@/components/ui/separator";
import ProductCard from "@/shared/productCard";
import "swiper/css";
import { IProduct } from "@/lib/interface";
import Heading from "@/shared/Heading/Heading";
import { promotionTag } from "@/data/content";
import CarouselComponent from "@/components/Carosol/SwiperComponent";

interface IProps {
  products: IProduct[];
}

const NewSectionView: React.FC<IProps> = ({ products }) => {
  const renderProductCarousel = () => {
    return (
      <CarouselComponent
        slidersPerView={3.5}
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
    <div className="container my-4  md:my-10">
      <Heading isCenter isMain desc={promotionTag?.description}>
        {promotionTag?.heading}
      </Heading>
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
