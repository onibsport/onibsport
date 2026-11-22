import Link from "next/link";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import NewsImage from "@/components/ui/NewsImage";

/**
 * A "read this too" slip in the middle of a story, cut like a ticket stub:
 * a kit-colour photo stub on the left, a perforation, then the headline.
 */
export default function ReadMoreCallout({ article }: { article: Article }) {
  const theme = leagueTheme(article.category);
  return (
    <aside className="not-prose my-10">
      <Link
        href={`/article/${article.slug}`}
        className="group flex items-stretch bg-white text-ink no-underline shadow-[5px_5px_0_var(--color-ink)] ring-2 ring-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        <span className="relative w-28 shrink-0 p-1.5 sm:w-36" style={{ background: theme.deep }}>
          <span className="relative block h-full min-h-20 overflow-hidden">
            <NewsImage src={article.image} focus={article.imageFocus} alt="" fill sizes="144px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          </span>
        </span>
        <span className="min-w-0 border-l-2 border-dashed border-ink/30 px-4 py-3">
          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-orange-deep">Also on {getCategory(article.category)?.name ?? "Onibsport"}</span>
          <span className="mt-1 line-clamp-2 block font-display text-xl font-extrabold leading-[1.05]">
            <span className="link-draw">{article.title}</span>
          </span>
        </span>
      </Link>
    </aside>
  );
}
