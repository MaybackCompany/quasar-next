// Snapshot legacy-URL redirects (lesson + hub) into a local JSON so next.config
// no longer reads parent-dir files at build time. Run while the legacy source
// tree still exists; commit the output. Re-run only if legacy URLs change.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

const hubSections = [
  { source: "operator", target: "server" },
  { source: "resources", target: "resources" },
  { source: "templates", target: "templates" },
  { source: "expansion", target: "expansion" },
  { source: "cheatsheets", target: "cheatsheets" },
  { source: "setup", target: "setup" },
  { source: "starter-kit", target: "starter-kit" },
];

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath];
  });
}

function hubDestination(sourcePath) {
  const normalized = sourcePath.replaceAll(path.sep, "/");
  const section = hubSections.find(
    (item) => normalized === item.source || normalized.startsWith(`${item.source}/`)
  );
  if (!section) return null;
  const relative = path.posix.relative(section.source, normalized);
  if (relative === "index.html") return `/${section.target}`;
  if (relative.endsWith("/index.html"))
    return `/${section.target}/${relative.slice(0, -"/index.html".length)}`;
  if (relative.endsWith(".html")) return `/${section.target}/${relative.slice(0, -".html".length)}`;
  return null;
}

function buildLessonRedirects() {
  const mapPath = path.join(repoRoot, "curriculum-map.json");
  const curriculumMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  return curriculumMap.lessons.map((lesson) => ({
    source: `/${lesson.path}`,
    destination: `/lessons/${lesson.slug}`,
    permanent: true,
  }));
}

function buildHubRedirects() {
  return hubSections.flatMap((section) =>
    walkFiles(path.join(repoRoot, section.source))
      .filter((file) => file.endsWith(".html"))
      .flatMap((file) => {
        const sourcePath = path.relative(repoRoot, file).replaceAll(path.sep, "/");
        const destination = hubDestination(sourcePath);
        if (!destination) return [];
        const redirects = [{ source: `/${sourcePath}`, destination, permanent: true }];
        if (sourcePath.endsWith("/index.html")) {
          const directorySource = `/${sourcePath.slice(0, -"/index.html".length)}`;
          if (directorySource !== destination) {
            redirects.push({ source: directorySource, destination, permanent: true });
          }
          redirects.push({ source: `${directorySource}/`, destination, permanent: true });
        }
        return redirects;
      })
  );
}

const redirects = [...buildLessonRedirects(), ...buildHubRedirects()];
// Stable order so the committed JSON diff is deterministic.
redirects.sort((a, b) => a.source.localeCompare(b.source));

const outPath = path.join(appRoot, "redirects.generated.json");
fs.writeFileSync(outPath, `${JSON.stringify(redirects, null, 2)}\n`, "utf8");
console.log(`wrote ${redirects.length} redirects -> ${path.relative(appRoot, outPath)}`);
