import Link from "next/link";
import type { FC } from "react";
import React from "react";
import LogoImg from "@/images/logo.png";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "hidden" }) => {
  return (
    <Link className='flex cursor-pointer items-center gap-2' href='/'>
      <Image src={LogoImg} alt='main-logo' />
      <span className={`${className} text-2xl font-bold hidden`}>Prior.</span>
    </Link>
  );
};

export default Logo;
