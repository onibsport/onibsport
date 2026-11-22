import Link from "next/link";
import { Article } from "@/lib/types";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";

/**
 * The ranked story list as a matchday ticket: an ink header strip, notches
 * punched in both sides, and big rank numbers (a ranking, so numbers fit).
 */
export default function TrendingSidebar({ articles, title = "Most read" }: { articles: Article[]; title?: string }) {
  if (articles.length === 0) return null;
  return (
    <aside aria-labelledby="trending-title" className="ticket-card relative bg-white text-ink ring-2 ring-ink">
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
        <h2 id="trending-title" className="font-display text-[26px] font-black uppercase leading-none">
          {title}
        </h2>
        <span aria-hidden="true" className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange">
          Admit one
        </span>
      </div>
      <ol className="divide-y-2 divide-dashed divide-ink/15 px-5">
        {articles.map((article, i) => {
          const theme = leagueTheme(article.category);
          return (
            <li key={article.slug}>
              <Link href={`/article/${article.slug}`} className="group flex items-start gap-4 py-4">
                <span className="w-9 shrink-0 font-display text-[46px] font-black leading-[0.78]" style={{ color: theme.deep }}>
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{getCategory(article.category)?.name}</span>
                  <span className="mt-0.5 line-clamp-3 block font-display text-[19px] font-extrabold leading-[1.05] text-ink">
                    <span className="link-draw">{article.title}</span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
