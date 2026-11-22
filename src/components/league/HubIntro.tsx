import { Category, Fixture, StandingRow } from "@/lib/types";
import { LeagueTheme } from "@/lib/leagues";
import type { ReactNode } from "react";
import LeagueCrest from "@/components/ui/LeagueCrest";
import LocalTime from "@/components/ui/LocalTime";
import StampText from "@/components/fx/gsap/StampText";

function leader(rows?: StandingRow[]) {
  if (!rows?.length) return null;
  return [...rows].sort(
    (a, b) => b.won * 3 + b.drawn - (a.won * 3 + a.drawn) || b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst)
  )[0];
}

/**
 * Hub title block, printed like the league's page in the programme (the
 * same look as the homepage's League pages): region and crest over a giant
 * name in capitals, a kit-colour bar, the brief, then the three facts a fan
 * wants first as ticket stubs.
 */
export default function HubIntro({
  category,
  theme,
  storyCount,
  standings,
  next,
}: {
  category: Category;
  theme: LeagueTheme;
  storyCount: number;
  standings?: StandingRow[];
  next?: Fixture;
}) {
  const top = leader(standings);
  const facts = [
    { label: "Stories", value: String(storyCount) },
    top ? { label: "Top of the table", value: `${top.team}, ${top.won * 3 + top.drawn} pts` } : null,
    next ? { label: "Next up", value: `${next.home} v ${next.away}`, sub: <LocalTime iso={next.kickoff} day={{ weekday: "short", day: "numeric", month: "short" }} zone /> } : null,
  ].filter(Boolean) as { label: string; value: string; sub?: ReactNode }[];

  return (
    <div className="mx-auto w-full max-w-[1400px] text-white">
      <div className="flex items-center justify-between gap-4 border-b-2 border-white/25 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] sm:text-xs">
        <span style={{ color: theme.tint }}>{theme.region}</span>
        <span className="text-white/60">Onibsport league page</span>
      </div>
      <div className="mt-8 flex flex-wrap items-end gap-5 sm:gap-7">
        <LeagueCrest slug={category.slug} size={88} className="shrink-0 rotate-[-4deg] shadow-[0_20px_40px_-15px_rgb(0_0_0/0.6)]" />
        <h1 className="min-w-0 font-display text-[52px] font-black uppercase leading-[0.82] tracking-[-0.01em] sm:text-[96px] lg:text-[124px]">
          <StampText className="block">{category.name}</StampText>
        </h1>
      </div>
      <span aria-hidden="true" className="mt-6 block h-2 w-24" style={{ background: theme.tint }} />
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">{theme.blurb}</p>
      {facts.length > 0 && (
        <dl className="mt-9 grid max-w-4xl border-2 border-white/30 sm:grid-cols-3">
          {facts.map((f, i) => (
            <div key={f.label} className={i > 0 ? "border-t-2 border-dashed border-white/25 p-4 sm:border-l-2 sm:border-t-0" : "p-4"}>
              <dt className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: theme.tint }}>
                {f.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-extrabold leading-tight">{f.value}</dd>
              {f.sub && <dd className="text-xs font-semibold uppercase tracking-wide text-white/60">{f.sub}</dd>}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
