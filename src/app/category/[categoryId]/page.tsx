// Category page — Server Component with full SEO/AEO/GEO:
// - generateMetadata from the category's stored SEO content
//   (GET /prior/product/category-seo/:identifier, Redis-cached 15min)
// - id URLs 308-redirect to canonical slug URLs
// - real 404s for unknown/inactive categories
// - server-rendered h1, breadcrumb, rich description, JSON-LD
// - ISR revalidate aligned with the backend cache TTL
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  fetchCategorySeo,
  fetchCategories,
  fetchCategoryProducts,
} from "@/services/categorySeoService";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import CategoryContent from "./CategoryContent";
import CategoryClient from "./CategoryClient";
import CategorySeoSchema from "./CategorySeoSchema";

export const revalidate = 900; // matches backend CACHE_TTL.CATEGORIES

type Props = {
  params: { categoryId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await fetchCategorySeo(params.categoryId);
  if (!seo) {
    return { title: "Category", robots: { index: false } };
  }
  const canonical = `${SITE_URL}/category/${seo.slug}`;
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

export default async function CategoryPage({ params }: Props) {
  const seo = await fetchCategorySeo(params.categoryId);
  if (!seo) notFound();

  // Canonical URL discipline: id URLs 308-redirect to slug URLs so every
  // canonical, JSON-LD id, and internal link agrees on one form.
  if (seo.slug && seo.slug !== params.categoryId) {
    redirect(`/category/${seo.slug}`);
  }

  // The category-seo fetch above is deduped by the Next data cache (same
  // URL + revalidate as generateMetadata's call).
  const [categories, productsResult] = await Promise.all([
    fetchCategories(),
    fetchCategoryProducts(seo.id, 12),
  ]);

  return (
    <>
      <CategorySeoSchema
        seo={seo}
        categories={categories}
        products={productsResult.products}
        totalProducts={productsResult.totalProducts}
      />
      <CategoryContent
        seo={seo}
        categories={categories}
        products={productsResult.products}
        totalProducts={productsResult.totalProducts}
      />
      <CategoryClient categoryId={seo.id} />
    </>
  );
}
