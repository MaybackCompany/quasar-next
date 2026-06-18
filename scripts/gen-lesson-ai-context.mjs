// Generate a per-lesson "AI mentor" payload from each lesson's MDX and bake it
// into content/lessons/manifest.json as `ai`. The "copy lesson for AI" button
// serves this so the prompt teaches THAT specific lesson (objective, every step,
// all code, exact console errors, recap) instead of a generic shell.
//
// Zero-dep: a small JSX-aware walker over the known lesson component vocabulary
// (LessonHero, Step, Callout, FailureList, Recap, ...). Run after editing lessons:
//   node scripts/gen-lesson-ai-context.mjs            (writes manifest)
//   node scripts/gen-lesson-ai-context.mjs <slug>     (prints one, no write)
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "content", "lessons", "manifest.json");
const mdxDir = path.join(root, "src", "content", "lessons");

// Visible, collision-proof placeholder for extracted code blocks.
const TOKEN_RE = /@@CODE(\d+)@@/g;
function tokenFor(n) {
  return "@@CODE" + n + "@@";
}

// Components whose data we render. Anything not here that is a JSX element gets
// dropped (its children are still walked) — that strips media/link widgets
// (LessonVideo, YouTube, Sandbox, Mockup, TechLinks, ...) without losing prose.
const HANDLED = new Set([
  "LessonHero", "Prereq", "Callout", "StepGroup", "Step", "ExpectedOutput",
  "FailureList", "Recap", "Exercise", "Checkpoint", "Refs",
]);

const QUOTES = new Set(["'", '"', "`"]);

/** Evaluate a JS literal from an attribute expression (trusted local content). */
function evalExpr(expr) {
  if (expr == null) return null;
  try {
    // eslint-disable-next-line no-new-func
    return new Function("return (" + expr + ");")();
  } catch {
    return null;
  }
}

/** Render a ReactNode-ish value (string/number) to plain text; skip JSX values. */
function nodeText(v) {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return "";
}

/** Strip the common leading indentation from a block (JSX nests prose ~2-4 sp,
 * which would otherwise read as accidental indented code blocks in markdown). */
function dedent(s) {
  const lines = s.split("\n");
  let min = Infinity;
  for (const l of lines) {
    if (!l.trim()) continue;
    min = Math.min(min, /^[ \t]*/.exec(l)[0].length);
  }
  if (!isFinite(min) || min === 0) return s;
  return lines.map((l) => (l.trim() ? l.slice(min) : l)).join("\n");
}

/** Given s[i] === a quote, return index just past the matching close quote. */
function skipString(s, i) {
  const q = s[i];
  i += 1;
  while (i < s.length) {
    if (s[i] === "\\") { i += 2; continue; }
    if (s[i] === q) return i + 1;
    if (q === "`" && s[i] === "$" && s[i + 1] === "{") { i = matchBrace(s, i + 1); continue; }
    i += 1;
  }
  return i;
}

/** Given s[i] === "{" or "[", return index just past the matching close. */
function matchBrace(s, i) {
  const open = s[i];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  while (i < s.length) {
    const c = s[i];
    if (QUOTES.has(c)) { i = skipString(s, i); continue; }
    if (c === open) depth += 1;
    else if (c === close) { depth -= 1; if (depth === 0) return i + 1; }
    else if (c === "{" || c === "[") { i = matchBrace(s, i) - 1; }
    i += 1;
  }
  return i;
}

/** Parse attributes starting at s[i] (just after the tag name). */
function parseAttrs(s, i) {
  const attrs = {};
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i += 1;
    if (s[i] === "/" && s[i + 1] === ">") return { attrs, end: i + 2, selfClose: true };
    if (s[i] === ">") return { attrs, end: i + 1, selfClose: false };
    const nameMatch = /^[A-Za-z_][\w-]*/.exec(s.slice(i));
    if (!nameMatch) { i += 1; continue; }
    const name = nameMatch[0];
    i += name.length;
    while (i < s.length && /\s/.test(s[i])) i += 1;
    if (s[i] !== "=") { attrs[name] = true; continue; }
    i += 1;
    while (i < s.length && /\s/.test(s[i])) i += 1;
    if (QUOTES.has(s[i])) {
      const end = skipString(s, i);
      attrs[name] = s.slice(i + 1, end - 1);
      i = end;
    } else if (s[i] === "{") {
      const end = matchBrace(s, i);
      attrs[name] = { expr: s.slice(i + 1, end - 1) };
      i = end;
    }
  }
  return { attrs, end: i, selfClose: false };
}

/** Find the matching </name>, honoring nested same-name elements. Operates on
 * JSX children (markdown), so it must NOT treat prose apostrophes or inline-code
 * backticks as string delimiters — only react to angle brackets. Nested open
 * tags are skipped via parseAttrs so `>` inside their attributes is ignored. */
function findClose(s, i, name) {
  let depth = 1;
  const closeTag = "</" + name + ">";
  const openRe = new RegExp("^<" + name + "[\\s/>]");
  while (i < s.length) {
    if (s[i] === "<") {
      if (s.startsWith(closeTag, i)) {
        depth -= 1;
        if (depth === 0) return { childEnd: i, end: i + closeTag.length };
        i += closeTag.length; continue;
      }
      if (openRe.test(s.slice(i, i + name.length + 2))) {
        const p = parseAttrs(s, i + 1 + name.length);
        if (!p.selfClose) depth += 1;
        i = p.end; continue;
      }
    }
    i += 1;
  }
  return { childEnd: s.length, end: s.length };
}

function attrExpr(attrs, key) {
  const v = attrs[key];
  return v && typeof v === "object" && "expr" in v ? evalExpr(v.expr) : null;
}
function attrStr(attrs, key) {
  const v = attrs[key];
  if (typeof v === "string") return v;
  const e = attrExpr(attrs, key);
  return e == null ? "" : nodeText(e);
}

