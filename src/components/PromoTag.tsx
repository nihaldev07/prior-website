import React from "react";
import Image from "next/image";
import { promotionTag } from "@/data/content";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import promotionImg from "@/images/banner-01.png";

const PromoTag = () => {
  return (
    <div className='relative h-full space-y-10 rounded-2xl bg-transparent bg-cover bg-center bg-no-repeat p-5 text-black overflow-hidden'>
      <Image
        src={promotionImg}
        className='absolute top-[-30px] right-0 w-full h-[450px] rounded-2xl'
        alt='prmotion'
      />
      <div className='bg-white opacity-60 rounded-2xl absolute  w-full bottom-0 h-[150px] right-0' />
      <div className=' absolute flex flex-col justify-start items-start pt-[200px] rounded-2xl px-4 text-black w-full h-full top-0 right-0 z-50'>
        <h4
          className='text-[30px] font-bold mb-2'
          style={{ lineHeight: "1em" }}>
          {promotionTag.heading}
        </h4>
        <p className='w-[90%] text-sm font-normal z-20'>
          {promotionTag.description}
        </p>
      </div>
    </div>
  );
};

export default PromoTag;
