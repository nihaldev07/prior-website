// Product detail page — Server Component with SEO metadata + JSON-LD:
// - generateMetadata from the product's stored SEO content
//   (GET /prior/product/seo/:identifier, Redis-cached 5 min)
// - id URLs 308-redirect to canonical slug URLs
// - real 404s for unknown/inactive products
// - JSON-LD Product + Offer + BreadcrumbList
// - ISR revalidate aligned with backend cache TTL
// Client-side fetch of /prior/product/by/:id preserves real-time stock
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { fetchProductSeo } from "@/services/productSeoService";
import { SITE_URL, absoluteUrl, stripHtml } from "@/lib/seo";
import ProductPageClient from "./ProductPageClient";
import ProductSeoSchema from "./ProductSeoSchema";

export const revalidate = 300; // matches backend CACHE_TTL.PRODUCT_DETAIL

type Props = {
  params: { collectionId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const seo = await fetchProductSeo(params.collectionId);
  if (!seo) {
    return { title: "Product", robots: { index: false } };
  }

  const slugOrId = seo.slug || params.collectionId;
  const canonical = `${SITE_URL}/collections/${slugOrId}`;
  const title = seo.seoTitle || `${seo.name}`;
  const description =
    seo.seoDescription ||
    seo.shortDescription ||
    stripHtml(seo.description).slice(0, 160) ||
    undefined;

  return {
    title,
    description,
    keywords: [...(seo.tags || []), seo.focusKeyphrase].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Prior",
      type: "website",
      images: seo.thumbnail
        ? [{ url: absoluteUrl(seo.thumbnail), alt: seo.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo.thumbnail ? [absoluteUrl(seo.thumbnail)] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const seo = await fetchProductSeo(params.collectionId);
  if (!seo) notFound(); // real 404 (was a 200 "No Product Found")

  // Canonical discipline: id URLs permanently redirect to slug URLs so every
  // canonical, JSON-LD id, and internal link agrees on one form.
  if (seo.slug && seo.slug !== params.collectionId) {
    permanentRedirect(`/collections/${seo.slug}`);
  }

  // The product-seo fetch above is deduped by the Next data cache (same
  // URL + revalidate as generateMetadata's call).
  return (
    <>
      <ProductSeoSchema seo={seo} />
      <ProductPageClient collectionId={params.collectionId} />
    </>
  );
}
