// llms.txt — the AEO/GEO discovery file for AI answer engines
// (ChatGPT, Claude, Perplexity, Google AI Overviews fetch /.well-known or
// /llms.txt to learn what a site offers). Markdown summary of the store,
// policies, and the full category catalog with product counts.
import { fetchCategories } from "@/services/categorySeoService";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export async function GET() {
  const categories = await fetchCategories();

  const body = `# Prior
> Women's shoes, bags and fashion accessories in Bangladesh. Prior — Your Priority in Fashion.
> BDT pricing, nationwide delivery across Bangladesh, cash on delivery, 7-day returns.
> Contact: +8801700534317, Dhanmondi 27, Genetic Plaza, Dhaka.

## Policies
- [FAQ](${SITE_URL}/faq): orders, payment, shipping, returns
- [Shipping](${SITE_URL}/shipping): delivery times and charges
- [Returns](${SITE_URL}/return-policy): 7-day return process
- [Privacy](${SITE_URL}/privacy-policy)
- [Terms](${SITE_URL}/terms-conditions)

## Categories
${categories
  .filter((c) => c.active !== false)
  .map((c) => `- [${c.name}](${SITE_URL}/category/${c.slug || c.id})${c.totalProducts ? `: ${c.totalProducts} products` : ""}`)
  .join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
