import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { NodeType, parse } from "node-html-parser";
import remarkGfm from "remark-gfm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const sourceDir = path.join(appRoot, "content", "lessons");
const outputDir = path.join(appRoot, "src", "content", "lessons");
const hubSourceDir = path.join(appRoot, "content", "hubs");
const hubOutputDir = path.join(appRoot, "src", "content", "hubs");
const hubManifestPath = path.join(hubSourceDir, "manifest.json");

const DEFAULT_SLUGS = [
  "first-line-of-lua",
  "install-fivem-client",
  "oxmysql-crud",
  "callbacks",
  "anatomy-of-a-resource",
];

const VALID_CALLOUTS = new Set(["tip", "info", "warn", "danger", "fivem", "pro", "gotcha"]);

const MAPPED_CLASSES = new Set([
  "beginner-orientation",
  "analogy-block",
  "analogy-block__label",
  "before-after",
  "before-after__caption",
  "before-after__col",
  "before-after__col--bad",
  "before-after__col--good",
  "before-after__label",
  "btn",
  "btn-mark",
  "callout",
  "callout--danger",
  "callout--fivem",
  "callout--gotcha",
  "callout--info",
  "callout--pro",
  "callout--tip",
  "callout--warn",
  "callout-inline",
  "cheatsheet",
  "cheat-diagram",
  "cheat-head",
  "cheat-row",
  "cheat-table",
  "checkpoint",
  "chip",
  "chip--esx",
  "chip--ox",
  "chip--qbcore",
  "chip--qbox",
  "cmp-table",
  "code",
  "crumbs",
  "crumbs__sep",
  "debug-card__num",
  "debug-sheet",
  "debug-sheet__row",
  "debug-sheet__row--accent",
  "debug-step",
  "debug-steps",
  "decision-tree",
  "deep-dive-card",
  "deep-dive-card__arrow",
  "deep-dive-card__kicker",
  "deep-dive-card__lede",
  "deep-dive-card__title",
  "deep-dive-section",
  "exercise",
  "expected",
  "expected-output",
  "explain",
  "err-card",
  "err-card__head",
  "err-card__msg",
  "err-card__row",
  "err-card__tag",
  "err-chip",
  "err-empty",
  "err-filters",
  "err-list",
  "err-search",
  "err-toolbar",
  "expansion-lesson",
  "expansion-template",
  "failure-list",
  "failure-modes",
  "failure-modes-table",
  "failure-table",
  "file",
  "first-script-callout",
  "first-script-callout__cta",
  "first-script-callout__kicker",
  "first-script-callout__lede",
  "first-script-callout__list",
  "first-script-callout__mascot",
  "first-script-callout__title",
  "hero-outcome",
  "framework-grid",
  "fw-card",
  "fw-card__cat",
  "fw-card__head",
  "fw-card__note",
  "fw-card__title",
  "fw-cell",
  "fw-cell__label",
  "fw-chip",
  "fw-chips",
  "fw-col",
  "fw-empty",
  "fw-filter-label",
  "fw-filter-row",
  "fw-grid",
  "fw-head",
  "fw-list",
  "fw-search",
  "fw-toolbar",
  "install-guide-shell",
  "label",
  "lang",
  "lede",
  "lesson",
  "lesson-card",
  "lesson-card--static",
  "lesson-exercise",
  "lesson-grid",
  "lesson-hero",
  "lesson-list",
  "lesson-nav",
  "lesson-pager",
  "lesson-recap",
  "lesson-refs",
  "level-up",
  "meta-line",
  "meta",
  "mistakes",
  "prereq",
  "prereq-list",
  "muted",
  "next",
  "num",
  "native-use-block",
  "page-nav",
  "pin-card",
  "pin-card__chip",
  "pin-card__head",
  "pin-card__lede",
  "pin-card__title",
  "qu-table-wrap",
  "quiz",
  "qu-btn",
  "qu-btn-arrow",
  "qu-page",
  "recap",
  "reading-panel",
  "reading-panel--accent",
  "references",
  "rail",
  "rail-title",
  "self-check",
  "section-banner",
  "setup-list",
  "shell",
  "shell--no-sidebar",
  "spec",
  "spec-footnote",
  "spec-tagline",
  "status",
  "step",
  "step-body",
  "step-num",
  "step-outcome",
  "strict-kicker",
  "strict-section",
  "strict-template",
  "substep",
  "table-wrap",
  "tests-table",
  "tldr-card",
  "tldr-card__body",
  "tldr-card__chip",
  "tldr-card__points",
  "vocab-list",
  "benchmark",
  "benchmark-note",
  "benchmark-table",
  "inline",
  "prose",
  "progress-top",
  "top",
  "mental-model",
  "why-section",
  "why-banner",
  "eyebrow",
  "kit-back",
  "kit-day",
  "kit-day-badge",
  "kit-day-meta",
  "kit-day-stamp",
  "kit-day-text",
  "kit-days",
  "kit-eyebrow",
  "kit-header",
  "kit-lede",
  "kit-main",
  "kit-progress",
  "kit-progress-bar",
  "kit-progress-fill",
  "kit-progress-label",
  "kit-section-title",
  "kit-title",
  "qu-container",
  "qu-eyebrow",
  "qu-foot",
  "qu-hero",
  "qu-hero__cta",
  "qu-hero__lede",
  "qu-hero__sublink",
  "qu-hero__title",
  "qu-section-head",
  "qu-section-head__lede",
  "qu-section-head__title",
  "qu-site-footer",
  "qu-tool-card",
  "qu-tool-card--featured",
  "qu-tool-card__cta",
  "qu-tool-card__flag",
  "qu-tool-card__kicker",
  "qu-tool-card__meta",
  "qu-tools",
  "qu-tools__grid",
  "spacer",
]);

const HUB_INDEX_ROUTES = new Set(["/server", "/resources", "/cheatsheets", "/expansion", "/templates", "/setup", "/starter-kit"]);
const TARGET_HUB_ROUTES = [
  "/server",
  "/resources",
  "/cheatsheets",
  "/expansion",
  "/templates",
  "/setup",
  "/starter-kit",
  "/resources/framework-matrix",
];

const state = {
  slug: "",
  unmappedClasses: new Set(),
  unmappedBlocks: new Map(),
};

let mdxCompile = null;

function classesOf(node) {
  const value = node?.getAttribute?.("class") ?? "";
  return value.split(/\s+/).filter(Boolean);
}

function hasClass(node, className) {
  return classesOf(node).includes(className);
}

function isElement(node, tagName) {
  if (!node || node.nodeType !== NodeType.ELEMENT_NODE) return false;
  return tagName ? node.rawTagName?.toLowerCase() === tagName : true;
}

function directChildren(node, tagName) {
  return node.childNodes.filter((child) => isElement(child, tagName));
}

function isWhitespaceText(node) {
  return node.nodeType === NodeType.TEXT_NODE && node.textContent.trim() === "";
}

function text(node) {
  return normalizeInline(node?.textContent ?? "");
}

function textFromNodes(nodes) {
  return normalizeInline(nodes.map((node) => node.textContent ?? "").join(""));
}

function normalizeInline(value) {
  return value.replace(/\s+/g, " ").trim();
}

function escapeMdxText(value) {
  return value.replace(/[{}<]/g, (char) => `\\${char}`);
}

function escapeMarkdownPipe(value) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function escapeMarkdownTableCell(value) {
  return escapeMarkdownPipe(escapeMdxText(value));
}

