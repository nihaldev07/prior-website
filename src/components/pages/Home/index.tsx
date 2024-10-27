// pages/home.tsx

import dynamic from "next/dynamic";
import { IProduct } from "@/lib/interface";
import CampaignPage from "./CampaignView";
import HeroSection from "./HeroSection";

// Lazy load components
const NewSectionView = dynamic(() => import("./NewSection"), { ssr: false });
const SectionProducts = dynamic(() => import("./products"), { ssr: false });
// Category can be lazily loaded if needed

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
