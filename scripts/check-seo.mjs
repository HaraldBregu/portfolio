import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, join, relative } from "node:path";
import { parse } from "parse5";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { SITE_URL, IS_PREVIEW } from "../src/data/site.mjs";

const directory = resolve(process.argv[2] || "dist");
const read = (path) => readFile(join(directory, path), "utf8");
const attr = (node, name) => node.attrs?.find((item) => item.name === name)?.value;
const text = (node) => node.value ?? (node.childNodes || []).map(text).join("");
function nodes(node, tag) {
  return [
    ...(node.tagName === tag ? [node] : []),
    ...(node.childNodes || []).flatMap((child) => nodes(child, tag)),
  ];
}
async function htmlFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? htmlFiles(join(path, entry.name))
    : entry.name.endsWith(".html") ? [join(path, entry.name)] : []));
  return files.flat();
}

const pages = new Map();
const titles = new Set();
const descriptions = new Set();
for (const file of await htmlFiles(directory)) {
  const path = relative(directory, file).replaceAll("\\", "/");
  const route = path === "index.html" ? "/" : `/${path.replace(/index\.html$/, "")}`;
  const doc = parse(await readFile(file, "utf8"));
  const head = nodes(doc, "head")[0];
  const metas = nodes(head, "meta");
  const meta = (name) => {
    const matches = metas.filter((item) => attr(item, "name") === name || attr(item, "property") === name);
    assert.equal(matches.length, 1, `${route}: missing or duplicate ${name}`);
    const value = attr(matches[0], "content");
    assert.ok(value?.trim(), `${route}: empty ${name}`);
    return value;
  };
  const titleNodes = nodes(head, "title");
  assert.equal(titleNodes.length, 1, `${route}: expected one title`);
  const title = text(titleNodes[0]).trim();
  const description = meta("description");
  assert.ok(title && !titles.has(title), `${route}: empty or duplicate title`);
  assert.ok(!descriptions.has(description), `${route}: duplicate description`);
  titles.add(title);
  descriptions.add(description);
  assert.equal(attr(nodes(doc, "html")[0], "lang"), "en", `${route}: document language`);
  assert.equal(nodes(doc, "h1").length, 1, `${route}: expected one main heading`);
  assert.ok(text(nodes(doc, "h1")[0]).trim(), `${route}: empty heading`);
  assert.equal(nodes(doc, "main").length, 1, `${route}: expected a main landmark`);
  assert.ok(meta("viewport").includes("width=device-width"), `${route}: responsive viewport`);

  const canonicalLinks = nodes(head, "link").filter((item) => attr(item, "rel") === "canonical");
  const is404 = route === "/404.html";
  const noindex = meta("robots").split(",").includes("noindex");
  assert.equal(noindex, IS_PREVIEW || is404, `${route}: wrong indexing policy`);
  assert.equal(canonicalLinks.length, is404 ? 0 : 1, `${route}: canonical count`);
  const url = `${SITE_URL}${route}`;
  if (!is404) {
    assert.equal(attr(canonicalLinks[0], "href"), url, `${route}: canonical URL`);
    assert.equal(meta("og:url"), url, `${route}: Open Graph URL`);
    assert.ok(meta("robots").includes("max-image-preview:large") || IS_PREVIEW);
  }
  assert.equal(meta("og:title"), title);
  assert.equal(meta("twitter:title"), title);
  assert.equal(meta("og:description"), description);
  assert.equal(meta("twitter:description"), description);
  assert.equal(meta("twitter:card"), "summary_large_image");
  assert.equal(meta("twitter:image"), meta("og:image"));
  assert.equal(meta("twitter:image:alt"), meta("og:image:alt"));
  const image = new URL(meta("og:image"));
  assert.equal(image.origin, SITE_URL);
  const png = await readFile(join(directory, image.pathname));
  assert.equal(png.subarray(1, 4).toString(), "PNG", `${route}: social image format`);
  assert.equal(png.readUInt32BE(16), Number(meta("og:image:width")), `${route}: image width`);
  assert.equal(png.readUInt32BE(20), Number(meta("og:image:height")), `${route}: image height`);

  const schemas = nodes(head, "script").filter((node) => attr(node, "type") === "application/ld+json")
    .flatMap((node) => JSON.parse(text(node))["@graph"] || []);
  const article = schemas.find((schema) => schema["@type"] === "BlogPosting");
  const isArticle = route.startsWith("/posts/") && route !== "/posts/";
  assert.equal(Boolean(article), isArticle, `${route}: article schema`);
  if (!is404) {
    assert.ok(schemas.some((schema) => schema["@type"] === "WebSite"), `${route}: website schema`);
    const pageSchema = schemas.find((schema) => ["ProfilePage", "CollectionPage", "BlogPosting"].includes(schema["@type"]));
    assert.equal(pageSchema?.url, url, `${route}: page schema URL`);
    if (route !== "/") {
      const crumbs = schemas.find((schema) => schema["@type"] === "BreadcrumbList")?.itemListElement;
      assert.ok(crumbs?.length >= 2, `${route}: breadcrumbs`);
      assert.equal(crumbs.at(-1).item, url);
      crumbs.forEach((crumb, i) => assert.equal(crumb.position, i + 1));
    }
  }
  if (article) {
    assert.equal(meta("og:type"), "article");
    assert.equal(article.headline, text(nodes(doc, "h1")[0]).trim());
    assert.equal(article.description, description);
    assert.equal(article.mainEntityOfPage["@id"], url);
    assert.equal(article.author.url, `${SITE_URL}/`);
    assert.equal(article.inLanguage, "en");
    assert.equal(article.image[0], image.href);
    assert.equal(meta("article:published_time"), article.datePublished);
    assert.ok(nodes(doc, "time").some((node) => attr(node, "datetime") === article.datePublished));
  }
  pages.set(route, { doc, url, noindex });
}

