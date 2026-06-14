import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");
const outputDir = path.join(appRoot, "content", "hubs");

const TRACK_ZERO = {
  "clase-00/leason00.html": "/lessons/install-fivem-client",
  "clase-00b/leason00b.html": "/lessons/tools-and-database",
  "clase-00c/leason00c.html": "/lessons/artifacts-txadmin",
  "clase-00d/leason00d.html": "/lessons/server-cfg",
  "clase-00e/leason00e.html": "/lessons/txadmin-tour",
  "clase-00f/leason00f.html": "/lessons/connect-restart",
};

const HUB_SECTIONS = [
  { source: "operator", target: "server" },
  { source: "resources", target: "resources" },
  { source: "templates", target: "templates" },
  { source: "expansion", target: "expansion" },
  { source: "cheatsheets", target: "cheatsheets" },
  { source: "setup", target: "setup" },
  { source: "starter-kit", target: "starter-kit" },
];

const DELETED_DIRS = new Set([
  "modern-fivem",
  "lua-guide",
  "entrepreneur",
  "mastery",
  "learn",
  "fivem-docs-for-dummies",
  "source-map",
  "checkout",
]);

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

const extractDescription = (html) => {
  const match = html.match(/<meta\s+name=["']description["']\s+content=(["'])(.*?)\1/i);
  return match ? decodeEntities(match[2]) : "";
};

const extractBody = (html, sourcePath) => {
  const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (!match) throw new Error(`Could not find <body> in ${sourcePath}`);

  return match[1]
    .replace(/<a\b(?=[^>]*class=["'][^"']*\bskip-link\b)[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<header\b(?=[^>]*class=["'][^"']*\btopbar\b)[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
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

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(fullPath) : fullPath;
    }),
  );
  return files.flat();
};

const normalizeSourcePath = (value) => value.replaceAll(path.sep, "/").replace(/^\/+/, "");

const routeForHubSource = (sourcePath) => {
  const section = HUB_SECTIONS.find((item) => sourcePath === item.source || sourcePath.startsWith(`${item.source}/`));
  if (!section) return null;

  const relative = path.posix.relative(section.source, sourcePath);
  if (relative === "index.html") return `/${section.target}`;
  if (relative.endsWith("/index.html")) {
    return `/${section.target}/${relative.slice(0, -"/index.html".length)}`;
  }
  if (relative.endsWith(".html")) {
    return `/${section.target}/${relative.slice(0, -".html".length)}`;
  }
  return `/${section.target}/${relative}`;
};

const splitUrl = (href) => {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const queryIndex = beforeHash.indexOf("?");
  return {
    pathname: queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash,
    query: queryIndex >= 0 ? beforeHash.slice(queryIndex) : "",
    hash,
  };
};

const isExternalUrl = (value) => /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);

const normalizeRelativeTarget = (sourcePath, hrefPathname) => {
  if (!hrefPathname || hrefPathname === ".") return path.posix.join(path.posix.dirname(sourcePath), "index.html");
  if (hrefPathname === "/") return "index.html";

  const raw = hrefPathname.startsWith("/")
    ? hrefPathname.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), hrefPathname));

  if (raw === "." || raw === "") return "index.html";
  if (raw.endsWith("/")) return `${raw}index.html`;
  if (!path.posix.extname(raw) && !raw.endsWith("index.html")) return `${raw}/index.html`;
  return raw;
};

const curriculumMap = JSON.parse(await readFile(path.join(repoRoot, "curriculum-map.json"), "utf8"));
const routeBySource = new Map(
  curriculumMap.lessons.map((lesson) => [normalizeSourcePath(lesson.path), `/lessons/${lesson.slug}`]),
);
Object.entries(TRACK_ZERO).forEach(([sourcePath, route]) => routeBySource.set(sourcePath, route));

const hubHtmlFiles = [];
for (const section of HUB_SECTIONS) {
  const sourceDir = path.join(repoRoot, section.source);
  const files = await walk(sourceDir);
  for (const file of files.filter((item) => item.endsWith(".html"))) {
    const sourcePath = normalizeSourcePath(path.relative(repoRoot, file));
    const route = routeForHubSource(sourcePath);
    if (route) {
      routeBySource.set(sourcePath, route);
      hubHtmlFiles.push({ sourcePath, route });
    }
  }
}

const rewriteUrl = (sourcePath, value, { keepQuery = false } = {}) => {
  if (!value || value.startsWith("#") || isExternalUrl(value)) return value;

  const { pathname, query, hash } = splitUrl(value);
  const targetPath = normalizeRelativeTarget(sourcePath, pathname);
  const firstSegment = targetPath.split("/")[0];

  if (targetPath === "index.html") return `/${hash}`;
  if (DELETED_DIRS.has(firstSegment)) return `/${hash}`;
  if (targetPath === "headlogo.png" || targetPath.endsWith("/headlogo.png")) return "/headlogo.png";

  const route = routeBySource.get(targetPath);
  if (route) return `${route}${hash}`;

  const hubRoute = routeForHubSource(targetPath);
  if (hubRoute) return `${hubRoute}${hash}`;

  const suffix = keepQuery ? query : "";
  return `/${targetPath}${suffix}${hash}`;
};

const rewriteLinks = (html, sourcePath) =>
  html.replace(/\b(href|src)=(["'])(.*?)\2/gi, (full, attr, quote, value) => {
    const rewritten = rewriteUrl(sourcePath, decodeEntities(value), { keepQuery: attr.toLowerCase() === "src" });
    return `${attr}=${quote}${rewritten}${quote}`;
  });

await mkdir(outputDir, { recursive: true });

const manifest = [];
for (const item of hubHtmlFiles.sort((a, b) => a.route.localeCompare(b.route))) {
  const html = await readFile(path.join(repoRoot, item.sourcePath), "utf8");
  const body = rewriteLinks(extractBody(html, item.sourcePath), item.sourcePath);
  const relativeOutput = `${item.route.slice(1)}.html`;
  const absoluteOutput = path.join(outputDir, relativeOutput);

  await mkdir(path.dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, `${body}\n`, "utf8");
  manifest.push({
    route: item.route,
    title: extractTitle(html, item.route),
    description: extractDescription(html),
    sourcePath: item.sourcePath,
    toc: extractToc(html),
  });
}

await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

const searchIndex = JSON.parse(await readFile(path.join(repoRoot, "search-index.json"), "utf8"));
const records = (searchIndex.records ?? []).map((record) => ({
  ...record,
  url: rewriteUrl("index.html", record.url),
}));
await writeFile(
  path.join(appRoot, "content", "search-index.json"),
  `${JSON.stringify({ ...searchIndex, records }, null, 2)}\n`,
  "utf8",
);

await cp(path.join(repoRoot, "assets", "lab"), path.join(appRoot, "public", "assets", "lab"), {
  recursive: true,
});

const templateFiles = (await walk(path.join(repoRoot, "templates"))).filter((file) => !file.endsWith(".html"));
for (const file of templateFiles) {
  const relative = path.relative(path.join(repoRoot, "templates"), file);
  const target = path.join(appRoot, "public", "templates", relative);
  await mkdir(path.dirname(target), { recursive: true });
  await cp(file, target);
}

console.log(`Imported ${manifest.length} hub pages to ${path.relative(appRoot, outputDir)}`);
console.log(`Rewrote ${records.length} search records to content/search-index.json`);
