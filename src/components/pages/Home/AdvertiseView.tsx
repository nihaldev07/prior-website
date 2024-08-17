import { Button } from "@/components/ui/button";
import { headerSection } from "@/data/content";
import Head from "next/head";
import Image from "next/image";

const AdvertiseView = () => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      <section className="relative  text-white p-28 sm:p-40 md:p-80">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/emerging-it/image/upload/v1723808062/tick_ujgq8c.png"
            alt="Women Shopping"
            fill
            quality={100}
            className="z-[-1] object-fill"
          />
        </div>
        <div className="absolute w-full h-full top-0 left-0  bg-blue-800 opacity-50 sm:opacity-70" />
        <div className="p-10" />
        {/* <div className="absolute left-40 top-10">
          <p className="text-6xl font-semibold text-white font-pocifico">
            Prior
          </p>
          <p className="text-xl ml-10 font-semibold text-white font-pocifico">
            Prior your priority
          </p>
        </div> */}
        <div className="absolute flex items-center justify-center top-0 left-0 sm:left-[10%] h-full  px-6 text-center w-full sm:w-4/5 z-50">
          <div className="w-full">
            <h1 className="text-base sm:text-4xl text-white lg:text-6xl font-bold mb-4 font-pocifico">
              {headerSection?.title}
            </h1>
            <p className=" text-xs sm:text-lg text-white lg:text-2xl mb-8 font-pocifico">
              {headerSection?.description}
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent text-white text-xs md:text-xl px-3 py-2 md:px-8 md:py-6"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>
      {/* <section className=" relative h-[25vh] w-full  hidden">
        <div className="absolute inset-0 z-[-1]">
          <CarouselComponent
            items={mobileHeaderSectionImages.map(
              (image: string, index: number) => (
                <Image
                  key={index}
                  src={image}
                  alt="Women Shopping"
                  fill
                  quality={90}
                  className="z-[-1] object-fill"
                />
              )
            )}
            delay={7000}
          />
        </div>
        
      </section> */}
    </>
  );
};

export default AdvertiseView;
