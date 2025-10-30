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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INavItem } from "@/lib/interface";
import { cn, NavItems } from "@/lib/utils";
import {
  Menu,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Package,
  User,
  LogOut,
  Heart,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import LogoImg from "@/images/logo.png";
import Image from "next/image";
import { GlobalSearch } from "./searchProduct";
import CartSideBar from "@/components/CartSideSheet";
import React, { useState } from "react";
import useCategory from "@/hooks/useCategory";
import useThrottledEffect from "@/hooks/useThrottleEffect";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useAuth } from "@/context/AuthContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  level: number;
  totalProducts: number;
  totalChildren: number;
  img?: string;
  children?: Category[];
}

const Navbar = () => {
  const [openSheet, setOpenSheet] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const { fetchCategories } = useCategory();
  const { authState, logout } = useAuth();

  useThrottledEffect(
    async () => {
      const data = await fetchCategories();
      if (data) {
        const categoryTree = buildCategoryTree(data);
        setCategories(categoryTree);
      }
    },
    [],
    2000
  );

  // Build nested category tree structure
  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // Create map of all categories
    flatCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Build tree structure
    flatCategories.forEach((category) => {
      const categoryNode = categoryMap.get(category.id)!;
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId)!;
        parent.children!.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Recursive Mobile Category Tree Component
  const MobileCategoryTree: React.FC<{
    categories: Category[];
    level?: number;
  }> = ({ categories, level = 0 }) => {
    return (
      <div
        className={cn(
          "space-y-1",
          level > 0 && "ml-4 pl-3 border-l border-gray-200"
        )}>
        {categories.map((category) => (
          <div key={category.id} className='space-y-1'>
            <div className='flex items-center justify-between group'>
              <Link
                href={`/category/${category.id}`}
                onClick={() => setOpenSheet(false)}
                className={cn(
                  "flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700",
                  level === 0 ? "font-medium text-gray-900" : "text-gray-600"
                )}>
                {category.img && (
                  <div className='w-6 h-6 rounded overflow-hidden bg-gray-100 flex-shrink-0'>
                    <Image
                      src={category.img}
                      alt={category.name}
                      width={24}
                      height={24}
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
                <span className='flex-1 truncate'>{category.name}</span>
                {category.totalProducts > 0 && (
                  <Badge
                    variant='outline'
                    className='text-xs px-1.5 py-0.5 text-gray-500'>
                    {category.totalProducts}
                  </Badge>
                )}
              </Link>
              {category.children && category.children.length > 0 && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1 h-auto hover:bg-blue-100'
                  onClick={() => toggleCategoryExpanded(category.id)}>
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className='w-4 h-4 text-gray-500' />
                  ) : (
                    <ChevronRight className='w-4 h-4 text-gray-500' />
                  )}
                </Button>
              )}
            </div>

            {category.children && category.children.length > 0 && (
              <Collapsible
                open={expandedCategories.has(category.id)}
                onOpenChange={() => toggleCategoryExpanded(category.id)}>
                <CollapsibleContent className='space-y-1'>
                  <MobileCategoryTree
                    categories={category.children}
                    level={level + 1}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMobileView = () => {
    return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' className='lg:hidden'>
            <Menu className='w-6 h-6' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='w-80 p-0'>
          <SheetHeader className='p-6 pb-4 border-b'>
            <SheetTitle className='flex items-center justify-start'>
              <Image
                alt='Your Company'
                src={LogoImg}
                width={150}
                height={80}
                className='h-10 w-auto'
              />
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className='flex-1 px-6'>
            <nav className='py-4 space-y-6'>
              {/* Regular Navigation Items */}
              <div className='space-y-2'>
                {NavItems.filter(
                  (item) => !item.title.toLowerCase().includes("collections")
                ).map((item: INavItem) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    onClick={() => setOpenSheet(false)}
                    className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'>
                    {item.title}
                  </Link>
                ))}
              </div>

              {/* Categories Section */}
              {categories.length > 0 && (
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 px-3'>
                    <Package className='w-4 h-4 text-gray-500' />
                    <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
                      Categories
                    </h3>
                  </div>
                  <Separator />
                  <div className='space-y-1'>
                    <Link
                      href='/collections'
                      onClick={() => setOpenSheet(false)}
                      className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 transition-all hover:bg-blue-50'>
                      <Grid3X3 className='w-4 h-4' />
                      All Categories
                    </Link>
                    <MobileCategoryTree categories={categories} />
                  </div>
                </div>
              )}

              {/* Authentication Section - Mobile */}
              <div className='space-y-3 md:hidden'>
                {authState.isAuthenticated ? (
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        {authState.user?.profilePicture ? (
                          <Image
                            src={authState.user.profilePicture}
                            alt={authState.user.name}
                            width={40}
                            height={40}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        ) : (
                          <User className='w-5 h-5 text-blue-600' />
                        )}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          {authState.user?.name}
                        </p>
                        <p className='text-xs text-gray-600'>
                          {authState.user?.email}
                        </p>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Link
                        href='/account'
                        onClick={() => setOpenSheet(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'>
                        <User className='w-4 h-4' />
                        Profile
                      </Link>
                      <Link
                        href='/account/orders'
                        onClick={() => setOpenSheet(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'>
                        <ShoppingBag className='w-4 h-4' />
                        Orders
                      </Link>
                      <Link
                        href='/account/wishlist'
                        onClick={() => setOpenSheet(false)}
                        className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'>
                        <Heart className='w-4 h-4' />
                        Wishlist
                      </Link>
                      <Button
                        onClick={() => {
                          logout();
                          setOpenSheet(false);
                        }}
                        variant='ghost'
                        className='w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700'>
                        <LogOut className='w-4 h-4' />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <Button
                      asChild
                      variant='outline'
                      className='w-full justify-start gap-3'>
                      <Link href='/login' onClick={() => setOpenSheet(false)}>
                        <User className='w-4 h-4' />
                        Login
                      </Link>
                    </Button>
                    <Button asChild className='w-full justify-start gap-3'>
                      <Link
                        href='/register'
                        onClick={() => setOpenSheet(false)}>
                        <User className='w-4 h-4' />
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
                <Separator />
              </div>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  const renderDesktopCategories = () => {
    if (!categories || categories.length === 0) return null;
    const rootCategories = categories.slice(0, 8); // Limit for better UI

    return (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-0 min-w-[800px]'>
        {/* Featured Categories */}
        <div className='col-span-2 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
          <div className='mb-5'>
            <h3 className='text-lg font-semibold text-gray-900 mb-1.5'>
              Featured Categories
            </h3>
            <p className='text-sm text-gray-600'>
              Explore our most popular product categories
            </p>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {rootCategories.slice(0, 4).map((cat) => (
              <NavigationMenuLink key={cat.id} asChild>
                <Link
                  href={`/category/${cat.slug || cat.id}`}
                  className='group flex items-start gap-3 p-3 rounded-lg hover:bg-white/80 hover:shadow-md transition-all duration-200 border border-transparent hover:border-blue-200'>
                  {cat.img && (
                    <div className='w-12 h-12 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-200'>
                      <Image
                        src={cat.img}
                        alt={cat.name}
                        width={48}
                        height={48}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  )}
                  <div className='flex-1 min-w-0 space-y-1'>
                    <p className='text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className='text-xs text-gray-500 line-clamp-2 leading-relaxed'>
                        {cat.description}
                      </p>
                    )}
                    {cat.totalProducts > 0 && (
                      <p className='text-xs text-blue-600 font-medium'>
                        {cat.totalProducts} products
                      </p>
                    )}
                  </div>
                </Link>
              </NavigationMenuLink>
            ))}
          </div>
        </div>

        {/* All Categories List */}
        <div className='p-6 bg-white border-l border-gray-200'>
          <div className='mb-4'>
            <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3'>
              All Categories
            </h3>
          </div>
          <ScrollArea className='h-[320px] pr-3'>
            <div className='space-y-1.5'>
              <NavigationMenuLink asChild>
                <Link
                  href='/collections'
                  className='flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-blue-50 text-blue-600 font-medium transition-colors group'>
                  <Grid3X3 className='w-4 h-4 group-hover:scale-110 transition-transform' />
                  View All Categories
                </Link>
              </NavigationMenuLink>
              <Separator className='my-3' />
              <div className='space-y-0.5'>
                {categories.map((cat) => (
                  <NavigationMenuLink key={cat.id} asChild>
                    <Link
                      href={`/category/${cat.slug || cat.id}`}
                      className='flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all group'>
                      <span className='truncate font-medium'>{cat.name}</span>
                      {cat.totalProducts > 0 && (
                        <Badge
                          variant='outline'
                          className='text-xs px-1.5 py-0.5 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors'>
                          {cat.totalProducts}
                        </Badge>
                      )}
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <header className='sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 lg:h-20 items-center justify-between flex-wrap gap-y-2'>
          {/* Left: Mobile Menu + Logo */}
          <div className='flex items-center gap-2 min-w-[60%] md:min-w-[30%] justify-between flex-shrink-0'>
            {/* Mobile Menu (visible on sm and below) */}
            <div className='md:hidden'>{renderMobileView()}</div>

            {/* Logo */}
            <Link href='/' className='flex-shrink-0'>
              <Image
                alt='Your Company'
                src={LogoImg}
                className='h-8 lg:h-12 w-auto'
              />
            </Link>
          </div>

          {/* Middle: Desktop Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList>
              {NavItems.map((item) => {
                const isCollection =
                  item.title.toLowerCase().includes("collections") &&
                  categories.length > 0;
                return isCollection ? (
                  <NavigationMenuItem key={item.id}>
                    <NavigationMenuTrigger className='flex items-center gap-1 text-base font-extrabold bg-transparent hover:bg-gray-100'>
                      <Package className='w-4 h-4' />
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {renderDesktopCategories()}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.id}>
                    <Link
                      href={item.link}
                      className='text-base font-extrabold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center justify-center'>
                      {item.title}
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right: Search + Auth + Cart */}
          <div className='flex items-center justify-between gap-x-2'>
            <div className='flex flex-1 justify-center px-2 md:mr-4 '>
              <div className='w-full max-w-lg lg:max-w-xs'>
                <label htmlFor='search' className='sr-only'>
                  Search
                </label>
                <div className='relative'>
                  <GlobalSearch />
                </div>
              </div>
            </div>

            {/* Cart Icon */}
            <Button variant='ghost' size='icon' className='relative'>
              <CartSideBar />
            </Button>

            {/* Authentication Section - Desktop */}
            <div className='hidden md:flex items-center gap-2'>
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                        {authState.user?.profilePicture ? (
                          <Image
                            src={authState.user.profilePicture}
                            alt={authState.user.name}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full object-cover'
                          />
                        ) : (
                          <User className='w-4 h-4 text-blue-600' />
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href='/account' className='flex items-center gap-2'>
                        <User className='w-4 h-4' />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className='flex items-center gap-2 text-red-600 focus:text-red-600'>
                      <LogOut className='w-4 h-4' />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='flex items-center gap-2'>
                      <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                        {authState.user?.profilePicture ? (
                          <Image
                            src={authState.user.profilePicture}
                            alt={authState.user.name}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full object-cover'
                          />
                        ) : (
                          <User className='w-4 h-4 text-blue-600' />
                        )}
                      </div>
                      <span className='hidden lg:block text-sm font-medium'>
                        {authState.user?.name}
                      </span>
                      <ChevronDown className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Button variant='ghost' size='sm' asChild>
                        <Link href='/login'>Login</Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button size='sm' asChild>
                        <Link href='/register'>Register</Link>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Auth Indicator
            <div className='md:hidden'>
              {authState.isAuthenticated ? (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setOpenSheet(true)}>
                  <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                    {authState.user?.profilePicture ? (
                      <Image
                        src={authState.user.profilePicture}
                        alt={authState.user.name}
                        width={32}
                        height={32}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                    ) : (
                      <User className='w-4 h-4 text-blue-600' />
                    )}
                  </div>
                </Button>
              ) : (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setOpenSheet(true)}>
                  <User className='w-5 h-5' />
                </Button>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
