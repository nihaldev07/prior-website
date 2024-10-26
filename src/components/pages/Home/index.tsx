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
  categories: any[]; // Adjust this type according to your category data structure
  products: IProduct[];
}

// Define the HomePage component with typed props
const HomePage: React.FC<HomePageProps> = ({ categories, products }) => {
  return (
    <div className="w-full">
      <HeroSection />
      {/* <AdvertiseView /> */}
      <CampaignPage />
      <NewSectionView products={products} />
      <SectionProducts />
    </div>
  );
};

export default HomePage;
