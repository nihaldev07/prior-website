import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}


export const  NavItems=[
  {
    id:0,
    title:"Home",
    link:"/",
    icon:"house"
  },{
    id:1,
    title:"Category",
    link:"/collections",
    icon:"box"
  },{
    id:2,
    title:"What's New",
    link:"/deals",
    icon:"package-plus"
  },{
    id:3,
    title:"About",
    link:"/about",
    icon:"book-a"
  }
]