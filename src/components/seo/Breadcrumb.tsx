// Visible breadcrumb (server component). Mirrors the BreadcrumbList JSON-LD
// emitted by CategorySeoSchema so crawlers and shoppers see the same chain.
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { name: string; slugOrId: string }[];
  /** "onDark" retints the chain for use over image banners. */
  variant?: "default" | "onDark";
}

export default function Breadcrumb({ items, variant = "default" }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;
  const onDark = variant === "onDark";
  return (
    <nav
      aria-label='Breadcrumb'
      className={`text-[13px] ${onDark ? "text-white/70" : "text-gray-500"}`}>
      <ol className='flex flex-wrap items-center gap-1'>
        <li className='flex items-center'>
          <Link
            href='/'
            className={`flex items-center gap-1 ${onDark ? "hover:text-white transition-colors duration-200" : "hover:text-primary"}`}>
            <Home className='w-3.5 h-3.5' />
            <span className='sr-only'>Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.slugOrId} className='flex items-center gap-1'>
              <ChevronRight
                className={`w-3.5 h-3.5 ${onDark ? "text-white/40" : "text-gray-400"}`}
              />
              {isLast ? (
                <span
                  aria-current='page'
                  className={`font-medium ${onDark ? "text-white" : "text-gray-900"}`}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={`/category/${item.slugOrId}`}
                  className={onDark ? "hover:text-white transition-colors duration-200" : "hover:text-primary"}>
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
