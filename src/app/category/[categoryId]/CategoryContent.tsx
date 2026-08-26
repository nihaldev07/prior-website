// Server-rendered SEO content for the category page: breadcrumb, the only
// h1, short description, GEO answer-first sentence, and the rich TipTap
// description (via the hybrid RichText). Everything here ships in the raw
// HTML — that's the SEO/AEO/GEO foundation.
import Link from "next/link";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { buildBreadcrumbChain } from "@/lib/seo";
import type { Category, CategorySeoType, ProductType } from "@/data/types";
import CategoryInfoDialog from "./CategoryInfoDialog";

interface CategoryContentProps {
  seo: CategorySeoType;
  categories: Category[];
  products: ProductType[];
  totalProducts: number;
}

function minPrice(products: ProductType[]): number | null {
  let min: number | null = null;
  for (const p of products) {
    const price = (p as any).hasDiscount
      ? (p as any).updatedPrice
      : (p as any).unitPrice;
    if (
      typeof price === "number" &&
      price > 0 &&
      (min === null || price < min)
    ) {
      min = price;
    }
  }
  return min;
}

export default function CategoryContent({
  seo,
  categories,
  products,
  totalProducts,
}: CategoryContentProps) {
  const chain = buildBreadcrumbChain(
    { id: seo.id, name: seo.name, parentId: undefined, slug: seo.slug },
    categories,
  );
  const from = minPrice(products);

  return (
    <div className='bg-gradient-to-br from-blue-50 via-purple-50/50 to-white border-b border-blue-100/60'>
      <div className='px-4 md:container py-8 md:py-12'>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <nav aria-label='Breadcrumb'>
            <ol className='flex flex-wrap items-center gap-1.5 text-[13px] text-blue-300'>
              <li className='flex items-center'>
                <Link
                  href='/'
                  className='transition-colors hover:text-blue-500'>
                  Home
                </Link>
              </li>
              {chain.map((item, i) => {
                const isLast = i === chain.length - 1;
                return (
                  <li key={item.slugOrId} className='flex items-center gap-1.5'>
                    <span className='text-blue-200'>/</span>
                    {isLast ? (
                      <span
                        aria-current='page'
                        className='font-medium text-gray-800'>
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        href={`/category/${item.slugOrId}`}
                        className='transition-colors hover:text-blue-500'>
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Title + Info button */}
        <div className='flex items-start gap-3 mb-2'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight'>
            {seo.name}
          </h1>
          {seo.description && (
            <CategoryInfoDialog
              name={seo.name}
              description={seo.description}
              img={seo.img}
            />
          )}
        </div>

        {/* Decorative blue underline */}
        <div className='w-16 h-1 bg-gradient-to-r from-blue-400 to-sky-300 rounded-full mb-5' />

        {/* GEO answer-first sentence */}
        <p className='text-[15px] text-gray-600 leading-relaxed max-w-2xl mb-3 hidden'>
          {`${seo.name} at Prior${totalProducts > 0 ? ` \u2014 ${totalProducts} products to shop` : ""}${from !== null ? `, prices from \u09F3${Math.ceil(from)}` : ""}. Delivery across Bangladesh with cash on delivery. Shop online or in-store at Prior.`}
        </p>

        {/* Short description */}
        {seo.shortDescription && (
          <p className='text-sm text-gray-500 leading-relaxed max-w-[80%] mb-5 italic'>
            {seo.shortDescription}
          </p>
        )}

        {/* Shop CTA */}
        <Link
          href='#body'
          className='inline-flex items-center gap-2 text-sm font-semibold text-blue-500 transition-colors hover:text-blue-700'>
          Shop all {seo.name}
          <span className='text-blue-300'>&darr;</span>
        </Link>
      </div>
    </div>
  );
}
