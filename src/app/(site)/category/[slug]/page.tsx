import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { categories, getCategory } from "@/lib/data/categories";
import { getArticlesByCategory } from "@/lib/data/db-articles";
import { getFixturesForLeague, getFixturesForRange, getStandingsForLeague, getTopScorers, todayIso } from "@/lib/live/footballData";
import { shiftDate } from "@/lib/time";
import type { Fixture } from "@/lib/types";
import { leagueTheme } from "@/lib/leagues";
import ArticleCard from "@/components/ArticleCard";
import LeagueDataTabs from "@/components/LeagueDataTabs";
import StandingsTable from "@/components/StandingsTable";
import TrendingSidebar from "@/components/TrendingSidebar";
import AdSlot from "@/components/AdSlot";
import AutoRefresh from "@/components/AutoRefresh";
import HubIntro from "@/components/league/HubIntro";
import HubPortal from "@/components/league/HubPortal";
import TransferTimeline from "@/components/league/TransferTimeline";
import { breadcrumbJsonLd } from "@/lib/seo";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 60;

/** Refresh the open page every minute only while a match is live or about to kick off. */
function liveOrSoon(fixtures: Fixture[]) {
  const soon = Date.now() + 15 * 60_000;
  return fixtures.some((f) => f.status === "live" || (f.status === "upcoming" && +new Date(f.kickoff) <= soon));
}

/** World Football has no single league, so its match centre covers every competition this week. */
async function hubFixtures(slug: string): Promise<Fixture[]> {
  if (slug === "world-football") {
    const today = todayIso();
    return getFixturesForRange(shiftDate(today, -3), shiftDate(today, 5));
  }
  return getFixturesForLeague(slug as Parameters<typeof getFixturesForLeague>[0]);
}

