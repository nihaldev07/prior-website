// components/HeroSection.tsx
import Image from "next/image";
import React from "react";
import { headerSection, headerSectionMBL } from "@/data/content";

const HeroSection: React.FC = () => {
  const HeroSectionImg = "https://d38c45qguy2pwg.cloudfront.net/hero-img.webp";
  const img1 = "https://d38c45qguy2pwg.cloudfront.net/abc.png";
  const img2 = "https://d38c45qguy2pwg.cloudfront.net/abc+(2).png";
  return (
    <header className="bg-gray-900 pattern min-h-[60vh] md:min-h-[80vh]">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <nav className="flex flex-col py-4 sm:flex-row sm:justify-between sm:items-center"></nav>

        <div className="flex flex-col items-center md:justify-center py-6 lg:py-12 lg:flex-row gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="w-full text-center lg:text-start lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">
              Prior
            </h2>
            <h3 className="mt-2 text-xl md:text-2xl lg:text-3xl font-semibold text-gray-100">
              {headerSection?.title.split("::")[0]}{" "}
              <span className="text-blue-400">
                {headerSection?.title.split("::")[1]}
              </span>
            </h3>
            <p className="mt-4 hidden md:inline-block text-sm md:text-base text-gray-100 max-w-full lg:max-w-md">
              {headerSection?.description}
            </p>
            <p className="mt-4 inline-block md:hidden text-sm md:text-base text-gray-100 max-w-full lg:max-w-md">
              {headerSectionMBL?.description}
            </p>
          </div>

          {/* Image Content */}
          <div className="flex flex-col w-full lg:w-1/2 lg:flex-row lg:justify-end gap-4">
            {/* Left Card */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg dark:bg-gray-800 overflow-hidden shadow-md hidden lg:block">
              <Image
                src={HeroSectionImg}
                width={500}
                height={400}
                quality={100}
                alt="hero-section"
                className="w-full h-[30vh] md:h-auto object-cover"
                priority
              />
            </div>

            {/* Right Column with 2 Cards for Mobile & Tablet */}
            <div className="lg:hidden grid grid-cols-2 gap-2">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg dark:bg-gray-800 overflow-hidden shadow-md">
                <Image
                  src={HeroSectionImg}
                  width={500}
                  height={400}
                  quality={100}
                  alt="hero-section"
                  className="w-full h-full  object-fit"
                  priority
                />
              </div>
              <div className="w-full lg:hidden flex flex-col gap-2">
                {/* SEO Card 1 */}
                <div className="relative flex justify-center items-center bg-white rounded-lg dark:bg-gray-800 p-6 shadow-md text-gray-700 dark:text-gray-200 text-sm">
                  <div className="absolute rounded-lg inset-0  z-20">
                    <div className=" absolute rounded-lg bg-black w-full h-full opacity-40 transition-opacity duration-300 z-20" />
                    <Image
                      src={img1}
                      width={500}
                      height={400}
                      quality={100}
                      alt="hero-section"
                      className="w-full h-full  rounded-lg object-cover"
                      priority
                    />
                  </div>
                  <p className="text-xs  text-white hover:shadow-md z-50 opacity-100 font-semibold">
                    Discover the Perfect Fusion of Tradition and Modern Style
                  </p>
                </div>
                {/* SEO Card 2 */}
                <div className=" relative flex justify-center items-center  bg-white rounded-lg dark:bg-gray-800 p-6 shadow-md text-gray-700 dark:text-gray-200 text-sm">
                  <div className="absolute rounded-lg inset-0 z-20">
                    <div className="absolute rounded-lg bg-black w-full h-full opacity-40 transition-opacity duration-300 z-20" />
                    <Image
                      src={img2}
                      width={500}
                      height={400}
                      quality={100}
                      alt="hero-section"
                      className="w-full h-full  object-cover"
                      priority
                    />
                  </div>
                  <p className="text-xs text-white hover:shadow-md z-50 opacity-100 font-semibold">
                    Elevate Your Style with affordable Fashion from Prior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
