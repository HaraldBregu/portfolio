import type { Post } from "./posts";

export const SITE_URL = "https://haraldbregu.com";

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

export function createProfileSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: `${SITE_URL}/`,
    name: "Harald Bregu | Software Engineer",
    mainEntity: {
      ...author,
      jobTitle: "Software Engineer",
      description,
    },
  };
}

export function createArticleSchema(post: Post) {
  const url = `${SITE_URL}${post.href}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${SITE_URL}${post.href}`,
      })),
    },
  };
}