function escapeInlineCode(value) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized.includes("`")) return `\`${normalized}\``;

  let ticks = "``";
  while (normalized.includes(ticks)) ticks += "`";
  return `${ticks} ${normalized} ${ticks}`;
}

function escapeJsxAttr(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");
}

function jsString(value) {
  return JSON.stringify(value);
}

function attrsComment(node) {
  const classes = classesOf(node).filter((className) => !isMappedClass(className));
  if (classes.length === 0) return "";

  for (const className of classes) {
    state.unmappedClasses.add(className);
  }

  const tag = node.rawTagName?.toLowerCase() ?? "node";
  const key = classes.join(" ");
  const existing = state.unmappedBlocks.get(key) ?? { count: 0, tags: new Set() };
  existing.count += 1;
  existing.tags.add(tag);
  state.unmappedBlocks.set(key, existing);

  return `{/* TODO:unmapped class ${classes.join(" ")} on tag ${tag} */}`;
}

function isMappedClass(className) {
  return MAPPED_CLASSES.has(className) || /^language-[a-z0-9_-]+$/i.test(className);
}

function extractMain(html, sourcePath, options = {}) {
  const mainClassPattern = options.hub ? String.raw`(?:lesson|qu-page|kit-main)` : String.raw`lesson`;
  const match = html.match(new RegExp(String.raw`<main\b(?=[^>]*class=["'][^"']*\b${mainClassPattern}\b)[^>]*>([\s\S]*?)<\/main>`, "i"));
  const body = match ? match[1] : html;

  if (!match) {
    console.error(`[${state.slug}] no <main class="lesson"> found in ${sourcePath}; using fragment body`);
  }

  return body
    .replace(/<!--\s*chrome:topbar:(?:lesson|track0)\s*-->/gi, "")
    .replace(/<!--\s*qu-(?:strict-template|track0)[\s\S]*?-->/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<nav\b(?=[^>]*class=["'][^"']*\blesson-nav\b)[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<nav\b(?=[^>]*class=["'][^"']*\bpage-nav\b)[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/locales\/<lang>\.lua/g, "locales/&lt;lang&gt;.lua")
    .trim();
}

function inline(nodes) {
  const parts = nodes.map((node) => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      return escapeMdxText(node.textContent);
    }
    if (!isElement(node)) return "";

    const tag = node.rawTagName.toLowerCase();

    if (tag === "strong" || tag === "b") return `**${inline(node.childNodes)}**`;
    if (tag === "em" || tag === "i") return `*${inline(node.childNodes)}*`;
    if (tag === "code" || tag === "kbd") return escapeInlineCode(node.textContent);
    if (tag === "br") return "\n";
    if (tag === "a") {
      const href = node.getAttribute("href") ?? "#";
      return `[${inline(node.childNodes)}](${href.replace(/\)/g, "%29")})`;
    }
    if (tag === "span" && hasClass(node, "chip")) {
      return `<Chip>${escapeMdxText(text(node))}</Chip>`;
    }
    if (tag === "span" && hasClass(node, "inline")) {
      return escapeInlineCode(node.textContent);
    }
    if (tag === "input" || tag === "button" || tag === "img") return "";
    if (tag === "label" || tag === "span") return inline(node.childNodes);

    return inline(node.childNodes);
  });

  return parts.join("").replace(/[ \t]*\n[ \t]*/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
}

function block(nodes) {
  const chunks = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (isWhitespaceText(node)) continue;

    if (isElement(node) && hasClass(node, "step")) {
      const steps = [];
      while (index < nodes.length) {
        const candidate = nodes[index];
        if (isWhitespaceText(candidate)) {
          index += 1;
          continue;
        }
        if (!isElement(candidate) || !hasClass(candidate, "step")) break;
        steps.push(renderStep(candidate));
        index += 1;
      }
      index -= 1;
      chunks.push(`<StepGroup>\n${steps.map((step) => indent(step, 2)).join("\n\n")}\n</StepGroup>`);
      continue;
    }

    const rendered = renderBlock(node);
    if (rendered) chunks.push(rendered);
  }

  return chunks.filter(Boolean).join("\n\n");
}

function renderBlock(node) {
  if (node.nodeType === NodeType.TEXT_NODE) {
    const value = normalizeInline(node.textContent);
    return value ? escapeMdxText(value) : "";
  }
  if (!isElement(node)) return "";

  const tag = node.rawTagName.toLowerCase();
  const unknownComment = attrsComment(node);

  if (hasClass(node, "lesson-nav") || hasClass(node, "lesson-pager") || hasClass(node, "page-nav")) return "";
  if (hasClass(node, "prev") || hasClass(node, "next")) return "";
  if (
    hasClass(node, "progress-top") ||
    hasClass(node, "rail") ||
    hasClass(node, "err-toolbar") ||
    hasClass(node, "err-empty") ||
    hasClass(node, "fw-toolbar") ||
    hasClass(node, "fw-empty") ||
    hasClass(node, "qu-site-footer") ||
    hasClass(node, "qu-foot") ||
    hasClass(node, "kit-back") ||
    hasClass(node, "kit-progress")
  ) {
    return "";
  }
  if (
    hasClass(node, "shell") ||
    hasClass(node, "shell--no-sidebar") ||
    hasClass(node, "prose") ||
    hasClass(node, "top") ||
    hasClass(node, "qu-page") ||
    hasClass(node, "kit-main") ||
    hasClass(node, "qu-container") ||
    hasClass(node, "qu-tools")
  ) {
    return joinComment(unknownComment, block(node.childNodes));
  }
  if (hasClass(node, "status") || hasClass(node, "meta") || hasClass(node, "eyebrow") || hasClass(node, "qu-eyebrow")) return "";
  if (hasClass(node, "lesson-list") || hasClass(node, "lesson-grid") || hasClass(node, "qu-tools__grid") || hasClass(node, "kit-days")) {
    return joinComment(unknownComment, renderLinkCardGrid(node));
  }
  if (hasClass(node, "lesson-card") || hasClass(node, "qu-tool-card") || hasClass(node, "kit-day")) return joinComment(unknownComment, renderLinkCard(node));
  if (hasClass(node, "lesson-hero")) return joinComment(unknownComment, renderLessonHero(node));
  if (hasClass(node, "qu-hero") || hasClass(node, "kit-header")) return joinComment(unknownComment, renderLessonHero(node));
  if (hasClass(node, "qu-section-head")) return joinComment(unknownComment, renderSectionHead(node));
  if (hasClass(node, "strict-template")) return joinComment(unknownComment, renderStrictTemplate(node));
  if (hasClass(node, "mental-model")) return joinComment(unknownComment, renderMentalModel(node));
  if (hasClass(node, "why-banner")) return joinComment(unknownComment, renderWhyBanner(node));
  if (hasClass(node, "err-list")) return joinComment(unknownComment, renderErrorCatalog(node));
  if (hasClass(node, "err-card")) return joinComment(unknownComment, renderErrorCard(node));
  if (hasClass(node, "err-card__row")) return joinComment(unknownComment, renderDefinitionTable(node));
  if (hasClass(node, "fw-list")) return joinComment(unknownComment, renderFrameworkList(node));
  if (hasClass(node, "fw-card")) return joinComment(unknownComment, renderFrameworkCard(node));
  if (hasClass(node, "fw-grid")) return joinComment(unknownComment, renderFrameworkGrid(node));
  if (hasClass(node, "cheat-diagram")) return joinComment(unknownComment, renderCheatDiagram(node));
  if (hasClass(node, "callout") || hasClass(node, "callout-inline")) return joinComment(unknownComment, renderCallout(node));
  if (hasClass(node, "reading-panel")) return joinComment(unknownComment, renderReadingPanel(node));
  if (hasClass(node, "prereq")) return joinComment(unknownComment, renderPrereq(node));
  if (hasClass(node, "beginner-orientation") && node.querySelector(".vocab-list")) {
    return joinComment(unknownComment, renderVocab(node));
  }
  if (hasClass(node, "lesson-recap")) return joinComment(unknownComment, renderRecap(node));
  if (hasClass(node, "lesson-refs")) return joinComment(unknownComment, renderRefs(node));
  if (hasClass(node, "lesson-exercise")) return joinComment(unknownComment, renderExercise(node));
  if (hasClass(node, "checkpoint")) return joinComment(unknownComment, renderCheckpoint(node));
  if (hasClass(node, "self-check")) return joinComment(unknownComment, renderSelfCheck(node));
  if (hasClass(node, "expected-output")) return joinComment(unknownComment, renderExpected(node));
  if (hasClass(node, "expected")) return joinComment(unknownComment, "");
  if (hasClass(node, "level-up")) return joinComment(unknownComment, renderLevelUp(node));
  if (hasClass(node, "quiz")) return joinComment(unknownComment, renderQuiz(node));
  if (hasClass(node, "cheatsheet")) return joinComment(unknownComment, renderCheatsheet(node));
  if (hasClass(node, "setup-list")) return joinComment(unknownComment, renderSetupList(node));
  if (hasClass(node, "failure-list") || hasClass(node, "failure-modes")) return joinComment(unknownComment, renderFailureList(node));
  if (hasClass(node, "benchmark")) return joinComment(unknownComment, renderBenchmark(node));
  if (hasClass(node, "first-script-callout")) return joinComment(unknownComment, renderFirstScriptCallout(node));
  if (hasClass(node, "qu-table-wrap")) return joinComment(unknownComment, renderTable(node.querySelector("table")));
  if (hasClass(node, "code")) return joinComment(unknownComment, renderCode(node));

  if (tag === "pre") return joinComment(unknownComment, renderCode(node));
  if (tag === "table") return joinComment(unknownComment, renderTable(node));
  if (tag === "details") return joinComment(unknownComment, renderDetails(node));
  if (tag === "h2") return joinComment(unknownComment, `## ${inline(node.childNodes)}`);
  if (tag === "h3") return joinComment(unknownComment, `### ${inline(node.childNodes)}`);
  if (tag === "h4") return joinComment(unknownComment, `#### ${inline(node.childNodes)}`);
  if (tag === "p") {
    const value = inline(node.childNodes);
    return joinComment(unknownComment, value);
  }
  if (tag === "ul" || tag === "ol") return joinComment(unknownComment, renderList(node, tag === "ol"));
  if (tag === "dl") return joinComment(unknownComment, renderDefinitionTable(node));
  if (tag === "figure" || tag === "div" || tag === "section" || tag === "aside" || tag === "form") {
    return joinComment(unknownComment, block(node.childNodes));
  }

  return joinComment(unknownComment, block(node.childNodes) || inline(node.childNodes));
}

function joinComment(comment, content) {
  if (!comment) return content;
  if (!content) return comment;
  return `${comment}\n${content}`;
}

function renderLessonHero(node) {
  const crumbSpans = node.querySelectorAll(".crumbs span");
  const fallbackCrumbs =
    text(node.querySelector(".qu-eyebrow") ?? node.querySelector(".kit-eyebrow"))
      .split(/[·|]/)[0]
      ?.trim() ?? "";
  const crumbs = crumbSpans.length > 0 ? text(crumbSpans.at(-1)) : fallbackCrumbs;
  const title = text(node.querySelector("h1") ?? node.querySelector(".kit-title"));
  const lede = inline(node.querySelector(".lede, .qu-hero__lede, .kit-lede")?.childNodes ?? []);
  const rows = node.querySelectorAll(".hero-outcome > div").map((row) => ({
    label: text(row.querySelector("dt")),
    value: text(row.querySelector("dd")),
  }));

  const meta = rows.map((row) => `    { label: ${jsString(row.label)}, value: ${jsString(row.value)} },`).join("\n");

  return `<LessonHero\n  crumbs="${escapeJsxAttr(crumbs)}"\n  title="${escapeJsxAttr(title)}"\n  meta={[\n${meta}\n  ]}\n>\n  ${lede}\n</LessonHero>`;
}

function renderSectionHead(node) {
  const parts = [];
  const heading = node.querySelector("h2");
  const lede = node.querySelector(".qu-section-head__lede");

  if (heading) parts.push(`## ${inline(heading.childNodes)}`);
  if (lede) parts.push(inline(lede.childNodes));

  const consumed = new Set([heading, lede].filter(Boolean));
  const rest = block(node.childNodes.filter((child) => !consumed.has(child) && !hasClass(child, "qu-eyebrow")));
  if (rest) parts.push(rest);

  return parts.filter(Boolean).join("\n\n");
}

function renderLinkCardGrid(node) {
  const cards = node
    .querySelectorAll(".lesson-card, .qu-tool-card, .kit-day")
    .map((card) => renderLinkCard(card))
    .filter(Boolean);

  if (cards.length === 0) return block(node.childNodes);

  return `<LinkCardGrid>\n${cards.map((card) => indent(card, 2)).join("\n")}\n</LinkCardGrid>`;
}

function renderLinkCard(node) {
  const href = node.getAttribute("href") ?? node.querySelector("a")?.getAttribute("href") ?? "";
  if (!href) return block(node.childNodes);

  const titleNode = node.querySelector("h2, h3, h4, strong, .qu-tool-card__title");
  const descNode = node.querySelector("p");
  const eyebrowNode =
    node.querySelector(".qu-tool-card__kicker") ??
    node.querySelector(".qu-tool-card__flag") ??
    node.querySelector(".kit-day-badge") ??
    node.querySelector(".num") ??
    node.querySelector(".status") ??
    node.querySelector(".qu-tool-card__meta");

  const attrs = [
    `href="${escapeJsxAttr(href)}"`,
    `title="${escapeJsxAttr(text(titleNode) || text(node))}"`,
  ];
  const desc = text(descNode);
  const eyebrow = text(eyebrowNode);

  if (desc) attrs.push(`desc="${escapeJsxAttr(desc)}"`);
  if (eyebrow) attrs.push(`eyebrow="${escapeJsxAttr(eyebrow)}"`);

  return `<LinkCard ${attrs.join(" ")} />`;
}

function renderStrictTemplate(node) {
  const chunks = [];

  for (const child of node.childNodes) {
    if (isWhitespaceText(child)) continue;
    if (!isElement(child)) continue;
    if (hasClass(child, "strict-kicker")) continue;
    if (child.rawTagName.toLowerCase() === "h2") continue;
    if (hasClass(child, "beginner-orientation") && child.querySelector(".vocab-list")) {
      chunks.push(renderVocab(child));
      continue;
    }
    if (hasClass(child, "why-banner")) {
      chunks.push(renderWhyBanner(child));
      continue;
    }
    if (hasClass(child, "lesson-refs")) {
      chunks.push(renderRefs(child));
      continue;
    }
    if (hasClass(child, "strict-section")) {
      chunks.push(renderStrictSection(child));
      continue;
    }
    chunks.push(renderBlock(child));
  }

  return chunks.filter(Boolean).join("\n\n");
}

function renderStrictSection(node) {
  const heading = node.querySelector("h3");
  const bodyNodes = node.childNodes.filter((child) => child !== heading);
  const parts = [];

  if (heading) parts.push(`## ${inline(heading.childNodes)}`);
  parts.push(block(bodyNodes));

  return parts.filter(Boolean).join("\n\n");
}

function renderMentalModel(node) {
  const heading = node.querySelector("h2") ?? node.querySelector("h3");
  const body = block(node.childNodes.filter((child) => child !== heading));
  const title = heading ? inline(heading.childNodes) : "Mental model";

  return [`## ${title}`, body].filter(Boolean).join("\n\n");
}

function renderStep(node) {
  const rawNum = text(node.querySelector(".step-num"));
  const parsedNum = rawNum.replace(/^step\s+/i, "").trim();
  const numProp = /^\d+$/.test(parsedNum) ? `num={${parsedNum}}` : `num="${escapeJsxAttr(parsedNum || rawNum)}"`;
  const title = text(node.querySelector("header h2"));
  const outcome = text(node.querySelector(".step-outcome")).replace(/^Outcome:\s*/i, "");
  const bodyNode = node.querySelector(".step-body");
  const body = block(bodyNode?.childNodes ?? node.childNodes.filter((child) => !hasClass(child, "step-outcome") && child.rawTagName?.toLowerCase() !== "header"));

  return `<Step ${numProp} title="${escapeJsxAttr(title)}" outcome="${escapeJsxAttr(outcome)}">\n${indent(body, 4)}\n</Step>`;
}

function renderReadingPanel(node) {
  const heading = node.querySelector("header") ?? node.querySelector("h2") ?? node.querySelector("h3");
  const title = heading ? text(heading) : "";
  const body = block(node.childNodes.filter((child) => child !== heading));

  return `<Callout variant="info"${title ? ` title="${escapeJsxAttr(title)}"` : ""}>\n${indent(body, 2)}\n</Callout>`;
}

function renderCallout(node) {
  const classes = classesOf(node);
  const variantClass = classes.find((className) => className.startsWith("callout--"));
  const variantName = variantClass ? variantClass.replace("callout--", "") : "info";
  const variant = VALID_CALLOUTS.has(variantName) ? variantName : "info";
  const header = node.querySelector("header");
  const leading = leadingStrong(node);
  const title = header ? text(header) : leading?.title;
  const bodyNodes = node.childNodes.filter((child) => child !== header);
  const body = leading ? renderWithoutLeadingStrong(node) : block(bodyNodes);

  return `<Callout variant="${variant}"${title ? ` title="${escapeJsxAttr(title)}"` : ""}>\n${indent(body, 2)}\n</Callout>`;
}

function renderWhyBanner(node) {
  const heading = node.querySelector("h3");
  const bodyNodes = node.childNodes.filter((child) => child !== heading);
  const body = block(bodyNodes);

  return `<Callout variant="tip" title="Why it matters">\n${indent(body, 2)}\n</Callout>`;
}

function leadingStrong(node) {
  const firstElement = node.childNodes.find((child) => !isWhitespaceText(child));
  if (!isElement(firstElement)) return null;

  const firstStrong =
    firstElement.rawTagName.toLowerCase() === "strong"
      ? firstElement
      : firstElement.childNodes.find((child) => !isWhitespaceText(child));

  if (!isElement(firstStrong, "strong")) return null;
  return { parent: firstElement, strong: firstStrong, title: text(firstStrong) };
}

function renderWithoutLeadingStrong(node) {
  const first = leadingStrong(node);
  if (!first) return block(node.childNodes);

  if (first.parent.rawTagName.toLowerCase() !== "p") {
    return block(node.childNodes.filter((child) => child !== first.strong));
  }

  const paragraphRest = first.parent.childNodes.filter((child) => child !== first.strong);
  const syntheticParagraph = inline(paragraphRest).replace(/^:\s*/, "");
  const remaining = node.childNodes.filter((child) => child !== first.parent);
  return [syntheticParagraph, block(remaining)].filter(Boolean).join("\n\n");
}

function renderPrereq(node) {
  const list = node.querySelector(".prereq-list") ?? node.querySelector("ul");
  const items = list ? directChildren(list, "li").map((item) => text(item)) : [];
  return `<Prereq\n  items={[\n${items.map((item) => `    ${jsString(item)},`).join("\n")}\n  ]}\n/>`;
}

function renderVocab(node) {
  const rows = node.querySelectorAll(".vocab-list > div, .vocab-list > dt")
    .map((row) => {
      if (row.rawTagName.toLowerCase() === "dt") {
        return { term: text(row), def: text(row.nextElementSibling) };
      }
      return { term: text(row.querySelector("dt")), def: text(row.querySelector("dd")) };
    })
    .filter((row) => row.term || row.def);

  return `<Vocab\n  items={[\n${rows.map((row) => `    { term: ${jsString(row.term)}, def: ${jsString(row.def)} },`).join("\n")}\n  ]}\n/>`;
}

function renderRecap(node) {
  const items = node.querySelectorAll("li").map((item) => text(item));
  return `<Recap\n  items={[\n${items.map((item) => `    ${jsString(item)},`).join("\n")}\n  ]}\n/>`;
}

function renderRefs(node) {
  const refs = node.querySelectorAll("a").map((anchor) => ({
    label: text(anchor),
    href: anchor.getAttribute("href") ?? "#",
  }));

  return `<Refs\n  items={[\n${refs.map((ref) => `    { label: ${jsString(ref.label)}, href: ${jsString(ref.href)} },`).join("\n")}\n  ]}\n/>`;
}

function renderExercise(node) {
  const title = text(node.querySelector("h2")) || "Exercise";
  const children = node.childNodes.filter((child) => !(isElement(child, "h2")));
  const chunks = [];

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (isWhitespaceText(child)) continue;
    if (isElement(child) && hasClass(child, "expected")) {
      const expectedNodes = [];
      index += 1;
      while (index < children.length) {
        const candidate = children[index];
        if (isWhitespaceText(candidate)) {
          index += 1;
          continue;
        }
        expectedNodes.push(candidate);
        index += 1;
      }
      chunks.push(`<ExpectedOutput>\n${indent(block(expectedNodes), 2)}\n</ExpectedOutput>`);
      break;
    }
    chunks.push(renderBlock(child));
  }

  return `<Exercise title="${escapeJsxAttr(title)}">\n${indent(chunks.filter(Boolean).join("\n\n"), 2)}\n</Exercise>`;
}

