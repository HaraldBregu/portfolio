export const SITE_URL = "https://haraldbregu.com";
export const SITE_NAME = "Harald Bregu";

// Preview deployments should be crawlable so bots can read their noindex tags.
export const IS_PREVIEW = process.env.VERCEL_ENV === "preview";

/** @param {string} pathname */
export function canonicalUrl(pathname) {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return new URL(`${path || ""}/`, `${SITE_URL}/`).href;
}
