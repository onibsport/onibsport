"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Deals the cards inside it onto the table as they scroll into view: each
 * `[data-deal]` element slides up from below with a turn, one after another
 * (GSAP ScrollTrigger.batch). Once only; off with reduced motion.
 */
export default function DealIn({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-deal]", el);
      gsap.set(cards, { y: 140, rotate: -10, opacity: 0 });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { y: 0, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(1.3)", stagger: 0.1, overwrite: true }),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
