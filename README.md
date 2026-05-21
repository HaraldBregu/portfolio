# Portfolio

Personal portfolio for Harald Bregu, built with Astro.

## Overview

This site presents profile information, skills, professional activities, projects, services, GitHub activity styling, and contact links in a compact terminal-inspired layout.

## Tech

- Astro
- JetBrains Mono via Google Fonts
- Plain CSS and small inline scripts for theme switching and the contribution heatmap

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
