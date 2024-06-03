"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import useSearchProduct from "@/hooks/useProductSearch";
import { ProductType } from "@/data/types";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { BanknoteIcon, BoxIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
  const router = useRouter();
  const { products, inputValue, setInputValue } = useSearchProduct();
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
      <p
        className='hidden sm:flex text-sm text-muted-foreground px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 justify-center items-center'
        onClick={() => setOpen(!open)}>
        <SearchIcon className=' size-4 text-gray-950  mr-1' /> Search{" "}
        <kbd className='pointer-events-none hidden sm:inline-flex h-5 ml-1 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </p>
      <SearchIcon
        onClick={() => setOpen(!open)}
        className=' size-6 text-primary  mr-1 sm:hidden'
      />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Type a command or search...'
          value={inputValue}
          onValueChange={(query) => setInputValue(query)}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandSeparator />
          <CommandGroup heading='Products'>
            {!!products &&
              products?.map((product: ProductType) => (
                <CommandItem
                  key={product?.id}
                  onSelect={(val) => {
                    setOpen(false);
                    router.push(`/products/${product?.id}`);
                  }}>
                  <Image
                    src={product?.thumbnail || ""}
                    className='mr-2 h-4 w-4'
                    alt='product'
                    width={32}
                    height={32}
                  />
                  <span>{product?.name}</span>
                  <CommandShortcut>
                    <Badge variant={"outline"}>
                      {" "}
                      <BoxIcon className=' size-2 mr-1' /> {product?.quantity}
                    </Badge>
                    <div className='inline h-4 w-[1px] bg-primary mx-1' />
                    <Badge variant={"outline"}>
                      {" "}
                      <BanknoteIcon className=' size-2 mr-1' />{" "}
                      {product?.unitPrice}
                    </Badge>
                  </CommandShortcut>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
