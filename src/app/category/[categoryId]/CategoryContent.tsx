// Server-rendered SEO content for the category page: breadcrumb, the only
// h1, product count and the from-price line. Everything here ships in the
// raw HTML — that's the SEO/AEO/GEO foundation.
// Visuals: an elegant image banner (category image, or a collage of the
// category's first product thumbnails — seo.img is usually unset) with the
// title overlaid as real, selectable text. The supporting copy (GEO
// sentence, short description) lives in the description section at the
// bottom of the page.
import Image from "next/image";
import Breadcrumb from "@/components/seo/Breadcrumb";
import { absoluteUrl, buildBreadcrumbChain, minPrice } from "@/lib/seo";
import type { Category, CategorySeoType, ProductType } from "@/data/types";

interface CategoryContentProps {
  seo: CategorySeoType;
  categories: Category[];
  products: ProductType[];
  totalProducts: number;
}

const COLLAGE_SLOTS = 4;

/** Distinct product thumbnails for the collage (up to 4). */
function collageImages(products: ProductType[]): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const thumb = (p as any).thumbnail as string | undefined;
    if (!thumb) continue;
    const key = absoluteUrl(thumb);
    if (seen.has(key)) continue;
    seen.add(key);
    urls.push(thumb);
    if (urls.length >= COLLAGE_SLOTS) break;
  }
  return urls;
}

export default function CategoryContent({
  seo,
  categories,
  products,
  totalProducts,
}: CategoryContentProps) {
  // CategorySeoType has no parentId, but the flat Category list does — look
  // the category up there so the chain includes its real parent categories.
  const listed = categories.find((c) => c.id === seo.id);
  const chain = buildBreadcrumbChain(
    {
      id: seo.id,
      name: seo.name,
      slug: seo.slug,
      parentId: listed?.parentId,
    },
    categories,
  );
  const from = minPrice(products);

  const bannerSrc = seo.img || null;
  const collage = bannerSrc ? [] : collageImages(products);
  const hasBanner = !!bannerSrc || collage.length > 0;

  const countLine =
    totalProducts > 0
      ? `${totalProducts} ${totalProducts === 1 ? "Product" : "Products"}`
      : "";
  const fromLine = from !== null ? `From ৳${Math.ceil(from)}` : "";
  const metaLine = [countLine, fromLine].filter(Boolean).join(" · ");

  return (
    <header>
      {hasBanner ? (
        /* ---------- Elegant image banner ---------- */
        <div className='relative overflow-hidden bg-neutral-900 h-[240px] sm:h-[300px] md:h-[380px]'>
          {/* Background: category image, else product collage */}
          {bannerSrc ? (
            <Image
              src={bannerSrc}
              alt=''
              fill
              priority
              quality={85}
              sizes='100vw'
              className='object-cover object-center scale-105'
            />
          ) : (
            <div className='absolute inset-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
              {collage.map((src, i) => (
                <div
                  key={src}
                  className={`relative ${i > 0 && i < 2 ? "hidden sm:block" : ""} ${i >= 2 ? "hidden md:block" : ""}`}>
                  <Image
                    src={src}
                    alt=''
                    fill
                    priority={i === 0}
                    quality={80}
                    sizes={i === 0 ? "100vw" : "(max-width: 640px) 0vw, (max-width: 768px) 50vw, 25vw"}
                    className='object-cover object-center'
                  />
                </div>
              ))}
            </div>
          )}

          {/* Neutral scrim for text legibility */}
          <div className='absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/45 to-neutral-900/25' />

          {/* Overlaid content — real text, fully indexable */}
          <div className='absolute inset-0 px-4 md:container flex flex-col justify-end pb-7 sm:pb-9 md:pb-12'>
            <Breadcrumb items={chain} variant='onDark' />
            <h1 className='mt-3 md:mt-4 text-[28px] leading-tight sm:text-4xl md:text-5xl lg:text-6xl sm:leading-[1.1] font-serif tracking-wide text-white [text-shadow:0_1px_24px_rgba(0,0,0,0.35)]'>
              {seo.name}
            </h1>
            <div className='mt-4 md:mt-5 h-px w-16 bg-white/60' />
            {metaLine && (
              <p className='mt-3 md:mt-4 text-[11px] md:text-xs font-serif tracking-[0.2em] uppercase text-white/80'>
                {metaLine}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* ---------- Minimal fallback: no image, no products ---------- */
        <div className='bg-neutral-50 border-b border-neutral-200'>
          <div className='px-4 md:container pt-6 pb-8 md:pt-8 md:pb-10'>
            <Breadcrumb items={chain} />
            <h1 className='mt-4 text-3xl md:text-4xl font-serif tracking-wide text-neutral-900 leading-tight'>
              {seo.name}
            </h1>
            <div className='mt-4 h-px w-16 bg-neutral-300' />
            {metaLine && (
              <p className='mt-4 text-xs font-serif tracking-[0.2em] uppercase text-neutral-500'>
                {metaLine}
              </p>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
