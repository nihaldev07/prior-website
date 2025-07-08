"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Interface for image data

// Image data array

const ImageSlider = ({ images }: { images: string[] }) => {
  // State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // State to determine if the image is being hovered over
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Function to show the previous slide
  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Function to show the next slide
  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // useEffect hook to handle automatic slide transition
  useEffect(() => {
    // Start interval for automatic slide change if not hovered
    if (!isHovered) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);

      // Cleanup the interval on component unmount
      return () => {
        clearInterval(interval);
      };
    }
    //eslint-disable-next-line
  }, [isHovered]);

  // Handle mouse over event
  const handleMouseOver = (): void => {
    setIsHovered(true);
  };

  // Handle mouse leave event
  const handleMouseLeave = (): void => {
    setIsHovered(false);
  };

  return (
    <div className='relative w-full mx-auto'>
      <div
        className='relative h-[30vh] mx-0 group hover:-translate-y-2'
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}>
        <Image
          src={images[currentIndex]}
          alt={`Slider Image ${currentIndex + 1}`}
          quality={100}
          fill
          className=' transition-all duration-500 ease-in-out cursor-pointer'
        />
      </div>
      <button
        className='absolute left-0 top-1/2 transform h-auto rounded-xl  mx-1 -mt-[10px] -translate-y-1/2  text-white p-2 group'
        onClick={prevSlide}>
        <ChevronLeft className='text-gray-400 group-hover:text-white' />
      </button>
      <button
        className='absolute right-0 top-1/2 transform h-auto rounded-xl  mx-1 -mt-[10px] -translate-y-1/2  text-white p-2 group'
        onClick={nextSlide}>
        <ChevronRight className='text-gray-400 group-hover:text-white' />
      </button>
      {/* <div className="flex justify-center mt-4 ">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${
              index === currentIndex
                ? "bg-primary rounded-xl"
                : "bg-gray-300 rounded-xl"
            } transition-all duration-500 ease-in-out`}
          ></div>
        ))}
      </div> */}
    </div>
  );
};

export default ImageSlider;
