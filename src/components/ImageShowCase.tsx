"use client";

import Image from "next/image";
import type { FC } from "react";
import React, { useState } from "react";
// import LikeButton from "./LikeButton";

interface ImageShowCaseProps {
  shots: string[];
}

const ImageShowCase: FC<ImageShowCaseProps> = ({ shots }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-3 rounded-sm p-2">
      <div className="relative overflow-hidden rounded-sm h-[500px] md:h-[700px] bg-gray-200 flex justify-center items-center">
        {/* <LikeButton className="absolute right-5 top-5" /> */}
        <div className="w-full relative h-full sm:w-[80%]">
          <Image
            src={shots[activeImageIndex]}
            alt="shoe image"
            fill
            quality={100}
            className=" absolute top-0 left-0 rounded-sm object-fill  object-center h-full w-full "
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
                  className="h-full w-full bg-gray-200"
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                >
                  <Image
                    src={shot}
                    width={100}
                    height={100}
                    alt="shoe image"
                    className="h-full w-full object-scale-down object-center"
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
