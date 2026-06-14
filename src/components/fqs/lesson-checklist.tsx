"use client";

import { useEffect, useState } from "react";

// Interactive, persisted "before you start" readiness checklist.
// Keyed by pathname so each lesson keeps its own checked state.
export function LessonChecklist({ items }: { items: string[] }) {
  const [storeKey, setStoreKey] = useState<string | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  useEffect(() => {
    const key = "fqs-check:" + window.location.pathname;
    setStoreKey(key);
    try {
      setChecked(JSON.parse(localStorage.getItem(key) || "[]") || []);
    } catch {
      setChecked([]);
    }
  }, []);

  const toggle = (i: number) => {
    const next = checked.includes(i) ? checked.filter((x) => x !== i) : [...checked, i];
    setChecked(next);
    if (storeKey) {
      try {
        localStorage.setItem(storeKey, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <section style={{ marginTop: 8 }}>
      <div className="eyebrow" style={{ marginBottom: 4 }}>
        BEFORE YOU START
      </div>
      <div className="checklist" role="group" aria-label="Before you start checklist">
        {items.map((it, i) => {
          const on = checked.includes(i);
          return (
            <button
              key={i}
              className={"check-item" + (on ? " checked" : "")}
              onClick={() => toggle(i)}
              aria-pressed={on}
            >
              <span className="check-box">{on ? "✓" : ""}</span>
              <span className="check-label">{it}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
