import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles, getAllPublishedForSitemap, getLatestArticles } from "@/lib/data/db-articles";
import { getCategory } from "@/lib/data/categories";
import { leagueTheme } from "@/lib/leagues";
import TimeAgo from "@/components/ui/TimeAgo";
import LocalTime from "@/components/ui/LocalTime";
import { parseBlocks, plainText, readingMinutes, RenderBlock } from "@/lib/richText";
import ArticleCard from "@/components/ArticleCard";
import ShareBar from "@/components/ShareBar";
import ReadMoreCallout from "@/components/ReadMoreCallout";
import AdSlot from "@/components/AdSlot";
import NewsImage from "@/components/ui/NewsImage";
import FullImage from "@/components/ui/FullImage";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleVideo from "@/components/article/ArticleVideo";
import { breadcrumbJsonLd, newsArticleJsonLd } from "@/lib/seo";
import { shareImageFor } from "@/lib/shareImage";
import { authorPath, getAuthorByName, initials } from "@/lib/authors";
import BreakingAlerts from "@/components/BreakingAlerts";
import ViewTransition, { storyPhotoName } from "@/components/fx/ViewTransition";
import SplitReveal from "@/components/fx/gsap/SplitReveal";
import SectionHeading from "@/components/SectionHeading";

export const revalidate = 60;

