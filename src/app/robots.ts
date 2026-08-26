// robots.txt — public content fully crawlable, private paths blocked, and
// AI/answer-engine crawlers EXPLICITLY allowed (GEO/AEO: prevents a future
// blanket disallow from silently excluding ChatGPT/Claude/Perplexity).
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE = [
  "/api/",
  "/account/",
  "/checkout",
  "/cart",
  "/order/",
  "/payments/",
  "/login",
  "/register",
  "/reset-password",
  "/forgot-password",
  "/user-deletion",
];

// AI crawlers that power answer engines and AI search
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
