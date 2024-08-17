import React from "react";
// import { LuFilter } from "react-icons/lu";

import { prices } from "@/data/content";
// import Button from "@/shared/Button/Button";
import Select from "@/shared/Select/Select";
import { Category } from "@/data/types";

interface Props {
  sizes: string[];
  colors: string[];
  categories: Category[];
  filterData: any;
  handleFilterChange: (filterData: any) => void;
}

const Filter: React.FC<Props> = ({
  sizes,
  colors,
  categories,
  filterData,
  handleFilterChange,
}) => {
  return (
    <div className="mx-auto mb-10 max-w-4xl items-center justify-between space-y-3 rounded-2xl border border-neutral-300 p-2 md:flex md:space-y-0 md:rounded-full">
      <div className="grid basis-[100%] gap-3 grid-cols-2 md:grid-cols-4">
        {/* {filters.map((filter) => (
          <Select sizeClass='h-12' key={filter[0]}>
            {filter.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        ))} */}
        <Select
          sizeClass="h-12"
          className=" text-center sm:text-left sm:pl-2 "
          key={"categories"}
          value={filterData?.categoryId}
          onChange={(e) => {
            handleFilterChange({ ...filterData, categoryId: e.target.value });
          }}
        >
          <option value="">All Category</option>
          {!!categories &&
            categories.map((category) => (
              <option key={category?.id} value={category?.id}>
                {category.name}
              </option>
            ))}
        </Select>
        <Select
          sizeClass="h-12"
          className=" text-center sm:text-left sm:pl-2 "
          key={"colors"}
          value={filterData?.color}
          onChange={(e) => {
            handleFilterChange({ ...filterData, color: e.target.value });
          }}
        >
          <option value="">All Colors</option>
          {!!colors &&
            colors.map((color, i) => (
              <option key={color + i} value={color}>
                {color}
              </option>
            ))}
        </Select>
        <Select
          sizeClass="h-12"
          key={"size"}
          className=" text-center sm:text-left sm:pl-2 "
          value={filterData?.size}
          onChange={(e) => {
            handleFilterChange({ ...filterData, size: e.target.value });
          }}
        >
          <option value="">All Sizes</option>
          {!!sizes &&
            sizes.map((size, i) => (
              <option key={size + i} value={size}>
                {size}
              </option>
            ))}
        </Select>
        <Select
          sizeClass="h-12"
          key={"price"}
          className=" text-center sm:text-left sm:pl-2 "
          value={filterData?.price}
          onChange={(e) => {
            handleFilterChange({ ...filterData, price: e.target.value });
          }}
        >
          {prices.map((price, i) => (
            <option key={price + i} value={price}>
              {price}
            </option>
          ))}
        </Select>
      </div>

      <div className="hidden h-5 w-px bg-neutral-300 md:block" />

      {/* <Button className='flex w-full items-center gap-1 bg-gray lg:w-auto'>
        More Filter
        <LuFilter />
      </Button> */}
    </div>
  );
};

export default Filter;
