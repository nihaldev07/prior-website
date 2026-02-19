"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

interface EditorialHeroCarouselProps {
  slides: HeroSlide[];
  autoPlayInterval?: number; // in milliseconds, default 5000
  showNavigation?: boolean;
  showIndicators?: boolean;
}

/**
 * Editorial Hero Carousel Component
 * Elegant, magazine-style hero carousel with smooth transitions
 * Features: Auto-play, manual navigation, fade transitions, progress indicators
 */
export default function EditorialHeroCarousel({
  slides,
  autoPlayInterval = 5000,
  showNavigation = true,
  showIndicators = true,
}: EditorialHeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 800);
    },
    [isAnimating, currentSlide],
  );

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && slides.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [handleNext, isPaused, autoPlayInterval, slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      className='relative h-[50vh] sm:h-[70vh] lg:h-[80vh] bg-neutral-50 overflow-hidden md:w-[100vw]'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}>
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}>
          {/* Background Image */}
          <div className='absolute inset-0'>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className='object-cover'
              priority={index === 0}
              sizes='100vw' // ✅ Specific breakpoints
              quality={95}
            />
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60' />
          </div>

          {/* Content */}
          <div className='relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col justify-end h-full pb-10 sm:pb-16 md:pb-24'>
              <div
                className={`max-w-2xl space-y-4 sm:space-y-5 md:space-y-6 transition-all duration-1000 delay-200 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}>
                {/* Category Label */}
                <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-white/90'>
                  {slide.category}
                </p>

                {/* Title */}
                <h1 className='text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif tracking-wide text-white leading-tight'>
                  {slide.title}
                </h1>

                {/* Description */}
                <p className='text-sm sm:text-base md:text-lg font-serif text-white/90 tracking-wide leading-relaxed max-w-xl hidden md:block'>
                  {slide.description}
                </p>

                {/* CTAs */}
                <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4'>
                  <Link
                    href={slide.primaryCTA.href}
                    className='w-full sm:w-auto'>
                    <button className='w-full sm:w-auto h-11 sm:h-12 md:h-14 px-6 sm:px-8 text-xs sm:text-sm font-serif tracking-[0.15em] uppercase bg-white hover:bg-neutral-100 text-neutral-900 border-0 rounded-none transition-colors duration-300'>
                      {slide.primaryCTA.text}
                    </button>
                  </Link>

                  {slide.secondaryCTA && (
                    <Link
                      href={slide.secondaryCTA.href}
                      className='w-full sm:w-auto'>
                      <button className='w-full sm:w-auto h-11 sm:h-12 md:h-14 px-6 sm:px-8 text-xs sm:text-sm font-serif tracking-[0.15em] uppercase bg-transparent hover:bg-white/10 text-white border border-white rounded-none transition-all duration-300'>
                        {slide.secondaryCTA.text}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {showNavigation && slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className='absolute hidden left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 sm:flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group'
            aria-label='Previous slide'>
            <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-translate-x-0.5 transition-transform duration-300' />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className='absolute right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 hidden sm:flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group'
            aria-label='Next slide'>
            <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-0.5 transition-transform duration-300' />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className='absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isAnimating}
              className='group relative h-1 sm:h-1.5 bg-white/30 hover:bg-white/50 transition-all duration-300 disabled:cursor-not-allowed overflow-hidden'
              style={{ width: index === currentSlide ? "48px" : "24px" }}
              aria-label={`Go to slide ${index + 1}`}>
              {/* Progress bar for active slide */}
              {index === currentSlide && !isPaused && (
                <div
                  className='absolute inset-0 bg-white origin-left'
                  style={{
                    animation: `slideProgress ${autoPlayInterval}ms linear`,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Slide Counter (Optional - Editorial Style) */}
      <div className='absolute top-6 sm:top-8 right-4 sm:right-6 lg:right-8 z-20 hidden sm:block'>
        <div className='bg-white/10 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-1.5 sm:py-2'>
          <p className='text-xs sm:text-sm font-serif text-white tracking-wider'>
            <span className='text-base sm:text-lg'>
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span className='mx-1.5 sm:mx-2 text-white/60'>/</span>
            <span className='text-white/80'>
              {String(slides.length).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      {/* CSS for progress bar animation */}
      <style jsx>{`
        @keyframes slideProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