function renderCheckpoint(node) {
  const header = node.querySelector("header");
  const questionNode = header?.querySelector("h3") ?? node.querySelector("summary") ?? node.querySelector("h3") ?? node.querySelector("h2");
  const question = text(questionNode) || "Checkpoint";
  const excluded = new Set([header, questionNode].filter(Boolean));
  const bodyNodes = node.childNodes.filter((child) => !excluded.has(child));
  const body = block(bodyNodes) || "Review the lesson text above, then check your answer.";

  return `<Checkpoint question="${escapeJsxAttr(question)}">\n${indent(body, 2)}\n</Checkpoint>`;
}

function renderSelfCheck(node) {
  const details = directChildren(node, "details");
  if (details.length === 0) return block(node.childNodes);
  return details.map((detail) => renderDetails(detail)).join("\n\n");
}

function renderDetails(node) {
  const summary = node.querySelector("summary");
  const title = text(summary) || "More detail";
  const bodyNodes = node.childNodes.filter((child) => child !== summary);
  const body = block(bodyNodes) || "Review the lesson text above.";

  return `<Callout variant="info" title="${escapeJsxAttr(title)}">\n${indent(body, 2)}\n</Callout>`;
}

function renderExpected(node) {
  const body = block(node.childNodes) || inline(node.childNodes);
  return `<ExpectedOutput>\n${indent(body, 2)}\n</ExpectedOutput>`;
}

