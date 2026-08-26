"use client";
// Hybrid rich-text block for server-rendered pages:
// - The server (parent) passes the SAME admin TipTap HTML to both layers.
// - SSR/no-JS layer: dangerouslySetInnerHTML with sanitizeLite — crawlers
//   and AI engines see the full content in the raw HTML.
// - After hydration the real TiptapRenderer (DOMPurify + embed support)
//   replaces it, so what the shopper sees matches the editor exactly.
// The two outputs are byte-identical for embed-free content (AI category
// descriptions are embed-free by construction), so there is no visual flip.
import { useEffect, useState } from "react";
import TiptapRenderer from "@/components/TiptapRenderer";
import { sanitizeLite } from "@/lib/seo";

interface RichTextProps {
  html: string;
  className?: string;
}

export default function RichText({ html, className = "" }: RichTextProps) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!html) return null;

  if (!hydrated) {
    return (
      <div
        className={`tiptap-content ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeLite(html) }}
      />
    );
  }
  return <TiptapRenderer content={html} className={className} />;
}
