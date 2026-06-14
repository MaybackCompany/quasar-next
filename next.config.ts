import fs from "node:fs";
import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

interface GeneratedRedirect {
  source: string;
  destination: string;
  permanent: boolean;
}

const appRoot = __dirname;

// Legacy-URL redirects are snapshotted into a local JSON by
// `scripts/snapshot-redirects.mjs`, so the build no longer reads any
// parent-directory source files. Re-run that script if legacy URLs change.
const generatedRedirects = JSON.parse(
  fs.readFileSync(path.join(appRoot, "redirects.generated.json"), "utf8"),
) as GeneratedRedirect[];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // React dev mode uses eval() for debugging; only relax it outside production.
      `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${process.env.NODE_ENV !== "production" ? "'unsafe-eval' " : ""}https://cdnjs.cloudflare.com https://translate.google.com`,
      "connect-src 'self' https://discord.com https://translate.googleapis.com https://translate.google.com",
      "frame-src https://translate.google.com https://translate.googleapis.com https://www.loom.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "form-action 'self' https://discord.com",
      "base-uri 'self'",
    ].join("; "),
  },
];

const trackZeroRedirects = [
  { source: "/clase-00/leason00.html", destination: "/lessons/install-fivem-client", permanent: true },
  { source: "/clase-00b/leason00b.html", destination: "/lessons/tools-and-database", permanent: true },
  { source: "/clase-00c/leason00c.html", destination: "/lessons/artifacts-txadmin", permanent: true },
  { source: "/clase-00d/leason00d.html", destination: "/lessons/server-cfg", permanent: true },
  { source: "/clase-00e/leason00e.html", destination: "/lessons/txadmin-tour", permanent: true },
  { source: "/clase-00f/leason00f.html", destination: "/lessons/connect-restart", permanent: true },
];

const deletedDirRedirects = [
  "/modern-fivem",
  "/lua-guide",
  "/entrepreneur",
  "/mastery",
  "/learn",
  "/fivem-docs-for-dummies",
  "/source-map",
  "/checkout",
].flatMap((source) => [
  { source, destination: "/", permanent: true },
  { source: `${source}/:path*`, destination: "/", permanent: true },
]);

if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
  securityHeaders.push({
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  });
}

const nextConfig: NextConfig = {
  // Allow .md/.mdx files to be treated as pages/imports (lessons are MDX).
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // Pin the workspace root so Turbopack doesn't infer a parent dir
  // (multiple lockfiles exist above this app during the migration).
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      ...generatedRedirects,
      ...trackZeroRedirects,
      ...deletedDirRedirects,
    ];
  },
};

// Turbopack requires remark/rehype plugins to be referenced by string name
// with serializable options (JS functions can't cross into the Rust pipeline).
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      // Shiki syntax highlighting; keepBackground:false so our dark code
      // surface + window chrome (the Pre component) stay in control.
      ["rehype-pretty-code", { theme: "vitesse-dark", keepBackground: false }],
      "rehype-slug",
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

export default withMDX(nextConfig);
