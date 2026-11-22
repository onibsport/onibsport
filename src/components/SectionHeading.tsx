import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Direction C section title: big programme type in capitals over a dashed
 * perforation rule with punched holes at each end, like a ticket.
 */
export default function SectionHeading({
  title,
  href,
  linkLabel = "See all",
  color,
  id,
  tone = "light",
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  /** Kit colour for a block in front of the title, e.g. on a league hub. */
  color?: string;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("relative pb-5", className)}>
      <div className="flex items-end justify-between gap-4">
        <h2 id={id} className={cn("flex items-center gap-3 font-display text-[40px] font-black uppercase leading-[0.85] sm:text-[60px]", dark ? "text-white" : "text-ink")}>
          {color && <span aria-hidden="true" className="h-9 w-9 shrink-0 rotate-45 sm:h-11 sm:w-11" style={{ background: color }} />}
          <span className="-my-1 block overflow-hidden py-1">
            <span className="sd-rise block">{title}</span>
          </span>
        </h2>
        {href && (
          <Link
            href={href}
            className={cn(
              "shrink-0 border-2 px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
              dark ? "border-white text-white hover:bg-white hover:text-ink" : "border-ink text-ink hover:bg-ink hover:text-paper"
            )}
          >
            {linkLabel}
          </Link>
        )}
      </div>
      {/* Perforation: a dashed rule with a punched hole at each end. */}
      <span aria-hidden="true" className={cn("absolute inset-x-3 bottom-0 border-t-2 border-dashed", dark ? "border-white/35" : "border-ink/35")} />
      <span aria-hidden="true" className={cn("absolute -bottom-[7px] left-0 h-3.5 w-3.5 rounded-full", dark ? "bg-white/35" : "bg-ink/35")} />
      <span aria-hidden="true" className={cn("absolute -bottom-[7px] right-0 h-3.5 w-3.5 rounded-full", dark ? "bg-white/35" : "bg-ink/35")} />
    </div>
  );
}
