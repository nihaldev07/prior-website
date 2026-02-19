"use client";

import React from "react";
import { IProduct } from "@/lib/interface";
import { adaptProductsToNewFormat } from "@/lib/adapters/productAdapter";
import ProductGrid from "@/components/new-ui/ProductGrid";
import EditorialHeroCarousel from "./HeroSectionV2";
import { heroSlides } from "@/utils/heroSectionContents";
import FeatureCard from "@/components/new-ui/FeatureCard";
import PriorOutletSection from "@/components/new-ui/PriorOutletSection";

// Define the interface for the component props
interface HomePageProps {
  products: IProduct[];
}

// Define the HomePage component with typed props
const HomePage: React.FC<HomePageProps> = ({ products }) => {
  // Adapt products to new UI format
  const newProducts = adaptProductsToNewFormat(products || []);

  // Use the same products for hot/trending for now
  const adaptedHotProducts = newProducts;

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section - Editorial Style */}
      <EditorialHeroCarousel slides={heroSlides} />

      {/* Trust Indicators */}
      {/* <section className='border-b border-neutral-200 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 md:py-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3'>
              <Award
                className='w-4 h-4 sm:w-5 sm:h-5 text-neutral-700'
                strokeWidth={1.5}
              />
              <span className='text-[10px] sm:text-xs font-serif tracking-wide text-neutral-700 text-center sm:text-left'>
                Premium Quality
              </span>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3'>
              <Package
                className='w-4 h-4 sm:w-5 sm:h-5 text-neutral-700'
                strokeWidth={1.5}
              />
              <span className='text-[10px] sm:text-xs font-serif tracking-wide text-neutral-700 text-center sm:text-left'>
                Free Shipping
              </span>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3'>
              <ShieldCheck
                className='w-4 h-4 sm:w-5 sm:h-5 text-neutral-700'
                strokeWidth={1.5}
              />
              <span className='text-[10px] sm:text-xs font-serif tracking-wide text-neutral-700 text-center sm:text-left'>
                Secure Payment
              </span>
            </div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-3'>
              <RotateCcw
                className='w-4 h-4 sm:w-5 sm:h-5 text-neutral-700'
                strokeWidth={1.5}
              />
              <span className='text-[10px] sm:text-xs font-serif tracking-wide text-neutral-700 text-center sm:text-left'>
                Easy Returns
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content Area */}
      <main className='w-full'>
        {/* Category Showcase */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-24'>
          <div className='text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3'>
            <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Explore Our Collections
            </p>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight px-4'>
              Crafted for You
            </h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8'>
            {/* Bags Category */}
            <FeatureCard
              title="Women's Bags"
              href='/category/fed3dffe-c6c1-46fd-b020-eb8ca8f3ca8c'
              description='Timeless elegance meets modern functionality'
              imageSrc='/images/category/bag.jpg'
            />

            {/* Shoes Category */}
            <FeatureCard
              title="Women's Footwear"
              href='/category/4506b4bb-e6a4-44c5-bb0c-ad77c1c3c967'
              description='Step into comfort and style'
              imageSrc='/images/category/shoes.jpg'
            />

            {/* Hijabs Category */}
            <FeatureCard
              title="Women's Hijabs"
              href='/category/e425d9b7-bdf6-4268-b203-390dd28d984f'
              description='Grace and modesty in every fabric'
              imageSrc='/images/category/hijab.jpg'
            />
          </div>
        </section>

        {/* New Arrivals Section */}
        <ProductGrid
          products={newProducts.slice(0, 8)}
          title='New Arrivals'
          subtitle='Fresh styles just landed. Discover the latest additions to our collection.'
          showViewAll={true}
          viewAllLink='/collections?sort=newest'
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'
        />

        {/* Editorial Feature Section */}
        {/* <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'>
          <div className='grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center'>
            <div className='order-2 md:order-1 space-y-4 sm:space-y-5 md:space-y-6'>
              <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
                Our Philosophy
              </p>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight'>
                Where Tradition Meets Contemporary Design
              </h2>
              <div className='space-y-3 sm:space-y-4'>
                <p className='text-sm sm:text-base font-serif leading-relaxed text-neutral-600 tracking-wide'>
                  We believe that every woman deserves to feel confident and
                  beautiful. Our collections are thoughtfully curated to blend
                  timeless elegance with modern sensibilities.
                </p>
                <p className='text-sm sm:text-base font-serif leading-relaxed text-neutral-600 tracking-wide'>
                  From meticulously crafted handbags to sophisticated footwear
                  and premium hijabs, each piece is selected with care to ensure
                  exceptional quality and enduring style.
                </p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 pt-2 sm:pt-4'>
                <div className='space-y-1.5 sm:space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-neutral-900 rounded-full'></div>
                    <span className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                      Handpicked Selection
                    </span>
                  </div>
                  <p className='text-xs font-serif text-neutral-600 tracking-wide leading-relaxed'>
                    Every item carefully chosen for quality and style
                  </p>
                </div>
                <div className='space-y-1.5 sm:space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-neutral-900 rounded-full'></div>
                    <span className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                      Premium Materials
                    </span>
                  </div>
                  <p className='text-xs font-serif text-neutral-600 tracking-wide leading-relaxed'>
                    Finest fabrics and materials sourced globally
                  </p>
                </div>
                <div className='space-y-1.5 sm:space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-neutral-900 rounded-full'></div>
                    <span className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                      Ethical Practices
                    </span>
                  </div>
                  <p className='text-xs font-serif text-neutral-600 tracking-wide leading-relaxed'>
                    Committed to sustainable and fair production
                  </p>
                </div>
                <div className='space-y-1.5 sm:space-y-2'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 bg-neutral-900 rounded-full'></div>
                    <span className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                      Expert Curation
                    </span>
                  </div>
                  <p className='text-xs font-serif text-neutral-600 tracking-wide leading-relaxed'>
                    Years of fashion expertise in every selection
                  </p>
                </div>
              </div>

              <Link href='/about'>
                <button className='h-11 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-serif tracking-[0.15em] uppercase bg-neutral-900 hover:bg-neutral-800 text-white border-0 rounded-none transition-colors duration-300 mt-2 sm:mt-4'>
                  Discover Our Story
                </button>
              </Link>
            </div>

            <div className='order-1 md:order-2 relative'>
              <div className='relative aspect-[4/5] rounded-sm overflow-hidden'>
                <Image
                  src='https://res.cloudinary.com/emerging-it/image/upload/v1723808062/tick_ujgq8c.png'
                  alt='Our Philosophy'
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>
              {/* Floating Badge */}
        {/* <div className='absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white/95 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 shadow-sm border border-neutral-200'>
                <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700 mb-1'>
                  Since 2020
                </p>
                <p className='text-xl sm:text-2xl font-serif text-neutral-900'>
                  10,000+
                </p>
                <p className='text-[10px] sm:text-xs font-serif text-neutral-600 tracking-wide'>
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </section>  */}

        {/* Trending Products Section */}
        <ProductGrid
          products={adaptedHotProducts.slice(8, 16)}
          title='Trending Now'
          subtitle="Most loved pieces by our community. See what's capturing hearts this season."
          showViewAll={true}
          viewAllLink='/collections?sort=popular'
          className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'
        />

        {/* Prior Outlet Section */}
        <PriorOutletSection />

        {/* Customer Testimonials */}
        {/* <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'>
          <div className='text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3'>
            <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Customer Stories
            </p>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight px-4'>
              What Our Customers Say
            </h2>
          </div>

          <div className='grid md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8'>
            {/* Testimonial 1 */}
        {/* <div className='bg-neutral-50 rounded-sm p-5 sm:p-6 md:p-8 space-y-3 sm:space-y-4'>
              <div className='flex gap-0.5 sm:gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-3.5 h-3.5 sm:w-4 sm:h-4 fill-neutral-900 text-neutral-900'
                  />
                ))}
              </div>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-700 tracking-wide italic'>
                {
                  "The quality of their hijabs is exceptional. Soft, breathable fabrics that last through countless wears. I've become a loyal customer!"
                }
              </p>
              <div className='pt-1 sm:pt-2'>
                <p className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                  Fatima Rahman
                </p>
                <p className='text-xs font-serif text-neutral-600 tracking-wide'>
                  Dhaka, Bangladesh
                </p>
              </div>
            </div> */}

        {/* Testimonial 2 */}
        {/* <div className='bg-neutral-50 rounded-sm p-5 sm:p-6 md:p-8 space-y-3 sm:space-y-4'>
              <div className='flex gap-0.5 sm:gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-3.5 h-3.5 sm:w-4 sm:h-4 fill-neutral-900 text-neutral-900'
                  />
                ))}
              </div>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-700 tracking-wide italic'>
                {
                  "Found my perfect work bag here. Elegant, spacious, and incredibly well-made. The customer service was wonderful too!"
                }
              </p>
              <div className='pt-1 sm:pt-2'>
                <p className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                  Ayesha Khan
                </p>
                <p className='text-xs font-serif text-neutral-600 tracking-wide'>
                  Chittagong, Bangladesh
                </p>
              </div>
            </div> */}

        {/* Testimonial 3 */}
        {/* <div className='bg-neutral-50 rounded-sm p-5 sm:p-6 md:p-8 space-y-3 sm:space-y-4'>
              <div className='flex gap-0.5 sm:gap-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-3.5 h-3.5 sm:w-4 sm:h-4 fill-neutral-900 text-neutral-900'
                  />
                ))}
              </div>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-700 tracking-wide italic'>
                {
                  "These shoes are a dream! Comfortable enough for all-day wear yet stylish enough for special occasions. Absolutely love them!"
                }
              </p>
              <div className='pt-1 sm:pt-2'>
                <p className='text-sm font-serif tracking-wide text-neutral-900 font-medium'>
                  Nadia Islam
                </p>
                <p className='text-xs font-serif text-neutral-600 tracking-wide'>
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </section> /*}

        {/* Instagram/Social Feed Section */}
        {/* <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'>
          <div className='text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3'>
            <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Join Our Community
            </p>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight px-4'>
              Style Inspiration
            </h2>
            <p className='text-sm sm:text-base font-serif text-neutral-600 tracking-wide px-4'>
              Follow{" "}
              <span className='font-medium text-neutral-900'>
                @yourbrandname
              </span>{" "}
              for daily style updates
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
            {[
              "https://res.cloudinary.com/emerging-it/image/upload/v1715253011/igm4yjltbt9l0yuegdky.jpg",
              "https://res.cloudinary.com/emerging-it/image/upload/v1715252728/hdoerqogutdh5dzav7tb.jpg",
              "https://res.cloudinary.com/emerging-it/image/upload/v1715252771/sgzwbp8qh6gbqsmyrlud.jpg",
              "https://res.cloudinary.com/emerging-it/image/upload/v1715253011/igm4yjltbt9l0yuegdky.jpg",
            ].map((item, index) => (
              <div
                key={index}
                className='group relative aspect-square bg-neutral-50 rounded-sm overflow-hidden cursor-pointer'>
                <Image
                  src={item}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-110'
                  sizes='(max-width: 640px) 50vw, (max-width: 768px) 50vw, 25vw'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <span className='text-white text-xs sm:text-sm font-serif tracking-[0.15em] uppercase'>
                    View Post
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Service Features Section */}
        {/* <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'>
          <div className='text-center mb-8 sm:mb-10 md:mb-12 space-y-2 sm:space-y-3'>
            <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
              Shopping With Us
            </p>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight px-4'>
              Excellence in Every Detail
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12'>
            {/* Free Shipping */}
        {/* <div className='text-center space-y-3 sm:space-y-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 rounded-sm flex items-center justify-center mx-auto'>
                <Package
                  className='w-6 h-6 sm:w-7 sm:h-7 text-neutral-700'
                  strokeWidth={1.5}
                />
              </div>
              <h3 className='text-base sm:text-lg font-serif tracking-wide text-neutral-900'>
                Complimentary Delivery
              </h3>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-600 tracking-wide max-w-xs mx-auto px-4'>
                Free shipping on all orders within Dhaka. Fast and reliable
                delivery to your doorstep.
              </p>
            </div> */}

        {/* 7 Day Returns */}
        {/* <div className='text-center space-y-3 sm:space-y-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 rounded-sm flex items-center justify-center mx-auto'>
                <RotateCcw
                  className='w-6 h-6 sm:w-7 sm:h-7 text-neutral-700'
                  strokeWidth={1.5}
                />
              </div>
              <h3 className='text-base sm:text-lg font-serif tracking-wide text-neutral-900'>
                Hassle-Free Returns
              </h3>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-600 tracking-wide max-w-xs mx-auto px-4'>
                Not completely satisfied? Return within 7 days for a full refund
                or exchange.
              </p>
            </div> */}

        {/* Customer Support */}
        {/* <div className='text-center space-y-3 sm:space-y-4'>
              <div className='w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 rounded-sm flex items-center justify-center mx-auto'>
                <Headphones
                  className='w-6 h-6 sm:w-7 sm:h-7 text-neutral-700'
                  strokeWidth={1.5}
                />
              </div>
              <h3 className='text-base sm:text-lg font-serif tracking-wide text-neutral-900'>
                Dedicated Support
              </h3>
              <p className='text-xs sm:text-sm font-serif leading-relaxed text-neutral-600 tracking-wide max-w-xs mx-auto px-4'>
                Our customer care team is here to assist you every step of your
                journey.
              </p>
            </div>
          </div>
        </section>  */}

        {/* Newsletter Section */}
        {/* <section className='py-10 sm:py-12 md:py-16 lg:py-24 border-t border-neutral-200'>
          <div className='bg-neutral-900 rounded-sm p-6 sm:p-8 md:p-12 lg:p-16 text-center'>
            <div className='max-w-2xl mx-auto space-y-4 sm:space-y-5 md:space-y-6'>
              <p className='text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase text-white/70'>
                Stay Connected
              </p>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-white leading-tight px-4'>
                Join Our Exclusive Circle
              </h2>
              <p className='text-sm sm:text-base font-serif text-white/90 tracking-wide leading-relaxed px-4'>
                Subscribe to receive early access to new collections, exclusive
                offers, and styling tips curated just for you.
              </p>

              <div className='pt-2 sm:pt-4'>
                <div className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto'>
                  <input
                    type='email'
                    placeholder='Enter your email address'
                    className='flex-1 h-11 sm:h-12 px-4 text-xs sm:text-sm font-serif border border-white/20 rounded-none bg-white/5 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors'
                  />
                  <button className='h-11 sm:h-12 px-6 sm:px-8 text-xs sm:text-sm font-serif tracking-[0.15em] uppercase bg-white hover:bg-neutral-100 text-neutral-900 border-0 rounded-none transition-colors duration-300 whitespace-nowrap'>
                    Subscribe
                  </button>
                </div>
                <p className='text-[10px] sm:text-xs font-serif text-white/60 tracking-wide mt-3'>
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default HomePage;
