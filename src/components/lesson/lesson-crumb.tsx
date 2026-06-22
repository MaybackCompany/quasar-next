"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Breadcrumb text derived from the curriculum (Track flag + module title) in the
 * lesson route, so lesson MDX no longer hardcodes a `crumbs` string that drifts
 * out of sync with `curriculum.ts`. Hub pages render LessonHero without this
 * provider, so they fall back to the `crumbs` prop they pass.
 */
const CrumbContext = createContext<string | null>(null);

export function CrumbProvider({ value, children }: { value: string | null; children: ReactNode }) {
  return <CrumbContext.Provider value={value}>{children}</CrumbContext.Provider>;
}

/** Renders the curriculum breadcrumb, falling back to a literal `fallback` (hub pages). */
export function LessonCrumb({ fallback }: { fallback?: string }) {
  const fromCurriculum = useContext(CrumbContext);
  const crumb = fromCurriculum ?? fallback;
  if (!crumb) return null;
  return (
    <div className="eyebrow" style={{ marginBottom: 12 }}>
      {crumb}
    </div>
  );
}
