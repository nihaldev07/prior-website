// Sitewide Organization + WebSite schema, rendered once in the root layout.
import JsonLd from "./JsonLd";
import { SITE_URL } from "@/lib/seo";

export default function SiteSeoSchema() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Prior",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.ico`,
        description:
          "Women's shoes, bags and fashion accessories in Bangladesh. BDT pricing, nationwide delivery, 7-day returns.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+8801700534317",
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["en", "bn"],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Prior",
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  return <JsonLd data={graph} />;
}
