// components/HeroSection.tsx
import Image from "next/image";
import React from "react";
import HeroSectionImg from "@/images/hero-img.webp";
import { headerSection } from "@/data/content";

const HeroSection: React.FC = () => {
  return (
    <header className="bg-gray-900 pattern md:h-[80vh]">
      <div className="container px-6 mx-auto">
        <nav className="flex flex-col py-6 sm:flex-row sm:justify-between sm:items-center"></nav>

        <div className="flex flex-col items-center justify-center md:justify-normal py-6 lg:h-[36rem] lg:flex-row">
          <div className="w-full text-center lg:text-start lg:w-1/2">
            <h2 className="text-4xl font-semibold text-gray-100 lg:text-4xl">
              Prior
            </h2>

            <h3 className="mt-3 text-2xl font-semibold text-gray-100">
              {headerSection?.title.split("::")[0]}{" "}
              <span className="text-blue-400">
                {headerSection?.title.split("::")[1]}
              </span>
            </h3>

            <p className="mt-4 text-xs md:text-base text-gray-100">
              {headerSection?.description}
            </p>
          </div>

          <div className="hidden lg:flex mt-8 lg:w-1/2 lg:justify-end lg:mt-0">
            <div className="w-full max-w-md bg-white rounded-lg dark:bg-gray-800">
              <div className="p-4 text-center">
                <Image
                  src={HeroSectionImg}
                  width={500}
                  height={100}
                  quality={100}
                  alt={"hero-section"}
                  className="w-full h-[50vh] object-fill"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
