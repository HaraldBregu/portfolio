import type { Post } from "./posts";
import { canonicalUrl, SITE_NAME, SITE_URL } from "./site.mjs";

const author = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Harald Bregu",
  url: `${SITE_URL}/`,
  sameAs: [
    "https://github.com/HaraldBregu",
    "https://www.linkedin.com/in/haraldbregu/",
    "https://x.com/HaraldBregu",
  ],
};

export function createWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: "en",
    publisher: author,
  };
}

export function createBreadcrumbSchema(url: string, title: string) {
  const items = [
    { name: "Home", item: canonicalUrl("/") },
    { name: "Writing", item: canonicalUrl("/posts/") },
  ];
  if (url !== canonicalUrl("/posts/")) {
    items.push({ name: title.replace(/ \| Harald Bregu$/, ""), item: url });
  }
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, ...item,
    })),
  };
}

export function createProfileSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: `${SITE_URL}/`,
    name: "Harald Bregu | Software Engineer",
    description,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      ...author,
      jobTitle: "Software Engineer",
      description,
    },
  };
}

export function createArticleSchema(post: Post) {
  const url = canonicalUrl(post.href);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE_URL}/og/${post.slug}.png`],
    datePublished: post.isoDate,
    author,
    publisher: author,
    keywords: [...post.tags],
  };
}

export function createPostsSchema(posts: readonly Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/posts/#collection`,
    url: `${SITE_URL}/posts/`,
    name: "Writing | Harald Bregu",
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: canonicalUrl(post.href),
      })),
    },
  };
}
