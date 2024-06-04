import React from "react";
import { FaRegBell } from "react-icons/fa6";

import Logo from "@/shared/Logo/Logo";

import CartSideBar from "../CartSideBar";
import MenuBar from "./MenuBar";
import { GlobalSearch } from "./Search";

const MainNav = () => {
  return (
    <div className='container flex items-center justify-between py-0 sm:py-4'>
      <div className='flex-1 lg:hidden'>
        <MenuBar />
      </div>
      <div className='flex items-center gap-5 lg:basis-[60%]'>
        <Logo />
        {/* <div className='hidden w-full max-w-2xl items-center gap-5 rounded-full px-5  lg:flex'> */}
        {/* <Input
            type='text'
            className='border-transparent bg-white placeholder:text-neutral-500 focus:border-transparent focus:ring-transparent focus:outline-none focus:ring-0'
            placeholder='search'
          />
          <RiSearch2Line className='text-2xl text-neutral-500' /> */}
        {/* </div> */}
      </div>

      <div className='flex flex-1 items-center justify-end gap-2 sm:gap-5'>
        <GlobalSearch />
        {/* <div className='relative hidden lg:block'>
          <span className='absolute -top-1/4 left-3/4 aspect-square w-3 rounded-full bg-red-600' />
          <FaRegBell className='text-2xl' />
        </div> */}

        <div className='flex items-center divide-x divide-neutral-300'>
          <CartSideBar />
          {/* <div className='flex items-center gap-2 pl-5'>
            <ButtonCircle3 className='overflow-hidden bg-gray' size='w-10 h-10'>
              <Image
                src={avatar}
                alt='avatar'
                className='h-full w-full object-cover object-center'
              />
            </ButtonCircle3>
            <Link href='#' className='hidden text-sm lg:block'>
              Guest
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MainNav;
