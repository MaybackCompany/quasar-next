interface LessonVideoProps {
  /** The Loom share id (the part after /share/ in the URL). */
  loomId: string;
  title?: string;
  caption?: string;
}

/**
 * Responsive 16:9 Loom embed for lessons. Usage in MDX:
 *   <LessonVideo loomId="81886632cbdd481e8f29e48ab88e167f" caption="Full walkthrough" />
 * The Loom domain must be allowed in the CSP frame-src (see next.config.ts).
 */
export function LessonVideo({ loomId, title = "Video walkthrough", caption }: LessonVideoProps) {
  const src = `https://www.loom.com/embed/${loomId}`;
  return (
    <figure style={{ margin: "24px 0" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "56.25%",
          height: 0,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--hairline)",
          background: "var(--surface-2)",
        }}
      >
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="fullscreen; picture-in-picture"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
      {caption ? (
        <figcaption style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
