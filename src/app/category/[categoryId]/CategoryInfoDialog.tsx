"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Info, X } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

interface CategoryInfoDialogProps {
  name: string;
  description: string;
  img?: string;
}

export default function CategoryInfoDialog({
  name,
  description,
  img,
}: CategoryInfoDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type='button'
          aria-label={`About ${name}`}
          className='group relative inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-500 transition-all duration-200 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2'>
          <Info className='h-4 w-4 transition-transform duration-200 group-hover:scale-110' />
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-xl p-0 overflow-hidden rounded-3xl border-0 bg-white shadow-2xl shadow-black/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.96] data-[state=open]:zoom-in-[0.96] data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 sm:data-[state=closed]:slide-out-to-bottom-2 sm:data-[state=open]:slide-in-from-bottom-2 duration-300'>
        {/* Custom close button — top-right pill style */}
        <button
          onClick={() => setOpen(false)}
          aria-label='Close'
          className='absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-400 backdrop-blur-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2'>
          <X className='h-4 w-4' />
        </button>

        {/* Hero image with layered gradient overlays */}
        {img && (
          <div className='relative h-56 w-full overflow-hidden'>
            <img
              src={absoluteUrl(img)}
              alt={name}
              className='h-full w-full object-cover transition-transform duration-500 hover:scale-105'
            />
            {/* Multi-layer gradient: bottom fade + top soft overlay for title readability */}
            <div className='absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent' />
          </div>
        )}

        {/* Content */}
        <div className={`${img ? "-mt-16" : "pt-6"} relative px-7 pb-7`}>
          {/* Title block */}
          <DialogHeader className='text-left mb-0'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-blue-500 ring-1 ring-inset ring-blue-100'>
                Category
              </span>
            </div>
            <DialogTitle className='text-2xl font-bold text-gray-900 tracking-tight leading-snug'>
              {name}
            </DialogTitle>
            <DialogDescription className='sr-only'>
              Detailed information about the {name} category
            </DialogDescription>
          </DialogHeader>

          {/* Separator */}
          <div className='my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent' />

          {/* Description body */}
          <div className='max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar'>
            {description ? (
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
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50'>
                  <Info className='h-5 w-5 text-rose-400' />
                </div>
                <p className='text-sm font-medium text-gray-500'>
                  No additional details available yet.
                </p>
                <p className='mt-1 text-xs text-gray-400'>
                  Check back soon for updates about this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
