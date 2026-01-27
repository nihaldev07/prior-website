'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, LogOut, Package, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import SearchBox from './SearchBox';

/**
 * Header Navigation Component
 * Includes logo, navigation menu, search, user auth, and shopping cart
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { authState, logout } = useAuth();
  const { user, isAuthenticated } = authState;
  const pathname = usePathname();
  const router = useRouter();

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
    router.push('/');
  };

  /**
   * Check if link is active
   */
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              PRIOR
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "font-medium transition-colors duration-200",
                isActive('/') && pathname === '/'
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              Home
            </Link>
            <Link
              href="/collections"
              className={cn(
                "font-medium transition-colors duration-200",
                isActive('/collections')
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              All Products
            </Link>
            <Link
              href="/deals"
              className={cn(
                "font-medium transition-colors duration-200",
                isActive('/deals')
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              Deals
            </Link>
            <Link
              href="/about"
              className={cn(
                "font-medium transition-colors duration-200",
                isActive('/about')
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              About
            </Link>
            <Link
              href="/contact-us"
              className={cn(
                "font-medium transition-colors duration-200",
                isActive('/contact-us')
                  ? "text-gray-900"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBox className="w-full" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Auth/Avatar - Desktop */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </button>

                  {/* User Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-900 hover:text-gray-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBox isMobile className="w-full" />
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/collections"
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                href="/deals"
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact-us"
                className="block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile User Actions */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center py-2 text-gray-900">
                      <User className="w-5 h-5 mr-2" />
                      <span>{user.name}</span>
                    </div>
                    <Link
                      href="/account/profile"
                      className="block py-2 text-gray-600 hover:text-gray-900 transition-colors pl-7"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block py-2 text-gray-600 hover:text-gray-900 transition-colors pl-7 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      className="block py-2 text-gray-600 hover:text-gray-900 transition-colors pl-7 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors pl-7 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block py-2 text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
