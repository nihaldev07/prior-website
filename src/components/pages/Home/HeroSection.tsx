import Image from "next/image";
import React from "react";
import { headerSection, headerSectionMBL } from "@/data/content";
import { cn } from "@/lib/utils";
import ImageSlider from "@/shared/ImageSlider";

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
      <header className="bg-gray-900 hidden lg:block pattern min-h-[60vh] md:min-h-[80vh]">
        <div className="container px-0 sm:px-6 lg:px-8 mx-auto">
          <nav className="flex flex-col py-4 sm:flex-row sm:justify-between sm:items-center"></nav>

          <div className="flex flex-col items-center md:justify-center py-6 lg:py-12 lg:flex-row gap-8 lg:gap-12">
            {/* Text Content */}
            <div className="w-full text-center px-4 sm:px-0 lg:text-start lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">
                Prior
              </h2>
              <h3 className="mt-2 text-xl md:text-2xl lg:text-3xl font-semibold text-gray-100">
                {headerSection?.title?.split("::")[0]}{" "}
                <span className="text-blue-400">
                  {headerSection?.title?.split("::")[1]}
                </span>
              </h3>
              <p className="mt-4 text-sm md:text-base text-gray-100 max-w-full lg:max-w-md">
                {headerSectionMBL?.description}
              </p>
            </div>

            {/* Image Content */}
            <div className="flex w-full lg:w-1/2 gap-4 lg:justify-end">
              {/* Desktop Image */}
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg dark:bg-gray-800 overflow-hidden shadow-md hidden lg:block">
                <Image
                  src={HeroSectionImg}
                  width={500}
                  height={400}
                  quality={50}
                  alt="hero-section"
                  className="w-full h-[30vh] md:h-auto object-cover"
                  priority
                />
              </div>

              {/* Mobile and Tablet Images */}
            </div>
          </div>
        </div>
      </header>
      <div className="lg:hidden w-full">
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
