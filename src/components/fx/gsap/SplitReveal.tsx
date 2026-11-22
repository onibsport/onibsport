"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

/**
 * Splits its text into lines (GSAP SplitText) and lifts each line out of a
 * mask, one after another. Re-splits if the width changes, so line breaks
 * always match the screen. Used for the cover headline. Off with reduced motion.
 */
export default function SplitReveal({ children, delay = 0.2, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const firstVisit = !document.documentElement.classList.contains("intro-seen");
    let played = false;
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        // Animate the first time only; later re-splits (on resize) just lay the lines out again.
        if (played) return;
        played = true;
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.09,
          delay: delay + (firstVisit ? 1.5 : 0),
        });
      },
    });
    return () => split.revert();
  }, [delay]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
