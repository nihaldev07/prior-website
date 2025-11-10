"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import MarketingBanner from "@/images/flash_sales_1111.jpg";
import Autumn1 from "@/images/autumn-00.jpg";
import Autumn2 from "@/images/autumn-01.jpg";
import Autumn3 from "@/images/autumn-02.jpg";
import Banner from "./Banner";

// eta images

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
    image: Autumn1,
    title: "Autumn Harvest Collection 2025",
    subtitle: "Embrace the season in rich tones and cozy textures",
    cta: "Shop Now",
  },
  {
    id: 2,
    image: Autumn2, // 203KB
    title: "Wrap Yourself in Warmth",
    subtitle: "Essential layers for crisp days and golden evenings",
    cta: "View Offers",
  },
  {
    id: 3,
    image: Autumn3, // 701KB
    title: "Fall Favorites Just Dropped",
    subtitle: "Be the first to explore our autumn must-haves",
    cta: "Explore",
  },
];

export default function HeroCarousel() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenMarketingPopup");

    if (!hasSeenPopup) {
      // Show popup after a short delay (1 second)
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    // Mark as seen for this session
    sessionStorage.setItem("hasSeenMarketingPopup", "true");
  };

  return (
    <>
      {/* Marketing Popup Modal */}
      <Dialog open={showPopup} onOpenChange={handleClosePopup}>
        <DialogContent className='max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[900px] xl:max-w-[1000px] p-0 gap-0 overflow-hidden border-0 bg-transparent shadow-2xl'>
          <div className='relative w-full group'>
            {/* Animated glow effect */}
            <div className='absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 animate-pulse transition duration-1000'></div>

            {/* Content container */}
            <a
              href='/collections'
              onClick={handleClosePopup}
              className='relative block w-full cursor-pointer overflow-hidden rounded-xl bg-black'>
              <div className='relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-video'>
                <Image
                  src={MarketingBanner}
                  alt='Special Offer'
                  fill
                  className='object-scale-down group-hover:scale-105 transition-transform duration-500 ease-out'
                  quality={95}
                  priority
                />
                {/* Shine effect on hover */}
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000'></div>
              </div>
            </a>
          </div>

          {/* Close button - more eye-catching */}
          <DialogClose
            onClick={handleClosePopup}
            className='absolute -right-2 -top-2 sm:-right-3 sm:-top-3 rounded-full bg-gradient-to-br from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 p-2 sm:p-2.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-50 border-2 border-white'>
            <X
              className='h-4 w-4 sm:h-5 sm:w-5 text-white font-bold'
              strokeWidth={3}
            />
            <span className='sr-only'>Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <div className='w-full'>
        <Banner />
        {/* Hero Carousel Section */}
        <section className='relative col-span-2 w-full h-[30vh] sm:h-[40vh] md:h-[550px] lg:h-[700px] xl:h-[850px] overflow-hidden'>
          <CarouselComponent
            items={heroSlides.map((slide) => (
              <div key={slide.id} className='relative w-full h-full'>
                {/* Overlay */}
                <div className='absolute inset-0 bg-black/30 md:bg-black/40 z-10' />

                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 2}
                  sizes='100vw'
                  className='object-cover'
                  quality={70}
                />

                {/* Content Overlay */}
                <div className='absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-3 sm:px-4 md:px-6'>
                  <h1 className='text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-3 lg:mb-4 max-w-[90%] md:max-w-4xl'>
                    {slide.title}
                  </h1>
                  <p className='text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl text-white/90 mb-2 sm:mb-3 md:mb-5 lg:mb-8 max-w-[85%] md:max-w-2xl'>
                    {slide.subtitle}
                  </p>

                  {/* Desktop Button */}
                  <Button
                    size='lg'
                    variant='outline'
                    className='hidden md:inline-flex text-base lg:text-lg px-6 lg:px-8 py-4 lg:py-6 text-white font-semibold bg-transparent hover:bg-white hover:text-black transition-colors'
                    onClick={() => (window.location.href = "/collections")}>
                    {slide.cta}
                  </Button>

                  {/* Mobile/Tablet Button */}
                  <Button
                    size='sm'
                    variant='outline'
                    className='inline-flex md:hidden text-xs sm:text-sm px-3 sm:px-4 py-2 text-white font-semibold bg-transparent hover:bg-white hover:text-black transition-colors'
                    onClick={() => (window.location.href = "/collections")}>
                    {slide.cta}
                  </Button>
                </div>
              </div>
            ))}
          />
        </section>
      </div>
    </>
  );
}