// Validate all local links and assets against the actual generated output.
const incoming = new Set(["/"]);
for (const [route, { doc }] of pages) {
  for (const node of [...nodes(doc, "a"), ...nodes(doc, "link"), ...nodes(doc, "img"), ...nodes(doc, "script")]) {
    const href = attr(node, "href") || attr(node, "src");
    if (!href) continue;
    const url = new URL(href, `${SITE_URL}${route}`);
    if (url.origin !== SITE_URL) continue;
    const target = pages.get(url.pathname);
    if (target) {
      if (node.tagName === "a" && route !== "/404.html" && route !== url.pathname) incoming.add(url.pathname);
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok((await readFile(join(directory, url.pathname, "index.html"), "utf8")).includes(`id="${id}"`), `${route}: missing anchor ${href}`);
      }
    } else {
      assert.ok((await stat(join(directory, decodeURIComponent(url.pathname)))).isFile(), `${route}: broken link ${href}`);
    }
  }
}
for (const route of pages.keys()) {
  if (route !== "/404.html") assert.ok(incoming.has(route), `${route}: orphan page`);
}

const sitemap = await read("sitemap.xml");
assert.equal(XMLValidator.validate(sitemap), true, "Malformed sitemap XML");
const xml = new XMLParser({ ignoreAttributes: false }).parse(sitemap);
assert.equal(xml.urlset["@_xmlns"], "http://www.sitemaps.org/schemas/sitemap/0.9");
const entries = xml.urlset.url ? [xml.urlset.url].flat() : [];
const locations = entries.map((entry) => entry.loc);
assert.equal(new Set(locations).size, locations.length, "Duplicate sitemap URLs");
assert.deepEqual(locations.sort(), [...pages.values()].filter((page) => !page.noindex).map((page) => page.url).sort(), "Sitemap must exactly cover all indexable pages");

const robots = await read("robots.txt");
assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^Allow: \/$/m);
assert.doesNotMatch(robots, /^Disallow:\s*\S/m, "Public content and assets must remain crawlable");
assert.equal(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), !IS_PREVIEW);
const vercel = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
assert.equal(vercel.trailingSlash, true, "Hosting must redirect to canonical trailing slashes");
console.log(`SEO checks passed: ${pages.size} HTML pages, ${locations.length} sitemap URLs, ${IS_PREVIEW ? "preview" : "production"} indexing policy.`);
