import React from "react";

import SectionBestDeals from "./SectionBestDeals";
//import SectionBrands from "./SectionBrands";
import SectionHeader from "./SectionHeader";
import SectionProducts from "./SectionProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Shoes and Bags | Prior - Your Priority in Fashion",
  description:
    "Discover Prior's latest collection of women's shoes and bags, where style meets sophistication. Elevate your fashion game with our trendy footwear and handbags designed to make you stand out. Prioritize your style effortlessly with Prior - your ultimate destination for fashion-forward accessories.",
};
const page = () => {
  return (
    <div>
      <div className=' my-2 sm:my-7'>
        <SectionHeader />
      </div>

      <div className=' my-10 sm:mb-32'>
        <SectionBestDeals />
      </div>

      <div className='mb-10 sm:mb-32'>
        <SectionProducts />
      </div>

      {/* <div className='mb-32'>
        <SectionBrands />
      </div> */}
    </div>
  );
};

export default page;
