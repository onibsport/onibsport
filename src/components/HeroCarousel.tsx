"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import TimeAgo from "@/components/ui/TimeAgo";
import NewsImage from "@/components/ui/NewsImage";
import ViewTransition, { storyPhotoName } from "@/components/fx/ViewTransition";
import { cn } from "@/lib/utils";

const SLIDE_MS = 7000;

/** The reader's own clock for the on-air bug, updated every half minute. Empty on the server. */
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}
const clockNow = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const clockServer = () => "";

/**
 * Front-page stage, styled as a live football broadcast: the lead story fills
 * the width of the page, the headline sits on a lower-third plate, an on-air
 * bug sits in the top corner, and the other top stories run along the bottom
 * as an "Up next" rundown. The orange broadcast wipe crosses on each new story.
 * Swipeable; hovering, focusing or pausing holds the rundown.
 */
export default function HeroCarousel({ articles }: { articles: Article[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const reduce = useReducedMotion();
  const clock = useSyncExternalStore(subscribeClock, clockNow, clockServer);
  const autoplay = !reduce && !paused && !held && articles.length > 1;

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const hold = () => setHeld(true);
    const release = () => setHeld(false);
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", hold);
    emblaApi.on("pointerUp", release);
    const id = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", hold);
      emblaApi.off("pointerUp", release);
    };
  }, [emblaApi, onSelect]);

  if (articles.length === 0) return null;
  const current = articles[selected] ?? articles[0];
  const currentCategory = getCategory(current.category);
  const theme = leagueTheme(current.category);

  return (
    <div className="bg-night">
    <section
      aria-roledescription="carousel"
      aria-label="Top stories"
      data-parallax=""
      data-spot=""
      className="cinema-recede grain relative overflow-hidden bg-[#07041a] text-white [--spot-color:rgb(255_244_214_/_0.08)] [--spot-size:640px]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {articles.map((article, i) => (
            <div
              key={article.slug}
              className="relative min-w-0 flex-[0_0_100%] overflow-hidden"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${articles.length}`}
              aria-hidden={i !== selected}
            >
              <Link href={`/article/${article.slug}`} tabIndex={i === selected ? 0 : -1} data-cursor="Read story" className="group block">
                <div className="relative h-[min(90svh,820px)] min-h-[600px] w-full overflow-hidden lg:min-h-[660px]">
                  {/* The photo drifts against the pointer, and grows into the lead photo of the article when the story is opened. */}
                  <ViewTransition name={storyPhotoName(article.slug)} share="morph" default="none">
                    <div className="parallax-layer absolute inset-0">
                      <NewsImage
                        src={article.image || article.coverImage}
                        focus={article.imageFocus}
                        alt={article.imageAlt}
                        fill
                        priority={i === 0}
                        sizes="100vw"
                        className={cn(
                          "object-cover brightness-[0.72] saturate-[0.9] transition-transform ease-out",
                          i === selected && !reduce ? "scale-100 duration-[7000ms]" : "scale-110 duration-0"
                        )}
                      />
                    </div>
                  </ViewTransition>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,transparent_0%,rgb(7_4_26_/_0.35)_55%,rgb(7_4_26_/_0.92)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#07041a] via-[#07041a]/70 to-transparent" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Floodlights sweeping over the pitch. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <span className="cinema-beam left-[-14%]" style={{ "--beam-time": "13s", rotate: "-10deg" } as React.CSSProperties} />
        <span className="cinema-beam right-[-14%]" style={{ "--beam-time": "16s", "--beam": "rgb(41 171 226 / 0.18)", rotate: "10deg" } as React.CSSProperties} />
      </div>

      {/* The broadcast wipe crosses each time a new story comes up. */}
      {!reduce && <div key={`wipe-${selected}`} aria-hidden="true" className="bc-wipe" />}

      {/* On-air bug, top corner. */}
      <div aria-hidden="true" className="pointer-events-none absolute left-4 top-4 z-[4] flex items-stretch sm:left-8 sm:top-7">
        <span className="flex items-center gap-2 bg-white px-2.5 py-1.5">
          <Image src="/logo.png" alt="" width={586} height={514} className="h-6 w-auto" />
          <span className="font-display text-lg font-black leading-none text-indigo">ONIBSPORT</span>
        </span>
        <span className="bc-cut flex items-center gap-1.5 bg-orange py-1.5 pl-2.5 font-display text-base font-black leading-none text-ink">
          <span className="h-2 w-2 animate-pulse rounded-full bg-ink" />
          TOP STORIES
        </span>
        {clock && <span className="ml-1 flex items-center bg-night/80 px-2.5 font-display text-base font-bold tabular-nums leading-none text-white">{clock}</span>}
      </div>

      {/* Lower third for the current story. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[132px] z-[4] sm:bottom-[150px] lg:bottom-[170px]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-3">
                {(current.isBreaking || currentCategory) && (
                  <span className="bc-tags">
                    {current.isBreaking && <span className="bg-orange text-ink">Breaking</span>}
                    {currentCategory && <span style={{ background: theme.tint, color: theme.onTint }}>{currentCategory.name}</span>}
                  </span>
                )}
                <TimeAgo iso={current.publishedAt} className="text-xs font-semibold text-white/75" />
              </div>
              {/* Big floodlit headline: each word rises with a slight turn. */}
              <h2
                aria-label={current.title}
                className="mt-4 font-display text-[40px] font-black leading-[0.9] text-white [text-shadow:0_4px_40px_rgb(0_0_0_/_0.5)] sm:text-[60px] lg:text-[78px]"
              >
                {current.title.split(/\s+/).map((word, i) => (
                  <span key={i} aria-hidden="true" className="-my-[0.1em] mr-[0.2em] inline-block overflow-hidden py-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={reduce ? false : { y: "115%", rotate: 4 }}
                      animate={{ y: 0, rotate: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.05 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="mt-4 hidden max-w-2xl text-[17px] leading-relaxed text-white/85 md:block"
              >
                {current.dek}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* "Up next" rundown: the other top stories, each with its own progress bar. */}
      <div className="absolute inset-x-0 bottom-0 z-[5] border-t border-white/10 bg-night/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-stretch gap-3 px-4 py-3 sm:px-8">
          <span aria-hidden="true" className="hidden shrink-0 items-center font-display text-lg font-black leading-none text-orange md:flex">
            UP
            <br />
            NEXT
          </span>
          <ol className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto" aria-label="Top stories running order">
            {articles.map((article, i) => {
              const cat = getCategory(article.category);
              const active = i === selected;
              return (
                <li key={article.slug} className="w-[72%] shrink-0 sm:w-auto sm:flex-1">
                  <button
                    type="button"
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative flex h-full w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl p-2 pb-3 text-left transition-colors",
                      active ? "bg-white/[0.12]" : "hover:bg-white/[0.06]"
                    )}
                  >
                    <span className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-white/10 sm:block">
                      <NewsImage src={article.image} focus={article.imageFocus} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn("text-[11px] font-bold uppercase tracking-wide", active ? "text-orange" : "text-white/55")}>{cat?.shortName ?? cat?.name}</span>
                      <span className={cn("mt-0.5 line-clamp-2 block text-[13px] font-semibold leading-snug", active ? "text-white" : "text-white/75")}>{article.title}</span>
                    </span>
                    {/* Progress for this story: fills while it is on air. */}
                    <span aria-hidden="true" className="absolute inset-x-2 bottom-1 h-[3px] overflow-hidden rounded-full bg-white/15">
                      <span
                        key={`${selected}-${i}`}
                        className={cn("absolute inset-0 origin-left rounded-full bg-orange", i < selected ? "scale-x-100" : "scale-x-0")}
                        style={
                          active
                            ? autoplay
                              ? { animation: `progress-fill ${SLIDE_MS}ms linear forwards` }
                              : { transform: "scaleX(1)" }
                            : undefined
                        }
                        onAnimationEnd={active ? () => emblaApi?.scrollNext() : undefined}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              data-magnetic="6"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 motion-reduce:hidden"
            >
              {paused ? <Play size={15} weight="fill" /> : <Pause size={15} weight="fill" />}
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous story"
              data-magnetic="6"
              className="hidden h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 lg:grid"
            >
              <CaretLeft size={17} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next story"
              data-magnetic="6"
              className="hidden h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/30 lg:grid"
            >
              <CaretRight size={17} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
