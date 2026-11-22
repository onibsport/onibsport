"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * One side of a TV-style score bug. When the score goes up while the page is
 * open (a goal), the box flashes and pops once. It never animates on first
 * load, only on a real change, and not at all with reduced motion.
 */
export default function ScoreBox({ score, live = false, muted = false, className }: { score: number | null; live?: boolean; muted?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const last = useRef(score);

  useEffect(() => {
    const before = last.current;
    last.current = score;
    if (before == null || score == null || score <= before) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.animate(
      [
        { transform: "scale(1)", boxShadow: "0 0 0 0 rgb(247 148 29 / 0)" },
        { transform: "scale(1.35)", boxShadow: "0 0 0 10px rgb(247 148 29 / 0.45)", offset: 0.25 },
        { transform: "scale(1)", boxShadow: "0 0 0 22px rgb(247 148 29 / 0)" },
      ],
      { duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }, [score]);

  return (
    <span ref={ref} data-live={live ? "" : undefined} className={cn("bc-score font-display font-black tabular-nums leading-none", muted && "opacity-55", className)}>
      {score ?? "-"}
    </span>
  );
}
