'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { fetchAllProducts } from '@/services/productServices';
import { SingleProductType } from '@/data/types';

interface SearchBoxProps {
  className?: string;
  isMobile?: boolean;
}

/**
 * SearchBox Component with elegant autocomplete dropdown
 * Features debounced search, product suggestions, and keyboard navigation
 */
export default function SearchBox({ className, isMobile = false }: SearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SingleProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<SingleProductType[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all products on mount for instant search
  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchAllProducts();
      setAllProducts(products);
    };
    loadProducts();
  }, []);

  // Debounced search function
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setOpen(false);
        return;
      }

      setIsLoading(true);

      // Filter products locally for instant results
      const filtered = allProducts.filter((product) => {
        const searchLower = query.toLowerCase();
        return (
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.categoryName?.toLowerCase().includes(searchLower) ||
          product.productCode?.toLowerCase().includes(searchLower)
        );
      }).slice(0, 8); // Limit to 8 results

      setSearchResults(filtered);
      setIsLoading(false);
      setOpen(filtered.length > 0);
    },
    [allProducts]
  );

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  /**
   * Handle product selection
   */
  const handleSelectProduct = (productId: string) => {
    router.push(`/collections/${productId}`);
    setSearchQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  /**
   * Handle search submit (Enter key or search icon click)
   */
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collections?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  /**
   * Clear search input
   */
  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  /**
   * Format price with BDT currency
   */
  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString()}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative", className)}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setOpen(true);
                  }
                }}
                className={cn(
                  "w-full pl-9 pr-9 py-1.5 border border-gray-300 rounded-lg",
                  "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent",
                  "text-sm placeholder:text-gray-400 transition-all duration-200",
                  isMobile ? "text-base" : ""
                )}
                aria-label="Search products"
                autoComplete="off"
              />
              <Search
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isLoading && (
                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </form>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[400px] max-w-[calc(100vw-2rem)]"
        align="start"
        side="bottom"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command className="border-0 shadow-none">
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              {searchQuery ? "No products found" : "Start typing to search..."}
            </CommandEmpty>

            {searchResults.length > 0 && (
              <CommandGroup heading="Products">
                {searchResults.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    onSelect={() => handleSelectProduct(product.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-3 w-full py-1">
                      {/* Product Image */}
                      <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Search className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(product.unitPrice)}
                          </span>
                          {product.hasDiscount && product.updatedPrice && (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(product.unitPrice)}
                              </span>
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                {Math.round(((product.unitPrice - product.updatedPrice) / product.unitPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* High rating indicator */}
                      {product.rating >= 4 && (
                        <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchResults.length > 0 && (
              <div className="border-t border-gray-100">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-4 py-3 text-sm text-center text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  View all results for &ldquo;{searchQuery}&rdquo;
                </button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
