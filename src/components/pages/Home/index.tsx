// pages/home.tsx

import dynamic from "next/dynamic";
import { IProduct } from "@/lib/interface";
import HeroSection from "./HeroSection";

// Lazy load below-the-fold components with proper SSR
const CampaignPage = dynamic(() => import("./CampaignView"), {
  ssr: true,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
});

const NewSectionView = dynamic(() => import("./NewSection"), {
  ssr: true,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />,
});

const SectionProducts = dynamic(() => import("./products"), {
  ssr: true,
  loading: () => <div className="h-screen bg-gray-100 animate-pulse" />,
});

// Define the interface for the component props
interface HomePageProps {
  products: IProduct[];
}

// Define the HomePage component with typed props
const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <div className="w-full">
      <HeroSection />
      <CampaignPage />
      <NewSectionView products={products} />
      <SectionProducts />
    </div>
  );
};

export default HomePage;
