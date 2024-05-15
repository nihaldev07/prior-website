import React from "react";

import { topNavLinks } from "@/data/content";

import Language from "../Language";
import NavigationItem from "../NavItem";

const TopNav = () => {
  return (
    <div className='hidden bg-primary py-3 lg:block'>
      <div className='container flex items-center justify-between text-sm text-white'>
        <div className='flex items-center justify-center divide-x divide-neutral-100 gap-4'>
          {topNavLinks.map((item) => (
            <NavigationItem menuItem={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
