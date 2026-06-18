import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteNav } from "@/components/fqs/site-nav";
import { LessonShell, type ShellModule } from "@/components/fqs/lesson-shell";
import { getLessonLookup } from "@/lib/curriculum";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface LessonManifestItem {
  slug: string;
  title: string;
  sourcePath: string;
  toc: Array<{ href: string; label: string }>;
  ai?: string;
}

const TRACK_LETTER: Record<string, string> = { server: "A", scripts: "B", gameworld: "C" };

const contentDir = path.join(process.cwd(), "content", "lessons");

async function readManifest(): Promise<LessonManifestItem[]> {
  const source = await readFile(path.join(contentDir, "manifest.json"), "utf8");
  return JSON.parse(source) as LessonManifestItem[];
}

async function getManifestItem(slug: string): Promise<LessonManifestItem | undefined> {
  const manifest = await readManifest();
  return manifest.find((item) => item.slug === slug);
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const manifest = await readManifest();
  return manifest.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getManifestItem(slug);
  if (!item) return { title: "Lesson not found · Quasar School" };
  return { title: `${item.title} · Quasar School` };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const [item, lookup] = await Promise.all([getManifestItem(slug), Promise.resolve(getLessonLookup(slug))]);

  if (!item || !lookup) {
    notFound();
  }

  // Lessons render from MDX.
  let MdxContent: ComponentType | null = null;
  try {
    const mod = await import(`../../../content/lessons/${slug}.mdx`);
    MdxContent = mod.default as ComponentType;
  } catch {
    MdxContent = null;
  }
  if (!MdxContent) {
    notFound();
  }

  const trackPath = lookup.path;
  const trackId = trackPath?.id ?? "scripts";
  const modules: ShellModule[] = (trackPath?.modules ?? []).map((m) => ({
    num: m.num,
    title: m.title,
    lessons: m.lessons.map((l) => ({ slug: l.slug, title: l.title, bonus: l.bonus })),
  }));

  return (
    <div className="fqs">
      <SiteNav active="tracks" />
      <LessonShell
        slug={slug}
        trackId={trackId}
        trackLetter={TRACK_LETTER[trackId] ?? "B"}
        trackTitle={trackPath?.title ?? "Write scripts"}
        modules={modules}
        moduleNum={lookup.module.num}
        moduleTitle={lookup.module.title}
        prev={lookup.prev ? { slug: lookup.prev.slug, title: lookup.prev.title } : null}
        next={lookup.next ? { slug: lookup.next.slug, title: lookup.next.title } : null}
        toc={item.toc}
        aiBody={item.ai}
      >
        <MdxContent />
      </LessonShell>
    </div>
  );
}
