"use client";
import { useEffect, useRef } from "react";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

SwiperCore.use([Autoplay]);

//@ts-ignore
const Carousel = ({ images, direction = "horizontal", delay = 3000 }) => {
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
      slidesPerView={1}
      loop={true}
      autoplay={{
        delay: delay,
        disableOnInteraction: false,
      }}
      className='w-full h-full'>
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image
            src={image}
            alt={`Image ${index}`}
            height={100}
            width={100}
            quality={100}
            className='w-full h-auto object-fill rounded-3xl'
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