export async function generateStaticParams() {
  const rows = await getAllPublishedForSitemap();
  return rows.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const category = getCategory(article.category);
  // The branded Onibsport card, unless the editor uploaded their own share image.
  const shareImage = shareImageFor(article);

  return {
    title: article.title,
    description: article.dek,
    keywords: article.tags,
    alternates: { canonical: `/article/${article.slug}` },
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.dek,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      authors: [article.author],
      section: category?.name,
      tags: article.tags,
      url: `/article/${article.slug}`,
      images: [{ url: shareImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.dek,
      images: [shareImage],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const theme = leagueTheme(article.category);
  const [related, latest, author] = await Promise.all([getRelatedArticles(article, 4), getLatestArticles(8), getAuthorByName(article.author)]);
  const blocks = parseBlocks(article.body);
  const headings = blocks.flatMap((b) => (b.type === "h2" ? [b] : []));
  const minutes = readingMinutes(article.body);

  // A "read more" link roughly halfway down, placed after a paragraph rather than mid-section.
  let midpoint = Math.ceil(blocks.length / 2);
  while (midpoint < blocks.length && blocks[midpoint - 1]?.type !== "p") midpoint++;
  const callout = related[0];
  const moreLatest = latest.filter((a) => a.slug !== article.slug && !related.some((r) => r.slug === a.slug)).slice(0, 4);
  const nextStory = moreLatest[0];

  const jsonLd = [
    newsArticleJsonLd(article, category, author),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      ...(category ? [{ name: category.name, path: `/category/${category.slug}` }] : []),
      { name: article.title, path: `/article/${article.slug}` },
    ]),
  ];

  return (
    <>
      <ReadingProgress color={theme.tint} />
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}

      <article className="programme-paper text-ink">
        <header className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6 sm:pt-8">
          {/* Programme masthead: section, reading time and edition, one line on every screen. */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-between gap-3 whitespace-nowrap border-b-2 border-ink pb-2 text-[10px] font-bold uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.14em]"
          >
            <ol className="flex min-w-0 items-center gap-2">
              <li>
                <Link href="/" className="hover:text-orange-deep">
                  Onibsport
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45" style={{ background: theme.deep }} />
                  <li className="min-w-0 truncate">
                    <Link href={`/category/${category.slug}`} className="hover:text-orange-deep">
                      {category.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
            <span className="shrink-0">{minutes} min read</span>
          </nav>

          <div className="relative">
            {article.isBreaking && (
              <p className="mt-6 inline-block rotate-[-3deg] bg-orange px-3 py-1 font-display text-lg font-black uppercase leading-none text-ink shadow-[3px_3px_0_var(--color-ink)]">
                Breaking
              </p>
            )}
            <h1 className="mt-5 max-w-[20ch] font-display text-[42px] font-black leading-[0.9] tracking-[-0.01em] sm:text-[72px] lg:text-[84px]">
              <SplitReveal delay={0.1}>{article.title}</SplitReveal>
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink/75">{article.dek}</p>
          </div>

          {/* Byline as a ticket stub: writer, date, share, split by perforations. */}
          <div className="mt-8 grid grid-cols-1 border-y-2 border-ink sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex items-center gap-3 py-4 sm:pr-6">
              <Link
                href={authorPath(author.name)}
                aria-hidden="true"
                tabIndex={-1}
                className="relative grid h-12 w-12 shrink-0 rotate-[-4deg] place-items-center overflow-hidden border-2 border-white font-display text-lg font-black text-white shadow-[3px_3px_0_var(--color-ink)]"
                style={{ background: theme.deep }}
              >
                {author.photo ? <NewsImage src={author.photo} alt="" fill sizes="48px" className="object-cover" /> : initials(author.name)}
              </Link>
              <div className="min-w-0 text-sm leading-tight">
                <p className="font-bold">
                  <Link href={authorPath(author.name)} rel="author" className="hover:text-orange-deep">
                    {author.name}
                  </Link>
                  {author.role && <span className="font-normal text-muted">, {author.role}</span>}
                </p>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  <LocalTime iso={article.publishedAt} day={{ day: "numeric", month: "long", year: "numeric" }} zone />
                  <span className="mx-1.5" aria-hidden="true">
                    /
                  </span>
                  Updated <TimeAgo iso={article.publishedAt} />
                </p>
              </div>
            </div>
            <div className="flex items-center border-t-2 border-dashed border-ink/25 py-3 sm:border-l-2 sm:border-t-0 sm:pl-6">
              <ShareBar title={article.title} path={`/article/${article.slug}`} />
            </div>
          </div>
        </header>

        <div className="mx-auto mt-10 max-w-[1100px] px-4 sm:px-6">
          {article.featuredVideoUrl ? (
            <div className="p-2.5 shadow-[0_30px_60px_-30px_rgb(18_10_51_/_0.6)] sm:p-3.5" style={{ background: theme.deep }}>
              <ArticleVideo src={article.featuredVideoUrl} title={article.title} poster={article.image || article.coverImage} />
            </div>
          ) : (
            <figure>
              {/* The photo sits in a frame of the league's kit colour, set at a slight angle like the homepage cover. */}
              <div className="rotate-[-0.6deg] p-2.5 shadow-[0_30px_60px_-30px_rgb(18_10_51_/_0.6)] sm:p-3.5" style={{ background: theme.deep }}>
                {/* Shares its name with the story card it was opened from, so the photo grows into place. */}
                <ViewTransition name={storyPhotoName(article.slug)} share="morph" default="none">
                  <div>
                    <FullImage src={article.image || article.coverImage} alt={article.imageAlt} priority sizes="(min-width: 1100px) 1100px, 100vw" />
                  </div>
                </ViewTransition>
              </div>
              {article.imageAlt && (
                <figcaption className="mt-4 flex items-start gap-2 text-sm text-muted">
                  <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-orange" />
                  {article.imageAlt}
                </figcaption>
              )}
            </figure>
          )}
        </div>

        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            {article.keyPoints && article.keyPoints.length > 0 && (
              <section aria-labelledby="key-points" className="ticket-card relative mx-auto mb-10 max-w-[680px] bg-white ring-2 ring-ink">
                <div className="flex items-center justify-between px-5 py-3" style={{ background: theme.deep }}>
                  <h2 id="key-points" className="font-display text-[26px] font-black uppercase leading-none text-white">
                    Key points
                  </h2>
                  <span aria-hidden="true" className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: theme.tint }}>
                    In brief
                  </span>
                </div>
                <ol className="divide-y-2 divide-dashed divide-ink/15 px-5">
                  {article.keyPoints.map((point, i) => (
                    <li key={point} className="flex gap-4 py-3.5 text-[16px] leading-snug text-ink/85">
                      <span aria-hidden="true" className="w-6 shrink-0 font-display text-[28px] font-black leading-[0.8]" style={{ color: theme.deep }}>
                        {i + 1}
                      </span>
                      {point}
                    </li>
                  ))}
                </ol>
              </section>
            )}
            <div className="story story-programme mx-auto max-w-[680px]">
              {blocks.slice(0, midpoint).map((block, i) => (
                <RenderBlock key={i} block={block} />
              ))}
              {callout && <ReadMoreCallout article={callout} />}
              {blocks.slice(midpoint).map((block, i) => (
                <RenderBlock key={midpoint + i} block={block} />
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-[680px] space-y-8">
              {article.source && (
                <p className="border-l-4 border-orange pl-4 text-sm text-muted">
                  Reporting based on information from <span className="font-semibold text-ink">{article.source}</span>.
                </p>
              )}
              {article.tags.length > 0 && (
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Topics</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          href={`/search?q=${encodeURIComponent(tag)}`}
                          className="inline-flex border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {author.bio && (
                <div className="relative flex gap-5 bg-white p-5 shadow-[6px_6px_0_var(--color-ink)] ring-2 ring-ink">
                  <span
                    className="relative grid h-20 w-20 shrink-0 rotate-[-4deg] place-items-center overflow-hidden border-[3px] border-white font-display text-3xl font-black text-white shadow-md"
                    style={{ background: theme.deep }}
                  >
                    {author.photo ? <NewsImage src={author.photo} alt="" fill sizes="80px" className="object-cover" /> : initials(author.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">About the writer</p>
                    <p className="mt-1 font-display text-[28px] font-black uppercase leading-none">
                      <Link href={authorPath(author.name)} className="hover:text-orange-deep">
                        {author.name}
                      </Link>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{author.bio}</p>
                    <Link
                      href={authorPath(author.name)}
                      className="mt-3 inline-block border-2 border-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
                    >
                      More from {author.name.split(/\s+/)[0]}
                    </Link>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-ink/25 pt-6">
                <ShareBar title={article.title} path={`/article/${article.slug}`} />
                <BreakingAlerts />
              </div>
              <AdSlot placement="article-end" />
            </div>
          </div>

          <aside className="hidden space-y-6 lg:block">
            <div className="sticky top-32 space-y-6">
              {headings.length > 1 && (
                <nav aria-labelledby="toc-title" className="border-y-2 border-ink py-4">
                  <h2 id="toc-title" className="font-display text-[26px] font-black uppercase leading-none">
                    In this story
                  </h2>
                  <ol className="mt-3 divide-y-2 divide-dashed divide-ink/15 text-sm">
                    {headings.map((h, i) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="group flex gap-3 py-2.5 font-semibold leading-snug text-ink/80 hover:text-ink">
                          <span aria-hidden="true" className="w-5 shrink-0 font-display text-lg font-black leading-none" style={{ color: theme.deep }}>
                            {i + 1}
                          </span>
                          <span className="link-draw">{plainText(h.text)}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {moreLatest.length > 0 && (
                <div className="ticket-card relative bg-white ring-2 ring-ink">
                  <div className="flex items-center justify-between bg-ink px-5 py-3 text-white">
                    <h2 className="font-display text-[26px] font-black uppercase leading-none">Latest</h2>
                    <span aria-hidden="true" className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange">
                      Admit one
                    </span>
                  </div>
                  <ul className="divide-y-2 divide-dashed divide-ink/15 px-5">
                    {moreLatest.map((a) => (
                      <li key={a.slug} className="py-4">
                        <ArticleCard article={a} size="compact" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <AdSlot placement="article-sidebar" />
            </div>
          </aside>
        </div>

        {nextStory && (
          <section aria-label="Next story" className="mx-auto max-w-[1100px] px-4 pt-20 sm:px-6">
            {/* The next page of the programme: a kit-colour page with the story overprinted. */}
            <Link
              href={`/article/${nextStory.slug}`}
              data-cursor="Next story"
              className="group relative block overflow-hidden p-2.5 text-white shadow-[0_30px_60px_-30px_rgb(18_10_51_/_0.6)] sm:p-3.5"
              style={{ background: leagueTheme(nextStory.category).deep }}
            >
              <span className="relative block overflow-hidden">
                <NewsImage
                  src={nextStory.image || nextStory.coverImage}
                  focus={nextStory.imageFocus}
                  alt=""
                  fill
                  sizes="1100px"
                  className="object-cover opacity-35 transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <span className="relative block p-7 sm:p-12">
                  <span
                    aria-hidden="true"
                    className="block font-display text-[56px] font-black uppercase leading-[0.8] text-transparent sm:text-[110px]"
                    style={{ WebkitTextStroke: "2px rgb(255 255 255 / 0.55)" }}
                  >
                    Next page
                  </span>
                  <span className="mt-4 block text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: leagueTheme(nextStory.category).tint }}>
                    Next story / {getCategory(nextStory.category)?.name}
                  </span>
                  <span className="mt-2 block max-w-2xl font-display text-4xl font-black leading-[0.95] sm:text-5xl">
                    <span className="link-draw">{nextStory.title}</span>
                  </span>
                </span>
              </span>
            </Link>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
            <SectionHeading id="related-title" title={`More ${category?.shortName ?? category?.name ?? "stories"}`} color={theme.deep} href={category ? `/category/${category.slug}` : undefined} />
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((a) => (
                <div key={a.slug} className="border-t-2 border-dashed border-ink/25 pt-5">
                  <ArticleCard article={a} />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
