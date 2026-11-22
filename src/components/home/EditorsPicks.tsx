import { Article } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import SectionHeading from "@/components/SectionHeading";
import SwipeRow from "@/components/ui/SwipeRow";

/**
 * Editor's picks as a row of collector cards: each story framed like a
 * trading card in its league's colours, tilted a little this way and that,
 * straightening when you point at it. Swipe or scroll sideways.
 */
const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export default function EditorsPicks({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="picks-title" className="programme-paper py-14">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeading id="picks-title" title="Editor's picks" />
        <p className="mt-4 text-sm font-semibold text-muted">The stories our editors would keep. Swipe through the collection.</p>
      </div>
      <div className="mx-auto mt-8 max-w-[1400px] px-4 sm:px-6">
        <SwipeRow label="Editor's picks">
          {articles.map((a, i) => (
            <div key={a.slug} className="w-[76%] shrink-0 snap-start px-1 py-4 sm:w-[44%] lg:w-[26%]">
              <div className={`${TILTS[i % TILTS.length]} transition-transform duration-500 hover:rotate-0`}>
                <ArticleCard article={a} size="overlay" />
              </div>
            </div>
          ))}
        </SwipeRow>
      </div>
    </section>
  );
}
