import React from "react";
import Head from "next/head";

const About: React.FC = () => {
  return (
    <>
      {/* SEO Optimized Meta Tags */}
      <Head>
        <title>About - Prior Fashion Brand</title>
        <meta
          name="description"
          content="Prior is a rising fashion brand in Bangladesh, offering modern style with traditional elegance. Discover our collections of bags, shoes, and accessories."
        />
        <meta
          name="keywords"
          content="Prior, fashion, Bangladesh, shoes, bags, accessories, online shopping, modern style, traditional elegance"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      {/* Page Content */}
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-100 p-4">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-6 text-center">About</h1>

        {/* Paragraphs */}
        <div className="max-w-3xl text-center text-gray-800">
          <p className="mb-4">
            Prior is a rising fashion brand in Bangladesh, celebrated for its
            unique blend of modern style and traditional elegance. Since 2021,
            we’ve become a preferred online shopping destination.
          </p>
          <p className="mb-4">
            Prior, renowned for its fashion authority, unique designs, and
            superior craftsmanship, we are dedicated to delivering exceptional
            quality and value. Experience the pinnacle of fashion with footwear
            that combines uniqueness and sophistication, crafted with the
            highest standards of craftsmanship. Join us to embrace ultimate
            style and elegance.
          </p>
          <p className="mb-4">
            Explore our latest collections of bags, shoes, accessories, and
            more. We are dedicated to providing high-quality products and an
            exceptional shopping experience throughout Bangladesh.
          </p>
          <p className="mb-4">
            Discover and shop with us online to experience the best in fashion.
            Prior—your priority.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
