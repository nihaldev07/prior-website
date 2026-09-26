"use client";
// Visual-only clamp for the below-grid category description. The full HTML
// stays in the DOM at all times (crawlers read everything) — this just
// caps the visible height with a fade and a Read more / Show less toggle.
// Height is tracked with a ResizeObserver because the content changes
// after mount (RichText swaps to the Tiptap renderer) and images inside
// load late — measuring once on mount gets it wrong.
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_HEIGHT = 380;

export default function CategoryDescriptionClamp({
  children,
}: {
  children: React.ReactNode;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => {
      setNeedsClamp(el.scrollHeight > MAX_HEIGHT + 40);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className='relative'>
        <div
          ref={innerRef}
          className={expanded ? "" : "overflow-hidden"}
          style={{ maxHeight: expanded ? "none" : `${MAX_HEIGHT}px` }}>
          {children}
        </div>
        {!expanded && needsClamp && (
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-white via-white/80 to-transparent' />
        )}
      </div>
      {needsClamp && (
        <div className='mt-5 flex justify-center'>
          <Button
            variant='outline'
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className='rounded-none border-neutral-300 bg-white px-6 md:px-8 text-xs font-serif tracking-[0.15em] uppercase text-neutral-900 hover:text-white hover:bg-neutral-900 hover:border-neutral-900 transition-colors duration-300'>
            {expanded ? (
              <>
                Show less <ChevronUp className='w-4 h-4' />
              </>
            ) : (
              <>
                Read more <ChevronDown className='w-4 h-4' />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
