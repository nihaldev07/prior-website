import Image from "next/image";
import React from "react";

import PromoTag from "@/components/PromoTag";
import { headerSection } from "@/data/content";
import shoe_box from "@/images/banner-02.png";

const SectionHeader = () => {
  return (
    <div className='container flex justify-center items-center  gap-y-5 lg:flex lg:gap-5 lg:gap-y-0'>
      <div className='basis-[100%] items-center space-y-10 rounded-2xl p-5 md:flex md:space-y-0  bg-blue-100'>
        <div className='basis-[70%] pl-10'>
          <h4 className='mb-5 text-xl font-medium text-primary'>
            {headerSection.title}
          </h4>
          <h1
            className='text-[55px] font-medium tracking-tight'
            style={{ lineHeight: "1em" }}>
            {headerSection.heading}
          </h1>
          <p className='my-10 w-[80%] text-[20px] text-neutral-500'>
            {headerSection.description}
          </p>
        </div>
        <div className='basis-[30%] flex justify-center'>
          <Image src={shoe_box} alt='shoe box' className='w-[75%]' />
        </div>
      </div>

      {/* <div className='mt-5 basis-[30%] lg:mt-0'>
        <PromoTag />
      </div> */}
    </div>
  );
};

export default SectionHeader;
