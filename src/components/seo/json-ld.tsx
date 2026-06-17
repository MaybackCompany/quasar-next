/**
 * Renders a JSON-LD <script> for SEO + GEO (so Google rich results and AI
 * answer engines can read structured facts about the page). Safe to render in
 * the body; `data` is serialized server-side.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the </script> edge case.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
