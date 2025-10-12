/* eslint-disable @next/next/no-img-element */
"use client";

import { classNames } from "@/lib/utils";
import { Cat, PawPrint } from "lucide-react";
import type { FC } from "react";
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import LikeButton from "./LikeButton";

interface ImageShowCaseProps {
  shots: string[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState(
    Array(shots.length).fill(true)
  );

  const handleImageLoad = (index: number, isLoaded: boolean = false) => {
    setLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !isLoaded;
      return newStates;
    });
  };

  return (
    <div className='rounded-sm p-2'>
      {/* Desktop Layout: Vertical thumbnails on left */}
      <div className='hidden md:flex md:flex-row md:gap-4'>
        {/* Vertical Thumbnail Carousel - Desktop */}
        {shots.length > 1 && (
          <div className='w-24 lg:w-28 xl:w-32'>
            <Carousel
              orientation='vertical'
              opts={{
                align: "start",
                loop: false,
              }}
              className='w-full'>
              <CarouselContent className='h-[600px] lg:h-[700px] xl:h-[800px] -mt-4'>
                {shots.map((shot, index) => (
                  <CarouselItem key={index} className='pt-4 basis-auto'>
                    <button
                      className={classNames(
                        "relative h-20 lg:h-24 xl:h-28 w-full overflow-hidden rounded-lg border-2 transition-all",
                        activeImageIndex === index
                          ? "border-blue-400"
                          : "border-gray-300 hover:border-gray-500"
                      )}
                      type='button'
                      onClick={() => {
                        setActiveImageIndex(index);
                        setIsLoading(true);
                      }}>
                      {loadingStates[index] && (
                        <div className='absolute inset-0 flex items-center justify-center bg-gray-200 z-10'>
                          <PawPrint className='animate-pulse w-6 h-6' />
                        </div>
                      )}
                      <img
                        src={shot}
                        alt={`Thumbnail ${index + 1}`}
                        className={classNames(
                          "h-full w-full object-cover object-center",
                          loadingStates[index] ? "invisible" : "visible"
                        )}
                        onLoad={() => handleImageLoad(index, true)}
                        onLoadStart={() => handleImageLoad(index)}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='-top-8' />
              <CarouselNext className='-bottom-8' />
            </Carousel>
          </div>
        )}

        {/* Main Image - Desktop */}
        <div className='flex-1'>
          <div className='relative overflow-hidden rounded-md h-[480px] sm:h-[600px] lg:h-[700px] xl:h-[800px] bg-gray-200 flex justify-center items-center'>
            {/* <LikeButton className="absolute right-5 top-5 z-20" /> */}
            <div className='w-full relative h-full'>
              {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-gray-200 z-10'>
                  <Cat className='animate-pulse w-16 h-16 md:w-32 md:h-32' />
                </div>
              )}
              <img
                src={shots[activeImageIndex]}
                alt='Product image'
                className={classNames(
                  "size-full rounded-md object-cover object-center",
                  isLoading ? "invisible" : "visible"
                )}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Main image with horizontal thumbnails below */}
      <div className='md:hidden space-y-3'>
        {/* Main Image - Mobile */}
        <div className='relative overflow-hidden rounded-md h-[400px] sm:h-[500px] bg-gray-200 flex justify-center items-center'>
          {/* <LikeButton className="absolute right-5 top-5 z-20" /> */}
          <div className='w-full relative h-full'>
            {isLoading && (
              <div className='absolute inset-0 flex items-center justify-center bg-gray-200 z-10'>
                <Cat className='animate-pulse w-16 h-16' />
              </div>
            )}
            <img
              src={shots[activeImageIndex]}
              alt='Product image'
              className={classNames(
                "size-full rounded-md object-cover object-center",
                isLoading ? "invisible" : "visible"
              )}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>

        {/* Horizontal Thumbnail Carousel - Mobile */}
        {shots.length > 1 && (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className='w-full'>
            <CarouselContent className='-ml-2 mx-2'>
              {shots.map((shot, index) => (
                <CarouselItem
                  key={index}
                  className='pl-2 basis-1/4 sm:basis-1/4'>
                  <button
                    className={classNames(
                      "relative h-24 sm:h-28 w-full overflow-hidden rounded-md border-2 transition-all",
                      activeImageIndex === index
                        ? "border-blue-400"
                        : "border-gray-300 hover:border-gray-500"
                    )}
                    type='button'
                    onClick={() => {
                      setActiveImageIndex(index);
                      setIsLoading(true);
                    }}>
                    {loadingStates[index] && (
                      <div className='absolute inset-0 flex items-center justify-center bg-gray-200 z-10'>
                        <PawPrint className='animate-pulse w-6 h-6' />
                      </div>
                    )}
                    <img
                      src={shot}
                      alt={`Thumbnail ${index + 1}`}
                      className={classNames(
                        "h-full w-full object-cover object-center",
                        loadingStates[index] ? "invisible" : "visible"
                      )}
                      onLoad={() => handleImageLoad(index, true)}
                      onLoadStart={() => handleImageLoad(index)}
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='-left-4' />
            <CarouselNext className='-right-4' />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default ImageShowCase;
