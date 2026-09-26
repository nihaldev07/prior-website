// Category page — Server Component with full SEO/AEO/GEO:
// - generateMetadata from the category's stored SEO content
//   (GET /prior/product/category-seo/:identifier, Redis-cached 15min)
// - id URLs permanent-redirect (308) to canonical slug URLs
// - real 404s for unknown/inactive categories and out-of-range ?page=
//   (validated in generateMetadata — see resolveCategoryPage)
// - server-rendered h1, breadcrumb, product GRID (crawlable <a> links),
//   rich description and JSON-LD — the shopper grid is not client-fetched
// - ?page=N pagination: self-canonical per page, crawlable <Link> pages
// - ISR revalidate aligned with the backend cache TTL (data cache still
//   applies; reading searchParams only disables the full-route cache)
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import {
  fetchCategorySeo,
  fetchCategories,
  fetchCategoryFacets,
  fetchCategoryProducts,
} from "@/services/categorySeoService";
import { SITE_URL, absoluteUrl, buildGeoAnswerSentence } from "@/lib/seo";
import { adaptProductsToNewFormat } from "@/lib/adapters/productAdapter";
import type { CategorySeoType } from "@/data/types";
import Pagination from "@/components/new-ui/Pagination";
import CategoryContent from "./CategoryContent";
import CategoryProductBrowser from "./CategoryProductBrowser";
import CategoryDescription from "./CategoryDescription";
import CategorySeoSchema from "./CategorySeoSchema";

export const revalidate = 900; // matches backend CACHE_TTL.CATEGORIES

const PAGE_SIZE = 20;

type Props = {
  params: { categoryId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const page = Math.trunc(Number(value));
  // Junk/absent ?page= normalizes to page 1 instead of 404-ing — avoids a
  // canonical-URL explosion for crawler noise.
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function canonicalFor(slug: string, page: number): string {
  return page > 1 ? `${SITE_URL}/category/${slug}?page=${page}` : `${SITE_URL}/category/${slug}`;
}

/**
 * Resolve + validate everything the page needs: category existence, the
 * id→slug 308, and the ?page= range. Runs in BOTH generateMetadata and the
 * page body (all fetches are deduped by the Next data cache) — doing it in
 * generateMetadata matters because notFound()/permanentRedirect() thrown
 * from the page body land AFTER loading.tsx has streamed the response and
 * therefore ship as HTTP 200 soft-404s; metadata resolves before the first
 * flush, so these come out as real 404/308 statuses.
 */
async function resolveCategoryPage(params: Props["params"], searchParams: Props["searchParams"]) {
  const seo = await fetchCategorySeo(params.categoryId);
  if (!seo) notFound();

  // Canonical URL discipline: id URLs 308-redirect to slug URLs so every
  // canonical, JSON-LD id, and internal link agrees on one form.
  if (seo.slug && seo.slug !== params.categoryId) {
    permanentRedirect(`/category/${seo.slug}`);
  }

  const page = parsePage(searchParams?.page);
  const productsResult = await fetchCategoryProducts(seo.id, { page, limit: PAGE_SIZE });

  // Out-of-range pages are real 404s (page 1 always renders, even empty).
  if (page > 1 && productsResult.totalProducts > 0 && page > productsResult.totalPages) {
    notFound();
  }

  return { seo, page, productsResult };
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { seo, page } = await resolveCategoryPage(params, searchParams);
  const canonical = canonicalFor(seo.slug, page);
  const title = seo.seoTitle || `${seo.name} | Prior`;
  const description = seo.metaDescription || seo.shortDescription || undefined;

  return {
    title: seo.seoTitle || seo.name,
    description,
    keywords: [...(seo.tags || []), seo.focusKeyphrase].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Prior",
      type: "website",
      images: seo.img
        ? [{ url: absoluteUrl(seo.img), alt: seo.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo.img ? [absoluteUrl(seo.img)] : undefined,
    },
  };
}

/** Skeleton mirroring the toolbar + grid, shown while the section streams. */
function BrowserSkeleton() {
  return (
    <section className='my-6 md:my-8' aria-hidden='true'>
      <div className='border-b border-neutral-200'>
        <div className='px-4 md:container flex items-center justify-between py-4'>
          <div className='h-3 w-40 bg-neutral-100 animate-pulse rounded-none' />
          <div className='flex items-center gap-3'>
            <div className='h-10 w-28 bg-neutral-100 animate-pulse rounded-none' />
            <div className='h-10 w-52 bg-neutral-100 animate-pulse rounded-none' />
          </div>
        </div>
      </div>
      <div className='px-4 md:container'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='aspect-square bg-neutral-100 animate-pulse rounded-none' />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The interactive grid section. Kept as a separate async server component
 * so its facets fetch can stream behind a Suspense boundary — the banner
 * renders as soon as the SEO/product fetches resolve, without reintroducing
 * a loading.tsx (which would turn 404/308 responses into soft 200s).
 */
async function CategoryBrowserSection({
  seo,
  page,
  productsResult,
  products,
}: {
  seo: CategorySeoType;
  page: number;
  productsResult: Awaited<ReturnType<typeof fetchCategoryProducts>>;
  products: ReturnType<typeof adaptProductsToNewFormat>;
}) {
  const facets = await fetchCategoryFacets(seo.id);
  return (
    <CategoryProductBrowser
      categoryId={seo.id}
      products={products}
      totalProducts={productsResult.totalProducts}
      currentPage={page}
      facets={facets}
    >
      <Pagination
        currentPage={page}
        totalPages={productsResult.totalPages}
        basePath={`/category/${seo.slug}`}
      />
    </CategoryProductBrowser>
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { seo, page, productsResult } = await resolveCategoryPage(params, searchParams);

  // Deduped by the Next data cache (same URL + revalidate as the
  // generateMetadata call).
  const categories = await fetchCategories();

  // Adapt to the plain-JSON card shape on the server: ProductType carries
  // non-serializable timestamps, and ProductCard consumes `Product`.
  const products = adaptProductsToNewFormat(productsResult.products);

  return (
    <>
      <CategorySeoSchema
        seo={seo}
        categories={categories}
        products={productsResult.products}
        totalProducts={productsResult.totalProducts}
        page={page}
      />
      <CategoryContent
        seo={seo}
        categories={categories}
        products={productsResult.products}
        totalProducts={productsResult.totalProducts}
      />
      <Suspense fallback={<BrowserSkeleton />}>
        <CategoryBrowserSection
          seo={seo}
          page={page}
          productsResult={productsResult}
          products={products}
        />
      </Suspense>
      <CategoryDescription
        name={seo.name}
        description={seo.description}
        shortDescription={seo.shortDescription}
        geoSentence={buildGeoAnswerSentence(seo.name, productsResult.totalProducts, productsResult.products)}
      />
    </>
  );
}
