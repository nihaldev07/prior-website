/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const ImageSlider = dynamic(() => import("@/shared/ImageSlider"), {
  ssr: false,
});

import Shoe from "@/images/ladies_shoe.png";
import HandbagIcon from "@/images/ladies_bag.png";
import Shirt from "@/images/ladies_hijab.png";

import { Button } from "@/components/ui/button";
import CarouselComponent from "@/components/Carosol/SwiperComponent";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const heroSlides = [
  // {
  //   id: 1,
  //   image:
  //     "https://d38c45qguy2pwg.cloudfront.net/beach-with-umbrella-summer-vacation-concept-generative-ai.jpg",
  //   title: "Summer Collection 2025",
  //   subtitle: "Discover the latest trends for the season",
  //   cta: "Shop Now",
  // },
  {
    id: 1,
    image: "https://d38c45qguy2pwg.cloudfront.net/lucide.jpg",
    title: "Rainy Season Collection 2025",
    subtitle: "Discover the latest trends for the season",
    cta: "Shop Now",
  },

  {
    id: 2,
    image: "https://d38c45qguy2pwg.cloudfront.net/new_gpt_collection_img.png",
    title: "Carry Your Story",
    subtitle: "Modern essentials for women who carry confidence everywhere.",
    cta: "View Offers",
  },

  //new_gpt_collection_img.png

  {
    id: 3,
    image: "https://d38c45qguy2pwg.cloudfront.net/rainy_gpt.png",
    title: "New Arrivals",
    subtitle: "Be the first to shop our latest collection",
    cta: "Explore",
  },

  // {
  //   id: 3,
  //   image:
  //     "https://d38c45qguy2pwg.cloudfront.net/young-woman-holding-phone-shopping-with-satisfaction-generated-by-ai.jpg",
  //   title: "New Arrivals",
  //   subtitle: "Be the first to shop our latest collection",
  //   cta: "Explore",
  // },
  // {
  //   id: 3,
  //   image:
  //     "https://d38c45qguy2pwg.cloudfront.net/glamorous-stiletto-pair-vibrant-pink-color-generated-by-ai.jpg",
  //   title: "Elevate Your Everyday",
  //   subtitle: "Refined shoes and bags designed for modern living",
  //   cta: "View Offers",
  // },
];

const featuredProducts = [
  {
    id: 1,
    title: "Shoes",
    description: "Elegant & comfortable designs for every occasion",
    icon: Shoe,
    color: "bg-pink-100 dark:bg-pink-950",
    iconColor: "text-pink-500",
    price: "$49.99",
    link: "/category/4506b4bb-e6a4-44c5-bb0c-ad77c1c3c967",
  },
  {
    id: 2,
    title: "Bags",
    description: "Stylish & functional accessories for your daily needs",
    icon: HandbagIcon,
    color: "bg-purple-100 dark:bg-purple-950",
    iconColor: "text-purple-500",
    price: "$79.99",
    link: "/category/fed3dffe-c6c1-46fd-b020-eb8ca8f3ca8c",
  },
  {
    id: 3,
    title: "Hijabs",
    description: "Beautiful fabrics & patterns in various styles",
    icon: Shirt,
    color: "bg-blue-100 dark:bg-blue-950",
    iconColor: "text-blue-500",
    price: "$29.99",
    link: "/category/e425d9b7-bdf6-4268-b203-390dd28d984f",
  },
];

const HeroSection: React.FC = () => {
  const HeroSectionImg = "https://d38c45qguy2pwg.cloudfront.net/hero-img.webp";
  const img1 =
    "https://prior-image.s3.eu-north-1.amazonaws.com/WhatsApp+Image+2024-11-04+at+1.14.21+AM+(1).jpeg";
  const img2 =
    "https://prior-image.s3.eu-north-1.amazonaws.com/WhatsApp+Image+2024-11-04+at+1.14.21+AM.jpeg";
  const img3 =
    "https://prior-image.s3.eu-north-1.amazonaws.com/WhatsApp+Image+2024-11-04+at+1.14.20+AM.jpeg";

  return (
    <>
      <header className='bg-white block min-h-[35vh] md:min-h-[750px] lg:min-h-[850px] relative'>
        <section className='relative w-full h-[35vh] md:h-[750px] lg:h-[850px] overflow-hidden'>
          <CarouselComponent
            items={heroSlides.map((slide) => (
              <div
                key={slide.id}
                className='relative w-full h-[35vh] md:h-full'>
                <div className='absolute inset-0 bg-black/40 z-10' />
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1} // Prioritize first image
                  sizes="100vw"
                  className='object-fit md:object-cover'
                  quality={85}
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
        <section className='py-2 px-4 md:py-16 max-w-full md:max-w-7xl mx-auto'>
          <h2 className=' text-lg md:text-3xl font-semibold text-center mb-2 md:mb-10'>
            Featured Collections
          </h2>
          <div className='grid grid-cols-3 gap-3 md:gap-6'>
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className='overflow-hidden hover:shadow-md transition-all duration-300 flex-1 w-full  border-2 border-dashed shadow-none'
                onClick={() => (window.location.href = product.link)}>
                <CardHeader
                  className={`flex flex-col items-center justify-center py-2 md:py-8 bg-white shadow-none  md:${product?.color}`}>
                  <div className='rounded-full p-0 md:p-4 bg-white/90 dark:bg-black/20 mb-2 md:mb-4 shadow-md border border-dashed overflow-hidden'>
                    <Image
                      src={product?.icon.src}
                      alt='category'
                      width={64}
                      height={64}
                      className={`h-12 w-12 md:h-16 md:w-16 bg-white`}
                    />
                  </div>
                  <CardTitle className=' font-medium md:font-semibold text-center'>
                    {product.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </header>
      <div className='hidden w-full'>
        {/* <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg dark:bg-gray-800 overflow-hidden shadow-md">
                <Image
                  src={HeroSectionImg}
                  width={500}
                  height={400}
                  quality={50}
                  alt="hero-section"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div> */}

        <ImageSlider images={[img1, img2, img3]} />
      </div>
    </>
  );
};

export default HeroSection;
