import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");
const outputDir = path.join(appRoot, "content", "lessons");

const TRACK_ZERO = {
  "install-fivem-client": "clase-00/leason00.html",
  "tools-and-database": "clase-00b/leason00b.html",
  "artifacts-txadmin": "clase-00c/leason00c.html",
  "server-cfg": "clase-00d/leason00d.html",
  "txadmin-tour": "clase-00e/leason00e.html",
  "connect-restart": "clase-00f/leason00f.html",
};

const decodeEntities = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rarr;/g, "→")
    .replace(/&larr;/g, "←")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&nbsp;/g, " ");

const stripTags = (value) => decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

const extractTitle = (html, fallback) => {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : fallback;
};

const extractMain = (html, sourcePath) => {
  const match = html.match(/<main\b(?=[^>]*class=["'][^"']*\blesson\b)[^>]*>([\s\S]*?)<\/main>/i);
  if (!match) {
    throw new Error(`Could not find <main class="lesson"> in ${sourcePath}`);
  }

  return match[1]
    .replace(/<!--\s*chrome:topbar:(?:lesson|track0)\s*-->/gi, "")
    .replace(/<!--\s*qu-(?:strict-template|track0)[\s\S]*?-->/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<nav\b(?=[^>]*class=["'][^"']*\blesson-nav\b)[^>]*>[\s\S]*?<\/nav>/gi, "")
    .trim();
};

const extractToc = (html) => {
  const railMatch = html.match(/<aside\b(?=[^>]*class=["'][^"']*\brail\b)[^>]*>([\s\S]*?)<\/aside>/i);
  if (!railMatch) return [];

  return [...railMatch[1].matchAll(/<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi)].map((match) => ({
    href: decodeEntities(match[2]),
    label: stripTags(match[3]),
  }));
};

const curriculumSource = await readFile(path.join(appRoot, "src", "lib", "curriculum.ts"), "utf8");
const curriculumSlugs = [...curriculumSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
const curriculumSlugSet = new Set(curriculumSlugs);

const curriculumMap = JSON.parse(await readFile(path.join(repoRoot, "curriculum-map.json"), "utf8"));
const sourceBySlug = new Map(
  curriculumMap.lessons
    .filter((lesson) => curriculumSlugSet.has(lesson.slug))
    .map((lesson) => [lesson.slug, lesson.path]),
);

for (const [slug, sourcePath] of Object.entries(TRACK_ZERO)) {
  if (curriculumSlugSet.has(slug)) {
    sourceBySlug.set(slug, sourcePath);
  }
}

await mkdir(outputDir, { recursive: true });

const manifest = [];
const missing = [];

for (const slug of curriculumSlugs) {
  const sourcePath = sourceBySlug.get(slug);
  if (!sourcePath) {
    missing.push(slug);
    continue;
  }

  const absoluteSourcePath = path.join(repoRoot, sourcePath);
  let html;
  try {
    html = await readFile(absoluteSourcePath, "utf8");
  } catch {
    missing.push(slug);
    continue;
  }

  const body = extractMain(html, sourcePath);
  const title = extractTitle(html, slug);
  const toc = extractToc(html);

  await writeFile(path.join(outputDir, `${slug}.html`), `${body}\n`, "utf8");
  manifest.push({ slug, title, sourcePath, toc });
}

await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

console.log(`Imported ${manifest.length} lessons to ${path.relative(appRoot, outputDir)}`);
if (missing.length > 0) {
  console.log(`Missing source files for slugs: ${missing.join(", ")}`);
} else {
  console.log("Missing source files for slugs: none");
}
