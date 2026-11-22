"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth, weighted scrolling (Lenis). It drives the window's own scroll, so
 * sticky headers, anchor links and keyboard scrolling keep working, and it
 * tells GSAP's ScrollTrigger about every frame so scroll effects stay in step.
 * Mouse-wheel only: phones keep their native scrolling. Off entirely for
 * readers who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, syncTouch: false, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}
