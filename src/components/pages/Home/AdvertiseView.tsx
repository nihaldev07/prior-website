import { Button } from "@/components/ui/button";
import { headerSection } from "@/data/content";
import Image from "next/image";
import dynamic from "next/dynamic";

// Lazy load heavy components or sections if needed
const CarouselComponent = dynamic(
  () => import("@/components/Carosol/SwiperComponent"),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const AdvertiseView = () => {
  return (
    <>
      <section className="relative text-white p-28 sm:p-40 md:p-80">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/emerging-it/image/upload/v1723808062/tick_ujgq8c.png"
            alt="Women Shopping"
            fill
            quality={80}
            className="z-[-1] object-fill"
            priority={true} // Loads image with high priority, crucial for hero sections
          />
        </div>
        <div className="absolute w-full h-full top-0 left-0 bg-blue-800 opacity-50 sm:opacity-70" />
        <div className="p-10" />
        <div className="absolute flex items-center justify-center top-0 left-0 sm:left-[10%] h-full px-6 text-center w-full sm:w-4/5 z-20">
          <div className="w-full">
            <h1 className="text-base sm:text-4xl lg:text-6xl font-bold mb-4">
              {headerSection?.title}
            </h1>
            <p className="text-xs sm:text-lg lg:text-2xl mb-8">
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
      {/* Lazy load carousel or other content if needed */}
      {/* <section className="relative h-[25vh] w-full hidden">
        <div className="absolute inset-0 z-[-1]">
          <CarouselComponent
            items={mobileHeaderSectionImages.map((image: string, index: number) => (
              <Image
                key={index}
                src={image}
                alt="Women Shopping"
                fill
                quality={90}
                className="z-[-1] object-fill"
              />
            ))}
            delay={7000}
          />
        </div>
      </section> */}
    </>
  );
};

export default AdvertiseView;
