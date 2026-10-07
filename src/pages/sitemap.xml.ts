import type { APIRoute } from "astro";
import { posts } from "../data/posts";
import { SITE_URL } from "../data/seo";

const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/posts/`,
  ...posts.map((post) => `${SITE_URL}${post.href}`),
];

export const GET: APIRoute = () => {
  const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
