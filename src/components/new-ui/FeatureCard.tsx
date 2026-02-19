import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  imageSrc,
  href,
}) => {
  return (
    <Link href={href} className='group'>
      <div className='relative aspect-[3/4] bg-neutral-50 rounded-sm overflow-hidden'>
        <Image
          src={imageSrc}
          alt={title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-[1.05]'
          sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 space-y-1 sm:space-y-2'>
          <h3 className='text-xl sm:text-2xl font-serif tracking-wide text-white'>
            {title}
          </h3>
          <p className='text-xs sm:text-sm font-serif text-white/90 tracking-wide'>
            {description}
          </p>
          <div className='flex items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2'>
            <span className='text-xs sm:text-sm font-serif tracking-[0.15em] uppercase text-white'>
              Shop Now
            </span>
            <ChevronRight className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-transform group-hover:translate-x-1' />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
