// Numbered pagination for server-rendered listing pages. Every page is a
// real <Link> (?page=N) so crawlers can follow the full product catalogue
// without executing JS; page 1 links to the clean basePath so the canonical
// URL never carries ?page=1.
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

/**
 * Pure windowed pagination math: always keep 1 and the last page, the
 * current page ±1, and a single ellipsis per gap. Exported for tests.
 */
export function getPageItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  // Near the edges, widen the window so the numbering doesn't look truncated.
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((p) => pages.add(p));

  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const items: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push("…");
    items.push(p);
  });
  return items;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const itemClasses =
    "flex h-10 w-10 items-center justify-center border font-serif text-sm tracking-wide rounded-none";
  const idleClasses =
    "border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-900 transition-colors duration-300";

  const arrow = (dir: "prev" | "next") => {
    const page = dir === "prev" ? currentPage - 1 : currentPage + 1;
    const disabled = page < 1 || page > totalPages;
    const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
    if (disabled) {
      return (
        <span
          aria-disabled='true'
          className={`${itemClasses} border-transparent text-neutral-300 opacity-60 pointer-events-none select-none`}>
          <Icon className='w-4 h-4' />
        </span>
      );
    }
    return (
      <Link
        href={pageHref(basePath, page)}
        rel={dir === "prev" ? "prev" : "next"}
        aria-label={dir === "prev" ? "Previous page" : "Next page"}
        className={`${itemClasses} ${idleClasses}`}>
        <Icon className='w-4 h-4' />
      </Link>
    );
  };

  return (
    <nav
      aria-label='Pagination'
      className='mt-12 mb-4 flex flex-col items-center gap-3'>
      <p className='sr-only'>
        Page {currentPage} of {totalPages}
      </p>
      <ul className='flex flex-wrap items-center justify-center gap-1'>
        <li>{arrow("prev")}</li>
        {getPageItems(currentPage, totalPages).map((item, i) => (
          <li key={`${item}-${i}`}>
            {item === "…" ? (
              <span className='flex h-10 w-6 items-end justify-center pb-2 text-neutral-400 font-serif whitespace-nowrap'>
                &hellip;
              </span>
            ) : item === currentPage ? (
              <span
                aria-current='page'
                className={`${itemClasses} border-neutral-900 bg-neutral-900 text-white`}>
                {item}
              </span>
            ) : (
              <Link
                href={pageHref(basePath, item)}
                aria-label={`Page ${item}`}
                className={`${itemClasses} ${idleClasses}`}>
                {item}
              </Link>
            )}
          </li>
        ))}
        <li>{arrow("next")}</li>
      </ul>
      <span className='h-px w-16 bg-neutral-200' aria-hidden='true' />
    </nav>
  );
}
