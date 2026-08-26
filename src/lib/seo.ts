// SEO helpers shared by metadata, JSON-LD, sitemap, robots, llms.txt.
// Single source of truth for the canonical site origin.

// Env override supported, but the production origin is the stable default —
// keeps Vercel config empty and localhost dev working without setup.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://priorbd.com"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${SITE_URL}/${path.replace(/^\//, "")}`;
}

/** Strip HTML tags → plain text (for meta descriptions / llms.txt). */
export function stripHtml(html: string): string {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Walk parentId up the flat category list to build the breadcrumb chain
 * (root first, the category itself last). The /categories endpoint does not
 * return `ancestors`, so the chain is derived here.
 */
export function buildBreadcrumbChain(
  category: { id: string; name: string; parentId?: string | null; slug?: string },
  categories: { id: string; name: string; parentId?: string | null; slug?: string }[],
): { name: string; slugOrId: string }[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const chain: { name: string; slugOrId: string }[] = [];
  let current: { id: string; name: string; parentId?: string | null; slug?: string } | undefined = category;
  const guard = new Set<string>(); // cycle protection on bad data

  while (current && !guard.has(current.id)) {
    guard.add(current.id);
    chain.unshift({ name: current.name, slugOrId: current.slug || current.id });
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain;
}

// TipTap allow-list mirroring TiptapRenderer's DOMPurify config (minus
// class, plus table cells kept from its main branch). Content is
// admin-generated and pre-sanitized by the backend AI pipeline — this
// server-side pass is defense-in-depth for the no-JS/crawler HTML.
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "code", "pre", "h1", "h2", "h3",
  "ul", "ol", "li", "blockquote", "a", "img", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div", "figure", "figcaption",
]);

const KEEP_ATTRS = /^(href|src|alt|class|width|height|target|colspan|rowspan)$/i;

/**
 * Server-safe sanitizer producing HTML IDENTICAL to TiptapRenderer's
 * DOMPurify output for embed-free content (the AI category descriptions are
 * embed-free by construction). The client upgrades to the real
 * TiptapRenderer on hydration — same visual result, plus embed support.
 */
export function sanitizeLite(html: string): string {
  if (!html) return "";
  let text = html;
  // Remove dangerous blocks entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  text = text.replace(/<object[\s\S]*?<\/object>/gi, "");
  text = text.replace(/<embed[\s\S]*?>/gi, "");
  text = text.replace(/<!--[\s\S]*?-->/g, "");
  // Remove inline event handlers and javascript: URLs
  text = text.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  text = text.replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
  // Tokenize tags: drop disallowed tags (keep inner text), strip attrs
  // outside the keep-list
  text = text.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)?(\/?)>/g,
    (match, tagName: string, attrs: string = "", selfClose: string = "") => {
      const tag = tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (match.startsWith("</")) return `</${tag}>`;
      const keptAttrs: string[] = [];
      const attrRe = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
      let m: RegExpExecArray | null;
      while ((m = attrRe.exec(attrs)) !== null) {
        if (KEEP_ATTRS.test(m[1])) keptAttrs.push(`${m[1]}="${m[3] ?? m[4] ?? ""}"`);
      }
      return `<${tag}${keptAttrs.length ? " " + keptAttrs.join(" ") : ""}${selfClose ? " /" : ""}>`;
    },
  );
  return text.trim();
}
