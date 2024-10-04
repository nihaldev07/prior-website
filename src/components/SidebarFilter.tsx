"use client";

import React, { useEffect, useState } from "react";

import Heading from "@/shared/Heading/Heading";
import { Category } from "@/data/types";
import { Button } from "./ui/button";
import { Palette, PencilRuler } from "lucide-react";

interface Props {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: any;
  showCategory?: boolean;
  selectedCategory?: string;
  selectedColor?: string;
  selectedSize?: string;
  handleFilterChange: (filterData: any) => void;
}
//
const SidebarFilters: React.FC<Props> = ({
  sizes,
  colors,
  categories,
  filterData,
  selectedSize = "",
  selectedColor = "",
  selectedCategory = "",
  showCategory = true,
  handleFilterChange,
}) => {
  // const [activeLocation, setActiveLocation] = useState("All");
  // const [rangePrices, setRangePrices] = useState([100, 500]);
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [activeColor, setActiveColor] = useState(selectedColor);
  const [activeSize, setActiveSize] = useState(selectedSize);

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
      <div className="relative flex flex-col space-y-2 md:space-y-4 pb-2 md:pb-8">
        <h3 className="mb-2.5 text-xl font-medium  border-b border-gray-950  py-3 px-1">
          Categories
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            key={"001"}
            variant={activeCategory === "" ? "default" : "outline"}
            onClick={() => setActiveCategory("")}
          >
            All
          </Button>
          {categories.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              variant={activeCategory === item?.id ? "default" : "outline"}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // OK
  const renderTabsGender = () => {
    return (
      <div className="relative flex flex-col space-y-2 md:space-y-4 py-2">
        <h3 className="mb-2.5 text-xl font-medium  border-b border-gray-950  py-3 px-1">
          <Palette className="inline" /> Colors
        </h3>
        <div className="grid grid-cols-2 gap-2 md:gap-3 max-h-[40vh] overflow-y-auto">
          <Button
            key={"001"}
            onClick={() => setActiveColor("")}
            variant={activeColor === "" ? "default" : "outline"}
          >
            All
          </Button>
          {/* <button
            key={"001"}
            type="button"
            onClick={() => setActiveColor("")}
            className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
              activeColor === "" ? "bg-primary text-white" : "bg-gray"
            }`}
          >
            All
          </button> */}
          {colors.map((item) => (
            <Button
              key={item}
              onClick={() => setActiveColor(item)}
              variant={activeColor === item ? "default" : "outline"}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // OK
  const renderTabsSize = () => {
    return (
      <div className="relative flex flex-col space-y-2 md:space-y-4 py-2 md:py-8">
        <h3 className="mb-2.5 text-xl font-medium   border-b border-gray-950  py-3 px-1">
          <PencilRuler className="inline" /> Sizes
        </h3>
        <div className="grid grid-cols-2 gap-4 max-h-[30vh] md:max-h-auto overflow-y-auto">
          <Button
            key={"001"}
            onClick={() => setActiveSize("")}
            variant={activeColor === "" ? "default" : "outline"}
          >
            All
          </Button>
          {/* <button
            key={"001"}
            type="button"
            onClick={() => setActiveSize("")}
            className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
              activeSize === "" ? "bg-primary text-white" : "bg-gray"
            }`}
          >
            All
          </button> */}
          {sizes.map((item) => (
            <Button
              key={item}
              variant={activeSize === item ? "default" : "outline"}
              onClick={() => setActiveSize(item)}
            >
              {item}
            </Button>
            // <button
            //   key={item}
            //   type="button"
            //   onClick={() => setActiveSize(item)}
            //   className={`rounded-lg py-2 md:py-4 text-xs md:text-lg ${
            //     activeSize === item ? "bg-primary text-white" : "bg-gray"
            //   }`}
            // >
            //   {item}
            // </button>
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
    <div className="top-4 md:top-28 lg:sticky">
      <Heading className="mb-0 text-sm md:text-xl">Filter products</Heading>
      <div>
        {!!showCategory && renderTabsCategories()}
        {Array.isArray(colors) && colors?.length > 0 && renderTabsGender()}
        {Array.isArray(sizes) && sizes?.length > 0 && renderTabsSize()}
        {/* {renderTabsPriceRage()} */}
        {/* {renderTabsLocation()} */}
      </div>
    </div>
  );
};

export default SidebarFilters;
