"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

// Thin wrapper over the dotLottie runtime, loaded client-only (the player uses
// wasm/web-components that must not run during SSR). Use for designed brand or
// state-moment animations (.lottie/.json in /public). For teaching diagrams,
// prefer the coded Framer components - a generic lottie reads as decoration.

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false },
);

interface LottieProps {
  /** Path to a .lottie or lottie .json, e.g. "/lottie/state-sync.lottie". */
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  /** Describe the animation for screen readers. */
  ariaLabel?: string;
  height?: number;
}

export function Lottie({ src, loop = true, autoplay = true, ariaLabel, height = 220 }: LottieProps) {
  const reduce = useReducedMotion();
  return (
    <div role="img" aria-label={ariaLabel ?? "animation"} style={{ maxWidth: 560, margin: "18px auto" }}>
      <DotLottieReact src={src} loop={reduce ? false : loop} autoplay={reduce ? false : autoplay} style={{ width: "100%", height }} />
    </div>
  );
}
