"use client";

import { useProgress } from "@/lib/progress";

interface LessonProgressProps {
  slug: string;
  trackSlugs?: string[];
}

export function LessonProgress({ slug, trackSlugs = [] }: LessonProgressProps) {
  const { isComplete, markComplete, markIncomplete, percentComplete, totalCompleted } =
    useProgress();

  const done = isComplete(slug);
  const trackPercent = trackSlugs.length > 0 ? percentComplete(trackSlugs) : 0;

  return (
    <div className="lesson-progress-bar">
      <button
        className={`btn ${done ? "btn-done" : "btn-primary"} btn-big`}
        onClick={() => (done ? markIncomplete(slug) : markComplete(slug))}
      >
        {done ? "✓ Completed" : "Mark complete & next →"}
      </button>
      {trackPercent > 0 && (
        <div className="track-progress">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${trackPercent}%` }}
            />
          </div>
          <span className="progress-text">
            {trackPercent}% complete · {totalCompleted} total lessons done
          </span>
        </div>
      )}
    </div>
  );
}
