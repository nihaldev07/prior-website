"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  Heart,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import LogoImg from "@/images/logo.png";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import SearchBox from "./SearchBox";
import MobileSearchBox from "./MobileSearchBox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useCategory from "@/hooks/useCategory";

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

/**
 * Header Navigation Component
 * Includes logo, navigation menu, search, user auth, and shopping cart
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const { cart } = useCart();
  const { authState, logout } = useAuth();
  const { user, isAuthenticated } = authState;
  const pathname = usePathname();
  const router = useRouter();
  const { fetchCategories } = useCategory();

  // Fetch categories on mount
  React.useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data) {
        const categoryTree = buildCategoryTree(data);
        setCategories(categoryTree);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Mobile Category Tree Component
  const MobileCategoryTree: React.FC<{
    categories: Category[];
    level?: number;
  }> = ({ categories, level = 0 }) => {
    return (
      <div className='space-y-1'>
        {categories.map((category) => (
          <div key={category.id} className='space-y-1'>
            <Collapsible
              open={
                category.children && category.children.length > 0
                  ? expandedCategories.has(category.id)
                  : false
              }
              onOpenChange={() => toggleCategoryExpanded(category.id)}>
              <div className='flex items-center justify-between group'>
                <Link
                  href={`/category/${category.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-neutral-50",
                    level === 0
                      ? "font-medium text-neutral-700"
                      : "text-neutral-700",
                  )}>
                  <span className='flex-1 font-serif tracking-wide'>
                    {category.name}
                  </span>
                </Link>
                {category.children && category.children.length > 0 && (
                  <CollapsibleTrigger className='p-1 hover:bg-neutral-100 rounded-md transition-colors'>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className='w-4 h-4 text-neutral-600' />
                    ) : (
                      <ChevronRight className='w-4 h-4 text-neutral-600' />
                    )}
                  </CollapsibleTrigger>
                )}
              </div>
              {category.children && category.children.length > 0 && (
                <CollapsibleContent className='space-y-1'>
                  <div
                    className={cn(
                      level > 0 && "ml-4 pl-3 border-l border-neutral-200",
                    )}>
                    <MobileCategoryTree
                      categories={category.children}
                      level={level + 1}
                    />
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        ))}
      </div>
    );
  };

  // All Products category state
  const [isAllProductsOpen, setIsAllProductsOpen] = useState(true);

  // Desktop Category Tree Component
  const DesktopCategoryTree: React.FC<{
    categories: Category[];
    level?: number;
  }> = ({ categories, level = 0 }) => {
    return (
      <div className='space-y-0.5'>
        {categories.map((category) => (
          <div key={category.id} className='space-y-0.5'>
            <Collapsible
              open={
                category.children && category.children.length > 0
                  ? expandedCategories.has(category.id)
                  : false
              }
              onOpenChange={() => toggleCategoryExpanded(category.id)}>
              <div className='flex items-center justify-between group rounded-lg hover:bg-neutral-50 transition-colors duration-200'>
                <Link
                  href={`/category/${category.id}`}
                  onClick={() => setIsDesktopMenuOpen(false)}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200",
                    level === 0
                      ? "font-medium text-neutral-900"
                      : "text-neutral-700",
                  )}>
                  <span className='flex-1 font-serif tracking-wide'>
                    {category.name}
                  </span>
                </Link>
                {category.children && category.children.length > 0 && (
                  <CollapsibleTrigger className='mr-2 p-1.5 hover:bg-neutral-200 rounded-md transition-all duration-200'>
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className='w-4 h-4 text-neutral-700' />
                    ) : (
                      <ChevronRight className='w-4 h-4 text-neutral-700' />
                    )}
                  </CollapsibleTrigger>
                )}
              </div>
              {category.children && category.children.length > 0 && (
                <CollapsibleContent className='space-y-0.5'>
                  <div
                    className={cn(
                      level === 0 &&
                        "ml-4 pl-4 border-l-2 border-neutral-200 mt-1 space-y-0.5",
                      level > 0 && "ml-4 pl-4 border-l border-neutral-200",
                    )}>
                    <DesktopCategoryTree
                      categories={category.children}
                      level={level + 1}
                    />
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>
        ))}
      </div>
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  /**
   * Check if link is active
   */
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <header className='bg-white border-b border-neutral-200 sticky top-0 z-50'>
      <div className='max-w-[85rem] mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className='md:hidden p-2 text-neutral-900 hover:text-neutral-700 transition-colors duration-300'
            aria-label='Toggle mobile menu'>
            {isMobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='text-2xl ml-[25px] md:ml-0 font-bold font-serif tracking-wide text-primary hover:text-neutral-700 transition-colors duration-300'>
              <Image
                alt='Your Company'
                src={LogoImg}
                className='h-8 lg:h-12 w-auto'
                quality={98}
                unoptimized
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <Link
              href='/'
              className={cn(
                "text-sm font-serif tracking-wide transition-colors duration-300",
                isActive("/") && pathname === "/"
                  ? "text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900",
              )}>
              Home
            </Link>
            <Popover
              open={isDesktopMenuOpen}
              onOpenChange={setIsDesktopMenuOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "text-sm font-serif tracking-wide transition-colors duration-300 text-left",
                    isActive("/collections")
                      ? "text-neutral-900"
                      : "text-neutral-700 hover:text-neutral-900",
                  )}>
                  All Products
                </button>
              </PopoverTrigger>
              <PopoverContent
                align='start'
                className='w-96 p-0 max-h-[65vh] overflow-hidden border-neutral-200 shadow-xl'>
                <div className='bg-gradient-to-b from-neutral-50 to-white p-4 border-b border-neutral-200'>
                  <div className='flex items-center gap-2'>
                    <Package className='w-4 h-4 text-neutral-600' />
                    <h3 className='text-sm font-semibold font-serif tracking-wide uppercase text-neutral-900'>
                      Shop by Category
                    </h3>
                  </div>
                </div>
                <ScrollArea className='h-[calc(65vh-60px)]'>
                  <div className='p-4 bg-white'>
                    {categories.length > 0 ? (
                      <DesktopCategoryTree categories={categories} />
                    ) : (
                      <div className='py-12 text-center text-neutral-500'>
                        <div className='w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-100 flex items-center justify-center'>
                          <Package className='w-6 h-6 text-neutral-400' />
                        </div>
                        <p className='text-sm font-serif'>
                          Loading categories...
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <Link
              href='/deals'
              className={cn(
                "text-sm font-serif tracking-wide transition-colors duration-300",
                isActive("/deals")
                  ? "text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900",
              )}>
              New Arrivals
            </Link>
            <Link
              href='/store-location'
              className={cn(
                "text-sm font-serif tracking-wide transition-colors duration-300",
                isActive("/store-location")
                  ? "text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900",
              )}>
              Store Location
            </Link>
            <Link
              href='/about'
              className={cn(
                "text-sm font-serif tracking-wide transition-colors duration-300",
                isActive("/about")
                  ? "text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900",
              )}>
              About
            </Link>
            <Link
              href='/contact-us'
              className={cn(
                "text-sm font-serif tracking-wide transition-colors duration-300",
                isActive("/contact-us")
                  ? "text-neutral-900"
                  : "text-neutral-700 hover:text-neutral-900",
              )}>
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 max-w-10 md:max-w-xs mx-6'>
            <SearchBox className='w-full' />
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center gap-4'>
            {/* User Auth/Avatar - Desktop */}
            <div className='hidden md:block'>
              {isAuthenticated && user ? (
                <div className='relative group'>
                  <button className='flex items-center gap-3 p-3 text-neutral-700 hover:text-neutral-900 transition-colors duration-300 border border-transparent hover:border-neutral-200 rounded-none'>
                    <div className='w-8 h-9 bg-neutral-200 rounded-none flex items-center justify-center'>
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.name}
                          width={32}
                          height={32}
                          className='w-8 h-8 rounded-none object-cover'
                        />
                      ) : (
                        <User className='w-4 h-4 text-neutral-600' />
                      )}
                    </div>
                    <span className='text-sm font-serif text-neutral-900'>
                      {user.name}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-none border border-neutral-200 shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                    <div className='py-2'>
                      <Link
                        href='/account/profile'
                        className='block px-4 py-3 text-sm font-serif text-neutral-700 hover:bg-neutral-50 transition-colors duration-200'>
                        Profile
                      </Link>
                      <Link
                        href='/account/orders'
                        className='block px-4 py-3 text-sm font-serif text-neutral-700 hover:bg-neutral-50 transition-colors duration-200'>
                        My Orders
                      </Link>
                      <Link
                        href='/account/wishlist'
                        className='block px-4 py-3 text-sm font-serif text-neutral-700 hover:bg-neutral-50 transition-colors duration-200'>
                        Wishlist
                      </Link>
                      <hr className='my-1' />
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-3 text-sm font-serif text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 flex items-center'>
                        <LogOut className='w-4 h-4 mr-2' />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href='/login'
                  className='text-sm font-serif tracking-wide text-neutral-900 hover:text-neutral-700 px-3 py-2 transition-colors duration-300 flex items-center gap-2'>
                  <User className='w-4 h-4' />
                  <span>Login</span>
                </Link>
              )}
            </div>

            <MobileSearchBox />

            {/* Shopping Cart */}
            <Link
              href='/cart'
              className='relative p-2 text-neutral-900 hover:text-neutral-700 transition-colors duration-300'>
              <ShoppingCart className='w-6 h-6' />
              {totalItems > 0 && (
                <span className='absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-none w-5 h-5 flex items-center justify-center font-serif'>
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side='left' className='w-full sm:w-80 p-0'>
            <SheetHeader className='p-6 border-b border-neutral-200'>
              <SheetTitle className='text-2xl font-serif font-bold tracking-wide text-neutral-900 flex justify-start items-center'>
                <Image
                  alt='Your Company'
                  src={LogoImg}
                  width={150}
                  height={80}
                  className='h-10 w-auto'
                  quality={98}
                  unoptimized
                />
              </SheetTitle>
            </SheetHeader>

            <ScrollArea className='h-[calc(100vh-80px)]'>
              <div className='px-6 py-4 space-y-6'>
                {/* Navigation Links */}
                <div className='space-y-1'>
                  <Link
                    href='/'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                    Home
                  </Link>
                  {/* All Products - Collapsible with Categories */}
                  <Collapsible
                    open={isAllProductsOpen}
                    onOpenChange={setIsAllProductsOpen}>
                    <div className='flex items-center justify-between group'>
                      <Link
                        href='/collections'
                        onClick={(e) => {
                          e.preventDefault();
                          setIsAllProductsOpen(!isAllProductsOpen);
                        }}
                        className='flex-1 flex items-center justify-between font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                        <span>All Products</span>
                      </Link>
                      <CollapsibleTrigger
                        onClick={(e) => {
                          e.preventDefault();
                          setIsAllProductsOpen(!isAllProductsOpen);
                        }}
                        className='p-1 mr-2 hover:bg-neutral-100 rounded-md transition-colors'>
                        {isAllProductsOpen ? (
                          <ChevronDown className='w-4 h-4 text-neutral-600' />
                        ) : (
                          <ChevronRight className='w-4 h-4 text-neutral-600' />
                        )}
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className='space-y-1'>
                      <div className='ml-4 pl-3 border-l border-neutral-200'>
                        {categories.length > 0 && (
                          <MobileCategoryTree categories={categories} />
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Link
                    href='/deals'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                    New Arrivals
                  </Link>
                  <Link
                    href='/store-location'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                    Store Location
                  </Link>
                  <Link
                    href='/about'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                    About
                  </Link>
                  <Link
                    href='/contact-us'
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block font-serif text-base tracking-wide text-neutral-700 hover:text-neutral-900 transition-colors duration-200 py-2.5 px-3 rounded-lg hover:bg-neutral-50'>
                    Contact
                  </Link>
                </div>

                {/* User Actions */}
                <div className='border-t border-neutral-200 pt-4'>
                  {isAuthenticated && user ? (
                    <div className='space-y-3'>
                      <div className='flex items-center gap-3 px-3 py-2 text-neutral-900'>
                        <User className='w-5 h-5' />
                        <span className='font-serif'>{user.name}</span>
                      </div>
                      <Link
                        href='/account/profile'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 py-2.5 px-3 text-sm font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-200 rounded-lg hover:bg-neutral-50'>
                        <User className='w-4 h-4' />
                        Profile
                      </Link>
                      <Link
                        href='/account/orders'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 py-2.5 px-3 text-sm font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-200 rounded-lg hover:bg-neutral-50'>
                        <Package className='w-4 h-4' />
                        My Orders
                      </Link>
                      <Link
                        href='/account/wishlist'
                        onClick={() => setIsMobileMenuOpen(false)}
                        className='flex items-center gap-3 py-2.5 px-3 text-sm font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-200 rounded-lg hover:bg-neutral-50'>
                        <Heart className='w-4 h-4' />
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='w-full flex items-center gap-3 py-2.5 px-3 text-sm font-serif text-neutral-700 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50'>
                        <LogOut className='w-4 h-4' />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href='/login'
                      onClick={() => setIsMobileMenuOpen(false)}
                      className='flex items-center gap-3 py-2.5 px-3 text-sm font-serif text-neutral-700 hover:text-neutral-900 transition-colors duration-200 rounded-lg hover:bg-neutral-50'>
                      <User className='w-5 h-5' />
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
