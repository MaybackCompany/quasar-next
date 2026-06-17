import type { MetadataRoute } from "next";

import { PATHS } from "@/lib/curriculum";
import { POSTS } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// Public, crawlable URLs only. The lessons are gated behind Discord login, so
// they redirect for bots and are intentionally left out; the marketing pages
// and the blog are the indexable surface.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/toolbox", "/blog"];
  const trackRoutes = PATHS.map((p) => `/track/${p.id}`);

  const pages: MetadataRoute.Sitemap = [...staticRoutes, ...trackRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...posts];
}
