"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import searchIndex from "../../../content/search-index.json";

interface SearchRecord {
  url: string;
  title: string;
  section: string;
  snippet: string;
}

const records = (searchIndex.records as SearchRecord[]).filter((record) => record.url && record.title);

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
    }
  }, [open]);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return records.slice(0, 8);

    return records
      .map((record) => {
        const haystack = `${record.title} ${record.section} ${record.snippet}`.toLowerCase();
        const titleHit = record.title.toLowerCase().includes(value) ? 2 : 0;
        const sectionHit = record.section.toLowerCase().includes(value) ? 1 : 0;
        const snippetHit = record.snippet.toLowerCase().includes(value) ? 1 : 0;
        return { record, score: titleHit + sectionHit + snippetHit + (haystack.includes(value) ? 1 : 0) };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
      .slice(0, 8)
      .map((item) => item.record);
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-separator bg-background px-3 text-sm text-ink-2 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open search"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-separator bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-ink-3 md:inline">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] bg-foreground/20 px-4 py-16 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search Quasar School"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-separator bg-popover text-popover-foreground shadow-2xl">
            <div className="flex items-center gap-3 border-b border-separator px-4">
              <Search className="size-5 text-ink-3" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                placeholder="Search lessons, templates, resources"
                aria-label="Search"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-full text-ink-3 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close search"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[min(70vh,520px)] overflow-y-auto p-2">
              {results.length > 0 ? (
                results.map((record) => (
                  <a
                    key={`${record.url}-${record.title}`}
                    href={record.url}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-semibold">{record.title}</span>
                      <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-deep">
                        {record.section}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-2">{record.snippet}</p>
                  </a>
                ))
              ) : (
                <div className="px-3 py-10 text-center text-sm text-ink-3">No matching pages.</div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
