"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, X, Filter } from "lucide-react";
import type { Lesson } from "@/lib/curriculum";

// Will be loaded from JSON
let SEARCH_INDEX: Record<string, SearchEntry> | null = null;

interface SearchEntry {
  title: string;
  blurb: string;
  tag: string;
  module: string;
  keywords: string;
  has_video: boolean;
}

const TAG_GROUPS: Record<string, string[]> = {
  "Core": ["Lua", "Lua core", "Setup", "Skeleton", "Mental model", "Tooling", "Workflow", "Scripting"],
  "Server": ["SQL", "Frameworks", "HTTP", "Callbacks", "State", "Events", "Networking", "Natives", "Threading", "Async"],
  "Security": ["Security", "Permissions"],
  "Performance": ["Performance", "Debugging", "Debug"],
  "Building": ["NUI", "Build", "Capstone", "Gameplay", "Entities", "Items", "Vehicles", "Handling", "World", "Assets"],
  "Growth": ["Business", "Product", "Quality", "Ops", "Server Ops", "Migration", "Community", "Voice", "Config", "Planning"],
  "Framework": ["ox_lib", "ox_target"],
};

async function loadIndex(): Promise<Record<string, SearchEntry>> {
  if (SEARCH_INDEX) return SEARCH_INDEX;
  try {
    const res = await fetch("/lesson-search-index.json");
    SEARCH_INDEX = await res.json();
  } catch {
    SEARCH_INDEX = {};
  }
  return SEARCH_INDEX || {};
}

export function LessonSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [index, setIndex] = useState<Record<string, SearchEntry>>({});
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadIndex().then(setIndex);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(index).forEach((e) => { if (e.tag) tags.add(e.tag); });
    return Array.from(tags).sort();
  }, [index]);

  const results = useMemo(() => {
    if (!query.trim() && !activeTag) return [];
    const q = query.toLowerCase().trim();

    return Object.entries(index)
      .filter(([slug, entry]) => {
        // Tag filter
        if (activeTag && entry.tag !== activeTag) return false;

        if (!q) return true; // show all for active tag

        // Search title, blurb, tag, module, keywords
        const searchText =
          `${entry.title} ${entry.blurb} ${entry.tag} ${entry.module} ${entry.keywords}`.toLowerCase();
        return searchText.includes(q);
      })
      .sort((a, b) => {
        // Title match first, then blurb, then keywords
        const aTitle = a[1].title.toLowerCase().includes(q) ? 0 : 1;
        const bTitle = b[1].title.toLowerCase().includes(q) ? 0 : 1;
        return aTitle - bTitle;
      })
      .slice(0, 20)
      .map(([slug, entry]) => ({ slug, ...entry }));
  }, [query, activeTag, index]);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div className="search-container" ref={containerRef}>
      {open ? (
        <div className="search-panel">
          <div className="search-bar">
            <Search size={15} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder={`Search ${Object.keys(index).length} lessons...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="search-clear"
              onClick={() => { setQuery(""); setActiveTag(null); }}
              aria-label="Clear"
            >
              <X size={14} />
            </button>
            <button
              className={`search-filter-btn ${showFilters || activeTag ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Filters"
              title="Filter by category"
            >
              <Filter size={14} />
            </button>
          </div>

          {showFilters && (
            <div className="search-filters">
              <button
                className={`search-tag ${!activeTag ? "active" : ""}`}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`search-tag ${activeTag === tag ? "active" : ""}`}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {(query.trim() || activeTag) && (
            <div className="search-results">
              {results.length > 0 ? (
                <>
                  <div className="search-count">
                    {results.length} lesson{results.length !== 1 ? "s" : ""}
                    {activeTag && <> in <strong>{activeTag}</strong></>}
                  </div>
                  {results.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/lessons/${r.slug}`}
                      className="search-result-item"
                      onClick={() => { setOpen(false); setQuery(""); setActiveTag(null); }}
                    >
                      <div className="sr-main">
                        <span className="sr-title">{r.title}</span>
                        <span className="sr-blurb">{r.blurb}</span>
                      </div>
                      <div className="sr-meta">
                        {r.tag && <span className="sr-tag">{r.tag}</span>}
                        {r.has_video && <span className="sr-video">🎬</span>}
                      </div>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="search-empty">
                  No lessons match &ldquo;{query}&rdquo;
                  {activeTag && <> in <strong>{activeTag}</strong></>}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          className="icon-btn search-trigger"
          onClick={handleOpen}
          aria-label="Search lessons"
          title="Search lessons (Ctrl+K)"
        >
          <Search size={16} />
        </button>
      )}
    </div>
  );
}
