import Icon from "@/components/layout/iconComponent";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { INavItem } from "@/lib/interface";
import { classNames, NavItems } from "@/lib/utils";
import {  BellIcon, ChartBar, Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

const Navbar=()=>{

    const renderMobileView=()=>{
        return <Sheet>
        <SheetTrigger><Menu className="size-6 text-white" /></SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader >
            <SheetTitle className="text-primary">Prior</SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            
            <nav className="grid gap-6 text-lg font-medium ">
                {NavItems.map((item:INavItem)=>{
                    return <Link key={item?.id}
                    href={item?.link}
                    className="p-4 rounded font-medium bg-gray-100 text-gray-950 transition-colors hover:text-foreground"
                  >
                    {item?.title}
                  </Link>
                })}
            </nav>
          
        </SheetContent>
      </Sheet>
    }

    return (
       <div className="w-full bg-gray-800">
         <div  className="bg-transparent w-full">
          <div className="mx-auto max-w-full px-2 sm:px-4 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex items-center px-2 lg:px-0">
                <div className="flex-shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-auto"
                  />
                </div>
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    
                    {NavItems.map((item:INavItem)=><a
                    key={item?.id}
                      href={item?.link}
                      className={classNames("rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white","")}
                    >
                      {item?.title}
                    </a>)}
                   
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search aria-hidden="true" className="size-5 text-gray-400" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      type="search"
                      placeholder="Search"
                      className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden">
                {/* Mobile menu button */}
                {renderMobileView()}
              </div>
              <div className="hidden lg:ml-4 lg:block">
                <div className="flex items-center">
                  <Button
                  variant={"ghost"}
                    className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Cart</span>
                    <ShoppingCart aria-hidden="true" className="h-6 w-6" />
                  </Button>
    
                  {/* Profile dropdown */}
                 <div className="hidden">
                 <DropdownMenu>
                 
                 <DropdownMenuTrigger asChild>
                     <Button variant={"ghost"}><span className="sr-only">Open user menu</span>
                     <img
                       alt=""
                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                       className="h-8 w-8 rounded-full"
                     /></Button>
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
      )
}

export default Navbar;