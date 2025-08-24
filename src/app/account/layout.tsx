"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
  const { authState, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [authState.isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navigationItems = [
    {
      href: "/account",
      label: "Dashboard",
      icon: User,
      exact: true,
      endPoint: "/account",
    },
    {
      href: "/account/profile",
      label: "Profile",
      icon: User,
      exact: true,
      endPoint: "/profile",
    },
    {
      href: "/account/orders",
      label: "Orders",
      icon: ShoppingBag,
      exact: true,
      endPoint: "/orders",
    },
    {
      href: "/account/wishlist",
      label: "Wishlist",
      icon: Heart,
      exact: true,
      endPoint: "/wishlist",
    },
    // {
    //   href: "/account/settings",
    //   label: "Settings",
    //   icon: Settings,
    // },
  ];

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
  }) => {
    return (
      <Link
        href={href}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors`}
        onClick={() => setIsMobileMenuOpen(false)}>
        <Icon className='h-5 w-5' />
        <span>{label}</span>
      </Link>
    );
  };

  const Sidebar = () => (
    <div className='w-64 bg-white shadow-sm border-r border-gray-200 h-full'>
      <div className='p-6'>
        <div className='flex items-center space-x-3 mb-6'>
          <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
            <User className='h-6 w-6 text-blue-600' />
          </div>
          <div>
            <h3 className='font-medium text-gray-900'>
              {authState.user?.name}
            </h3>
            <p className='text-sm text-gray-500'>
              {authState.user?.email || authState.user?.mobileNumber}
            </p>
          </div>
        </div>

        <nav className='space-y-1'>
          {navigationItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className='mt-8 pt-6 border-t border-gray-200'>
          <Button
            variant='ghost'
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
            onClick={handleLogout}>
            <LogOut className='h-5 w-5 mr-3' />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  // Show loading or redirect if not authenticated
  if (!authState.isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile header */}
      <div className='lg:hidden bg-white shadow-sm border-b border-gray-200 p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold text-gray-900'>My Account</h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-72 p-0'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-lg font-semibold'>Account Menu</h2>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <X className='h-5 w-5' />
                  </Button>
                </div>

                <div className='flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-lg'>
                  <div className='h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <User className='h-6 w-6 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-medium text-gray-900'>
                      {authState.user?.name}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {authState.user?.email || authState.user?.mobileNumber}
                    </p>
                  </div>
                </div>

                <nav className='space-y-1'>
                  {navigationItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                  ))}
                </nav>

                <div className='mt-8 pt-6 border-t border-gray-200'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
                    onClick={handleLogout}>
                    <LogOut className='h-5 w-5 mr-3' />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className='flex'>
        {/* Desktop sidebar */}
        <div className='hidden lg:block'>
          <Sidebar />
        </div>

        {/* Main content */}
        <div className='flex-1 lg:ml-0'>
          <main className='px-2 py-6 md:p-6 lg:p-8'>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
