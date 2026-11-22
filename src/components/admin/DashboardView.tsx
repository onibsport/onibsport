import Link from "next/link";
import { PencilSimpleLine, Robot } from "@phosphor-icons/react/dist/ssr";
import { PublishButton } from "@/components/admin/ArticleActions";
import NewsImage from "@/components/ui/NewsImage";
import BioLinks from "@/components/admin/BioLinks";
import CountUp from "@/components/reactbits/CountUp";
import StampText from "@/components/fx/gsap/StampText";
import { timeAgo } from "@/lib/time";

export type DashboardStory = {
  id: string;
  slug: string;
  title: string;
  image: string;
  author: string;
  source?: string | null;
  createdAt: string;
  category: string;
};

/**
 * The newsroom front page, printed like the matchday programme: the title
 * stamped in capitals, the four counts as ticket stubs that count up, the
 * review queue as a run sheet and the latest published stories as a ticket.
 * `preview` swaps the publish buttons for inert ones (the sample preview).
 */
export default function DashboardView({
  counts,
  pending,
  recent,
  preview = false,
}: {
  counts: { pending: number; published: number; publishedThisWeek: number; drafts: number };
  pending: DashboardStory[];
  recent: DashboardStory[];
  preview?: boolean;
}) {
  const stats = [
    { label: "Waiting for review", value: counts.pending, tone: "bg-orange text-ink", edge: "border-ink/30" },
    { label: "Published", value: counts.published, tone: "bg-night text-white", edge: "border-white/25" },
    { label: "Published this week", value: counts.publishedThisWeek, tone: "bg-white text-ink", edge: "border-ink/25" },
    { label: "Drafts", value: counts.drafts, tone: "bg-white text-ink", edge: "border-ink/25" },
  ];

  return (
    <div className="text-ink">
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink pb-2 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs">
        <span>Onibsport newsroom</span>
        <span className="text-muted">Today&apos;s run sheet</span>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <h1 className="font-display text-[56px] font-black uppercase leading-[0.82] sm:text-[88px]">
            <span className="-my-1 block overflow-hidden py-1">
              <StampText className="block">Newsroom</StampText>
            </span>
          </h1>
          <p className="mt-3 text-muted">Review AI drafts, publish stories and keep every hub fresh.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/ai-desk"
            className="flex items-center gap-2 border-2 border-ink bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
          >
            <Robot size={18} weight="bold" aria-hidden="true" />
            Open the AI Desk
          </Link>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-paper shadow-[4px_4px_0_var(--color-orange)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            <PencilSimpleLine size={18} weight="bold" aria-hidden="true" />
            Write a story
          </Link>
        </div>
      </div>

      {/* The four counts as ticket stubs. */}
      <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`ticket-card ticket-mid relative p-5 shadow-[5px_5px_0_var(--color-ink)] ring-2 ring-ink ${s.tone} ${i % 2 ? "rotate-[0.6deg]" : "rotate-[-0.6deg]"}`}
          >
            <dd className="font-display text-6xl font-black leading-none tabular-nums">
              <CountUp to={s.value} duration={1.2} />
            </dd>
            <dt className={`mt-3 border-t-2 border-dashed pt-2 text-[11px] font-bold uppercase tracking-[0.14em] opacity-80 ${s.edge}`}>{s.label}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <BioLinks />
      </div>

      <div className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section aria-labelledby="pending-title">
          <div className="flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
            <h2 id="pending-title" className="font-display text-[34px] font-black uppercase leading-[0.85]">
              Waiting for review
            </h2>
            <Link href="/admin/articles?status=PENDING_REVIEW" className="border-2 border-ink px-3 py-1 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-paper">
              See all
            </Link>
          </div>

          {pending.length === 0 ? (
            <div className="mt-5 bg-white p-8 text-center ring-2 ring-ink">
              <p className="font-display text-3xl font-black uppercase">All caught up</p>
              <p className="mt-1 text-sm text-muted">AI-drafted stories land here for approval before they go live. Draft one from the AI Desk.</p>
            </div>
          ) : (
            <ul className="divide-y-2 divide-dashed divide-ink/20">
              {pending.map((article) => (
                <li key={article.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                  <Link href={`/admin/articles/${article.id}`} className="block w-full shrink-0 bg-night p-1 sm:w-40">
                    <span className="relative block aspect-[16/10] overflow-hidden bg-line">
                      <NewsImage src={article.image} alt="" fill sizes="160px" className="object-cover" />
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-deep">{article.category}</p>
                    <Link href={`/admin/articles/${article.id}`} className="group mt-0.5 line-clamp-2 font-display text-[22px] font-extrabold leading-[1.05]">
                      <span className="link-draw">{article.title}</span>
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {article.author}, {timeAgo(article.createdAt)}
                      {article.source && <> / via {article.source}</>}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-ink hover:text-paper"
                    >
                      Review and edit
                    </Link>
                    {preview ? (
                      <span className="bg-[#1f9d5c] px-3.5 py-2 text-xs font-bold text-white opacity-80" title="Sample preview: publishing is switched off">
                        Publish
                      </span>
                    ) : (
                      <PublishButton id={article.id} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="recent-title" className="ticket-card relative self-start bg-white ring-2 ring-ink">
          <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
            <h2 id="recent-title" className="font-display text-[26px] font-black uppercase leading-none">
              Just published
            </h2>
            <span aria-hidden="true" className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange">
              Live on site
            </span>
          </div>
          <ul className="divide-y-2 divide-dashed divide-ink/15 px-5">
            {recent.length === 0 && <li className="py-5 text-sm text-muted">Nothing published yet.</li>}
            {recent.map((a) => (
              <li key={a.id} className="py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{a.category}</p>
                <div className="mt-0.5 flex items-start justify-between gap-3">
                  <Link href={`/admin/articles/${a.id}`} className="group line-clamp-2 text-sm font-bold">
                    <span className="link-draw">{a.title}</span>
                  </Link>
                  <Link href={`/article/${a.slug}`} target="_blank" className="shrink-0 border-b-2 border-orange text-xs font-bold uppercase">
                    View
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
