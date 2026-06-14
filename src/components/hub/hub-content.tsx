"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-lua";

interface HubContentProps {
  html: string;
  route: string;
}

const LAB_SCRIPT_ID = "quasar-lab-runtime";

function renderStarterProgress(root: HTMLElement) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".kit-day"));
  const fill = root.querySelector<HTMLElement>("#kitFill");
  const label = root.querySelector<HTMLElement>("#kitLabel");

  if (cards.length === 0 || !fill || !label) return;

  let progress: Record<string, { labs?: Record<string, unknown> }> = {};
  try {
    progress = JSON.parse(window.localStorage.getItem("qu.starterkit.progress") || "{}");
  } catch {
    progress = {};
  }

  let doneDays = 0;
  let firstUndoneIndex = -1;

  cards.forEach((card, index) => {
    const dayId = `day-${card.dataset.day ?? ""}`;
    const labCount = Number(card.dataset.labs || "0");
    card.dataset.dayId = dayId;
    card.dataset.labCount = String(labCount);

    const labsDone = Object.keys(progress[dayId]?.labs ?? {}).length;
    const isDone = labCount > 0 && labsDone >= labCount;
    card.classList.toggle("is-done", isDone);
    card.classList.remove("is-current");

    if (isDone) doneDays += 1;
    else if (firstUndoneIndex === -1) firstUndoneIndex = index;
  });

  if (firstUndoneIndex >= 0) {
    cards[firstUndoneIndex]?.classList.add("is-current");
  }
  fill.style.width = `${Math.round((doneDays / 7) * 100)}%`;
  label.textContent =
    doneDays === 0
      ? "No days complete yet · start with Day 1."
      : doneDays < 7
        ? `${doneDays} of 7 days complete · current: Day ${doneDays + 1}.`
        : "All 7 days complete. Jump into the 21-lesson curriculum →";
}

// Prepend each external link with its site favicon, so reference links in the
// cheatsheets and other hubs show the logo of the site they point to.
function decorateExternalLinks(root: HTMLElement) {
  const anchors = root.querySelectorAll<HTMLAnchorElement>('a[href^="http"]');
  anchors.forEach((a) => {
    if (a.dataset.faviconed === "1" || a.querySelector("img")) {
      a.dataset.faviconed = "1";
      return;
    }
    let host: string;
    try {
      host = new URL(a.href).hostname;
    } catch {
      return;
    }
    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
    img.alt = "";
    img.width = 14;
    img.height = 14;
    img.loading = "lazy";
    img.style.cssText = "display:inline-block;vertical-align:-2px;margin-right:5px;border-radius:3px;";
    a.insertBefore(img, a.firstChild);
    a.dataset.faviconed = "1";
  });
}

function reloadLabRuntime() {
  document.getElementById(LAB_SCRIPT_ID)?.remove();
  const script = document.createElement("script");
  script.id = LAB_SCRIPT_ID;
  script.src = "/assets/lab/lab.js";
  script.async = true;
  document.body.appendChild(script);
}

export function HubContent({ html, route }: HubContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    Prism.highlightAllUnder(root);
    decorateExternalLinks(root);

    if (route.startsWith("/starter-kit")) {
      renderStarterProgress(root);
      const onProgress = () => renderStarterProgress(root);
      document.addEventListener("qu:progress", onProgress);
      if (root.querySelector(".lab")) reloadLabRuntime();
      return () => document.removeEventListener("qu:progress", onProgress);
    }
  }, [html, route]);

  return <div ref={contentRef} className="lesson-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
