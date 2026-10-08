import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/data/site.mjs';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  // Keep the small page styles available even when a CSS request is blocked.
  build: { inlineStylesheets: "always" },
});
