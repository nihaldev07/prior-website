"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Star, Zap } from "lucide-react";
import Link from "next/link";

// Hero carousel slides data
const HERO_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920&q=80",
    badge: "Elevate Your",
    title: "Everyday Style",
    quote:
      '"Fashion is about dressing according to what\'s fashionable. Style is more about being yourself."',
    author: "Oscar de la Renta",
    primaryCTA: "Shop Now",
    secondaryCTA: "New Arrivals",
    primaryLink: "/collections",
    secondaryLink: "/deals",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920&q=80",
    badge: "Discover the Perfect",
    title: "Bags & Accessories",
    quote:
      "\"A woman's handbag is more than just an accessory - it's a statement of style.\"",
    author: "Unknown",
    primaryCTA: "Explore Bags",
    secondaryCTA: "View Collection",
    primaryLink: "/category/ladies-bag",
    secondaryLink: "/collections",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1920&q=80",
    badge: "Step into",
    title: "Comfort & Grace",
    quote: '"Give a girl the right shoes and she can conquer the world."',
    author: "Marilyn Monroe",
    primaryCTA: "Shop Sandals",
    secondaryCTA: "See More",
    primaryLink: "/category/ladies-sandal",
    secondaryLink: "/category/hijab",
  },
];

const VideoHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <section className='relative w-full h-[60vh] md:h-[750px] lg:h-[850px] overflow-hidden bg-gray-900'>
      {/* Background Image Carousel with Animations */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSlideData.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className='absolute inset-0'>
          <Image
            src={currentSlideData.image}
            alt={currentSlideData.title}
            fill
            className='object-cover object-center'
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30' />
        </motion.div>
      </AnimatePresence>

      {/* Floating Decorative Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none z-10'>
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className='absolute top-20 right-20 opacity-30'>
          <Sparkles className='w-16 h-16 md:w-24 md:h-24 text-yellow-300' />
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className='absolute bottom-32 right-40 opacity-20'>
          <Star className='w-12 h-12 md:w-16 md:h-16 text-pink-300' />
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className='absolute top-40 right-1/4 opacity-25'>
          <Zap className='w-10 h-10 md:w-14 md:h-14 text-blue-300' />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className='relative z-20 h-full flex items-center'>
        <div className='container mx-auto px-4 md:px-6 lg:px-32'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlideData.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className='max-w-2xl'>
              {/* Badge/Small Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='mb-2 md:mb-4'>
                <span className='text-white/90 text-lg md:text-[34px] font-light leading-tight'>
                  {currentSlideData.badge}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='text-white text-3xl md:text-[56px] font-medium leading-tight mb-4 md:mb-6'>
                {currentSlideData.title}
              </motion.h1>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='mb-6 md:mb-10 max-w-md'>
                <p className='text-white/90 text-sm md:text-base leading-relaxed italic'>
                  {currentSlideData.quote}
                </p>
                <p className='text-white/70 text-xs md:text-sm mt-2'>
                  - {currentSlideData.author}
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='flex flex-col sm:flex-row gap-4'>
                {/* Primary CTA */}
                <Link
                  href={currentSlideData.primaryLink}
                  className='group relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity' />
                  <button className='relative rounded-md px-6 md:px-8 py-3 md:py-4 bg-white font-semibold text-black text-sm md:text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto'>
                    {currentSlideData.primaryCTA}
                  </button>
                </Link>

                {/* Secondary CTA */}
                <Link href={currentSlideData.secondaryLink} className='group'>
                  <button className='rounded-md px-6 md:px-8 py-3 md:py-4 border-2 border-white text-white font-semibold text-sm md:text-base hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto group-hover:scale-105'>
                    {currentSlideData.secondaryCTA}
                  </button>
                </Link>
              </motion.div>

              {/* Seasonal Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className='mt-6 md:mt-8 inline-block'>
                <div className='bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium shadow-lg flex items-center gap-2'>
                  <Sparkles className='w-4 h-4' />
                  <span>Winter Collection 2025</span>
                  <Star className='w-4 h-4 fill-white' />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className='absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 md:p-3 transition-all hover:scale-110 group'
        aria-label='Previous slide'>
        <ChevronLeft className='w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-white' />
      </button>
      <button
        onClick={nextSlide}
        className='absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-2 md:p-3 transition-all hover:scale-110 group'
        aria-label='Next slide'>
        <ChevronRight className='w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-white' />
      </button>

      {/* Carousel Dots */}
      <div className='absolute bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3'>
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-white w-8 md:w-10 h-2 md:h-2.5"
                : "bg-white/50 hover:bg-white/75 w-2 md:w-2.5 h-2 md:h-2.5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll to Explore Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className='absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30'>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className='flex flex-col items-center gap-2 text-white/90 drop-shadow-lg'>
          <span className='text-xs md:text-sm font-medium tracking-wider uppercase'>
            Scroll to explore
          </span>
          <svg
            className='w-5 h-5 md:w-6 md:h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Slide Counter (Optional) */}
      <div className='absolute top-6 md:top-8 right-6 md:right-8 z-30 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2'>
        <span className='text-white text-xs md:text-sm font-medium'>
          {currentSlide + 1} / {HERO_SLIDES.length}
        </span>
      </div>
    </section>
  );
};

export default VideoHero;
