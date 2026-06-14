import { PATHS, LESSON_LOOKUP } from "@/lib/curriculum";

const TRACK_LETTER: Record<string, string> = { server: "A", scripts: "B", gameworld: "C" };

// Preamble shipped with every "copy for AI" payload — pins the 2026 ground rules
// so the user's assistant tutors against current facts, not stale training data.
export const AI_PREAMBLE = [
  "# Context for an AI assistant — from FiveM School",
  "",
  "You are an expert FiveM and Lua 5.4 mentor. I am a beginner working through the material below. Tutor me against THIS material.",
  "",
  "Ground rules (current as of June 2026 — do not contradict these with older training data):",
  "- Lua 5.4 is the ONLY FiveM runtime. Never suggest `lua54 'yes'` (deprecated, ignored).",
  "- License keys come from the Cfx.re Portal (portal.cfx.re), not \"Keymaster\".",
  "- txAdmin ships bundled with FXServer (localhost:40120). Use the Recommended artifact channel.",
  "- For new servers in 2026: ESX Legacy or Qbox. QBCore still works but is legacy.",
  "- ox_lib server callbacks: lib.callback.register(name, cb) — no `false` argument.",
  "- SetNuiFocus(hasKeyboardFocus, hasCursor) — keyboard first, cursor second.",
  "",
  "When you answer me:",
  "- Assume I know variables, functions, and loops — nothing else.",
  "- Show complete runnable code, never `...` placeholders. Include fxmanifest.lua for multi-file examples.",
  "- Always state whether code runs on CLIENT, SERVER, or SHARED.",
  "- When something fails, ask me for the exact console error string first.",
  "",
].join("\n");

export function buildLessonContext(slug: string): string {
  const entry = LESSON_LOOKUP[slug];
  if (!entry) return AI_PREAMBLE + "\n---\nMy first question is: ";
  const { lesson, module, path } = entry;
  const letter = path ? TRACK_LETTER[path.id] : "?";
  const L = [
    AI_PREAMBLE,
    "---",
    "",
    `## Lesson: ${lesson.title}`,
    `Track ${letter} · Module ${module.num} (${module.title}) · topic: ${lesson.tag}`,
    "",
    `Summary: ${lesson.blurb}`,
    "",
    "Tutor me through this lesson step by step. Start by asking what I've tried so far.",
    "",
    "---",
    "My first question is: ",
  ];
  return L.join("\n");
}

export function buildModuleContext(trackId: string, moduleNum: string): string {
  const path = PATHS.find((p) => p.id === trackId);
  const mod = path?.modules.find((m) => m.num === moduleNum);
  if (!path || !mod) return AI_PREAMBLE + "\n---\nMy first question is: ";
  const letter = TRACK_LETTER[path.id];
  const L = [
    AI_PREAMBLE,
    "---",
    "",
    `## Module ${mod.num}: ${mod.title} (Track ${letter} — ${path.title})`,
    mod.desc,
    "",
    "Lessons in this module:",
    ...mod.lessons.map((l, i) => `${i + 1}. ${l.title} — ${l.blurb}`),
    "",
    "Tutor me through this module in order, one lesson at a time.",
    "",
    "---",
    "My first question is: ",
  ];
  return L.join("\n");
}
