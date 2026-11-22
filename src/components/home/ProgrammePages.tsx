"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { categories } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import type { DeskData } from "@/components/home/LeagueDesk";
import { cn } from "@/lib/utils";

/**
 * Direction C: each league as a page of the programme, printed in its kit
 * colours. Swipe on a phone, drag or use the arrows on a computer; the page
 * in front sits straight while the pages behind are tilted like a stack.
 */
export default function ProgrammePages({ desks }: { desks: DeskData[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selected, setSelected] = useState(0);
  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const id = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const pages = categories.map((c) => ({ c, theme: leagueTheme(c.slug), lead: desks.find((d) => d.slug === c.slug)?.articles[0] }));

  return (
    <section aria-labelledby="programme-pages-title" className="programme-paper overflow-hidden py-14 text-ink">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 sm:px-6">
        <h2 id="programme-pages-title" className="font-display text-[44px] font-black uppercase leading-[0.85] sm:text-[72px]">
          League pages
        </h2>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-sm font-semibold text-muted">Swipe through the leagues</span>
          <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous league" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 border-ink hover:bg-ink hover:text-paper">
            <ArrowLeft size={18} weight="bold" />
          </button>
          <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Next league" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 border-ink hover:bg-ink hover:text-paper">
            <ArrowRight size={18} weight="bold" />
          </button>
        </div>
      </div>
      <div className="mx-auto mt-4 max-w-[1400px] px-4 sm:px-6">
        <div className="h-0 border-t-2 border-dashed border-ink/30" />
      </div>

      <div ref={emblaRef} className="mt-10 overflow-hidden" role="region" aria-roledescription="carousel" aria-label="League pages">
        <div className="flex touch-pan-y">
          {pages.map(({ c, theme, lead }, i) => {
            const active = i === selected;
            return (
              <div key={c.slug} className="min-w-0 flex-[0_0_82%] px-2 sm:flex-[0_0_46%] lg:flex-[0_0_34%]" aria-roledescription="slide" aria-label={c.name}>
                <Link
                  href={`/category/${c.slug}`}
                  className={cn(
                    "group relative flex aspect-[3/4] flex-col justify-between overflow-hidden p-6 text-white shadow-[0_30px_60px_-30px_rgb(18_10_51_/_0.7)] transition-transform duration-500 sm:p-8",
                    active ? "rotate-0 scale-100" : i % 2 ? "rotate-[2.5deg] scale-[0.92]" : "rotate-[-2.5deg] scale-[0.92]"
                  )}
                  style={{ background: theme.deep }}
                  tabIndex={active ? 0 : -1}
                >
                  <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 font-display text-[220px] font-black leading-none opacity-[0.12]" style={{ color: theme.tint }}>
                    {theme.crest}
                  </span>
                  <span className="relative flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em]">
                    <span style={{ color: theme.tint }}>{theme.region}</span>
                    <span className="text-white/60">Page {i + 1}</span>
                  </span>
                  <span className="relative">
                    <span className="block font-display text-[48px] font-black uppercase leading-[0.85] sm:text-[60px]">{c.name}</span>
                    <span className="mt-3 block h-1.5 w-16" style={{ background: theme.tint }} />
                    {lead ? (
                      <span className="mt-4 block text-[17px] font-semibold leading-snug text-white/90">{lead.title}</span>
                    ) : (
                      <span className="mt-4 block text-[15px] leading-snug text-white/70">{theme.blurb}</span>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: theme.tint }}>
                      Open the {c.shortName} page
                      <ArrowRight size={16} weight="bold" aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