function renderLevelUp(node) {
  const heading = node.querySelector("h2") ?? node.querySelector("h3");
  const title = heading ? text(heading) : "";
  const body = block(node.childNodes.filter((child) => child !== heading));
  return `<LevelUp${title ? ` title="${escapeJsxAttr(title)}"` : ""}>\n${indent(body, 2)}\n</LevelUp>`;
}

function renderQuiz(node) {
  const fieldsets = node.querySelectorAll("fieldset");
  const quizzes = [];

  for (const fieldset of fieldsets) {
    const question = text(fieldset.querySelector("legend"));
    const answer = (fieldset.getAttribute("data-answer") ?? "").trim();
    const labels = fieldset.querySelectorAll("label");
    const options = labels.map((label) => {
      const input = label.querySelector("input");
      const value = (input?.getAttribute("value") ?? "").trim();
      const labelText = textFromNodes(label.childNodes.filter((child) => child !== input));
      const labelMdx = inline(label.childNodes.filter((child) => child !== input));
      const correct =
        input?.getAttribute("data-answer") === "true" ||
        input?.getAttribute("data-correct") === "true" ||
        (answer && value === answer);
      return { label: labelText, labelMdx, correct };
    });
    const correctOption = options.find((option) => option.correct);
    const optionsProp = options
      .map((option) => `    { label: ${jsString(option.label)}${option.correct ? ", correct: true" : ""} },`)
      .join("\n");
    const explanation = correctOption ? `Correct answer: **${correctOption.labelMdx}**.` : "Review the lesson text above, then try again.";

    quizzes.push(`<Quiz\n  question="${escapeJsxAttr(question)}"\n  options={[\n${optionsProp}\n  ]}\n>\n${indent(explanation, 2)}\n</Quiz>`);
  }

  return quizzes.join("\n\n");
}

