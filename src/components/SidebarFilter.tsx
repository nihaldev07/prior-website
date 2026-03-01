"use client";

import React, { useEffect, useState } from "react";

import Heading from "@/shared/Heading/Heading";
import { Category } from "@/data/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

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
      categoryId: showCategory ? activeCategory : selectedCategory,
      color: activeColor,
      size: activeSize,
    });
    //eslint-disable-next-line
  }, [activeCategory, activeColor, activeSize]);

  const renderTabsCategories = () => {
    return (
      <div className='space-y-4 pb-8'>
        <div className='space-y-3'>
          <p className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
            Categories
          </p>
          <div className='h-px bg-neutral-200' />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <Button
            key={"001"}
            onClick={() => setActiveCategory("")}
            className={cn(
              "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
              activeCategory === ""
                ? "bg-neutral-900 text-white border-0"
                : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
            )}>
            All
          </Button>
          {categories.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={cn(
                "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
                activeCategory === item?.id
                  ? "bg-neutral-900 text-white border-0"
                  : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
              )}>
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderTabsGender = () => {
    return (
      <div className='space-y-4 py-8'>
        <div className='space-y-3'>
          <p className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
            Colors
          </p>
          <div className='h-px bg-neutral-200' />
        </div>
        <div className='grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto'>
          <Button
            key={"001"}
            onClick={() => setActiveColor("")}
            className={cn(
              "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
              activeColor === ""
                ? "bg-neutral-900 text-white border-0"
                : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
            )}>
            All
          </Button>
          {colors.map((item) => (
            <Button
              key={item}
              onClick={() => setActiveColor(item)}
              className={cn(
                "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
                activeColor === item
                  ? "bg-neutral-900 text-white border-0"
                  : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
              )}>
              {item}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderTabsSize = () => {
    return (
      <div className='space-y-4 py-8'>
        <div className='space-y-3'>
          <p className='text-xs font-serif tracking-[0.2em] uppercase text-neutral-700'>
            Sizes
          </p>
          <div className='h-px bg-neutral-200' />
        </div>
        <div className='grid grid-cols-2 gap-3 max-h-[30vh] overflow-y-auto'>
          <Button
            key={"001"}
            onClick={() => setActiveSize("")}
            className={cn(
              "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
              activeSize === ""
                ? "bg-neutral-900 text-white border-0"
                : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
            )}>
            All
          </Button>
          {sizes.map((item) => (
            <Button
              key={item}
              onClick={() => setActiveSize(item)}
              className={cn(
                "h-12 text-xs font-serif tracking-[0.15em] uppercase rounded-none transition-all duration-300",
                activeSize === item
                  ? "bg-neutral-900 text-white border-0"
                  : "bg-white text-neutral-900 border border-neutral-200 hover:border-neutral-900"
              )}>
              {item}
            </Button>
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
    <div className='lg:sticky lg:top-28 space-y-6'>
      {(activeColor || activeSize) && (activeColor?.length > 0 || activeSize?.length > 0) && (
        <div className='pb-6 border-b border-neutral-200'>
          <Heading className='text-sm font-serif tracking-wide text-neutral-900'>
            Filter products
          </Heading>
        </div>
      )}
      <div className='space-y-6'>
        {!!showCategory && renderTabsCategories()}
        {Array.isArray(colors) && colors?.length > 0 && renderTabsGender()}
        {Array.isArray(sizes) && sizes?.length > 0 && renderTabsSize()}
      </div>
    </div>
  );
};

export default SidebarFilters;
