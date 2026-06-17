import type { Metadata } from "next";
import Link from "next/link";

import { SiteNav } from "@/components/fqs/site-nav";
import { SiteFooter } from "@/components/fqs/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { POSTS } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "FiveM guides and tutorials · Quasar School",
  description:
    "Practical, current FiveM guides: how to make a server, choosing a framework, installing scripts, and fixing the most common errors. From the team behind 60,000+ scripts sold.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "FiveM guides and tutorials · Quasar School",
    description: "Practical, current FiveM guides from Quasar School.",
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}

export default function BlogIndex() {
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div className="fqs">
      <JsonLd data={itemListLd} />
      <SiteNav />
      <main className="wrap" style={{ paddingTop: 64, paddingBottom: 80 }}>
        <div style={{ maxWidth: 760 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            QUASAR SCHOOL BLOG
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(32px, 5vw, 46px)" }}>
            FiveM guides that actually ship.
          </h1>
          <p style={{ fontSize: 17, color: "var(--fg-2)", margin: "16px 0 0", maxWidth: "62ch", lineHeight: 1.6 }}>
            Straight, current answers to the questions every FiveM server owner asks. No fluff, verified for 2026,
            from the team behind 60,000+ scripts sold and 6 Tebex Legends Awards.
          </p>
        </div>

        <div style={{ display: "grid", gap: 16, marginTop: 36, maxWidth: 760 }}>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="track-card"
              style={{ display: "block", padding: 22 }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                  {formatDate(post.date)}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>· {post.readingMinutes} min read</span>
              </div>
              <h2 className="fqs-h" style={{ fontSize: 22, margin: "0 0 8px" }}>
                {post.title}
              </h2>
              <p style={{ fontSize: 15, color: "var(--fg-2)", margin: 0, lineHeight: 1.55 }}>{post.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                {post.tags.slice(0, 4).map((t) => (
                  <span key={t} className="chip" style={{ fontSize: 12 }}>
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}
