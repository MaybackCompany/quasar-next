import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteNav } from "@/components/fqs/site-nav";
import { HubContent } from "./hub-content";

interface HubManifestItem {
  route: string;
  title: string;
  description: string;
  sourcePath: string;
  toc: Array<{ href: string; label: string }>;
}

interface HubPageProps {
  params: Promise<{ slug?: string[] }>;
}

const contentDir = path.join(process.cwd(), "content", "hubs");

async function readManifest(): Promise<HubManifestItem[]> {
  const source = await readFile(path.join(contentDir, "manifest.json"), "utf8");
  return JSON.parse(source) as HubManifestItem[];
}

function routeFor(section: string, slug: string[] = []) {
  return `/${[section, ...slug].filter(Boolean).join("/")}`;
}

async function getHubItem(route: string): Promise<HubManifestItem | undefined> {
  const manifest = await readManifest();
  return manifest.find((item) => item.route === route);
}

async function readHubHtml(route: string): Promise<string> {
  return readFile(path.join(contentDir, `${route.slice(1)}.html`), "utf8");
}

export async function generateHubStaticParams(section: string): Promise<Array<{ slug: string[] }>> {
  const manifest = await readManifest();
  return manifest
    .filter((item) => item.route === `/${section}` || item.route.startsWith(`/${section}/`))
    .map((item) => {
      const rest = item.route.slice(section.length + 2);
      return { slug: rest ? rest.split("/") : [] };
    });
}

export async function generateHubMetadata(section: string, { params }: HubPageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const item = await getHubItem(routeFor(section, slug));

  if (!item) {
    return { title: "Page not found · Quasar School" };
  }

  return {
    title: item.title,
    description: item.description || undefined,
  };
}

export async function HubRoutePage({ section, params }: HubPageProps & { section: string }) {
  const { slug = [] } = await params;
  const route = routeFor(section, slug);
  const item = await getHubItem(route);

  if (!item) {
    notFound();
  }

  // Prefer a migrated MDX hub; fall back to the legacy injected HTML.
  let MdxContent: ComponentType | null = null;
  try {
    const mod = await import(`../../content/hubs/${route.slice(1)}.mdx`);
    MdxContent = mod.default as ComponentType;
  } catch {
    MdxContent = null;
  }

  const navActive = route.startsWith("/cheatsheets") ? "cheatsheets" : null;

  if (MdxContent) {
    return (
      <div className="fqs">
        <SiteNav active={navActive} />
        <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
          <article className="prose" style={{ maxWidth: 760 }}>
            <MdxContent />
          </article>
        </main>
      </div>
    );
  }

  const html = await readHubHtml(route);

  return (
    <div className="fqs">
      <SiteNav active={navActive} />
      <link rel="stylesheet" href="/assets/lab/lab.css" />
      <HubContent html={html} route={route} />
    </div>
  );
}
