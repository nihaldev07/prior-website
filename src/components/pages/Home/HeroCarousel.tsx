"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Dynamically import Swiper
const CarouselComponent = dynamic(
  () => import("@/components/Carosol/SwiperComponent"),
  {
    ssr: false,
  }
);

const heroSlides = [
  {
    id: 1,
    image: "/images/autumn-00.png", // 77KB - Smallest! Perfect for LCP
    title: "Autumn Harvest Collection 2025",
    subtitle: "Embrace the season in rich tones and cozy textures",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: "/images/autumn-01.jpg", // 203KB
    title: "Wrap Yourself in Warmth",
    subtitle: "Essential layers for crisp days and golden evenings",
    cta: "View Offers",
  },
  {
    id: 3,
    image: "/images/autumn-02.jpg", // 701KB
    title: "Fall Favorites Just Dropped",
    subtitle: "Be the first to explore our autumn must-haves",
    cta: "Explore",
  },
];

export default function HeroCarousel() {
  return (
    <section className='relative w-full h-[35vh] md:h-[750px] lg:h-[850px] overflow-hidden'>
      <CarouselComponent
        items={heroSlides.map((slide) => (
          <div key={slide.id} className='relative w-full h-[35vh] md:h-full'>
            <div className='absolute inset-0 bg-black/40 z-10' />
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={slide.id === 1}
              sizes='100vw'
              className='object-cover'
              quality={70}
            />
            <div className='absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4'>
              <h1 className='text-xl md:text-6xl font-bold text-white mb-2 md:mb-4'>
                {slide.title}
              </h1>
              <p className='text-sm md:text-2xl text-white/90 mb-4 md:mb-8 max-w-2xl'>
                {slide.subtitle}
              </p>
              <Button
                size='lg'
                variant={"outline"}
                className='hidden md:block text-lg px-8 text-white font-semibold bg-transparent'
                onClick={() => (window.location.href = "/collections")}>
                {slide.cta}
              </Button>
              <Button
                size='sm'
                variant={"outline"}
                className='text-xs px-4 block md:hidden text-white font-semibold bg-transparent'
                onClick={() => (window.location.href = "/collections")}>
                {slide.cta}
              </Button>
            </div>
          </div>
        ))}
      />
    </section>
  );
}
