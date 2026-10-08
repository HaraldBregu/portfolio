# Portfolio

Personal portfolio for Harald Bregu, built with Astro.

## Overview

This site presents profile information, skills, professional activities, projects, services, posts, and contact links in a compact terminal-inspired layout.

## Tech

- Astro
- JetBrains Mono via Google Fonts
- Plain CSS and a small inline script for theme switching

## Local Development

Use Node.js `>=22.12.0`. The project is also configured with `.nvmrc`,
`.node-version`, and `package.json` engines so Vercel does not build it with
Node 20.

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## SEO and crawler configuration

`src/data/site.mjs` is the source of truth for the production origin. The layout
derives each canonical URL from its route, without query strings, and emits
Open Graph, Twitter, and JSON-LD metadata. Astro and Vercel both use trailing
slashes for page URLs; crawler files and other assets keep their extensions.

`/robots.txt` and `/sitemap.xml` are generated during the build. The sitemap
includes the homepage, writing index, and posts in `src/data/posts.ts`. Add
new public routes to `src/pages/sitemap.xml.ts`. Dates are deliberately omitted
until genuine content modification dates are tracked; build times are not
content modification times. The 404 page is noindex and excluded from the sitemap.

Every `npm run build` also runs `npm run check:seo`. This checks generated HTML,
unique metadata, canonicals, structured data, social image dimensions, local
links and anchors, crawlability, and exact sitemap coverage. A new page missing
from the sitemap will fail the build. Run the validator alone against an existing
build with `npm run check:seo`.

Vercel preview builds (`VERCEL_ENV=preview`) emit noindex on all pages and an
empty sitemap. Crawling stays enabled so search engines can see the noindex
directive. To verify this locally, run `VERCEL_ENV=preview npm run build`, then
run `npm run build` again to restore production output.

After deployment, verify the domain resolves, page URLs return 200, missing
pages return 404, and slashless page URLs redirect to their canonical form.
Submit `https://haraldbregu.com/sitemap.xml` in Google Search Console and use URL
Inspection to check the deployed pages. These external checks require a working
domain and access to the site's Search Console property.

## Vercel Deployment

The repository includes `vercel.json` with the Astro build settings:

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

Astro 6 requires Node.js `>=22.12.0`. If Vercel still shows Node 20 in build
logs, redeploy after this commit or set the project Node.js version to `22.x`
or `24.x` in Vercel Project Settings.

## Contact

- Email: <harald.bregu@gmail.com>
- GitHub: <https://github.com/HaraldBregu>
- LinkedIn: <https://www.linkedin.com/in/haraldbregu/>
