"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sun, Moon, ChevronDown } from "lucide-react";
import { PATHS } from "@/lib/curriculum";
import { NavUser } from "@/components/fqs/nav-user";

const TRACK_LETTER: Record<string, string> = { server: "A", scripts: "B", gameworld: "C" };
const TRACK_SUB: Record<string, string> = {
  server: "Install, txAdmin, server.cfg, ship.",
  scripts: "Lua → resources → events → SQL → features.",
  gameworld: "Entities, vehicles, inventories, NUI.",
};

function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("fqs-theme", next);
    } catch {
      /* ignore */
    }
  };
  return [theme, toggle];
}

interface SiteNavProps {
  active?: "tracks" | "cheatsheets" | null;
}

export function SiteNav({ active }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  return (
    <header className="nav fqs">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="mark">FS</span>
          <span>FiveM School</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <div className="dropdown" ref={ref}>
            <button
              className={"nav-link" + (active === "tracks" ? " active" : "")}
              onClick={() => setOpen(!open)}
              aria-expanded={open}
            >
              Tracks <ChevronDown size={13} style={{ opacity: 0.7 }} />
            </button>
            {open ? (
              <div className="dropdown-menu" role="menu">
                {PATHS.map((t) => (
                  <Link
                    key={t.id}
                    className="dropdown-item"
                    href={"/track/" + t.id}
                    onClick={() => setOpen(false)}
                    role="menuitem"
                  >
                    <span className="di-letter">{TRACK_LETTER[t.id]}</span>
                    <span>
                      <span className="di-title">{t.title}</span>
                      <div className="di-sub">{TRACK_SUB[t.id]}</div>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link className={"nav-link hide-m" + (active === "cheatsheets" ? " active" : "")} href="/cheatsheets">
            Cheatsheets
          </Link>
          <Link className="nav-link hide-m" href="/toolbox">
            Toolbox
          </Link>
        </nav>
        <div className="nav-right">
          <NavUser />
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link className="btn btn-primary nav-cta" href="/track/scripts">
            Start learning
          </Link>
        </div>
      </div>
    </header>
  );
}
