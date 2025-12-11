// Server Component - no hydration issues
import React from "react";
import VideoHero from "./VideoHero";
import FeaturedCollections from "./FeaturedCollections";

const HeroSection: React.FC = () => {
  return (
    <header className='bg-white block relative' id="hero-section">
      <VideoHero />
      <FeaturedCollections />
    </header>
  );
};

export default HeroSection;
