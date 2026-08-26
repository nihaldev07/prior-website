// Server-side fetchers for category SEO data. Native fetch with Next data
// cache (revalidate aligned to the backend Redis cache TTL of 900s) and
// null/empty fallbacks so a slow or down backend degrades gracefully
// instead of 502-ing the page.
import { config } from "@/lib/config";
import type { Category, CategorySeoType, ProductType } from "@/data/types";

const CATEGORY_CACHE = 900; // matches backend CACHE_TTL.CATEGORIES

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
 * Fetch category SEO content by id or slug.
 * Returns null on failure (unknown category, backend down, timeout).
 */
export async function fetchCategorySeo(
  identifier: string,
): Promise<CategorySeoType | null> {
  const json = await fetchJson(
    config.product.getCategorySeo(encodeURIComponent(identifier)),
    CATEGORY_CACHE,
  );
  if (!json || json.success !== true || !json.data?.id) return null;
  return json.data as CategorySeoType;
}

/**
 * Fetch the flat category list (for breadcrumbs, sitemap, llms.txt).
 * Returns [] on failure.
 */
export async function fetchCategories(): Promise<Category[]> {
  const json = await fetchJson(config.product.getCategories(), CATEGORY_CACHE);
  if (!json) return [];
  // The endpoint's success shape has been observed both wrapped and raw —
  // handle both defensively.
  const list = Array.isArray(json) ? json : (json.data ?? json.categories);
  return Array.isArray(list) ? list : [];
}

export type CategoryProductsResult = {
  products: ProductType[];
  totalProducts: number;
};

/**
 * Fetch the first page of products for the category (used for ItemList
 * JSON-LD and the GEO answer-first sentence — NOT for the visible grid,
 * which keeps its own client-side pagination).
 */
export async function fetchCategoryProducts(
  categoryId: string,
  limit = 12,
): Promise<CategoryProductsResult> {
  const params = new URLSearchParams({
    page: "1",
    limit: String(limit),
    categoryId,
    includeSubcategories: "true",
  });
  const json = await fetchJson(`${config.product.getProducts()}?${params}`, 900);
  const products = Array.isArray(json?.products) ? json.products : [];
  return {
    products,
    totalProducts:
      typeof json?.totalProducts === "number" ? json.totalProducts : products.length,
  };
}
