// pages/home.tsx

import AdvertiseView from "./AdvertiseView";
import Category from "./Category";
import NewSectionView from "./NewSection";
import { IProduct } from "@/lib/interface";
import SectionProducts from "./products";

// Define the interface for the component props
interface HomePageProps {
  categories: any[]; // Adjust this type according to your category data structure
  products: IProduct[];
}

// Define the HomePage component with typed props
const HomePage: React.FC<HomePageProps> = ({ categories, products }) => {
  return (
    <div className="w-full">
      <AdvertiseView />
      <NewSectionView products={products} />
      {/* <Category categories={categories} /> */}
      <SectionProducts />
    </div>
  );
};

export default HomePage;
