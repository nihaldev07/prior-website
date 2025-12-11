// Server Component - better performance, no hydration issues
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingBag } from "lucide-react";
import Shoe from "@/images/ladies_shoe.png";
import HandbagIcon from "@/images/ladies_bag.png";
import Shirt from "@/images/ladies_hijab.png";
import Charms from "@/images/charms.png";

const featuredProducts = [
  {
    id: 1,
    title: "Shoes",
    description: "Step into elegance",
    icon: Shoe,
    gradient: "from-pink-400/20 via-rose-300/20 to-pink-500/20",
    glowColor: "shadow-pink-500/50",
    accentFrom: "from-pink-400",
    accentTo: "to-rose-500",
    link: "/category/4506b4bb-e6a4-44c5-bb0c-ad77c1c3c967",
    startingPrice: "৳ 1,299",
  },
  {
    id: 2,
    title: "Bags",
    description: "Carry your dreams",
    icon: HandbagIcon,
    gradient: "from-purple-400/20 via-violet-300/20 to-fuchsia-500/20",
    glowColor: "shadow-purple-500/50",
    accentFrom: "from-purple-400",
    accentTo: "to-fuchsia-500",
    link: "/category/fed3dffe-c6c1-46fd-b020-eb8ca8f3ca8c",
    startingPrice: "৳ 899",
  },
  {
    id: 3,
    title: "Hijabs",
    description: "Grace & beauty",
    icon: Shirt,
    gradient: "from-blue-400/20 via-cyan-300/20 to-sky-500/20",
    glowColor: "shadow-blue-500/50",
    accentFrom: "from-blue-400",
    accentTo: "to-cyan-500",
    link: "/category/e425d9b7-bdf6-4268-b203-390dd28d984f",
    startingPrice: "৳ 499",
  },
  {
    id: 4,
    title: "Charms",
    description: "Sparkle & shine",
    icon: Charms,
    gradient: "from-emerald-400/20 via-teal-300/20 to-green-500/20",
    glowColor: "shadow-emerald-500/50",
    accentFrom: "from-emerald-400",
    accentTo: "to-teal-500",
    link: "/category/charms",
    startingPrice: "৳ 299",
  },
];

export default function FeaturedCollections() {
  return (
    <section
      className='py-12 px-4 md:py-20 max-w-full md:max-w-7xl mx-auto relative'
      id='featured-collections'>
      {/* Decorative Background Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-full blur-3xl' />
        <div className='absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl' />
      </div>

      {/* Section Header */}
      <div className='text-center mb-12 md:mb-16 relative z-10'>
        <div className='inline-flex items-center gap-2 mb-4'>
          <Sparkles className='w-5 h-5 md:w-6 md:h-6 text-pink-500 animate-pulse' />
          <h2 className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent'>
            Featured Collections
          </h2>
          <Sparkles className='w-5 h-5 md:w-6 md:h-6 text-purple-500 animate-pulse' />
        </div>
        <p className='text-sm md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light'>
          Discover our handpicked treasures, crafted with love ✨
        </p>
      </div>

      {/* Collection Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10'>
        {featuredProducts.map((product, index) => (
          <Link
            key={product.id}
            href={product.link}
            prefetch={false}
            className='group'
            style={{ animationDelay: `${index * 100}ms` }}>
            {/* Glassmorphic Card */}
            <div className='relative h-full overflow-hidden rounded-3xl md:rounded-[2rem] transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-3'>
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
              />

              {/* Glass Effect Layer */}
              <div className='absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl md:rounded-[2rem]' />

              {/* Glow Effect on Hover */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${product.accentFrom} ${product.accentTo} rounded-3xl md:rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-700 ${product.glowColor}`}
              />

              {/* Content */}
              <div className='relative p-6 md:p-8 flex flex-col items-center text-center h-full'>
                {/* Icon Container */}
                <div className='relative mb-6 md:mb-8'>
                  {/* Rotating Glow Ring */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${product.accentFrom} ${product.accentTo} opacity-20 group-hover:opacity-40 blur-xl transition-all duration-700 group-hover:scale-150 group-hover:rotate-180`}
                  />

                  {/* Icon Wrapper with Glass Effect */}
                  <div className='relative w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500'>
                    <Image
                      src={product.icon}
                      alt={product.title}
                      width={100}
                      height={100}
                      className='w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg'
                    />
                  </div>

                  {/* Floating Sparkles */}
                  <Sparkles className='absolute -top-2 -right-2 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300' />
                </div>

                {/* Title with Gradient */}
                <h3
                  className={`text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r ${product.accentFrom} ${product.accentTo} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                  {product.title}
                </h3>

                {/* Description */}
                <p className='text-xs md:text-sm text-gray-700 dark:text-gray-200 mb-4 md:mb-6 font-medium opacity-90'>
                  {product.description}
                </p>

                {/* Divider */}
                <div
                  className={`w-16 h-0.5 bg-gradient-to-r ${product.accentFrom} ${product.accentTo} rounded-full mb-4 md:mb-6 opacity-50 group-hover:w-24 group-hover:opacity-100 transition-all duration-500`}
                />

                {/* Price Tag with Glass Effect
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 shadow-lg mb-4 md:mb-6'>
                  <span className='text-xs text-gray-600 dark:text-gray-300'>From</span>
                  <span className={`text-base md:text-lg font-bold bg-gradient-to-r ${product.accentFrom} ${product.accentTo} bg-clip-text text-transparent`}>
                    {product.startingPrice}
                  </span>
                </div> */}

                {/* Shop Button */}
                <div
                  className={`group/btn w-full py-3 px-6 rounded-full bg-gradient-to-r ${product.accentFrom} ${product.accentTo} text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base`}>
                  <ShoppingBag className='w-4 h-4 md:w-5 md:h-5' />
                  <span>Shop Now</span>
                  <div className='w-0 group-hover/btn:w-4 overflow-hidden transition-all duration-300'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </div>
                </div>

                {/* Floating Hearts on Hover */}
                <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                  <span className='text-2xl animate-bounce'>💖</span>
                </div>
              </div>

              {/* Shimmer Effect */}
              <div className='absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent' />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Decorative Text */}
      {/* <div className='text-center mt-12 md:mt-16 relative z-10'>
        <p className='text-sm md:text-base text-gray-500 dark:text-gray-400 font-light italic'>
          Crafted with love, designed for you 💝
        </p>
      </div> */}
    </section>
  );
}
