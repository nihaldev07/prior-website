// Dynamic sitemap: static routes + all categories (slug URLs — matching the
// canonical form the category page enforces via 308 redirects). Products
// are intentionally excluded for now: categories are the crawl hubs, and
// the catalog is too large for a single unsharded file.
import type { MetadataRoute } from "next";
import { fetchCategories } from "@/services/categorySeoService";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await fetchCategories();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/faq",
    "/contact-us",
    "/deals",
    "/collections",
    "/privacy-policy",
    "/terms-conditions",
    "/return-policy",
    "/shipping",
    "/store-location",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.active !== false)
    .map((c) => ({
      url: `${SITE_URL}/category/${c.slug || c.id}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...categoryRoutes];
}
