"use client";

import Link from "next/link";
import React, { useState } from "react";

import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import { ArrowLeft } from "lucide-react";

//const tabs = ['Home', 'Banner', 'New Arrival'];

const SectionNavigation = () => {
  //const [activeTab, setActiveTab] = useState('New Arrival');
  return (
    <div className="my-10 hidden sm:flex items-center justify-between">
      <Link href="/">
        <ButtonCircle3 size="w-10 h-10" className="border border-neutral-300">
          <ArrowLeft className="text-2xl" />
        </ButtonCircle3>
      </Link>

      {/* <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab ? 'text-primary' : 'text-neutral-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default SectionNavigation;
