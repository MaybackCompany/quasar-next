// Extract lesson quizzes into compact text for answer-key auditing.
// Output: grouped by lesson slug, each question with its marked answer + options.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "lessons");
const stripTags = (s) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const files = (await readdir(dir)).filter((f) => f.endsWith(".html")).sort();
const out = [];

for (const file of files) {
  const slug = file.replace(/\.html$/, "");
  const html = await readFile(path.join(dir, file), "utf8");
  const fieldsets = [...html.matchAll(/<fieldset\s+data-answer="([a-d])"[^>]*>([\s\S]*?)<\/fieldset>/g)];
  if (fieldsets.length === 0) continue;

  out.push(`=== ${slug} (${fieldsets.length} q) ===`);
  for (const [, answer, body] of fieldsets) {
    const legend = body.match(/<legend[^>]*>([\s\S]*?)<\/legend>/);
    out.push(`  Q [answer=${answer}]: ${legend ? stripTags(legend[1]) : "(no legend)"}`);
    const labels = [...body.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)];
    for (const [, lab] of labels) {
      const val = lab.match(/value="([a-d])"/);
      out.push(`    ${val ? val[1] : "?"}) ${stripTags(lab.replace(/<input[^>]*>/g, ""))}`);
    }
  }
  out.push("");
}

await writeFile("/tmp/quizzes.txt", out.join("\n"), "utf8");
console.log(`extracted quizzes from ${files.length} files -> /tmp/quizzes.txt`);
console.log(`lessons with quizzes: ${out.filter((l) => l.startsWith("===")).length}`);
