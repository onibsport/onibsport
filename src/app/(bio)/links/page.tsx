import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FacebookLogo,
  InstagramLogo,
  Newspaper,
  SoccerBall,
  ThreadsLogo,
  TiktokLogo,
  WhatsappLogo,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { getLatestArticles } from "@/lib/data/db-articles";
import { getCategory } from "@/lib/data/categories";
import { SOCIAL_LINKS, YOUTUBE_CHANNEL_URL } from "@/lib/config";
import NewsImage from "@/components/ui/NewsImage";
import TimeAgo from "@/components/ui/TimeAgo";
import BreakingAlerts from "@/components/BreakingAlerts";
import { cn } from "@/lib/utils";
import { leagueTheme } from "@/lib/leagues";
import LiveClock from "@/components/ui/LiveClock";
import PrintedWordmark from "@/components/fx/gsap/PrintedWordmark";

/**
 * The link-in-bio hub: one link for every social bio, with buttons for the
 * latest news (this site), full videos (YouTube), live scores and the latest
 * stories, plus every other Onibsport account.
 *
 * Put /links?utm_source=instagram (or tiktok, x, …) in each bio: the tag is
 * passed on to every button, so analytics still show which network sent the
 * reader. The admin dashboard has these links ready to copy.
 */

const DESCRIPTION = "Latest football news, full videos and live scores from Onibsport: one link for everything.";

export const metadata: Metadata = {
  title: "Onibsport | Links",
  description: DESCRIPTION,
  alternates: { canonical: "/links" },
  openGraph: {
    title: "Onibsport | Links",
    description: DESCRIPTION,
    url: "/links",
    siteName: "Onibsport",
    images: [{ url: "/covers/default-cover.jpg", width: 1200, height: 630, alt: "Onibsport" }],
  },
};

const SOCIALS = [
  { key: "instagram", label: "Instagram", Icon: InstagramLogo },
  { key: "tiktok", label: "TikTok", Icon: TiktokLogo },
  { key: "twitter", label: "X", Icon: XLogo },
  { key: "facebook", label: "Facebook", Icon: FacebookLogo },
  { key: "youtube", label: "YouTube", Icon: YoutubeLogo },
  { key: "threads", label: "Threads", Icon: ThreadsLogo },
  { key: "whatsapp", label: "WhatsApp channel", Icon: WhatsappLogo },
] as const;

/** A tracking tag from the bio link, kept short and safe. */
function tag(value: string | string[] | undefined) {
  return typeof value === "string" ? value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30) : "";
}

