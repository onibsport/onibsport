"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import TimeAgo from "@/components/ui/TimeAgo";
import NewsImage from "@/components/ui/NewsImage";
import ViewTransition, { storyPhotoName } from "@/components/fx/ViewTransition";
import { cn } from "@/lib/utils";

const SLIDE_MS = 8000;

/**
 * Direction B's front-page stage: the lead story fills the screen in a dark,
 * floodlit stadium. Two floodlight beams sweep slowly across the photo, the
 * headline rises word by word, and the whole stage sinks back into the page
 * as you scroll past it. The other top stories sit in a slim list at the side.
 */
export default function HeroCinema({ articles }: { articles: Article[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const reduce = useReducedMotion();
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
  const category = getCategory(current.category);

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
                <Link href={`/article/${article.slug}`} tabIndex={i === selected ? 0 : -1} data-cursor="Read story" className="block">
                  <div className="relative h-[min(90svh,820px)] min-h-[580px] w-full overflow-hidden">
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
                            i === selected && !reduce ? "scale-100 duration-[8000ms]" : "scale-110 duration-0"
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

        {/* Headline */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3]">
          <div className="mx-auto grid max-w-[1400px] items-end gap-10 px-4 pb-12 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_320px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl"
              >
                <p className="flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80">
                  {current.isBreaking && <span className="rounded-full bg-orange px-3 py-1 text-xs font-bold text-ink shadow-[0_0_24px_rgb(247_148_29_/_0.6)]">Breaking</span>}
                  {category && <span className="text-gold">{category.name}</span>}
                  <TimeAgo iso={current.publishedAt} className="text-white/60" />
                </p>
                <h2
                  aria-label={current.title}
                  className="mt-4 font-display text-[42px] font-black leading-[0.9] text-white [text-shadow:0_4px_40px_rgb(0_0_0_/_0.5)] sm:text-[64px] lg:text-[84px]"
                >
                  {current.title.split(/\s+/).map((word, i) => (
                    <span key={i} aria-hidden="true" className="-my-[0.1em] mr-[0.2em] inline-block overflow-hidden py-[0.1em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={reduce ? false : { y: "115%", rotate: 4 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.05 }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </h2>
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-5 hidden max-w-2xl text-lg leading-relaxed text-white/75 md:block"
                >
                  {current.dek}
                </motion.p>
                <motion.span
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.75 }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-[0_0_40px_rgb(255_244_214_/_0.35)]"
                >
                  Read the story
                  <ArrowRight size={16} weight="bold" aria-hidden="true" />
                </motion.span>
              </motion.div>
            </AnimatePresence>

            {/* The other top stories, with a thin lit bar for the one on screen. */}
            <ol className="pointer-events-auto hidden space-y-1 lg:block" aria-label="Top stories running order">
              {articles.map((article, i) => {
                const active = i === selected;
                return (
                  <li key={article.slug}>
                    <button
                      type="button"
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-current={active ? "true" : undefined}
                      className="group relative block w-full cursor-pointer py-3 pl-5 text-left"
                    >
                      <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] overflow-hidden rounded-full bg-white/15">
                        <span
                          key={`${selected}-${i}`}
                          className={cn("absolute inset-0 origin-top rounded-full bg-orange shadow-[0_0_12px_rgb(247_148_29_/_0.8)]", i < selected ? "scale-y-100" : "scale-y-0")}
                          style={
                            active
                              ? autoplay
                                ? { animation: `cinema-fill ${SLIDE_MS}ms linear forwards` }
                                : { transform: "scaleY(1)" }
                              : undefined
                          }
                          onAnimationEnd={active ? () => emblaApi?.scrollNext() : undefined}
                        />
                      </span>
                      <span className={cn("line-clamp-2 text-[15px] font-semibold leading-snug transition-colors", active ? "text-white" : "text-white/45 group-hover:text-white/80")}>
                        {article.title}
                      </span>
                    </button>
                  </li>
                );
              })}
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                  className="flex cursor-pointer items-center gap-2 pl-5 text-xs font-semibold text-white/55 hover:text-white motion-reduce:hidden"
                >
                  {paused ? <Play size={12} weight="fill" /> : <Pause size={12} weight="fill" />}
                  {paused ? "Play" : "Pause"}
                </button>
              </li>
            </ol>
          </div>
        </div>

        {/* Phones: dots under the stage. */}
        <div className="absolute inset-x-0 bottom-4 z-[3] flex justify-center gap-2 lg:hidden">
          {articles.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Story ${i + 1} of ${articles.length}`}
              aria-current={i === selected ? "true" : undefined}
              className={cn("h-1.5 cursor-pointer rounded-full transition-all", i === selected ? "w-8 bg-orange" : "w-1.5 bg-white/40")}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
