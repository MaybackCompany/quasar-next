"use client";

import { useState } from "react";
import { buildModuleContext, buildLessonContext } from "@/lib/fqs-context";

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta);
}

// Compact "copy module for AI" button - used per-module on track pages.
export function ModuleAiCopy({ trackId, moduleNum }: { trackId: string; moduleNum: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    copyText(buildModuleContext(trackId, moduleNum));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      className={"ai-copy-btn" + (copied ? " copied" : "")}
      onClick={onCopy}
      title="Copies this whole module as AI-assistant context"
    >
      {copied ? "✓ copied" : "⧉ copy for AI"}
    </button>
  );
}

// Full "copy lesson for AI" card - used on the lesson page. `body` is this
// lesson's content distilled to markdown (from the manifest), so the copied
// prompt teaches THIS specific lesson, not a generic shell.
export function LessonAiCopy({ slug, body }: { slug: string; body?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    copyText(buildLessonContext(slug, body));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="ai-copy">
      <div>
        <div className="t">Learning with an AI assistant?</div>
        <div className="s">
          Copies this whole lesson - every step, code block, and the exact console errors - plus 2026 ground rules
          (no <code>lua54 &apos;yes&apos;</code>, Cfx.re Portal, correct callback signatures) as a ready-to-paste
          mentor prompt.
        </div>
      </div>
      <button className={"ai-copy-btn" + (copied ? " copied" : "")} onClick={onCopy}>
        {copied ? "✓ copied" : "⧉ copy lesson for AI"}
      </button>
    </div>
  );
}
