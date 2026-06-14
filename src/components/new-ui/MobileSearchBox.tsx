"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import useSearchProduct from "@/hooks/useProductSearch";

// Import the shared components and utilities from SearchBox
// We'll need to redefine them here since they're in the same directory
import {
  ProductRow,
  ResultsPanel,
  getRecent,
  saveRecent,
  removeRecent,
  TRENDING,
} from "./SearchBox";

interface MobileSearchBoxProps {
  className?: string;
}

/**
 * MobileSearchBox Component
 * A mobile-only search with icon trigger that opens a dialog at the top of the screen
 * Designed to prevent keyboard overlap on mobile devices
 */
export default function MobileSearchBox({ className }: MobileSearchBoxProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { loading, products, inputValue, setInputValue } = useSearchProduct();
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useState<string[]>([]);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open) {
      setRecent(getRecent());
      // Small delay to ensure dialog is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      setInputValue("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, setInputValue]);

  /**
   * Handle product selection
   */
  const handleSelectProduct = (productId: string) => {
    router.push(`/collections/${productId}`);
    setInputValue("");
    setOpen(false);
  };

  /**
   * Handle search submit (Enter key or search icon click)
   */
  const handleSearchSubmit = useCallback(() => {
    if (!inputValue.trim()) return;
    saveRecent(inputValue.trim());
    router.push(`/collections?search=${encodeURIComponent(inputValue)}`);
    setInputValue("");
    setOpen(false);
  }, [inputValue, router, setInputValue]);

  /**
   * Clear search input
   */
  const handleClear = () => {
    setInputValue("");
    inputRef.current?.focus();
  };

  /**
   * Close dialog and reset state
   */
  const handleClose = () => {
    setInputValue("");
    setOpen(false);
  };

  const handleRemoveRecent = (term: string) => {
    removeRecent(term);
    setRecent(getRecent());
  };

  const handleRecentClick = (t: string) => {
    setInputValue(t);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleTrendingClick = (t: string) => {
    setInputValue(t);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <>
      {/* Search Icon Trigger - Visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "md:hidden p-2 rounded-lg hover:bg-[#e8f0ff] text-gray-500 hover:text-[#0b3393] transition-colors",
          className,
        )}
        aria-label="Search products"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Dialog */}
      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white">
          {/* ── Top bar: back button + input ────────────────────────────────── */}
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 bg-white shadow-sm">
            {/* Back */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600"
              aria-label="Close search"
            >
              <ArrowLeft size={20} />
            </button>

            {/* Input wrapper */}
            <div
              className={cn(
                "flex-1 flex items-center h-11 rounded-2xl border-2 transition-all duration-150",
                inputValue
                  ? "border-[#0b3393] bg-white"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <Search
                size={16}
                className={cn(
                  "ml-3.5 flex-shrink-0",
                  inputValue ? "text-[#0b3393]" : "text-gray-400",
                )}
              />
              <input
                ref={inputRef}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                placeholder="What are you looking for?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder:text-gray-400 outline-none px-2.5 py-0 min-w-0"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {inputValue && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClear}
                  className="mr-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 active:bg-gray-300 transition-colors flex-shrink-0"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Search CTA — only shown when there's a query */}
            {inputValue && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSearchSubmit}
                className="flex-shrink-0 h-11 px-4 rounded-2xl bg-[#0b3393] text-white text-sm font-semibold active:bg-[#092875] transition-colors shadow-sm"
              >
                Go
              </button>
            )}
          </div>

          {/* ── Scrollable results ───────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain">
            <ResultsPanel
              inputValue={inputValue}
              loading={loading}
              products={products}
              recent={recent}
              onSelect={handleSelectProduct}
              onSubmit={handleSearchSubmit}
              onRecentClick={handleRecentClick}
              onRecentRemove={handleRemoveRecent}
              onTrendingClick={handleTrendingClick}
              compact
            />
          </div>
        </div>
      )}
    </>
  );
}
