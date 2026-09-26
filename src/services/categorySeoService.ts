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
  totalPages: number;
};

/**
 * Fetch one page of products for the category. This is the SAME list the
 * visible grid renders (params match the old client fetch exactly: no
 * includeSubcategories), so the server HTML and the shopper see identical
 * results. Used for the grid, ItemList JSON-LD and the GEO sentence.
 */
export async function fetchCategoryProducts(
  categoryId: string,
  opts: { page?: number; limit?: number } = {},
): Promise<CategoryProductsResult> {
  const page = Math.max(1, Math.trunc(opts.page ?? 1));
  const limit = Math.max(1, Math.trunc(opts.limit ?? 20));
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    categoryId,
  });
  const json = await fetchJson(`${config.product.getProducts()}?${params}`, 900);
  const products = Array.isArray(json?.products) ? json.products : [];
  const totalProducts =
    typeof json?.totalProducts === "number" ? json.totalProducts : products.length;
  return {
    products,
    totalProducts,
    // A backend outage (null json) must yield a renderable empty state, not
    // a bogus 404 for page 1 — hence the floor of 1.
    totalPages: Math.max(1, Math.ceil(totalProducts / limit)),
  };
}

/**
 * Fetch the color/size facet values for the category filter sheet.
 * Returns empty lists on failure (the sheet simply renders no options).
 */
export async function fetchCategoryFacets(
  categoryId: string,
): Promise<{ sizes: string[]; colors: string[] }> {
  const json = await fetchJson(
    `${config.product.getFilterData()}?categoryId=${encodeURIComponent(categoryId)}`,
    CATEGORY_CACHE,
  );
  const asList = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((i): i is string => typeof i === "string" && i !== "") : [];
  return {
    sizes: asList(json?.sizes),
    colors: asList(json?.colors),
  };
}
