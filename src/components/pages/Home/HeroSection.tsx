// Server Component - no hydration issues
import React from "react";
import HeroCarousel from "./HeroCarousel";
import FeaturedCollections from "./FeaturedCollections";

const HeroSection: React.FC = () => {
  return (
    <header className='bg-white block min-h-[35vh] md:min-h-[750px] lg:min-h-[850px] relative'>
      <HeroCarousel />
      <FeaturedCollections />
    </header>
  );
};

export default HeroSection;
