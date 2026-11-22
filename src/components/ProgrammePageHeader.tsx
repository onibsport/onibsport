import type { ReactNode } from "react";
import StampText from "@/components/fx/gsap/StampText";

/**
 * The title page for a section of the site (scores, videos, search, a
 * writer), printed like a page of the matchday programme: a masthead line,
 * the title stamped in giant capitals with a faded outline word set huge
 * behind it, and an orange bar. Night ink by default, or any kit colour.
 */
export default function ProgrammePageHeader({
  kicker,
  title,
  ghost,
  intro,
  aside,
  meta,
  background = "var(--color-night)",
  accent = "var(--color-orange)",
}: {
  /** Small capitals at the top left, e.g. "Match centre". */
  kicker: string;
  title: string;
  /** A word set huge in outline behind the title; defaults to the title. */
  ghost?: string;
  intro?: ReactNode;
  /** Shown to the right of the title on wide screens, below it on phones (a button, a clock). */
  aside?: ReactNode;
  /** Small capitals at the top right of the masthead line. */
  meta?: ReactNode;
  background?: string;
  accent?: string;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-6 text-white sm:px-6 sm:pt-8" style={{ background }}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 right-0 select-none whitespace-nowrap font-display text-[150px] font-black uppercase leading-none text-transparent sm:-bottom-10 sm:text-[300px]"
        style={{ WebkitTextStroke: "2px rgb(255 255 255 / 0.08)" }}
      >
        {ghost ?? title}
      </span>
      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex items-center justify-between gap-3 whitespace-nowrap border-b-2 border-white/25 pb-2 text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.16em]">
          <span style={{ color: accent }}>{kicker}</span>
          {meta && <span className="flex items-center gap-2 text-white/70">{meta}</span>}
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <h1 className="font-display text-[56px] font-black uppercase leading-[0.82] tracking-[-0.01em] sm:text-[104px]">
              <span className="-my-1 block overflow-hidden py-1">
                <StampText className="block">{title}</StampText>
              </span>
            </h1>
            <span aria-hidden="true" className="mt-5 block h-2 w-24" style={{ background: accent }} />
            {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{intro}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