function renderCheatsheet(node) {
  const heading = node.querySelector("h2");
  const rows = cheatsheetRows(node);
  return renderCheatsheetComponent(heading ? text(heading) : "", rows);
}

function renderSetupList(node) {
  return renderCheatsheetComponent("Setup", definitionRows(node));
}

function renderCheatsheetComponent(title, rows) {
  const rowsProp = rows
    .filter((row) => row.cmd || row.desc)
    .map((row) => `    { cmd: ${jsString(row.cmd)}, desc: ${jsString(row.desc)} },`)
    .join("\n");

  return `<Cheatsheet${title ? ` title="${escapeJsxAttr(title)}"` : ""}\n  rows={[\n${rowsProp}\n  ]}\n/>`;
}

function cheatsheetRows(node) {
  const dl = node.querySelector("dl");
  if (dl) return definitionRows(dl);

  const rows = [];
  for (const row of node.querySelectorAll(".cheat-row")) {
    if (hasClass(row, "cheat-head")) continue;
    const cells = directChildren(row, "div");
    if (cells.length < 2) continue;
    rows.push({ cmd: textFromNodes(cells[0].childNodes), desc: textFromNodes(cells[1].childNodes) });
  }

  return rows;
}

function definitionRows(dl) {
  if (!dl) return [];
  const rows = [];
  const divRows = directChildren(dl, "div");

  if (divRows.length > 0) {
    for (const row of divRows) {
      rows.push({
        cmd: textFromNodes(row.querySelector("dt")?.childNodes ?? []),
        desc: textFromNodes(row.querySelector("dd")?.childNodes ?? []),
      });
    }
    return rows;
  }

  const children = directChildren(dl);
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (child.rawTagName.toLowerCase() !== "dt") continue;
    const dd = children[index + 1]?.rawTagName?.toLowerCase() === "dd" ? children[index + 1] : null;
    rows.push({ cmd: textFromNodes(child.childNodes), desc: textFromNodes(dd?.childNodes ?? []) });
  }

  return rows;
}

function renderFailureList(node) {
  const heading = node.querySelector("h2") ?? node.querySelector("h3");
  const title = heading ? text(heading) : "";
  const prefaceNodes = node.childNodes.filter(
    (child) => child !== heading && !(isElement(child, "ul")) && !(isElement(child, "ol")) && !(isElement(child, "dl")) && !(isElement(child, "table")),
  );
  const preface = block(prefaceNodes);
  const items = failureItems(node);
  const itemsProp = items
    .filter((item) => item.symptom || item.fix)
    .map((item) => `    { symptom: ${jsString(item.symptom)}${item.fix ? `, fix: ${jsString(item.fix)}` : ""} },`)
    .join("\n");
  const list = `<FailureList${title ? ` title="${escapeJsxAttr(title)}"` : ""}\n  items={[\n${itemsProp}\n  ]}\n/>`;

  return [preface, list].filter(Boolean).join("\n\n");
}

function renderErrorCatalog(node) {
  const items = node
    .querySelectorAll(".err-card")
    .map((card) => errorCardItem(card))
    .filter((item) => item.symptom || item.fix);
  const itemsProp = items
    .map((item) => `    { symptom: ${jsString(item.symptom)}${item.fix ? `, fix: ${jsString(item.fix)}` : ""} },`)
    .join("\n");

  return `<FailureList title="Error catalog"\n  items={[\n${itemsProp}\n  ]}\n/>`;
}

function renderErrorCard(node) {
  const item = errorCardItem(node);
  const rows = node.querySelectorAll(".err-card__row").map((row) => [text(row.querySelector("dt")), inline(row.querySelector("dd")?.childNodes ?? [])]);

  if (item.symptom && item.fix) {
    return `<FailureList\n  items={[\n    { symptom: ${jsString(item.symptom)}, fix: ${jsString(item.fix)} },\n  ]}\n/>`;
  }

  return renderMarkdownTable(["Field", "Value"], rows);
}

