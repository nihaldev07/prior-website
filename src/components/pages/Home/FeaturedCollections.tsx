// Server Component - better performance, no hydration issues
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Shoe from "@/images/ladies_shoe.png";
import HandbagIcon from "@/images/ladies_bag.png";
import Shirt from "@/images/ladies_hijab.png";

const featuredProducts = [
  {
    id: 1,
    title: "Shoes",
    description: "Elegant & comfortable designs for every occasion",
    icon: Shoe,
    color: "bg-pink-100 dark:bg-pink-950",
    link: "/category/4506b4bb-e6a4-44c5-bb0c-ad77c1c3c967",
  },
  {
    id: 2,
    title: "Bags",
    description: "Stylish & functional accessories for your daily needs",
    icon: HandbagIcon,
    color: "bg-purple-100 dark:bg-purple-950",
    link: "/category/fed3dffe-c6c1-46fd-b020-eb8ca8f3ca8c",
  },
  {
    id: 3,
    title: "Hijabs",
    description: "Beautiful fabrics & patterns in various styles",
    icon: Shirt,
    color: "bg-blue-100 dark:bg-blue-950",
    link: "/category/e425d9b7-bdf6-4268-b203-390dd28d984f",
  },
];

export default function FeaturedCollections() {
  return (
    <section className='py-2 px-4 md:py-16 max-w-full md:max-w-7xl mx-auto'>
      <h2 className='text-lg md:text-3xl font-semibold text-center mb-2 md:mb-10'>
        Featured Collections
      </h2>
      <div className='grid grid-cols-3 gap-3 md:gap-6'>
        {featuredProducts.map((product) => (
          <Link key={product.id} href={product.link} prefetch={false}>
            <Card className='overflow-hidden hover:shadow-md transition-all duration-300 flex-1 w-full border-2 border-dashed shadow-none cursor-pointer'>
              <CardHeader
                className={`flex flex-col items-center justify-center py-2 md:py-8 bg-white shadow-none md:${product?.color}`}>
                <div className='rounded-full p-0 md:p-4 bg-white/90 dark:bg-black/20 mb-2 md:mb-4 shadow-md border border-dashed overflow-hidden'>
                  <Image
                    src={product.icon}
                    alt={product.title}
                    width={64}
                    height={64}
                    className='h-12 w-12 md:h-16 md:w-16 bg-white'
                  />
                </div>
                <CardTitle className='font-medium md:font-semibold text-center'>
                  {product.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
