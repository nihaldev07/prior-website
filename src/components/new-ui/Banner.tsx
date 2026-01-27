'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  link?: string;
  isActive: boolean;
}

interface BannerComponentProps {
  banners?: Banner[];
  autoPlayInterval?: number;
}

/**
 * Banner Carousel Component
 * Auto-rotating banner with manual navigation
 */
const BannerComponent: React.FC<BannerComponentProps> = ({
  banners: propBanners,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default banners if none provided
  const defaultBanners: Banner[] = [
    {
      id: '1',
      title: 'New Collection 2025',
      subtitle: 'Discover the latest fashion trends',
      image: 'https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg',
      buttonText: 'Shop Now',
      buttonLink: '/collections',
      isActive: true,
    },
    {
      id: '2',
      title: 'Winter Sale',
      subtitle: 'Up to 50% off on selected items',
      image: 'https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg',
      buttonText: 'Explore',
      buttonLink: '/deals',
      isActive: true,
    },
    {
      id: '3',
      title: 'Exclusive Designs',
      subtitle: 'Limited edition pieces',
      image: 'https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg',
      buttonText: 'View Collection',
      buttonLink: '/collections',
      isActive: true,
    },
  ];

  const banners = propBanners || defaultBanners;
  const activeBanners = banners.filter(b => b.isActive);

  // Auto-play functionality
  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [activeBanners.length, autoPlayInterval]);

  /**
   * Go to previous slide
   */
  const goToPrevious = () => {
    setCurrentIndex(
      currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1
    );
  };

  /**
   * Go to next slide
   */
  const goToNext = () => {
    setCurrentIndex(
      currentIndex === activeBanners.length - 1 ? 0 : currentIndex + 1
    );
  };

  /**
   * Go to specific slide
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gray-100">
      {/* Banner Images */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="100vw"
            />
            {/* Overlay and Text */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-sm md:text-lg lg:text-xl mb-4 md:mb-6">
                    {banner.subtitle}
                  </p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <Link
                    href={banner.buttonLink}
                    className="inline-block bg-white text-gray-900 px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-300 shadow-lg z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'bg-white w-6 md:w-8'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerComponent;
