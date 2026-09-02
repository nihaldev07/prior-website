"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Info, X } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

interface CategoryDescriptionPanelProps {
  name: string;
  description: string;
  img?: string;
}

function DescriptionBody({
  name,
  description,
  img,
}: {
  name: string;
  description: string;
  img?: string;
}) {
  return (
    <>
      {img && (
        <div className='relative h-52 w-full overflow-hidden rounded-2xl'>
          <img
            src={absoluteUrl(img)}
            alt={name}
            className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent' />
        </div>
      )}

      <div className={`${img ? "-mt-12" : "pt-2"} relative`}>
        <div className='flex items-center gap-2 mb-1'>
          <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-500 ring-1 ring-inset ring-blue-100'>
            Category
          </span>
        </div>

        <h3 className='text-xl font-bold text-gray-900 tracking-tight leading-snug mb-4'>
          {name}
        </h3>

        <div className='h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-5' />

        <div className='max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto pr-1 '>
          <div
            className='[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose prose-sm max-w-none text-gray-600 leading-relaxed
              [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-5 [&_h3]:mb-1.5
              [&_p]:mb-3 [&_p]:leading-[1.7]
              [&_ul]:space-y-1.5 [&_ul]:my-3 [&_ul]:pl-5 [&_ul]:list-disc
              [&_ol]:space-y-1.5 [&_ol]:my-3 [&_ol]:pl-5 [&_ol]:list-decimal
              [&_li]:text-gray-600
              [&_strong]:text-gray-800 [&_strong]:font-semibold
              [&_em]:text-gray-500
              [&_a]:text-rose-500 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-rose-200 hover:[&_a]:decoration-rose-400
              [&_blockquote]:border-l-2 [&_blockquote]:border-rose-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
              [&_img]:rounded-xl [&_img]:my-4 [&_img]:shadow-sm
              [&_hr]:my-6 [&_hr]:border-gray-100'
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>
    </>
  );
}

export default function CategoryDescriptionPanel({
  name,
  description,
  img,
}: CategoryDescriptionPanelProps) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!description) return null;

  const trigger = (
    <button
      type='button'
      aria-label={`About ${name}`}
      className='group relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-500 transition-all duration-200 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2'>
      <Info className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
    </button>
  );

  // Desktop: Sheet from right
  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent className='w-full sm:max-w-xl p-0 overflow-hidden border-l border-gray-100'>
          <div className='px-7 py-7'>
            <SheetHeader className='text-left mb-0 p-0'>
              <SheetTitle className='sr-only'>About {name}</SheetTitle>
              <SheetDescription className='sr-only'>
                Detailed information about the {name} category
              </SheetDescription>
            </SheetHeader>
            <DescriptionBody name={name} description={description} img={img} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Mobile: Drawer from bottom
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className='max-h-[85vh] px-5 pb-6'>
        <div className='mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300' />
        <DrawerHeader className='px-0 pt-3 pb-0'>
          <DrawerTitle className='sr-only'>About {name}</DrawerTitle>
          <DrawerDescription className='sr-only'>
            Detailed information about the {name} category
          </DrawerDescription>
        </DrawerHeader>
        <div className='overflow-y-auto max-h-[75vh] custom-scrollbar -mx-1 px-1'>
          <DescriptionBody name={name} description={description} img={img} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
