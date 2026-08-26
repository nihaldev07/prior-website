// Visible breadcrumb (server component). Mirrors the BreadcrumbList JSON-LD
// emitted by CategorySeoSchema so crawlers and shoppers see the same chain.
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  items: { name: string; slugOrId: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label='Breadcrumb' className='text-[13px] text-gray-500'>
      <ol className='flex flex-wrap items-center gap-1'>
        <li className='flex items-center'>
          <Link
            href='/'
            className='hover:text-primary flex items-center gap-1'>
            <Home className='w-3.5 h-3.5' />
            <span className='sr-only'>Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.slugOrId} className='flex items-center gap-1'>
              <ChevronRight className='w-3.5 h-3.5 text-gray-400' />
              {isLast ? (
                <span aria-current='page' className='text-gray-900 font-medium'>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={`/category/${item.slugOrId}`}
                  className='hover:text-primary'>
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
