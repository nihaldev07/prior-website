/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Adjust path as per your project
import { Input } from "@/components/ui/input";
import useSearchProduct from "@/hooks/useProductSearch";
import { ProductType } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import {
  BanknoteIcon,
  BoxIcon,
  RefreshCcw,
  Search,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const router = useRouter();
  const { loading, products, inputValue, setInputValue } = useSearchProduct();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* <p
        className="hidden sm:flex text-sm text-muted-foreground px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 justify-center items-center"
        onClick={() => setOpen(!open)}
      >
        <SearchIcon className=" size-4 text-gray-950  mr-1" /> Search{" "}
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 ml-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p> */}
      <SearchIcon
        onClick={() => setOpen(!open)}
        className=' size-6 text-primary  mr-1 sm:hidden'
      />
      <div
        className='sm:pointer-events-none absolute inset-y-0 right-0 sm:left-0  items-center pl-3 hidden'
        onClick={() => setOpen(!open)}>
        <Search
          aria-hidden='true'
          className='size-5 text-gray-700'
          onClick={() => setOpen(!open)}
        />
      </div>
      <SearchIcon
        onClick={() => setOpen(!open)}
        className=' size-6 text-primary hidden mr-1 sm:block'
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='hidden'>
          <button className='px-4 py-2 bg-primary text-white rounded-md'>
            Search Products
          </button>
        </DialogTrigger>
        <DialogContent className='w-full max-w-lg sm:top-[20%] top-4 translate-y-0 max-h-[85vh] sm:max-h-[80vh] flex flex-col p-4 sm:p-6'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className='space-y-3 sm:space-y-4 flex-1 flex flex-col min-h-0'>
            {/* Input for searching */}
            <div className='flex-shrink-0'>
              <Input
                placeholder='Type product name to search...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='text-base sm:text-sm'
              />
            </div>
            {/* Loading State */}
            {loading ? (
              <div className='p-6 flex justify-center items-center'>
                Searching... <RefreshCcw className='animate-spin ml-2' />
              </div>
            ) : (
              <div className='p-0 flex justify-center items-center flex-1 min-h-0'>
                {/* Empty State */}
                {!products || products.length === 0 ? (
                  <p className='text-center text-gray-500'>No results found.</p>
                ) : (
                  <div className='space-y-2 sm:space-y-4 w-full h-full overflow-y-auto -mx-4 px-4 sm:mx-0 sm:px-0'>
                    {/* Product List */}
                    {products.map((product: any) => (
                      <div
                        key={
                          product.id ||
                          product.name ||
                          Math.random().toString(36)
                        }
                        onClick={() => {
                          setOpen(false);
                          router.push(`/collections/${product.id}`);
                        }}
                        className='flex items-center gap-3 sm:gap-4 p-2 sm:p-0 rounded-md hover:bg-gray-100 active:bg-gray-200 cursor-pointer w-full transition-colors'>
                        <img
                          src={product.thumbnail || "/placeholder-image.jpg"}
                          className='h-12 w-12 sm:h-10 sm:w-10 rounded-md flex-shrink-0'
                          alt={product.name || "product"}
                          width={40}
                          height={40}
                        />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {product.name || "Unnamed Product"}
                          </p>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='outline' className='text-xs'>
                              <BoxIcon className='mr-1 h-3 w-3' />{" "}
                              {product.quantity || 0}
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              <BanknoteIcon className='mr-1 h-3 w-3' />{" "}
                              {product.unitPrice || "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
