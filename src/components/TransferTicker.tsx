import Link from "next/link";
import { Article } from "@/lib/types";
import Marquee from "@/components/ui/Marquee";

/**
 * Transfer headlines on a strip of gold tape stuck across the programme,
 * with a stamped "Transfer watch" label. The tape is tilted inside a clipped
 * band, so it never makes the page scroll sideways.
 */
export default function TransferTicker({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="overflow-hidden py-5">
      <div className="-mx-4 -rotate-[1.2deg] border-y-2 border-ink bg-gold text-ink shadow-[0_10px_24px_-14px_rgb(18_10_51_/_0.6)]">
        <div className="mx-auto flex h-12 max-w-[1480px] items-stretch px-4">
          <Link
            href="/category/transfers"
            className="my-1.5 mr-2 flex shrink-0 -rotate-2 items-center border-2 border-dashed border-ink bg-paper px-3 font-display text-lg font-black uppercase tracking-wide hover:bg-white"
          >
            Transfer watch
          </Link>
          <Marquee label="Transfer headlines" seconds={Math.max(36, articles.length * 9)} controlClassName="border-l-2 border-ink/20 text-ink/70 hover:text-ink">
            {articles.map((a) => (
              <Link key={a.slug} href={`/article/${a.slug}`} className="flex shrink-0 items-center gap-3 px-6 font-display text-[17px] font-extrabold whitespace-nowrap hover:underline">
                <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-ink" />
                {a.title}
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
