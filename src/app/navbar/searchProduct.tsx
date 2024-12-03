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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { BanknoteIcon, BoxIcon, RefreshCcw, Search } from "lucide-react";
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
      </p>
      <SearchIcon
        onClick={() => setOpen(!open)}
        className=" size-6 text-primary  mr-1 sm:hidden"
      /> */}
      <div
        className="sm:pointer-events-none absolute inset-y-0 right-0 sm:left-0 flex items-center pl-3"
        onClick={() => setOpen(!open)}
      >
        <Search
          aria-hidden="true"
          className="size-5 text-gray-700"
          onClick={() => setOpen(!open)}
        />
      </div>
      <div
        onClick={() => setOpen(!open)}
        id="search"
        className="hidden sm:block w-full rounded-md border border-gray-300 md:border-transparent md:border-0  bg-white md:bg-gray-200 py-1.5 pl-10 pr-3 text-gray-800 placeholder:text-gray-800 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
      >
        Search
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className="hidden">
          <button className="px-4 py-2 bg-primary text-white rounded-md">
            Search Products
          </button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Input for searching */}
            <Input
              placeholder="Type product name to search..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* Loading State */}
            {loading ? (
              <div className="p-6 flex justify-center items-center">
                Searching... <RefreshCcw className="animate-spin ml-2" />
              </div>
            ) : (
              <div className="p-0 flex justify-center items-center">
                {/* Empty State */}
                {!products || products.length === 0 ? (
                  <p className="text-center text-gray-500">No results found.</p>
                ) : (
                  <div className="space-y-4 w-full max-h-[60vh] overflow-y-auto">
                    {/* Product List */}
                    {products.map((product: ProductType) => (
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
                        className="flex items-center gap-4 rounded-md hover:bg-gray-100 cursor-pointer w-full"
                      >
                        <Image
                          src={product.thumbnail || "/placeholder-image.jpg"}
                          className="h-10 w-10 rounded-md"
                          alt={product.name || "product"}
                          width={40}
                          height={40}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {product.name || "Unnamed Product"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              <BoxIcon className="mr-1 h-4 w-4" />{" "}
                              {product.quantity || 0}
                            </Badge>
                            <Badge variant="outline">
                              <BanknoteIcon className="mr-1 h-4 w-4" />{" "}
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
