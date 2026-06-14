"use client";

import { useRef, useState, type ReactNode } from "react";

interface PreProps {
  children: ReactNode;
  "data-file"?: string;
  "data-language"?: string;
  /** Optional CLIENT / SERVER / SHARED badge. */
  "data-runs"?: string;
}

function CopyButton({ targetRef }: { targetRef: React.RefObject<HTMLPreElement | null> }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const text = targetRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <button className={"copy-btn" + (copied ? " copied" : "")} onClick={copy} aria-label="Copy code">
      {copied ? "copied" : "copy"}
    </button>
  );
}

/**
 * Code block — FiveM School design. Always a dark panel; the head shows a
 * meaningful label, an optional CLIENT/SERVER/SHARED badge, and a copy button.
 * Every block renders light-on-dark (the .codeblock pre rule), tokenized or not.
 */
export function Pre({ children, ...props }: PreProps) {
  const ref = useRef<HTMLPreElement>(null);
  const file = props["data-file"];
  const lang = props["data-language"];
  const runs = props["data-runs"];
  const label = file ?? lang ?? "code";

  return (
    <figure className="codeblock">
      <figcaption className="codeblock-head">
        <span className="codeblock-label">{label}</span>
        {runs ? <span className={"runs-badge runs-" + runs}>{runs}</span> : null}
        <span className="spacer" />
        <CopyButton targetRef={ref} />
      </figcaption>
      <pre ref={ref}>{children}</pre>
    </figure>
  );
}
