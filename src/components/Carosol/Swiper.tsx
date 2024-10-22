"use client";
import React, { useEffect, useRef } from "react";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

SwiperCore.use([Autoplay]);

interface IProps {
  images: any[];
  direction?: "horizontal" | "vertical" | undefined;
  delay?: number;
  perView?: number;
  spaceBetween?: number;
}

//@ts-ignore
const Carousel: React.FC<IProps> = ({
  images,
  direction = "horizontal",
  delay = 3000,
  perView = 5,
  spaceBetween = 1,
}) => {
  return (
    <Swiper
      centeredSlides={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={spaceBetween}
      direction={direction}
      slidesPerView={perView}
      loop={true}
      autoplay={{
        delay: delay,
        disableOnInteraction: false,
      }}
      className="w-full h-full bg-transparent rounded-md p-5 md:p-8"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="h-full w-full p-2 rounded bg-white">
            <Image
              src={image}
              alt={`Image ${index}`}
              fill
              quality={90}
              className="w-full h-auto object-fill rounded"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
