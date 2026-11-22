"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * The giant ONIBSPORT on the programme cover, printed letter by letter: each
 * letter drops onto the page with a slight turn and settles, like type being
 * stamped. On the first visit it waits for the ticket intro to tear away.
 * GSAP; nothing moves for readers who prefer reduced motion.
 */
export default function PrintedWordmark({ className }: { className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const firstVisit = !document.documentElement.classList.contains("intro-seen");
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-letter]"), {
        yPercent: -70,
        opacity: 0,
        rotate: () => gsap.utils.random(-14, 14),
        scale: 1.25,
        duration: 0.75,
        ease: "back.out(1.8)",
        stagger: 0.055,
        delay: firstVisit ? 1.35 : 0.15,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const letters = (word: string, extra?: string) =>
    word.split("").map((ch, i) => (
      <span key={i} data-letter="" className={`inline-block ${extra ?? ""}`}>
        {ch}
      </span>
    ));

  return (
    <p ref={ref} aria-hidden="true" className={className}>
      {letters("ONIB")}
      {letters("SPORT", "text-orange-deep")}
    </p>
  );
}
