"use client";

import ScrollVelocity from "@/components/reactbits/ScrollVelocity";

/**
 * A giant two-line type band between sections (React Bits ScrollVelocity):
 * the lines drift in opposite directions and speed up, lean and stretch as
 * you scroll, like a printed banner whipping past. The second line is in
 * outline. Clipped to its own box, so it never widens the page.
 */
export default function EditionBand() {
  return (
    <div aria-hidden="true" className="programme-paper overflow-hidden border-y-2 border-ink py-6 text-ink">
      <ScrollVelocity
        texts={["Onibsport matchday edition", "Football news with an African lens"]}
        velocity={60}
        numCopies={4}
        separator={<span className="inline-block h-[0.32em] w-[0.32em] rotate-45 bg-orange align-middle" />}
        gap={24}
        skewWithVelocity={8}
        scaleWithVelocity={0.06}
        outlineAlternate
        fadeEdges
        className="uppercase"
        fontSize="clamp(44px, 8vw, 104px)"
        fontWeight={900}
        scrollerClassName="py-1"
        scrollerStyle={{ fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}
      />
    </div>
  );
}