/** Hubs that open with the glyph-portal camera move, and the word it flies through. */
const PORTAL_WORDS: Record<string, string> = {
  "nigeria-football": "NAIJA",
  npfl: "NPFL",
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const description = `${leagueTheme(slug).blurb} The latest ${category.name} news, results, fixtures and table on Onibsport.`;
  return {
    title: `${category.name} news, results, fixtures and table`,
    description,
    keywords: [category.name, `${category.name} news`, `${category.name} results`, `${category.name} fixtures`, `${category.name} table`, "Onibsport"],
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} — Onibsport`,
      description,
      type: "website",
      url: `/category/${category.slug}`,
      images: [{ url: "/covers/default-cover.jpg", width: 1200, height: 630, alt: `Onibsport — ${category.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} — Onibsport`,
      description,
      images: ["/covers/default-cover.jpg"],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const theme = leagueTheme(slug);

  const [articles, fixtures, standings, scorers] = await Promise.all([
    getArticlesByCategory(slug),
    hubFixtures(category.slug),
    getStandingsForLeague(category.slug),
    getTopScorers(category.slug),
  ]);
  const [lead, ...rest] = articles;
  const gridArticles = rest.slice(0, 4);
  const riverArticles = rest.slice(4);
  const hasTable = !!standings && standings.length > 0;
  // The match centre shows whenever there is anything to put in it.
  const hasMatches = fixtures.length > 0 || hasTable || scorers.length > 0;
  const next = fixtures.filter((f) => f.status === "upcoming").sort((a, b) => +new Date(a.kickoff) - +new Date(b.kickoff))[0];
  const portalWord = PORTAL_WORDS[slug];

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: category.name, path: `/category/${category.slug}` },
  ]);

  const intro = <HubIntro category={category} theme={theme} storyCount={articles.length} standings={standings} next={next} />;

  const sections = [
    { href: "#latest", label: "Latest", show: true },
    { href: "#match-centre", label: fixtures.length > 0 ? "Results & fixtures" : "Match centre", show: hasMatches },
    { href: "#table", label: "Table", show: hasTable },
    { href: "#timeline", label: "Timeline", show: slug === "transfers" },
  ].filter((s) => s.show);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {liveOrSoon(fixtures) && <AutoRefresh />}

      {portalWord ? (
        <HubPortal word={portalWord} image={lead?.image || lead?.coverImage} deep={theme.deep} tint={theme.tint} eyebrow={`Onibsport ${category.name} desk`}>
          {intro}
        </HubPortal>
      ) : (
        /* The league's page of the programme, printed in its kit colour with its crest letters set huge behind. */
        <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pt-14" style={{ background: theme.deep }}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[260px] font-black leading-none opacity-[0.12] sm:-right-10 sm:text-[440px]"
            style={{ color: theme.tint }}
          >
            {theme.crest}
          </span>
          <div className="relative">{intro}</div>
        </section>
      )}

      {sections.length > 1 && (
        <nav aria-label={`${category.name} sections`} className="programme-paper border-b-2 border-ink">
          <ul className="no-scrollbar mx-auto flex h-14 max-w-[1400px] items-center gap-2 overflow-x-auto px-4 sm:px-6">
            {sections.map((s) => (
              <li key={s.href} className="shrink-0">
                <a
                  href={s.href}
                  className="inline-flex border-2 border-ink px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="programme-paper text-ink">
        <div id="latest" className="mx-auto max-w-[1400px] scroll-mt-32 px-4 py-12 sm:px-6">
          <div className={hasMatches ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-0" : "grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-0"}>
            <div className="min-w-0 lg:border-r-2 lg:border-dashed lg:border-ink/25 lg:pr-10">
              <SectionHeading title="Latest" color={theme.deep} className="mb-10" />
              {articles.length === 0 ? (
                <div className="bg-white p-8 shadow-[6px_6px_0_var(--color-ink)] ring-2 ring-ink">
                  <h2 className="font-display text-3xl font-black uppercase">No {category.name} stories yet</h2>
                  <p className="mt-2 text-muted">New stories appear here as soon as they&apos;re published. Meanwhile, catch up on the rest of the site.</p>
                  <Link
                    href="/"
                    className="mt-5 inline-flex border-2 border-ink bg-ink px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-paper transition-colors hover:bg-transparent hover:text-ink"
                  >
                    Back to the front page
                  </Link>
                </div>
              ) : (
                <>
                  {lead && <ArticleCard article={lead} size="large" priority />}
                  {gridArticles.length > 0 && (
                    <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
                      {gridArticles.map((article) => (
                        <div key={article.slug} className="border-t-2 border-dashed border-ink/25 pt-5">
                          <ArticleCard article={article} />
                        </div>
                      ))}
                    </div>
                  )}
                  {riverArticles.length > 0 && (
                    <div className="mt-12 divide-y-2 divide-dashed divide-ink/20 border-t-2 border-ink">
                      {riverArticles.map((article) => (
                        <div key={article.slug} className="py-7">
                          <ArticleCard article={article} size="row" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="min-w-0 space-y-6 lg:pl-10">
              {hasMatches ? (
                <section id="match-centre" aria-labelledby="match-centre-title" className="scroll-mt-32">
                  <SectionHeading id="match-centre-title" title="Match centre" className="mb-6" />
                  <LeagueDataTabs
                    league={category.slug}
                    fixtures={fixtures}
                    standings={standings}
                    scorers={scorers}
                    showLeague={category.slug === "world-football"}
                    accent={theme.deep}
                  />
                </section>
              ) : (
                <TrendingSidebar articles={articles.slice(0, 6)} title={`More ${category.shortName}`} />
              )}
              <AdSlot placement="hub-sidebar" />
            </aside>
          </div>
        </div>

        {slug === "transfers" && articles.length >= 3 && <TransferTimeline articles={articles} />}

        {hasTable && (
          <section id="table" aria-labelledby="table-title" className="mx-auto max-w-[1400px] scroll-mt-32 px-4 pb-14 pt-6 sm:px-6">
            <SectionHeading id="table-title" title={`${category.shortName} table`} color={theme.deep} className="mb-8" />
            <StandingsTable rows={standings!} accent={theme.deep} league={category.slug} />
          </section>
        )}
      </div>
    </>
  );
}
