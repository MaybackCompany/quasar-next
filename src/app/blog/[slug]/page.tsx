import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteNav } from "@/components/fqs/site-nav";
import { SiteFooter } from "@/components/fqs/site-footer";
import { BookAudit } from "@/components/fqs/book-audit";
import { JsonLd } from "@/components/seo/json-ld";
import { allPostSlugs, getPost } from "@/lib/blog";
import { LOGO_IMAGE, OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return allPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found · Quasar School" };
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} · Quasar School`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    keywords: post.tags,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [{ url: OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  let MdxContent: ComponentType | null = null;
  try {
    const mod = await import(`../../../content/blog/${slug}.mdx`);
    MdxContent = mod.default as ComponentType;
  } catch {
    MdxContent = null;
  }
  if (!MdxContent) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      mainEntityOfPage: url,
      image: `${SITE_URL}${OG_IMAGE}`,
      keywords: post.tags.join(", "),
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_IMAGE}` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <div className="fqs">
      <JsonLd data={ld} />
      <SiteNav />
      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link href="/blog" className="nav-link" style={{ padding: 0, fontSize: 13.5, color: "var(--muted)" }}>
            ← All guides
          </Link>

          <header style={{ marginTop: 16, marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                {formatDate(post.date)}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>· {post.readingMinutes} min read</span>
            </div>
            <h1 className="fqs-h" style={{ fontSize: "clamp(28px, 4.5vw, 42px)", lineHeight: 1.12 }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 17, color: "var(--fg-2)", margin: "16px 0 0", lineHeight: 1.6 }}>
              {post.description}
            </p>
          </header>

          <div className="lesson-content">
            <MdxContent />
          </div>

          {/* Conversion footer: related lesson + free audit. */}
          <div
            style={{
              marginTop: 44,
              padding: 22,
              border: "1px solid var(--accent-strong)",
              borderRadius: 12,
              background: "var(--surface)",
            }}
          >
            <h2 className="fqs-h" style={{ fontSize: 20, margin: "0 0 8px" }}>
              Want this done with you, not just explained?
            </h2>
            <p style={{ fontSize: 15, color: "var(--fg-2)", margin: "0 0 16px", lineHeight: 1.55 }}>
              Book a free one on one FiveM audit and a senior builder maps your exact next step. Free, no card, you
              leave with a plan.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <BookAudit className="btn btn-primary">Book your free FiveM audit</BookAudit>
              {post.related ? (
                <Link className="btn btn-ghost" href={post.related.href}>
                  {post.related.label}
                </Link>
              ) : null}
            </div>
          </div>

          <SiteFooter />
        </article>
      </main>
    </div>
  );
}
