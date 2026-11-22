"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * A section title stamped onto the page as it scrolls into view: GSAP splits
 * it into letters and each one lands with a small turn, like a rubber stamp
 * on a programme. Once only. Off with reduced motion (the title just shows).
 */
export default function StampText({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const split = SplitText.create(el, { type: "words,chars" });
    const tween = gsap.from(split.chars, {
      scale: 1.9,
      opacity: 0,
      rotate: () => gsap.utils.random(-18, 18),
      duration: 0.5,
      ease: "back.out(2.2)",
      stagger: 0.035,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
