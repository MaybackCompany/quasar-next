"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ORDERED_LESSONS, LESSON_LOOKUP } from "@/lib/curriculum";

const TRACK_LETTER: Record<string, string> = {
  server: "A",
  scripts: "B",
  gameworld: "C",
};

export function LessonSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ORDERED_LESSONS.filter((l) => {
      const entry = LESSON_LOOKUP[l.slug];
      const trackLetter = entry?.path
        ? TRACK_LETTER[entry.path.id] ?? ""
        : "";
      const moduleTitle = entry?.module?.title ?? "";
      const searchText =
        `${l.title} ${l.blurb} ${l.tag} ${trackLetter} ${moduleTitle}`.toLowerCase();
      return searchText.includes(q);
    }).slice(0, 15);
  }, [query]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="search-container" ref={containerRef}>
      {open ? (
        <div className="search-bar">
          <Search size={15} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search 127 lessons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
              }
            }}
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <button
          className="icon-btn search-trigger"
          onClick={handleOpen}
          aria-label="Search lessons"
          title="Search lessons (/)"
        >
          <Search size={16} />
        </button>
      )}

      {open && query.trim() && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((l) => {
              const entry = LESSON_LOOKUP[l.slug];
              const trackLetter = entry?.path
                ? TRACK_LETTER[entry.path.id]
                : "";
              const moduleTitle = entry?.module?.title ?? "";
              return (
                <Link
                  key={l.slug}
                  href={`/lessons/${l.slug}`}
                  className="search-result-item"
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="sr-track">{trackLetter}</span>
                  <div className="sr-text">
                    <span className="sr-title">{l.title}</span>
                    <span className="sr-module">{moduleTitle}</span>
                  </div>
                  {l.bonus && <span className="sr-bonus">BONUS</span>}
                </Link>
              );
            })
          ) : (
            <div className="search-empty">
              No lessons match &ldquo;{query}&rdquo;
            </div>
          )}
          {results.length > 0 && (
            <div className="search-footer">
              {results.length} of {ORDERED_LESSONS.length} lessons
            </div>
          )}
        </div>
      )}
    </div>
  );
}
