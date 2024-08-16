import { Button } from "@/components/ui/button";
import { headerSection } from "@/data/content";
import Image from "next/image";

const AdvertiseView=()=>{
return <section className="relative bg-gray-900 text-white p-10 lg:p-80">
<div className="absolute inset-0">
  <Image
    src="https://res.cloudinary.com/emerging-it/image/upload/v1715472500/samples/two-ladies.jpg"
    alt="Women Shopping"
    fill
    quality={100}
    className="z-[-1] opacity-70 object-fill"
  />
</div>
<div className="relative container mx-auto px-6 text-center">
  <h1 className="text-4xl md:text-6xl font-bold mb-4">
    {headerSection?.title}
  </h1>
  <p className="text-lg md:text-2xl mb-8">
    {headerSection?.description}
  </p>
  <Button
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
  >
    Shop Now
  </Button>
</div>
</section>
}

export default AdvertiseView;