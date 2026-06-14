interface YouTubeVideoProps {
  /** The YouTube video id (the v= value). */
  id: string;
  title?: string;
  caption?: string;
}

/**
 * Responsive 16:9 YouTube embed (privacy-enhanced, no-cookie). Usage in MDX:
 *   <YouTube id="UspWGEbsY20" caption="RED: High-performance Lua" />
 * The youtube-nocookie.com domain must be allowed in the CSP frame-src.
 */
export function YouTubeVideo({ id, title = "Video", caption }: YouTubeVideoProps) {
  const src = `https://www.youtube-nocookie.com/embed/${id}`;
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
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
      {caption ? (
        <figcaption style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