function errorCardItem(card) {
  const symptom = text(card.querySelector(".err-card__msg"));
  const rows = new Map(
    card.querySelectorAll(".err-card__row").map((row) => [text(row.querySelector("dt")).toLowerCase(), textFromNodes(row.querySelector("dd")?.childNodes ?? [])]),
  );
  const means = rows.get("means") ?? "";
  const cause = rows.get("cause") ?? "";
  const fix = rows.get("fix") ?? "";
  const combinedFix = [
    means ? `Means: ${means}` : "",
    cause ? `Cause: ${cause}` : "",
    fix ? `Fix: ${fix}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return { symptom, fix: combinedFix };
}

function renderFrameworkList(node) {
  const rows = node.querySelectorAll(".fw-card").map((card) => frameworkCardRow(card));
  return renderMarkdownTable(["Task", "Note", "QBCore", "ESX", "ox_lib"], rows);
}

function renderFrameworkCard(node) {
  return renderMarkdownTable(["Task", "Note", "QBCore", "ESX", "ox_lib"], [frameworkCardRow(node)]);
}

function frameworkCardRow(card) {
  const cells = new Map(
    card.querySelectorAll(".fw-cell").map((cell) => {
      const label = text(cell.querySelector(".fw-cell__label"));
      const value = textFromNodes(cell.childNodes.filter((child) => !hasClass(child, "fw-cell__label")));
      return [label.toLowerCase(), value];
    }),
  );

  return [
    text(card.querySelector(".fw-card__title")),
    text(card.querySelector(".fw-card__note")),
    cells.get("qbcore") ?? "",
    cells.get("esx") ?? "",
    cells.get("ox_lib") ?? cells.get("ox") ?? "",
  ];
}

function renderFrameworkGrid(node) {
  const rows = node.querySelectorAll(".fw-cell").map((cell) => [text(cell.querySelector(".fw-cell__label")), textFromNodes(cell.childNodes.filter((child) => !hasClass(child, "fw-cell__label")))]);
  return renderMarkdownTable(["Framework", "Example"], rows);
}

function renderCheatDiagram(node) {
  const caption = inline(node.querySelector("figcaption")?.childNodes ?? []);
  const desc = text(node.querySelector("desc"));
  const body = [desc, caption].filter(Boolean).join("\n\n");

  return body ? `<Callout variant="info">\n${indent(body, 2)}\n</Callout>` : "";
}

function failureItems(node) {
  const table = node.rawTagName?.toLowerCase() === "table" ? node : node.querySelector("table");
  if (table) return failureItemsFromTable(table);

  const dl = node.rawTagName?.toLowerCase() === "dl" ? node : node.querySelector("dl");
  if (dl) {
    return definitionRows(dl).map((row) => ({ symptom: row.cmd, fix: row.desc }));
  }

  const list = node.rawTagName?.toLowerCase() === "ul" || node.rawTagName?.toLowerCase() === "ol" ? node : node.querySelector("ul, ol");
  if (!list) return [];

  return directChildren(list, "li").map((item) => splitFailureText(item));
}

function failureItemsFromTable(table) {
  return table.querySelectorAll("tbody tr").map((row) => {
    const cells = directChildren(row, "td").map((cell) => textFromNodes(cell.childNodes));
    const symptom = cells[0] ?? "";
    if (cells.length <= 2) return { symptom, fix: cells[1] ?? "" };

    const cause = cells.slice(1, -1).filter(Boolean).join(" ");
    const fix = cells.at(-1) ?? "";
    return { symptom, fix: [cause ? `Cause: ${cause}` : "", fix ? `Fix: ${fix}` : ""].filter(Boolean).join(" ") };
  });
}

function splitFailureText(item) {
  const firstElement = item.childNodes.find((child) => !isWhitespaceText(child));
  const firstStrong =
    isElement(firstElement, "strong") || isElement(firstElement, "b")
      ? firstElement
      : isElement(firstElement) && (firstElement.childNodes.find((child) => isElement(child, "strong") || isElement(child, "b")) ?? null);

  if (firstStrong) {
    const symptom = text(firstStrong).replace(/:$/, "");
    const fix = textFromNodes(item.childNodes).replace(text(firstStrong), "").replace(/^[:\s-]+/, "");
    return { symptom, fix };
  }

  const value = textFromNodes(item.childNodes);
  const means = value.match(/^(.+?)\s+means\s+(.+)$/i);
  if (means) return { symptom: means[1], fix: means[2] };

  const sentence = value.match(/^(.+?[.!?])\s+(.+)$/);
  if (sentence) return { symptom: sentence[1], fix: sentence[2] };

  return { symptom: value, fix: "" };
}

function renderBenchmark(node) {
  const table = node.querySelector("table");
  const parts = [];

  for (const child of node.childNodes) {
    if (isWhitespaceText(child)) continue;
    if (child === table) {
      parts.push(renderTable(table));
      continue;
    }
    if (isElement(child, "h2")) {
      parts.push(`## ${inline(child.childNodes)}`);
      continue;
    }
    if (isElement(child, "h3")) {
      parts.push(`### ${inline(child.childNodes)}`);
      continue;
    }
    parts.push(renderBlock(child));
  }

  return parts.filter(Boolean).join("\n\n");
}

function renderFirstScriptCallout(node) {
  const title = text(node.querySelector(".first-script-callout__title"));
  const lede = inline(node.querySelector(".first-script-callout__lede")?.childNodes ?? []);
  const list = node.querySelector(".first-script-callout__list");
  const cta = node.querySelector(".first-script-callout__cta");
  const lines = [];

  if (lede) lines.push(lede);
  if (list) lines.push(renderList(list, false));
  if (cta) {
    const href = cta.getAttribute("href") ?? "#";
    lines.push(`[${inline(cta.childNodes)}](${href.replace(/\)/g, "%29")})`);
  }

  return `<Callout variant="fivem"${title ? ` title="${escapeJsxAttr(title)}"` : ""}>\n${indent(lines.filter(Boolean).join("\n\n"), 2)}\n</Callout>`;
}

function renderCode(node) {
  const code = node.querySelector("code") ?? (node.rawTagName?.toLowerCase() === "code" ? node : null);
  if (!code && node.rawTagName?.toLowerCase() === "pre") {
    const value = node.textContent.replace(/^\n+|\n+$/g, "");
    return `\`\`\`\n${value}\n\`\`\``;
  }
  if (!code) return block(node.childNodes);

  const className = code.getAttribute("class") ?? "";
  const language = className.match(/\blanguage-([a-z0-9_-]+)/i)?.[1] ?? "";
  const value = code.textContent.replace(/^\n+|\n+$/g, "");
  return `\`\`\`${language}\n${value}\n\`\`\``;
}

function renderTable(table) {
  if (!table) return "";

  const headerCells = table.querySelectorAll("thead th");
  const headers =
    headerCells.length > 0
      ? headerCells.map((cell) => inline(cell.childNodes))
      : directChildren(table.querySelector("tr") ?? table, "th").map((cell) => inline(cell.childNodes));
  const bodyRows = table.querySelectorAll("tbody tr");
  const rows = bodyRows.length > 0 ? bodyRows : table.querySelectorAll("tr").slice(headers.length > 0 ? 1 : 0);
  const safeHeaders = headers.length > 0 ? headers : ["Column", "Value"];

  const lines = [
    `| ${safeHeaders.map((cell) => escapeMarkdownPipe(cell)).join(" | ")} |`,
    `| ${safeHeaders.map(() => "---").join(" | ")} |`,
  ];

  for (const row of rows) {
    const cells = directChildren(row, "td").map((cell) => inline(cell.childNodes));
    if (cells.length === 0) continue;
    while (cells.length < safeHeaders.length) cells.push("");
    lines.push(`| ${cells.slice(0, safeHeaders.length).map((cell) => escapeMarkdownPipe(cell)).join(" | ")} |`);
  }

  return lines.join("\n");
}

function renderMarkdownTable(headers, rows) {
  const safeHeaders = headers.length > 0 ? headers : ["Column", "Value"];
  const lines = [
    `| ${safeHeaders.map((cell) => escapeMarkdownTableCell(cell)).join(" | ")} |`,
    `| ${safeHeaders.map(() => "---").join(" | ")} |`,
  ];

  for (const row of rows) {
    const cells = [...row];
    while (cells.length < safeHeaders.length) cells.push("");
    lines.push(`| ${cells.slice(0, safeHeaders.length).map((cell) => escapeMarkdownTableCell(cell)).join(" | ")} |`);
  }

  return lines.join("\n");
}

