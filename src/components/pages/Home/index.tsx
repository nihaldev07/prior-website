'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, RotateCcw, Headphones } from 'lucide-react';
import { IProduct } from "@/lib/interface";
import { adaptProductsToNewFormat } from "@/lib/adapters/productAdapter";
import BannerComponent from "@/components/new-ui/Banner";
import ProductGrid from "@/components/new-ui/ProductGrid";

// Define the interface for the component props
interface HomePageProps {
  products: IProduct[];
}

// Define the HomePage component with typed props
const HomePage: React.FC<HomePageProps> = ({ products }) => {
  // Adapt products to new UI format
  const newProducts = adaptProductsToNewFormat(products || []);

  // Use the same products for hot/trending for now
  // TODO: Fetch from best products API endpoint when available
  const adaptedHotProducts = newProducts;

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Carousel */}
      <BannerComponent />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* New Products Section */}
        <ProductGrid
          products={newProducts.slice(0, 8)}
          title="New Arrivals"
          subtitle="Discover the latest fashion trends and styles"
          showViewAll={true}
          viewAllLink="/collections?sort=newest"
          className="py-12 md:py-16"
        />

        {/* Divider */}
        <div className="border-t border-gray-100 my-8 md:my-12"></div>

        {/* Hot Products Section */}
        <ProductGrid
          products={adaptedHotProducts.slice(8, 16)}
          title="Trending Now"
          subtitle="Popular items loved by our customers"
          showViewAll={true}
          viewAllLink="/collections?sort=popular"
          className="pb-12 md:pb-16"
        />

        {/* Brand Story Section */}
        <section className="py-12 md:py-16 border-t border-gray-100">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Quality Meets Style
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We are committed to providing modern women with high-quality fashion clothing.
                Each piece is carefully designed and rigorously selected to ensure that while pursuing beauty,
                you can also enjoy a comfortable wearing experience.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="text-gray-700">Premium Fabrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="text-gray-700">Expert Craftsmanship</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="text-gray-700">Trendy Designs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                  <span className="text-gray-700">Comfortable Fit</span>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-block mt-6 text-gray-900 font-medium hover:text-gray-700 transition-colors duration-200"
              >
                Learn More About Us →
              </Link>
            </div>
            <div className="relative">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-sm">
                <Image
                  src="https://res.cloudinary.com/emerging-it/image/upload/v1726577358/nniy2n3ki3w1fqtxxy08.jpg"
                  alt="Brand Story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Features Section */}
        <section className="py-12 md:py-16 border-t border-gray-100">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Why Shop With Us
            </h2>
            <p className="text-gray-600">
              Providing you with a comprehensive shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Free Shipping */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">
                Free delivery on orders within Dhaka
              </p>
            </div>

            {/* 7 Day Returns */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">7-Day Returns</h3>
              <p className="text-sm text-gray-600">
                Easy returns and exchanges within 7 days
              </p>
            </div>

            {/* Customer Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-gray-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-sm text-gray-600">
                Dedicated support team ready to help
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-12 md:py-16 border-t border-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join Our Fashion Community
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get exclusive offers, early access to new collections,
              and style tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
