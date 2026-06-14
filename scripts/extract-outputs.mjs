// Extract code-block + claimed-expected-output pairs for auditing.
// A <figure class="code" data-expected-output="X"> declares that its code prints X.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "lessons");
const decode = (s) =>
  s
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "-");

const files = (await readdir(dir)).filter((f) => f.endsWith(".html")).sort();
const out = [];
let pairCount = 0;

for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  const html = await readFile(path.join(dir, file), "utf8");
  const figures = [...html.matchAll(/<figure class="code"\s+data-expected-output="([^"]*)"[^>]*>([\s\S]*?)<\/figure>/g)];
  if (figures.length === 0) continue;

  out.push(`=== ${slug} ===`);
  for (const [, claimed, body] of figures) {
    pairCount++;
    const codeMatch = body.match(/<(?:pre|code)[^>]*>([\s\S]*?)<\/(?:pre|code)>/);
    const code = decode(codeMatch ? codeMatch[1] : body).trim();
    out.push(`  CLAIMED_OUTPUT: ${decode(claimed).trim()}`);
    out.push("  CODE:");
    out.push(
      code
        .split("\n")
        .map((l) => `    ${l}`)
        .join("\n")
    );
    out.push("  ---");
  }
  out.push("");
}

await writeFile("/tmp/outputs.txt", out.join("\n"), "utf8");
console.log(`extracted ${pairCount} code/output pairs from ${files.length} files -> /tmp/outputs.txt`);
console.log(`lessons with expected-output figures: ${out.filter((l) => l.startsWith("===")).length}`);
