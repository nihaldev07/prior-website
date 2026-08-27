// Server-side fetcher for product SEO data. Native fetch with Next data
// cache (revalidate aligned to the backend Redis cache TTL of 300s) and
// null/empty fallbacks so a slow or down backend degrades gracefully
// instead of 502-ing the page.
import { config } from "@/lib/config";
import type { ProductSeoType } from "@/data/types";

const PRODUCT_SEO_CACHE = 300; // matches backend CACHE_TTL.PRODUCT_DETAIL

async function fetchJson(url: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch product SEO content by id or slug.
 * Returns null on failure (unknown product, backend down, timeout).
 */
export async function fetchProductSeo(
  identifier: string,
): Promise<ProductSeoType | null> {
  const json = await fetchJson(
    config.product.getProductSeo(encodeURIComponent(identifier)),
    PRODUCT_SEO_CACHE,
  );
  if (!json || json.success !== true || !json.data?.id) return null;
  return json.data as ProductSeoType;
}
