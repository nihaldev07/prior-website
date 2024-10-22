import { Button } from "@/components/ui/button";
import { headerSection } from "@/data/content";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdvertiseView = React.memo(() => {
  return (
    <>
      <Head>
        <title>{"Prior"}</title>
        <meta
          name="description"
          content={headerSection?.description || "Prior description"}
        />
        <meta property="og:title" content={headerSection?.title || "Prior"} />
        <meta
          property="og:description"
          content={headerSection?.description || "Prior description"}
        />
        <meta
          property="og:image"
          content={
            "https://prior-image.s3.eu-north-1.amazonaws.com/nniy2n3ki3w1fqtxxy08.jpg"
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="relative text-white p-28 sm:p-40 md:p-80">
        <div className="absolute inset-0">
          <Image
            src="https://prior-image.s3.eu-north-1.amazonaws.com/nniy2n3ki3w1fqtxxy08.jpg"
            alt="Women Shopping"
            fill
            quality={70}
            className="z-[-1] object-fill md:object-cover"
            loading="lazy"
            priority={true} // Loads image with high priority, crucial for hero sections
          />
        </div>
        <div className="absolute w-full h-full top-0 left-0 bg-gray-500 opacity-20 sm:opacity-70" />
        <div className="p-10" />
        <div className="absolute flex items-center justify-center top-0 left-0 sm:left-[10%] h-full px-6 text-center w-full sm:w-4/5 z-20">
          <div className="w-full">
            <h1 className="text-base text-gray-300 sm:text-4xl lg:text-6xl font-bold mb-4">
              {headerSection?.title}
            </h1>
            <p className="hidden md:block text-xs sm:text-lg text-gray-300 lg:text-2xl mb-8">
              {headerSection?.description}
            </p>
            <Link href={"/category/fed3dffe-c6c1-46fd-b020-eb8ca8f3ca8c"}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-gray-300 text-xs md:text-xl px-3 py-2 md:px-8 md:py-6"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
});

// Adding a display name to the component
AdvertiseView.displayName = "AdvertiseView";

export default AdvertiseView;
