"use client";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

SwiperCore.use([Autoplay]);
interface IProps {
  items: any[];
  direction?: "horizontal" | "vertical" | undefined;
  delay?: number;
  slidersPerView?: number;
}

//@ts-ignore
const CarouselComponent: React.FC<IProps> = ({
  items,
  direction = "horizontal",
  delay = 3000,
  slidersPerView = 1,
}) => {
  return (
    <Swiper
      centeredSlides={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={0}
      direction={direction}
      slidesPerView={slidersPerView}
      loop={true}
      autoplay={{
        delay: delay,
        disableOnInteraction: false,
      }}
      className="w-full h-full"
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CarouselComponent;
