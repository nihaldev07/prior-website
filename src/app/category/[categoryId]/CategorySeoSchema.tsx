// JSON-LD for the category page: BreadcrumbList + CollectionPage with an
// ItemList of the top products (each with Product + Offer). One @graph so
// entities reference each other and the sitewide Organization/WebSite nodes.
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl, buildBreadcrumbChain, stripHtml } from "@/lib/seo";
import type { Category, CategorySeoType, ProductType } from "@/data/types";

interface CategorySeoSchemaProps {
  seo: CategorySeoType;
  categories: Category[];
  products: ProductType[];
  totalProducts: number;
}

export default function CategorySeoSchema({
  seo,
  categories,
  products,
  totalProducts,
}: CategorySeoSchemaProps) {
  const url = `${SITE_URL}/category/${seo.slug}`;
  const chain = buildBreadcrumbChain(
    { id: seo.id, name: seo.name, parentId: undefined, slug: seo.slug },
    categories,
  );

  const description =
    seo.metaDescription || seo.shortDescription || stripHtml(seo.description).slice(0, 300);

  const itemListElement = products.map((p, i) => {
    const product = p as any;
    const productUrl = `${SITE_URL}/collections/${product.slug || product.id}`;
    const price = product.hasDiscount ? product.updatedPrice : product.unitPrice;
    return {
      "@type": "ListItem",
      position: i + 1,
      url: productUrl,
      name: product.name,
      item: {
        "@type": "Product",
        name: product.name,
        image: product.thumbnail ? [absoluteUrl(product.thumbnail)] : undefined,
        url: productUrl,
        category: seo.name,
        offers: {
          "@type": "Offer",
          price: price != null ? String(price) : undefined,
          priceCurrency: "BDT",
          availability:
            product.quantity > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: productUrl,
        },
      },
    };
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          ...chain.map((c, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: c.name,
            item: `${SITE_URL}/category/${c.slugOrId}`,
          })),
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name: seo.name,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        provider: { "@id": `${SITE_URL}/#organization` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: totalProducts,
          itemListElement,
        },
      },
    ],
  };

  return <JsonLd data={graph} />;
}
