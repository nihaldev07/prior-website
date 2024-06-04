"use client";

import "rc-slider/assets/index.css";

import { pathOr } from "ramda";
import Slider from "rc-slider";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";

import Heading from "@/shared/Heading/Heading";
import Input from "@/shared/Input/Input";
import { Category } from "@/data/types";

// DEMO DATA
const brands = [
  {
    name: "All",
  },
  {
    name: "Nike",
  },
  {
    name: "New Balance",
  },
  {
    name: "Rick Owens",
  },
];

const gender = ["Men", "Women", "Unisex", "Kids"];

const locations = [
  "New York",
  "Canada",
  "Bangladesh",
  "Indonesia",
  "San Francisco",
];

const PRICE_RANGE = [1, 500];

interface Props {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: any;
  handleFilterChange: (filterData: any) => void;
}
//
const SidebarFilters: React.FC<Props> = ({
  sizes,
  colors,
  categories,
  filterData,
  handleFilterChange,
}) => {
  // const [activeLocation, setActiveLocation] = useState("All");
  // const [rangePrices, setRangePrices] = useState([100, 500]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [activeSize, setActiveSize] = useState("");

  useEffect(() => {
    handleFilterChange({
      ...filterData,
      categoryId: activeCategory,
      color: activeColor,
      size: activeSize,
    });
    //eslint-disable-next-line
  }, [activeCategory, activeColor, activeSize]);

  const renderTabsCategories = () => {
    return (
      <div className='relative flex flex-col space-y-2 md:space-y-4 pb-2 md:pb-8'>
        <h3 className='mb-2.5 text-xl font-medium'>Category</h3>
        <div className='grid grid-cols-2 gap-4'>
          <button
            key={"001"}
            type='button'
            onClick={() => setActiveCategory("")}
            className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
              activeCategory === "" ? "bg-primary text-white" : "bg-gray"
            }`}>
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type='button'
              onClick={() => setActiveCategory(item.id)}
              className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
                activeCategory === item.id ? "bg-primary text-white" : "bg-gray"
              }`}>
              {item.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // OK
  const renderTabsGender = () => {
    return (
      <div className='relative flex flex-col space-y-2 md:space-y-4 py-2 md:py-8'>
        <h3 className='mb-2.5 text-xl font-medium'>Color</h3>
        <div className='grid grid-cols-2 gap-1 md:gap-4 max-h-[30vh] md:max-h-auto overflow-y-auto'>
          <button
            key={"001"}
            type='button'
            onClick={() => setActiveColor("")}
            className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
              activeColor === "" ? "bg-primary text-white" : "bg-gray"
            }`}>
            All
          </button>
          {colors.map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => setActiveColor(item)}
              className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
                activeColor === item ? "bg-primary text-white" : "bg-gray"
              }`}>
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // OK
  const renderTabsSize = () => {
    return (
      <div className='relative flex flex-col space-y-2 md:space-y-4 py-2 md:py-8'>
        <h3 className='mb-2.5 text-xl font-medium'>Size</h3>
        <div className='grid grid-cols-2 gap-4 max-h-[30vh] md:max-h-auto overflow-y-auto'>
          <button
            key={"001"}
            type='button'
            onClick={() => setActiveSize("")}
            className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
              activeSize === "" ? "bg-primary text-white" : "bg-gray"
            }`}>
            All
          </button>
          {sizes.map((item) => (
            <button
              key={item}
              type='button'
              onClick={() => setActiveSize(item)}
              className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
                activeSize === item ? "bg-primary text-white" : "bg-gray"
              }`}>
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // OK
  // const renderTabsPriceRage = () => {
  //   return (
  //     <div className='relative flex flex-col space-y-5 py-8 pr-3'>
  //       <div className='space-y-5'>
  //         <span className='font-semibold'>Price range</span>
  //         <Slider
  //           range
  //           min={PRICE_RANGE[0]}
  //           max={PRICE_RANGE[1]}
  //           step={1}
  //           defaultValue={[
  //             pathOr(0, [0], rangePrices),
  //             pathOr(0, [1], rangePrices),
  //           ]}
  //           allowCross={false}
  //           onChange={(_input: number | number[]) =>
  //             console.log("price", _input as number[])
  //           }
  //         />
  //       </div>

  //       <div className='flex justify-between space-x-5'>
  //         <div>
  //           <div className='block text-sm font-medium'>Min price</div>
  //           <div className='relative mt-1 rounded-md'>
  //             <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm'>
  //               $
  //             </span>
  //             <input
  //               type='text'
  //               name='minPrice'
  //               disabled
  //               id='minPrice'
  //               className='block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm'
  //               value={rangePrices[0]}
  //             />
  //           </div>
  //         </div>
  //         <div>
  //           <div className='block text-sm font-medium'>Max price</div>
  //           <div className='relative mt-1 rounded-md'>
  //             <span className='pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500 sm:text-sm'>
  //               $
  //             </span>
  //             <input
  //               type='text'
  //               disabled
  //               name='maxPrice'
  //               id='maxPrice'
  //               className='block w-32 rounded-full border-neutral-300 bg-transparent pl-4 pr-10 sm:text-sm'
  //               value={rangePrices[1]}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // OK
  // const renderTabsLocation = () => {
  //   return (
  //     <div className='relative flex flex-col space-y-4 py-8'>
  //       <h3 className='mb-2.5 text-xl font-medium'>Location</h3>
  //       <div className='mb-2 flex items-center gap-2 space-y-3 rounded-full border border-neutral-300 px-4 md:flex md:space-y-0'>
  //         <MdSearch className='text-2xl text-neutral-500' />
  //         <Input
  //           type='password'
  //           rounded='rounded-full'
  //           placeholder='Search...'
  //           sizeClass='h-12 px-0 py-3'
  //           className='border-transparent bg-transparent placeholder:text-neutral-500 focus:border-transparent'
  //         />
  //       </div>
  //       <div className='grid grid-cols-2 gap-4'>
  //         {locations.map((item) => (
  //           <button
  //             key={item}
  //             type='button'
  //             onClick={() => setActiveLocation(item)}
  //             className={`rounded-lg py-4 ${
  //               activeLocation === item ? "bg-primary text-white" : "bg-gray"
  //             }`}>
  //             {item}
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div className='top-4 md:top-28 lg:sticky'>
      <Heading className='mb-0 text-sm md:text-xl'>Filter products</Heading>
      <div className='divide-y divide-neutral-300'>
        {renderTabsCategories()}
        {renderTabsGender()}
        {renderTabsSize()}
        {/* {renderTabsPriceRage()} */}
        {/* {renderTabsLocation()} */}
      </div>
    </div>
  );
};

export default SidebarFilters;
