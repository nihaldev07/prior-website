"use client";

import { classNames } from "@/lib/utils";
import { Cat, PawPrint } from "lucide-react";
import Image from "next/image";
import type { FC } from "react";
import React, { useState } from "react";
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
      newStates[index] = !isLoaded; // Set the loading state to false for the loaded image
      return newStates;
    });
  };

  return (
    <div className="space-y-3 rounded-sm p-2">
      <div className="relative overflow-hidden rounded-sm h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] bg-gray-200 flex justify-center items-center">
        {/* <LikeButton className="absolute right-5 top-5" /> */}
        <div className="w-full relative h-full sm:w-[80%]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
              <Cat className=" animate-pulse w-16 h-16  md:w-32 md:h-32" />
            </div>
          )}
          <img
            src={shots[activeImageIndex]}
            alt="shoe image"
            className={classNames(
              " size-full rounded-lg md:rounded-none object-cover",
              isLoading ? "invisible" : "visible"
            )}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
      {shots.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {!!shots &&
            shots.map((shot, index) => (
              <div
                key={index}
                className={`${
                  activeImageIndex === index ? "border-2 border-gray-500" : ""
                } h-[100px] overflow-hidden rounded-lg`}
              >
                <button
                  className="h-full w-full bg-gray-200 relative"
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setIsLoading(true);
                  }}
                >
                  {/* Loading state indicator */}
                  {loadingStates[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                      <PawPrint className=" animate-pulse w-8 h-8  md:w-16 md:h-16" />
                    </div>
                  )}
                  <Image
                    src={shot}
                    width={100}
                    height={100}
                    alt="shoe image"
                    className={classNames(
                      "h-full w-full object-scale-down object-center",
                      loadingStates[index] ? "invisible" : "visible"
                    )}
                    onLoad={() => handleImageLoad(index, true)}
                    onLoadStart={() => handleImageLoad(index)}
                  />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageShowCase;
