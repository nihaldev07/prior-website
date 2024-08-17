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
import { classNames, NavItems } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import LogoImg from "@/images/logo.png";
import Image from "next/image";
import { GlobalSearch } from "./searchProduct";
import CartSideBar from "@/components/CartSideSheet";

const Navbar = () => {
  const renderMobileView = () => {
    return (
      <Sheet>
        <SheetTrigger>
          <Menu className="size-6 text-gray-700" />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle className="text-primary">Prior</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />

          <nav className="grid gap-6 text-lg font-medium ">
            {NavItems.map((item: INavItem) => {
              return (
                <Link
                  key={item?.id}
                  href={item?.link}
                  className="p-4 rounded font-medium bg-gray-100 text-gray-950 transition-colors hover:text-foreground"
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
        <div className="mx-auto max-w-full px-2 sm:px-4 lg:px-8">
          <div className="relative flex h-16 md:h-20  items-center justify-between md:container">
            <div className="flex items-center px-2 lg:px-0">
              <a href="/" className="flex-shrink-0">
                <Image
                  alt="Your Company"
                  src={LogoImg}
                  className="h-8 md:h-16 w-auto"
                />
              </a>
              <div className="hidden md:ml-6 sm:block">
                <div className="flex space-x-1 md:space-x-4">
                  {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}

                  {NavItems.map((item: INavItem) => (
                    <a
                      key={item?.id}
                      href={item?.link}
                      className={classNames(
                        "rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:bg-blue-400 hover:text-white",
                        ""
                      )}
                    >
                      {item?.title}
                    </a>
                  ))}
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
            <div className="flex sm:hidden">
              {/* Mobile menu button */}
              {renderMobileView()}
            </div>
            <div className="hidden lg:ml-4 sm:block">
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
                        <img
                          alt=""
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
