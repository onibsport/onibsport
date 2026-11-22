import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import TimeAgo from "@/components/ui/TimeAgo";
import LiveClock from "@/components/ui/LiveClock";
import NewsImage from "@/components/ui/NewsImage";
import ViewTransition, { storyPhotoName } from "@/components/fx/ViewTransition";

/**
 * Direction C's front page: a matchday programme cover. A masthead with the
 * edition date, ONIBSPORT set across the full width, the cover story in a
 * frame of its league's kit colour with its headline overprinted in giant
 * type, and "In this edition" listing the next stories like a contents page.
 */
export default function HeroProgramme({ articles, dateLabel }: { articles: Article[]; dateLabel: string }) {
  const [cover, ...rest] = articles;
  if (!cover) return null;
  const theme = leagueTheme(cover.category);
  const category = getCategory(cover.category);

  return (
    <section aria-label="Cover story" className="programme-paper relative overflow-hidden text-ink">
      <div className="mx-auto max-w-[1400px] px-4 pt-6 sm:px-6">
        {/* Masthead */}
        {/* On phones it stays on one line: shorter spacing, and the year is dropped from the date. */}
        <div
          className="load-in flex items-center justify-between gap-3 whitespace-nowrap border-b-2 border-ink pb-2 text-[10px] font-bold uppercase tracking-[0.08em] sm:gap-4 sm:text-xs sm:tracking-[0.14em]"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <span>Matchday edition</span>
          <span className="hidden lg:inline">Football news with an African lens</span>
          <span className="flex items-center gap-2 sm:gap-3">
            <span>
              {dateLabel.replace(/\s\d{4}$/, "")}
              <span className="hidden sm:inline">{dateLabel.match(/\s\d{4}$/)?.[0]}</span>
            </span>
            <LiveClock className="whitespace-nowrap text-[13px] sm:text-[15px]" />
          </span>
        </div>
        <p
          aria-hidden="true"
          className="load-in select-none text-center font-display text-[20.5vw] font-black leading-[0.78] tracking-[-0.035em] lg:text-[17.6rem]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          ONIB<span className="text-orange-deep">SPORT</span>
        </p>
        <div className="border-t-2 border-ink" />

        <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:py-10">
          {/* Cover story */}
          <Link href={`/article/${cover.slug}`} data-cursor="Read story" className="group relative block">
            <div
              className="load-in relative rotate-[-1.2deg] p-2.5 shadow-[0_30px_60px_-30px_rgb(18_10_51_/_0.6)] transition-transform duration-500 group-hover:rotate-0 sm:p-3.5"
              style={{ background: theme.deep, "--i": 2 } as React.CSSProperties}
            >
              <ViewTransition name={storyPhotoName(cover.slug)} share="morph" default="none">
                <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]">
                  <NewsImage
                    src={cover.image || cover.coverImage}
                    focus={cover.imageFocus}
                    alt={cover.imageAlt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </ViewTransition>
              <span
                className="absolute -right-3 -top-4 rotate-[8deg] px-3 py-1.5 font-display text-lg font-black uppercase shadow-md"
                style={{ background: theme.tint, color: theme.onTint }}
              >
                {cover.isBreaking ? "Breaking" : category?.shortName ?? "Cover story"}
              </span>
            </div>
            <div className="load-in relative -mt-10 ml-3 mr-6 bg-paper px-4 pb-1 pt-3 sm:-mt-16 sm:ml-8 sm:mr-24" style={{ "--i": 3 } as React.CSSProperties}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                {category?.name} <span className="mx-1">/</span> <TimeAgo iso={cover.publishedAt} />
              </p>
              <h2 className="mt-1 font-display text-[40px] font-black leading-[0.88] tracking-[-0.01em] sm:text-[62px] lg:text-[76px]">
                <span className="link-draw">{cover.title}</span>
              </h2>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/75">{cover.dek}</p>
            </div>
          </Link>

          {/* Contents */}
          <aside aria-labelledby="in-this-edition" className="load-in-side lg:border-l-2 lg:border-dashed lg:border-ink/30 lg:pl-8" style={{ "--i": 1 } as React.CSSProperties}>
            <h2 id="in-this-edition" className="font-display text-3xl font-black uppercase leading-none">
              In this edition
            </h2>
            <ul className="mt-4 divide-y-2 divide-dashed divide-ink/20 border-y-2 border-ink">
              {rest.slice(0, 4).map((a) => {
                const t = leagueTheme(a.category);
                return (
                  <li key={a.slug}>
                    <Link href={`/article/${a.slug}`} className="group flex items-start gap-3 py-4">
                      <span aria-hidden="true" className="mt-1.5 h-3 w-3 shrink-0 rotate-45" style={{ background: t.deep }} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{getCategory(a.category)?.name}</span>
                        <span className="mt-0.5 block font-display text-[22px] font-extrabold leading-[1.02]">
                          <span className="link-draw">{a.title}</span>
                        </span>
                      </span>
                      <ArrowUpRight size={18} weight="bold" className="mt-1 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
