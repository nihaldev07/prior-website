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
                  "w-full pl-10 pr-10 h-12 border border-neutral-300 rounded-none text-sm font-serif",
                  "focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900",
                  "placeholder:text-neutral-400 transition-all duration-300 tracking-wide",
                  isMobile ? "text-base" : ""
                )}
                aria-label="Search products"
                autoComplete="off"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4 pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
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
            <CommandEmpty className="py-8 text-center text-sm font-serif text-neutral-600 tracking-wide">
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
                      <div className="relative w-12 h-12 flex-shrink-0 bg-neutral-50 rounded-none overflow-hidden border border-neutral-200">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <Search className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-serif tracking-wide text-neutral-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-serif text-neutral-900">
                            {formatPrice(product.unitPrice)}
                          </span>
                          {product.hasDiscount && product.updatedPrice && (
                            <>
                              <span className="text-xs text-neutral-400 line-through font-serif">
                                {formatPrice(product.unitPrice)}
                              </span>
                              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-none border border-emerald-200 font-serif tracking-wide">
                                {Math.round(((product.unitPrice - product.updatedPrice) / product.unitPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* High rating indicator */}
                      {product.rating >= 4 && (
                        <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchResults.length > 0 && (
              <div className="border-t border-neutral-200">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full px-6 py-4 text-sm text-center font-serif tracking-wide text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-300"
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
