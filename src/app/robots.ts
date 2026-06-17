import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// Allow crawling of the public marketing + blog surface; keep the private
// surfaces (admin, auth, the trial/upsell screens, API) out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/auth/", "/expired", "/paywall"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
