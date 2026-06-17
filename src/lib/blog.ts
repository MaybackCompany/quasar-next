// Blog post metadata. Bodies live in src/content/blog/<slug>.mdx and are
// dynamically imported by the [slug] route (same pattern as lessons). Keeping
// metadata here (not MDX frontmatter) avoids configuring frontmatter plugins
// and keeps titles/dates/SEO under type-checked control.

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  updated?: string;
  tags: string[];
  readingMinutes: number;
  /** A related in-app lesson/hub the post links to. */
  related?: { href: string; label: string };
}

const POSTS_RAW: BlogPost[] = [
  {
    slug: "how-to-make-a-fivem-server",
    title: "How to Make a FiveM Server in 2026 (Step by Step)",
    description:
      "A clear, current walkthrough to get a FiveM server live: what you need, the server files and license key, server.cfg essentials, picking a framework, and adding scripts safely.",
    date: "2026-06-17",
    tags: ["FiveM server", "txAdmin", "beginner", "server.cfg"],
    readingMinutes: 7,
    related: { href: "/lessons/first-line-of-lua", label: "Start the build guide" },
  },
  {
    slug: "esx-vs-qbcore-vs-qbox",
    title: "ESX vs QBCore vs Qbox: Which FiveM Framework to Choose in 2026",
    description:
      "ESX, QBCore, and Qbox compared for 2026: ecosystem size, maintenance, and a clear recommendation by use-case so you build on the right foundation the first time.",
    date: "2026-06-16",
    tags: ["frameworks", "ESX", "QBCore", "Qbox", "ox_lib"],
    readingMinutes: 7,
    related: { href: "/lessons/frameworks", label: "Frameworks lesson" },
  },
  {
    slug: "how-to-install-fivem-scripts",
    title: "How to Install FiveM Scripts Without Breaking Your Server",
    description:
      "Where scripts go, how load order and [bracket] folders work, dependencies, importing SQL, ensure vs start, and a troubleshooting list so your installs work the first time.",
    date: "2026-06-15",
    tags: ["scripts", "resources", "oxmysql", "troubleshooting"],
    readingMinutes: 7,
    related: { href: "/lessons/installing-managing-scripts", label: "Installing scripts lesson" },
  },
  {
    slug: "common-fivem-server-errors",
    title: "12 Common FiveM Server Errors (and How to Fix Each One)",
    description:
      "The most common FiveM console errors with the exact cause and the one-line fix for each, from nil values and load order to license keys, OneSync, and NUI callbacks.",
    date: "2026-06-14",
    tags: ["errors", "debugging", "troubleshooting", "console"],
    readingMinutes: 8,
    related: { href: "/resources/error-catalog", label: "Full error catalog" },
  },
];

export const POSTS: BlogPost[] = [...POSTS_RAW].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return POSTS_RAW.find((p) => p.slug === slug);
}

export function allPostSlugs(): string[] {
  return POSTS_RAW.map((p) => p.slug);
}
