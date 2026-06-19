"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface ProgressState {
  completed: Record<string, number>; // slug → timestamp
  current: string | null;
}

interface ProgressContextType {
  completed: Record<string, number>;
  isComplete: (slug: string) => boolean;
  markComplete: (slug: string) => void;
  markIncomplete: (slug: string) => void;
  percentComplete: (slugs: string[]) => number;
  totalCompleted: number;
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType>({
  completed: {},
  isComplete: () => false,
  markComplete: () => {},
  markIncomplete: () => {},
  percentComplete: () => 0,
  totalCompleted: 0,
  clearProgress: () => {},
});

const STORAGE_KEY = "quasar-lesson-progress";

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completed: {}, current: null };
  } catch {
    return { completed: {}, current: null };
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>({ completed: {}, current: null });

  useEffect(() => {
    setState(loadProgress());
  }, []);

  const isComplete = useCallback(
    (slug: string) => slug in state.completed,
    [state.completed]
  );

  const markComplete = useCallback(
    (slug: string) => {
      setState((prev) => {
        const next = {
          ...prev,
          completed: { ...prev.completed, [slug]: Date.now() },
          current: slug,
        };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const markIncomplete = useCallback(
    (slug: string) => {
      setState((prev) => {
        const { [slug]: _, ...rest } = prev.completed;
        const next = { ...prev, completed: rest };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const percentComplete = useCallback(
    (slugs: string[]) => {
      if (slugs.length === 0) return 0;
      const done = slugs.filter((s) => s in state.completed).length;
      return Math.round((done / slugs.length) * 100);
    },
    [state.completed]
  );

  const totalCompleted = Object.keys(state.completed).length;

  const clearProgress = useCallback(() => {
    const next = { completed: {}, current: null };
    setState(next);
    saveProgress(next);
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        completed: state.completed,
        isComplete,
        markComplete,
        markIncomplete,
        percentComplete,
        totalCompleted,
        clearProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
