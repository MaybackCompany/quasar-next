// Rebuild content/lessons/manifest.json `toc` from the current MDX `##` headings.
// Run after lessons are rewritten so the on-page TOC rail matches the new sections.
// Slug algorithm mirrors rehype-slug / github-slugger for plain ASCII headings.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "content", "lessons", "manifest.json");
const mdxDir = path.join(root, "src", "content", "lessons");

/** Strip inline markdown (backticks, emphasis, links) to the visible heading text. */
function headingText(raw) {
  return raw
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .trim();
}

/** github-slugger-compatible slug for ASCII headings. */
function slugify(text, seen) {
  let base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  let slug = base;
  let n = 1;
  while (seen.has(slug)) slug = `${base}-${n++}`;
  seen.add(slug);
  return slug;
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
let updated = 0;

for (const item of manifest) {
  let mdx;
  try {
    mdx = await readFile(path.join(mdxDir, `${item.slug}.mdx`), "utf8");
  } catch {
    continue; // no MDX (e.g. not migrated) — leave existing toc
  }

  const seen = new Set();
  const toc = [];
  let inFence = false;
  for (const line of mdx.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^## (?!#)(.+?)\s*$/.exec(line); // h2 only, not h3+
    if (!m) continue;
    const label = headingText(m[1]);
    if (!label) continue;
    toc.push({ href: `#${slugify(label, seen)}`, label });
  }

  item.toc = toc;
  updated += 1;
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`regenerated toc for ${updated} lessons`);
