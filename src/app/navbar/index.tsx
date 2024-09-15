"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { INavItem } from "@/lib/interface";
import { cn, NavItems } from "@/lib/utils";
import { Menu, PlusIcon } from "lucide-react";
import Link from "next/link";
import LogoImg from "@/images/logo.png";
import Image from "next/image";
import { GlobalSearch } from "./searchProduct";
import CartSideBar from "@/components/CartSideSheet";
import React, { useState } from "react";
import useCategory from "@/hooks/useCategory";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [categories, setCategories] = useState([]);
  const { fetchCategories } = useCategory();

  useThrottledEffect(
    async () => {
      const data = await fetchCategories();
      setCategories(data ?? []);
    },
    [],
    2000
  );

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li className="z-50">
        <NavigationMenuLink className="z-50" asChild>
          <a
            ref={ref}
            className={cn(
              "block  z-50 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none uppercase z-50">
              {title}
            </div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground z-50">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  const renderMobileView = () => {
    return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger>
          <Menu className="size-6 text-gray-700" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>
              <Image
                alt="Your Company"
                src={LogoImg}
                width={200}
                height={100}
              />
            </SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />

          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {NavItems.map((item: INavItem) => {
              if (item?.title.toLowerCase().includes("collections")) {
                return (
                  <Collapsible defaultOpen>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between ">
                        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary uppercase">
                          {item?.title}
                        </span>
                        <PlusIcon className="size-4 ml-auto text-gray-900 font-semibold transition-colors hover:text-foreground" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-2 flex flex-col justify-start items-center bg-gray-50">
                      <Link
                        key={item?.id}
                        href={`${item?.link}`}
                        onClick={() => setOpenSheet(false)}
                        className=" rounded-lg px-3 py-2 text-muted-foreground mr-auto hover:text-primary uppercase"
                      >
                        - all
                      </Link>
                      {categories.map((category: any, index: number) => (
                        <Link
                          key={item?.id + index}
                          href={`/category/${category?.id}`}
                          onClick={() => setOpenSheet(false)}
                          className="rounded-lg px-3 py-2 text-muted-foreground mr-auto hover:text-primary uppercase"
                        >
                          - {category?.name}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              } else
                return (
                  <Link
                    key={item?.id}
                    href={item?.link}
                    onClick={() => setOpenSheet(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary uppercase"
                  >
                    {item?.title}
                  </Link>
                );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-300">
      <div className="bg-transparent w-full">
        <div className="container sm:mx-auto max-w-full px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 md:h-20  items-center justify-between md:container">
            <div className="flex ml-2 sm:hidden">
              {/* Mobile menu button */}
              {renderMobileView()}
            </div>
            <div className="flex items-center justify-center sm:justify-start px-2 w-full sm:w-auto lg:px-0">
              <a href="/" className="flex-shrink-0 ">
                <Image
                  alt="Your Company"
                  src={LogoImg}
                  className="h-10 md:h-16 w-auto"
                />
              </a>
              <div className="hidden md:ml-6 sm:block w-full">
                <div className="flex space-x-1 md:space-x-4">
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}

                  <NavigationMenu>
                    <NavigationMenuList className="grid gap-2 grid-cols-5">
                      {NavItems.map((item: INavItem) => {
                        if (
                          item?.title?.toLowerCase().includes("collections") &&
                          !!categories &&
                          categories?.length > 0
                        ) {
                          return (
                            <NavigationMenuItem
                              key={item?.id}
                              className="z-[50]"
                            >
                              <NavigationMenuTrigger>
                                {item?.title}
                              </NavigationMenuTrigger>
                              <NavigationMenuContent className="z-[50]">
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[600px] z-[50]">
                                  <ListItem
                                    key={item?.id}
                                    title={"All"}
                                    href={item?.link}
                                  >
                                    All Type Collection Provide By Us
                                  </ListItem>
                                  {categories.map((category: any) => (
                                    <ListItem
                                      key={category?.id}
                                      title={category?.name}
                                      href={`/category/${category?.id}`}
                                    >
                                      {category?.description}
                                    </ListItem>
                                  ))}
                                </ul>
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          );
                        } else {
                          return (
                            <NavigationMenuItem
                              key={item?.id}
                              className="text-center flex items-center justify-center"
                            >
                              <Link href={item?.link} legacyBehavior passHref>
                                <NavigationMenuLink>
                                  {item?.title}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          );
                        }
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
            </div>
            <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="w-full max-w-lg lg:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <GlobalSearch />
                </div>
              </div>
            </div>

            <div className=" lg:ml-4">
              <div className="flex items-center">
                <div className="relative flex-shrink-0 rounded-full bg-white p-1 text-gray-400 ">
                  <CartSideBar />
                </div>

                {/* Profile dropdown */}
                <div className="hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"}>
                        <span className="sr-only">Open user menu</span>
                        <Image
                          alt=""
                          width={32}
                          height={32}
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="h-8 w-8 rounded-full"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Log Out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
