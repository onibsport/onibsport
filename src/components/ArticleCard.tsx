import Link from "next/link";
import { PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import TimeAgo from "@/components/ui/TimeAgo";
import NewsImage from "@/components/ui/NewsImage";
import ViewTransition, { storyPhotoName } from "@/components/fx/ViewTransition";
import { cn } from "@/lib/utils";

/**
 * Story cards in the matchday-programme style: square print corners, photos
 * set in a thin frame of the league's kit colour, labels in tracked capitals
 * with a kit-colour diamond, and "Breaking" as a tilted stamp.
 */

type Size = "default" | "compact" | "large" | "row" | "overlay";

function Kicker({ article, onDark = false }: { article: Article; onDark?: boolean }) {
  const category = getCategory(article.category);
  if (article.isBreaking) {
    return (
      <span className="inline-flex -rotate-2 border-2 border-orange-deep bg-orange px-1.5 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-ink">
        Breaking
      </span>
    );
  }
  if (!category) return null;
  const theme = leagueTheme(category.slug);
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em]", onDark ? "text-white/80" : "text-ink/60")}>
      <span aria-hidden="true" className="h-2 w-2 rotate-45" style={{ background: onDark ? theme.tint : theme.deep }} />
      {category.name}
    </span>
  );
}

function Meta({ article, onDark = false }: { article: Article; onDark?: boolean }) {
  return (
    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.1em]", onDark ? "text-white/55" : "text-muted")}>
      <TimeAgo iso={article.publishedAt} />
    </p>
  );
}

function VideoBadge({ article }: { article: Article }) {
  if (!article.featuredVideoUrl) return null;
  return (
    <span className="absolute left-3 top-3 z-[1] flex items-center gap-1 bg-ink px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
      <PlayCircle size={13} weight="fill" className="text-orange" aria-hidden="true" />
      Video
    </span>
  );
}

/** A photo set in a frame of the league's kit colour. */
function Framed({ article, className, children }: { article: Article; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative", className)} style={{ background: leagueTheme(article.category).deep }}>
      {children}
    </div>
  );
}

export default function ArticleCard({
  article,
  size = "default",
  priority = false,
  className,
}: {
  article: Article;
  size?: Size;
  priority?: boolean;
  className?: string;
}) {
  const href = `/article/${article.slug}`;

  if (size === "compact") {
    return (
      <Link href={href} className={cn("group flex gap-3", className)}>
        <Framed article={article} className="h-[68px] w-[96px] shrink-0 p-[3px]">
          <div className="relative h-full w-full overflow-hidden bg-line">
            <NewsImage src={article.image} focus={article.imageFocus} alt={article.imageAlt} fill sizes="96px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        </Framed>
        <div className="min-w-0">
          <Kicker article={article} />
          <h3 className="mt-1 line-clamp-2 font-display text-[18px] font-extrabold leading-[1.05] text-ink">
            <span className="link-draw">{article.title}</span>
          </h3>
        </div>
      </Link>
    );
  }

  if (size === "row") {
    return (
      <Link href={href} className={cn("group grid grid-cols-[minmax(0,1fr)_120px] gap-4 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-6", className)}>
        <div className="min-w-0">
          <Kicker article={article} />
          <h3 className="mt-2 font-display text-[24px] font-black leading-[0.98] text-ink sm:text-[32px]">
            <span className="link-draw">{article.title}</span>
          </h3>
          <div className="hidden sm:block">
            <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink/70">{article.dek}</p>
          </div>
          <div className="mt-2">
            <Meta article={article} />
          </div>
        </div>
        <Framed article={article} className="self-start p-1 transition-transform duration-500 group-hover:-rotate-1">
          <div className="relative aspect-[4/3] overflow-hidden bg-line">
            <NewsImage src={article.image} focus={article.imageFocus} alt={article.imageAlt} fill sizes="(min-width: 640px) 220px, 120px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            <VideoBadge article={article} />
          </div>
        </Framed>
      </Link>
    );
  }

  if (size === "overlay") {
    // A collector card: white border like a trading card, the story's kit colour as the name band.
    const theme = leagueTheme(article.category);
    return (
      <Link
        href={href}
        data-tilt="5"
        data-spot=""
        data-cursor="Read story"
        className={cn("group relative block bg-white p-2 shadow-[0_24px_50px_-28px_rgb(18_10_51_/_0.7)] ring-1 ring-ink/10", className)}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-night sm:aspect-[3/4]">
          <NewsImage
            src={article.image}
            focus={article.imageFocus}
            alt={article.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <VideoBadge article={article} />
          <div className="absolute inset-x-0 bottom-0 p-4 pt-10 text-white" style={{ background: `linear-gradient(0deg, ${theme.deep} 0%, ${theme.deep} 55%, transparent 100%)` }}>
            <Kicker article={article} onDark />
            <h3 className="mt-1.5 font-display text-[24px] font-black leading-[0.98]">{article.title}</h3>
            <div className="mt-2">
              <Meta article={article} onDark />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (size === "large") {
    return (
      <Link href={href} className={cn("group block", className)}>
        <ViewTransition name={storyPhotoName(article.slug)} share="morph" default="none">
          <Framed article={article} className="-rotate-[0.8deg] p-2 shadow-[0_30px_60px_-34px_rgb(18_10_51_/_0.7)] transition-transform duration-500 group-hover:rotate-0 sm:p-3">
            <div data-cursor="Read story" className="relative aspect-[16/10] w-full overflow-hidden bg-line">
              <NewsImage
                src={article.image}
                focus={article.imageFocus}
                alt={article.imageAlt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <VideoBadge article={article} />
            </div>
          </Framed>
        </ViewTransition>
        <div className="mt-5">
          <Kicker article={article} />
          <h2 className="mt-2 font-display text-[38px] font-black leading-[0.9] tracking-[-0.01em] text-ink sm:text-[56px]">
            <span className="link-draw">{article.title}</span>
          </h2>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/70">{article.dek}</p>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
            <span className="text-ink/80">{article.author}</span>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <TimeAgo iso={article.publishedAt} />
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className={cn("group block", className)}>
      <Framed article={article} className="p-1 transition-transform duration-500 group-hover:-rotate-1">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
          <NewsImage
            src={article.image}
            focus={article.imageFocus}
            alt={article.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <VideoBadge article={article} />
        </div>
      </Framed>
      <div className="mt-3">
        <Kicker article={article} />
        <h3 className="mt-1.5 line-clamp-3 font-display text-[24px] font-black leading-[1] text-ink">
          <span className="link-draw">{article.title}</span>
        </h3>
        <div className="mt-1.5">
          <Meta article={article} />
        </div>
      </div>
    </Link>
  );
}
