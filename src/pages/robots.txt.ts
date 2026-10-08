import type { APIRoute } from "astro";
import { IS_PREVIEW, SITE_URL } from "../data/site.mjs";

export const GET: APIRoute = () => new Response(
  [
    "User-agent: *",
    "Allow: /",
    "",
    ...(!IS_PREVIEW ? [`Sitemap: ${SITE_URL}/sitemap.xml`, ""] : []),
  ].join("\n"),
  { headers: { "Content-Type": "text/plain; charset=utf-8" } },
);
