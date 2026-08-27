// JSON-LD for the product detail page: BreadcrumbList + Product with Offer.
// One @graph so entities reference each other and the sitewide Organization/WebSite nodes.
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, absoluteUrl, stripHtml } from "@/lib/seo";
import type { ProductSeoType } from "@/data/types";

interface ProductSeoSchemaProps {
  seo: ProductSeoType;
}

export default function ProductSeoSchema({ seo }: ProductSeoSchemaProps) {
  const url = `${SITE_URL}/collections/${seo.slug || seo.id}`;
  const description = stripHtml(seo.description).slice(0, 300);

  // Build image array: thumbnail first, then additional images
  const images = [seo.thumbnail, ...(seo.images || [])]
    .filter(Boolean)
    .map(absoluteUrl);

  // Product offer pricing
  const price = seo.hasDiscount ? seo.updatedPrice : seo.unitPrice;

  // Breadcrumb: Home → Category → Product
  const breadcrumbItemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...(seo.categorySlug || seo.categoryId
      ? [
          {
            "@type": "ListItem",
            position: 2,
            name: seo.categoryName || "Category",
            item: seo.categorySlug
              ? `${SITE_URL}/category/${seo.categorySlug}`
              : undefined,
          },
        ]
      : []),
    {
      "@type": "ListItem",
      position: seo.categorySlug ? 3 : 2,
      name: seo.name,
      item: url,
    },
  ];

  const product: Record<string, any> = {
    "@type": "Product",
    "@id": url,
    name: seo.name,
    description,
    image: images,
    url,
    sku: seo.sku,
    ...(seo.brand
      ? { brand: { "@type": "Brand", name: seo.brand } }
      : undefined),
    offers: {
      "@type": "Offer",
      url,
      price: String(price),
      priceCurrency: "BDT",
      availability: seo.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
    },
  };

  // Add aggregateRating only when we have both rating and review count
  if (seo.rating && seo.rating > 0 && seo.reviewCount && seo.reviewCount > 0) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: String(seo.rating),
      reviewCount: String(seo.reviewCount),
      bestRating: "5",
      worstRating: "1",
    };
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: breadcrumbItemListElement,
      },
      product,
    ],
  };

  return <JsonLd data={graph} />;
}
