import type { APIRoute } from "astro";
import { posts } from "../data/posts";
import { canonicalUrl, IS_PREVIEW } from "../data/site.mjs";

const urls = [
  canonicalUrl("/"),
  canonicalUrl("/posts/"),
  ...posts.map((post) => canonicalUrl(post.href)),
];

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
})[character]!);

export const GET: APIRoute = () => {
  // Do not invent lastmod dates: add them only when content revisions are tracked.
  const entries = (IS_PREVIEW ? [] : [...new Set(urls)])
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