function renderDefinitionTable(dl) {
  if (!dl) return "";
  const rows = [];
  const divRows = directChildren(dl, "div");

  if (divRows.length > 0) {
    for (const row of divRows) {
      rows.push([inline(row.querySelector("dt")?.childNodes ?? []), inline(row.querySelector("dd")?.childNodes ?? [])]);
    }
  } else {
    const children = directChildren(dl);
    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];
      if (child.rawTagName.toLowerCase() !== "dt") continue;
      const dd = children[index + 1]?.rawTagName?.toLowerCase() === "dd" ? children[index + 1] : null;
      rows.push([inline(child.childNodes), inline(dd?.childNodes ?? [])]);
    }
  }

  const lines = ["| Term | Description |", "| --- | --- |"];
  for (const [term, description] of rows) {
    lines.push(`| ${escapeMarkdownPipe(term)} | ${escapeMarkdownPipe(description)} |`);
  }
  return lines.join("\n");
}

function renderList(node, ordered) {
  return directChildren(node, "li")
    .map((item, index) => {
      const prefix = ordered ? `${index + 1}. ` : "- ";
      const hasBlockChildren = item.childNodes.some(
        (child) =>
          isElement(child) &&
          ["p", "ul", "ol", "pre", "figure", "div", "section", "details"].includes(child.rawTagName.toLowerCase()),
      );

      if (!hasBlockChildren) {
        return `${prefix}${inline(item.childNodes)}`;
      }

      const rendered = block(item.childNodes);
      return `${prefix}${rendered.split("\n").join("\n  ")}`;
    })
    .join("\n");
}

function indent(value, spaces) {
  const pad = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : ""))
    .join("\n");
}

function finalizeMdx(value) {
  return `${value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`;
}

async function convertSlug(slug) {
  if (slug === "two-worlds") {
    console.error(`[${slug}] skipped`);
    return null;
  }

  state.slug = slug;
  state.unmappedClasses = new Set();
  state.unmappedBlocks = new Map();

  const sourcePath = path.join(sourceDir, `${slug}.html`);
  const html = await readFile(sourcePath, "utf8");
  const main = extractMain(html, sourcePath);
  const root = parse(main, {
    blockTextElements: { script: true, noscript: true, style: true },
    comment: false,
  });
  const mdx = finalizeMdx(block(root.childNodes));
  const outputPath = path.join(outputDir, `${slug}.mdx`);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, mdx, "utf8");

  console.error(`[${slug}] wrote ${path.relative(appRoot, outputPath)}`);
  if (state.unmappedClasses.size > 0) {
    console.error(`[${slug}] unmapped classes: ${[...state.unmappedClasses].sort().join(", ")}`);
  } else {
    console.error(`[${slug}] unmapped classes: none`);
  }

  return {
    slug,
    unmappedClasses: [...state.unmappedClasses].sort(),
    unmappedBlocks: [...state.unmappedBlocks.entries()].map(([classes, details]) => ({
      classes,
      count: details.count,
      tags: [...details.tags].sort(),
    })),
  };
}

async function convertHubEntry(entry) {
  const route = entry.route;
  const sourcePath = resolveHubSource(entry);
  const sourceLabel = sourcePath ? path.relative(appRoot, sourcePath) : entry.sourcePath;

  if (HUB_INDEX_ROUTES.has(route)) {
    return skipHub(route, "index", sourceLabel);
  }

  if (!sourcePath) {
    return skipHub(route, "not-a-guide", sourceLabel || "missing source");
  }

  state.slug = route;
  state.unmappedClasses = new Set();
  state.unmappedBlocks = new Map();

  const html = await readFile(sourcePath, "utf8");
  const interactiveReason = interactiveHubReason(html);
  if (interactiveReason) return skipHub(route, "interactive", `${sourceLabel}; ${interactiveReason}`);
  if (isFrameworkMatrixIndex(html)) return skipHub(route, "index", `${sourceLabel}; framework matrix`);
  if (!isGuideHub(html)) return skipHub(route, "not-a-guide", sourceLabel);

  const main = extractMain(html, sourcePath, { hub: true });
  const root = parse(main, {
    blockTextElements: { script: true, noscript: true, style: true },
    comment: false,
  });
  const mdx = finalizeMdx(block(root.childNodes));
  const outputPath = hubOutputPath(route);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, mdx, "utf8");
  const compileFailure = await compileMdxFile(outputPath);

  console.error(`[${route}] wrote ${path.relative(appRoot, outputPath)}`);
  if (state.unmappedClasses.size > 0) {
    console.error(`[${route}] unmapped classes: ${[...state.unmappedClasses].sort().join(", ")}`);
  } else {
    console.error(`[${route}] unmapped classes: none`);
  }
  if (compileFailure) {
    console.error(`[${route}] compile failed: ${compileFailure.message}`);
  } else {
    console.error(`[${route}] compile: ok`);
  }

  return {
    route,
    converted: true,
    outputPath,
    unmappedClasses: [...state.unmappedClasses].sort(),
    compileFailure,
  };
}

async function convertTargetHubRoute(route, manifest) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const entry = manifest.find((item) => item.route === normalizedRoute) ?? { route: normalizedRoute, sourcePath: "" };
  const sourcePath = resolveHubSource(entry);
  const sourceLabel = sourcePath ? path.relative(appRoot, sourcePath) : entry.sourcePath;

  if (!sourcePath) {
    return skipHub(normalizedRoute, "missing-source", sourceLabel || "missing source");
  }

  state.slug = normalizedRoute;
  state.unmappedClasses = new Set();
  state.unmappedBlocks = new Map();

  const html = await readFile(sourcePath, "utf8");
  const main = extractMain(html, sourcePath, { hub: true });
  const root = parse(main, {
    blockTextElements: { script: true, noscript: true, style: true },
    comment: false,
  });
  let mdx = finalizeMdx(block(root.childNodes));
  if (normalizedRoute === "/setup" && !mdx.includes("<LinkCardGrid>")) {
    mdx = insertAfterFirstLessonHero(mdx, renderSetupToolGrid(root));
  }
  const outputPath = hubOutputPath(normalizedRoute);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, mdx, "utf8");
  const compileFailure = await compileMdxFile(outputPath);
  const lineCount = mdx.split("\n").length - 1;

  console.error(`[${normalizedRoute}] wrote ${path.relative(appRoot, outputPath)} (${lineCount} lines)`);
  if (state.unmappedClasses.size > 0) {
    console.error(`[${normalizedRoute}] unmapped classes: ${[...state.unmappedClasses].sort().join(", ")}`);
  } else {
    console.error(`[${normalizedRoute}] unmapped classes: none`);
  }
  if (compileFailure) {
    console.error(`[${normalizedRoute}] compile failed: ${compileFailure.message}`);
  } else {
    console.error(`[${normalizedRoute}] compile: ok`);
  }

  return {
    route: normalizedRoute,
    converted: true,
    outputPath,
    lineCount,
    unmappedClasses: [...state.unmappedClasses].sort(),
    compileFailure,
  };
}