export default async function LinksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const source = tag(params.utm_source);
  const stories = await getLatestArticles(5);

  /** A link on this site, carrying the bio's tracking tag so the visit is credited to the right network. */
  const track = (path: string) => {
    if (!source) return path;
    const [base, hash] = path.split("#");
    const sp = new URLSearchParams({ utm_source: source, utm_medium: "bio", utm_campaign: "link_hub" });
    return `${base}${base.includes("?") ? "&" : "?"}${sp}${hash ? `#${hash}` : ""}`;
  };

  /** Each button is a ticket: a coloured stub with the icon, a perforation, then the label. */
  const buttons = [
    {
      href: track("/"),
      label: "Latest News",
      sub: "Breaking stories, transfers and match reports",
      Icon: Newspaper,
      stub: "bg-orange text-ink",
      body: "bg-orange text-ink",
      external: false,
    },
    {
      href: YOUTUBE_CHANNEL_URL,
      label: "Watch Full Videos",
      sub: "Highlights, reactions and analysis on YouTube",
      Icon: YoutubeLogo,
      stub: "bg-[#ff0000] text-white",
      body: "bg-white text-ink",
      external: true,
    },
    {
      href: track("/live-scores"),
      label: "Live Scores",
      sub: "Scores, fixtures and league tables",
      Icon: SoccerBall,
      stub: "bg-orange text-ink",
      body: "bg-night text-white",
      external: false,
    },
  ];

  const socials = SOCIALS.filter((s) => SOCIAL_LINKS[s.key]);
  const today = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Lagos" }).format(new Date());

  return (
    // Paper, like the matchday programme the main site is printed as.
    <div className="programme-paper relative min-h-screen overflow-hidden text-ink">
      <main className="relative z-[2] mx-auto flex max-w-[480px] flex-col px-4 pb-12 pt-5">
        {/* Masthead line, as on the front page. */}
        <div
          className="load-in flex items-center justify-between gap-3 whitespace-nowrap border-b-2 border-ink pb-2 text-[10px] font-bold uppercase tracking-[0.1em]"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <span>Matchday edition</span>
          <span className="flex items-center gap-2">
            {today}
            <LiveClock className="whitespace-nowrap text-[12px]" />
          </span>
        </div>

        <header className="flex flex-col items-center text-center">
          <span
            className="load-in mt-7 grid h-20 w-20 rotate-[-6deg] place-items-center border-2 border-ink bg-white shadow-[4px_4px_0_var(--color-ink)]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <Image src="/logo.png" alt="" width={586} height={514} priority className="h-12 w-auto" />
          </span>
          <h1 className="mt-4 w-full">
            <span className="sr-only">Onibsport</span>
            <PrintedWordmark delay={0.2} className="select-none font-display text-[19vw] font-black leading-[0.8] tracking-[-0.03em] min-[480px]:text-[92px]" />
          </h1>
          <div className="mt-3 w-full border-t-2 border-ink" />
          <p className="load-in mt-4 max-w-xs text-[15px] leading-relaxed text-ink/70" style={{ "--i": 2 } as React.CSSProperties}>
            Football news, transfers and live scores, from Lagos to London.
          </p>
        </header>

        <nav aria-label="Onibsport links" className="mt-8 space-y-4">
          {buttons.map(({ href, label, sub, Icon, stub, body, external }, i) => {
            const inner = (
              <>
                <span className={cn("grid w-[72px] shrink-0 place-items-center", stub)}>
                  <Icon size={28} weight="fill" aria-hidden="true" />
                </span>
                <span className={cn("flex min-w-0 flex-1 items-center gap-3 border-l-2 border-dashed border-current/40 py-3.5 pl-4 pr-5", body)}>
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block font-display text-[26px] font-black uppercase leading-none">{label}</span>
                    <span className="mt-1 block text-[13px] leading-snug opacity-75">{sub}</span>
                  </span>
                  {external ? <ArrowUpRight size={20} weight="bold" aria-hidden="true" /> : <ArrowRight size={20} weight="bold" aria-hidden="true" />}
                </span>
              </>
            );
            const className = cn(
              "ticket-card ticket-mid relative flex items-stretch shadow-[5px_5px_0_var(--color-ink)] ring-2 ring-ink transition-transform duration-300 hover:rotate-0 hover:-translate-x-0.5 hover:-translate-y-0.5",
              i % 2 ? "rotate-[0.8deg]" : "rotate-[-0.8deg]"
            );
            return (
              <div key={label} className="load-in" style={{ "--i": i + 3 } as React.CSSProperties}>
                {external ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                  </a>
                ) : (
                  <Link href={href} className={className}>
                    {inner}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="load-in mt-6 flex justify-center" style={{ "--i": 6 } as React.CSSProperties}>
          <BreakingAlerts />
        </div>

        {stories.length > 0 && (
          <section aria-labelledby="just-posted" className="load-in mt-10" style={{ "--i": 7 } as React.CSSProperties}>
            <div className="flex items-end justify-between gap-3 border-b-2 border-ink pb-2">
              <h2 id="just-posted" className="font-display text-[34px] font-black uppercase leading-[0.85]">
                Just posted
              </h2>
              <span className="flex items-center gap-1.5 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-deep">
                <span className="h-2 w-2 animate-pulse rounded-full bg-orange" aria-hidden="true" />
                Live
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">Saw a story on our page? It&apos;s here.</p>
            <ul className="mt-2 divide-y-2 divide-dashed divide-ink/20">
              {stories.map((story) => {
                const theme = leagueTheme(story.category);
                return (
                  <li key={story.slug}>
                    <Link href={track(`/article/${story.slug}`)} className="group flex items-center gap-3.5 py-3.5">
                      <span className="block shrink-0 p-1" style={{ background: theme.deep }}>
                        <span className="relative block h-[64px] w-[64px] overflow-hidden">
                          <NewsImage src={story.image} focus={story.imageFocus} alt="" fill sizes="64px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                          {story.isBreaking ? <span className="text-orange-deep">Breaking</span> : getCategory(story.category)?.name}
                          <span className="mx-1.5" aria-hidden="true">
                            /
                          </span>
                          <TimeAgo iso={story.publishedAt} />
                        </span>
                        <span className="mt-0.5 line-clamp-2 block font-display text-[19px] font-extrabold leading-[1.05]">
                          <span className="link-draw">{story.title}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href={track("/")}
              className="mt-3 flex items-center justify-center gap-1.5 border-2 border-ink py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-ink hover:text-paper"
            >
              See all the latest news
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </section>
        )}

        {socials.length > 0 && (
          <section aria-labelledby="follow" className="mt-10 text-center">
            <h2 id="follow" className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Follow Onibsport
            </h2>
            <ul className="mt-3 flex flex-wrap justify-center gap-2.5">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a
                    href={SOCIAL_LINKS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Onibsport on ${label}`}
                    data-magnetic="5"
                    className="grid h-12 w-12 place-items-center border-2 border-ink bg-white transition-colors hover:bg-ink hover:text-paper"
                  >
                    <Icon size={22} weight="fill" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-12 border-t-2 border-dashed border-ink/25 pt-4 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          <Link href={track("/")} className="hover:text-ink">
            onibsport.com
          </Link>
        </footer>
      </main>
    </div>
  );
}
