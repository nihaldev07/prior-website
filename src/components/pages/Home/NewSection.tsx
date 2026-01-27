'use client';

import { IProduct } from "@/lib/interface";
import { adaptProductsToNewFormat } from "@/lib/adapters/productAdapter";
import ProductGrid from "@/components/new-ui/ProductGrid";
import Link from "next/link";
import { Sparkles, Star, Heart, ShoppingBag, TrendingUp } from "lucide-react";

interface IProps {
  products: IProduct[];
}

const NewSectionView: React.FC<IProps> = ({ products }) => {
  // Adapt products to new UI format
  const adaptedProducts = adaptProductsToNewFormat(products || []);

  return (
    <div className='container my-8 md:my-16 relative'>
      {/* Cute Header Section with Glassmorphism */}
      <div className='relative mb-8 md:mb-12'>
        {/* Main Header Card */}
        <div className='relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] group '>
          {/* Gradient Background */}
          <div className='absolute inset-0 bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-blue-400/30 animate-gradient-xy' />

          {/* Glass Effect */}
          <div className='absolute inset-0 bg-white/50 dark:bg-white/10 backdrop-blur-2xl border-2 border-white/30 dark:border-white/20' />

          {/* Animated Border Glow */}
          <div className='absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-700' />

          {/* Content */}
          <div className='relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Left Side - Title with Decorations */}
            <div className='flex items-center gap-3 md:gap-4'>
              {/* Cute Icon Badge */}
              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl blur-lg opacity-50 animate-pulse' />
                <div className='relative bg-gradient-to-br from-pink-400 to-purple-500 p-3 md:p-4 rounded-2xl shadow-xl'>
                  <Sparkles className='w-6 h-6 md:w-8 md:h-8 text-white' />
                </div>
                {/* Floating Star */}
                <Star className='absolute -top-2 -right-2 w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce' />
              </div>

              {/* Title */}
              <div>
                <h2 className='text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-1'>
                  Fresh Arrivals
                </h2>
                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1'>
                  <Heart className='w-3 h-3 md:w-4 md:h-4 text-pink-500 fill-pink-500 animate-pulse' />
                  Just landed & ready to love!
                  <Heart
                    className='w-3 h-3 md:w-4 md:h-4 text-pink-500 fill-pink-500 animate-pulse'
                    style={{ animationDelay: "0.5s" }}
                  />
                </p>
              </div>
            </div>

            {/* Right Side - CTA Button */}
            <Link href='/deals' prefetch={false} className='group/btn'>
              <div className='relative overflow-hidden rounded-full'>
                {/* Button Glow */}
                <div className='absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-70 group-hover/btn:opacity-100 blur-md transition-opacity duration-300' />

                {/* Button Content */}
                <div className='relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center gap-2 md:gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'>
                  <ShoppingBag className='w-4 h-4 md:w-5 md:h-5 text-white' />
                  <span className='text-sm md:text-base font-bold text-white'>
                    Explore More
                  </span>
                  <TrendingUp className='w-4 h-4 md:w-5 md:h-5 text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300' />
                </div>
              </div>
            </Link>
          </div>

          {/* Floating Emojis */}
          <div className='absolute top-4 right-4 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none'>
            <span className='text-2xl md:text-3xl animate-bounce inline-block'>
              ✨
            </span>
          </div>
          <div
            className='absolute bottom-4 left-8 opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none'
            style={{ animationDelay: "0.5s" }}>
            <span className='text-xl md:text-2xl animate-bounce inline-block'>
              🎀
            </span>
          </div>
          <div
            className='absolute top-1/2 right-1/4 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block'
            style={{ animationDelay: "1s" }}>
            <span className='text-xl animate-bounce inline-block'>💖</span>
          </div>

          {/* Shimmer Effect */}
          <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent' />
        </div>

        {/* Cute Wave Separator */}
        <div className='relative h-8 md:h-12 -mt-10 sm:-mt-18'>
          <svg
            className='absolute inset-0 w-full h-full'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'>
            <path
              d='M0,0 C300,60 600,60 900,0 C1050,30 1125,30 1200,0 L1200,120 L0,120 Z'
              className='fill-gradient-to-r from-pink-100/50 via-purple-100/50 to-blue-100/50'
              fill='url(#wave-gradient)'
            />
            <defs>
              <linearGradient
                id='wave-gradient'
                x1='0%'
                y1='0%'
                x2='100%'
                y2='0%'>
                <stop offset='0%' stopColor='#fce7f3' stopOpacity='0.3' />
                <stop offset='50%' stopColor='#f3e8ff' stopOpacity='0.3' />
                <stop offset='100%' stopColor='#dbeafe' stopOpacity='0.3' />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Product Grid - Using new enhanced component */}
      <div className='relative'>
        <ProductGrid
          products={adaptedProducts.slice(0, 8)} // Show first 8 products
          loading={false}
          showViewAll={true}
          viewAllLink='/collections'
        />

        {/* Bottom Decorative Stars */}
        <div className='flex justify-center gap-2 mt-6 md:mt-8'>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className='w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer'
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewSectionView;