function renderSetupToolGrid(root) {
  const cards = root
    .querySelectorAll(".step-body li")
    .map((item) => {
      const anchor = item.querySelector("a");
      if (!anchor) return null;
      const href = anchor.getAttribute("href") ?? "";
      const title = text(anchor);
      const desc = textFromNodes(item.childNodes).replace(title, "").trim();
      if (!href || !title) return null;
      return { href, title, desc };
    })
    .filter(Boolean)
    .slice(0, 5);

  if (cards.length === 0) return "";

  return `<LinkCardGrid>\n${cards
    .map((card) => {
      const attrs = [`href="${escapeJsxAttr(card.href)}"`, `title="${escapeJsxAttr(card.title)}"`];
      if (card.desc) attrs.push(`desc="${escapeJsxAttr(card.desc)}"`);
      attrs.push('eyebrow="Setup tool"');
      return indent(`<LinkCard ${attrs.join(" ")} />`, 2);
    })
    .join("\n")}\n</LinkCardGrid>`;
}

function insertAfterFirstLessonHero(mdx, addition) {
  if (!addition) return mdx;
  return mdx.replace("</LessonHero>", `</LessonHero>\n\n${addition}`);
}

function skipHub(route, reason, detail) {
  console.error(`[${route}] skipped: ${reason}${detail ? ` (${detail})` : ""}`);
  return { route, skipped: true, reason, detail };
}

function resolveHubSource(entry) {
  const routeRelative = entry.route.replace(/^\//, "");
  const routeSource = path.join(hubSourceDir, `${routeRelative}.html`);
  if (fileExists(routeSource)) return routeSource;

  const manifestSource = entry.sourcePath ? path.join(hubSourceDir, entry.sourcePath) : "";
  if (manifestSource && fileExists(manifestSource)) return manifestSource;

  if (entry.sourcePath?.endsWith("/index.html")) {
    const flatSource = path.join(hubSourceDir, `${entry.sourcePath.replace(/\/index\.html$/, ".html")}`);
    if (fileExists(flatSource)) return flatSource;
  }

  return null;
}

function fileExists(filePath) {
  return Boolean(filePath) && existsSync(filePath);
}

function interactiveHubReason(html) {
  if (/\bkit-day\b/.test(html)) return "kit-day";
  if (/\bdata-day\b/.test(html)) return "data-day";
  if (html.includes("/assets/lab")) return "/assets/lab";
  return "";
}

function isGuideHub(html) {
  return /\blesson-hero\b/.test(html) || /\bstep\b/.test(html) || /\bstrict-section\b/.test(html);
}

function isFrameworkMatrixIndex(html) {
  return /\bfw-list\b/.test(html) && /\bfw-cell\b/.test(html);
}

function hubOutputPath(route) {
  const relative = route.replace(/^\//, "");
  return path.join(hubOutputDir, `${relative}.mdx`);
}

async function compileMdxFile(filePath) {
  try {
    const value = await readFile(filePath, "utf8");
    if (value.includes("TODO")) {
      return new Error("TODO marker found");
    }
    const compile = await getMdxCompile();
    await compile(value, { remarkPlugins: [remarkGfm], jsx: true, outputFormat: "function-body" });
    return null;
  } catch (error) {
    return error;
  }
}

async function getMdxCompile() {
  if (mdxCompile) return mdxCompile;

  let modulePath = "";
  try {
    modulePath = require.resolve("@mdx-js/mdx");
  } catch {
    const loaderRequire = createRequire(require.resolve("@mdx-js/loader"));
    modulePath = loaderRequire.resolve("@mdx-js/mdx");
  }

  const mod = await import(pathToFileURL(modulePath).href);
  mdxCompile = mod.compile;
  return mdxCompile;
}

async function convertHubs() {
  const manifest = JSON.parse(await readFile(hubManifestPath, "utf8"));
  const reports = [];

  for (const entry of manifest) {
    reports.push(await convertHubEntry(entry));
  }

  const generated = reports.filter((report) => report.converted);
  const batchFailures = [];
  for (const report of generated) {
    const failure = await compileMdxFile(report.outputPath);
    if (failure) batchFailures.push({ route: report.route, message: failure.message });
  }

  const allUnmapped = [...new Set(generated.flatMap((report) => report.unmappedClasses))].sort();
  console.log(`Converted count: ${generated.length}`);
  console.log("Converted routes:");
  for (const report of generated) console.log(`- ${report.route}`);
  console.log("Skipped routes:");
  for (const report of reports.filter((item) => item.skipped)) {
    console.log(`- ${report.route}: ${report.reason}${report.detail ? ` (${report.detail})` : ""}`);
  }
  console.log(`Remaining unmapped classes: ${allUnmapped.length > 0 ? allUnmapped.join(", ") : "none"}`);
  console.log("Compile failures:");
  if (batchFailures.length === 0) {
    console.log("- none");
  } else {
    for (const failure of batchFailures) console.log(`- ${failure.route}: ${failure.message}`);
  }

  return { reports, batchFailures, allUnmapped };
}

async function convertTargetHubRoutes(routes = TARGET_HUB_ROUTES) {
  const manifest = JSON.parse(await readFile(hubManifestPath, "utf8"));
  const reports = [];

  for (const route of routes) {
    reports.push(await convertTargetHubRoute(route, manifest));
  }

  const generated = reports.filter((report) => report.converted);
  const skipped = reports.filter((report) => report.skipped);
  const batchFailures = generated
    .filter((report) => report.compileFailure)
    .map((report) => ({ route: report.route, message: report.compileFailure.message }));
  const allUnmapped = [...new Set(generated.flatMap((report) => report.unmappedClasses))].sort();

  console.log("Written files:");
  for (const report of generated) {
    console.log(`- ${path.relative(appRoot, report.outputPath)}: ${report.lineCount} lines`);
  }
  if (skipped.length > 0) {
    console.log("Skipped routes:");
    for (const report of skipped) console.log(`- ${report.route}: ${report.reason}${report.detail ? ` (${report.detail})` : ""}`);
  }
  console.log(`Remaining unmapped classes: ${allUnmapped.length > 0 ? allUnmapped.join(", ") : "none"}`);
  console.log("Compile failures:");
  if (batchFailures.length === 0) {
    console.log("- none");
  } else {
    for (const failure of batchFailures) console.log(`- ${failure.route}: ${failure.message}`);
  }

  return { reports, skipped, batchFailures, allUnmapped };
}

const args = process.argv.slice(2);

if (args.includes("--hub-routes")) {
  const routeIndex = args.indexOf("--hub-routes");
  const routes = args.slice(routeIndex + 1).filter((arg) => !arg.startsWith("--"));
  const result = await convertTargetHubRoutes(routes.length > 0 ? routes : TARGET_HUB_ROUTES);
  if (result.skipped.length > 0 || result.batchFailures.length > 0 || result.allUnmapped.length > 0) process.exitCode = 1;
} else if (args.includes("--hubs")) {
  const result = await convertHubs();
  if (result.batchFailures.length > 0 || result.allUnmapped.length > 0) process.exitCode = 1;
} else {
  const slugs = (args.length > 0 ? args : DEFAULT_SLUGS).filter(Boolean);
  const reports = [];

  for (const slug of slugs) {
    const report = await convertSlug(slug);
    if (report) reports.push(report);
  }

  const allUnmapped = [...new Set(reports.flatMap((report) => report.unmappedClasses))].sort();
  console.error(`[all] unmapped classes: ${allUnmapped.length > 0 ? allUnmapped.join(", ") : "none"}`);
}
