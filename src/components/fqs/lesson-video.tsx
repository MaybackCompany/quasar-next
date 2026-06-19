interface LessonVideoProps {
  /** The Loom share id (the part after /share/ in the URL). Use this OR src. */
  loomId?: string;
  /**
   * Path to a self-hosted video served from /public, e.g. "/lesson-videos/clase-7.mp4".
   * Use this for videos shipped with the app (VPS deploy) instead of a Loom embed.
   */
  src?: string;
  /** Optional poster image path for the self-hosted player. */
  poster?: string;
  title?: string;
  caption?: string;
}

/**
 * Responsive 16:9 lesson video. Two modes:
 *   Self-hosted: <LessonVideo src="/lesson-videos/clase-7.mp4" caption="Banking walkthrough" />
 *   Loom embed:  <LessonVideo loomId="81886632cbdd481e8f29e48ab88e167f" caption="Full walkthrough" />
 * Self-hosted files are served from /public and play same-origin (CSP media-src 'self').
 * The Loom domain must be allowed in the CSP frame-src (see next.config.ts).
 */
export function LessonVideo({ loomId, src, poster, title = "Video walkthrough", caption }: LessonVideoProps) {
  const frame = {
    position: "relative" as const,
    paddingBottom: "56.25%",
    height: 0,
    borderRadius: 12,
    overflow: "hidden" as const,
    border: "1px solid var(--hairline)",
    background: "var(--surface-2)",
  };
  const fill = { position: "absolute" as const, inset: 0, width: "100%", height: "100%", border: 0 };
  return (
    <figure style={{ margin: "24px 0" }}>
      <div style={frame}>
        {src ? (
          <video
            controls
            preload="metadata"
            playsInline
            poster={poster}
            title={title}
            style={{ ...fill, objectFit: "contain", background: "#000" }}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support embedded video. Download it at <a href={src}>{src}</a>.
          </video>
        ) : (
          <iframe
            src={`https://www.loom.com/embed/${loomId}`}
            title={title}
            loading="lazy"
            allowFullScreen
            allow="fullscreen; picture-in-picture"
            style={fill}
          />
        )}
      </div>
      {caption ? (
        <figcaption style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