/** Emit markdown for one handled component. */
function emit(name, attrs, inner) {
  const intro = inner.trim();
  switch (name) {
    case "LessonHero": {
      const meta = attrExpr(attrs, "meta") || [];
      const lines = [];
      if (intro) lines.push(intro, "");
      if (Array.isArray(meta) && meta.length) {
        lines.push("### What this lesson covers");
        for (const m of meta) {
          const label = nodeText(m && m.label).trim();
          const value = nodeText(m && m.value).trim();
          if (label && value) lines.push("- " + label + ": " + value);
        }
      }
      return lines.join("\n");
    }
    case "Prereq": {
      const items = attrExpr(attrs, "items") || [];
      if (!items.length) return "";
      return ["### Before you start", ...items.map((it) => "- " + nodeText(it).trim())].join("\n");
    }
    case "StepGroup":
      return intro; // lessons already carry their own "## Build it" heading
    case "Step": {
      const num = attrStr(attrs, "num");
      const title = attrStr(attrs, "title");
      const outcome = attrStr(attrs, "outcome");
      const head = ("### Step " + num + (num ? " - " : "") + title).trim();
      const body = [head];
      if (outcome) body.push("_Goal: " + outcome + "_");
      body.push("", intro);
      return body.join("\n");
    }
    case "ExpectedOutput":
      return "Expected output:\n\n```\n" + intro + "\n```";
    case "Callout": {
      const title = attrStr(attrs, "title");
      const body = intro.split("\n").map((l) => "> " + l).join("\n");
      return (title ? "> **" + title + "**\n" : "") + body;
    }
    case "Exercise":
      return intro; // lessons carry their own "## Try it yourself" heading
    case "Checkpoint":
      return "### Check yourself: " + attrStr(attrs, "question") + "\n\n" + intro;
    case "FailureList": {
      const items = attrExpr(attrs, "items") || [];
      if (!items.length) return "";
      const rows = items.map((f) => "- `" + nodeText(f && f.symptom).trim() + "` -> " + nodeText(f && f.fix).trim());
      return ["## Common errors and fixes", ...rows].join("\n");
    }
    case "Recap": {
      const items = attrExpr(attrs, "items") || [];
      if (!items.length) return "";
      return ["## Recap", ...items.map((it) => "- " + nodeText(it).trim())].join("\n");
    }
    case "Refs": {
      const items = attrExpr(attrs, "items") || [];
      if (!items.length) return "";
      const rows = items.map((r) => "- " + nodeText(r && r.label).trim() + ": " + ((r && r.href) || ""));
      return ["## References", ...rows].join("\n");
    }
    default:
      return intro;
  }
}

/** Walk a fence-free MDX segment, replacing known JSX with markdown. */
function walk(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "<" && /[A-Za-z]/.test(s[i + 1] || "")) {
      const name = (/^[A-Za-z_][\w.]*/.exec(s.slice(i + 1)) || [""])[0];
      if (/^[A-Z]/.test(name)) {
        const parsed = parseAttrs(s, i + 1 + name.length);
        if (parsed.selfClose) {
          out += HANDLED.has(name) ? "\n\n" + emit(name, parsed.attrs, "") + "\n\n" : "";
          i = parsed.end;
          continue;
        }
        const closed = findClose(s, parsed.end, name);
        const inner = walk(dedent(s.slice(parsed.end, closed.childEnd)));
        out += HANDLED.has(name) ? "\n\n" + emit(name, parsed.attrs, inner) + "\n\n" : "\n" + inner + "\n";
        i = closed.end;
        continue;
      }
    }
    out += c;
    i += 1;
  }
  return out;
}

/** Pull fenced code blocks out so JSX parsing never touches their angle/brace
 * characters. Placeholders keep the opening fence's indentation so the
 * per-component dedent strips prose and code uniformly. */
function extract(mdx) {
  const codes = [];
  const result = [];
  let fence = null;
  for (const line of mdx.split("\n")) {
    const m = /^(\s*)(`{3,})(.*)$/.exec(line);
    if (m && !fence) {
      fence = { lang: m[3].trim(), indent: m[1], body: [] };
      continue;
    }
    if (m && fence) {
      result.push(fence.indent + tokenFor(codes.length));
      codes.push("```" + fence.lang + "\n" + dedent(fence.body.join("\n")) + "\n```");
      fence = null;
      continue;
    }
    if (fence) fence.body.push(line);
    else result.push(line);
  }
  return { stripped: result.join("\n"), codes };
}

function restore(text, codes) {
  return text.replace(TOKEN_RE, (_, n) => codes[Number(n)]);
}

function clean(text) {
  return text
    .replace(/\{["'`]\s*["'`]\}/g, " ") // {" "} spacers
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&") // decode last so the above are not re-mangled
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function mdxToAiBody(mdx) {
  const ex = extract(mdx.replace(/\r\n?/g, "\n")); // normalize CRLF first
  return clean(restore(walk(ex.stripped), ex.codes));
}

async function main() {
  const onlyArg = process.argv[2]; // optional: a single slug to preview (no write)
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  let updated = 0;
  for (const item of manifest) {
    if (onlyArg && item.slug !== onlyArg) continue;
    let mdx;
    try {
      mdx = await readFile(path.join(mdxDir, item.slug + ".mdx"), "utf8");
    } catch {
      continue; // no MDX source — leave as-is
    }
    const body = mdxToAiBody(mdx);
    if (onlyArg) {
      console.log(body);
      return;
    }
    item.ai = body;
    updated += 1;
  }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log("generated AI context for " + updated + " lessons");
}

main();
