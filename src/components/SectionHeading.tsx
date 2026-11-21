import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A section title styled as a broadcast segment strap: an orange tab and an
 * angled plate, in capitals, that wipes open as the section scrolls into view.
 * `color` swaps the orange tab for a league's kit colour.
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
  /** Kit colour for the tab, e.g. on a league hub. */
  color?: string;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-wrap items-end justify-between gap-4 pb-4", className)}>
      <h2 id={id} className="min-w-0 font-display text-[30px] font-black leading-none sm:text-[40px]">
        <span className="bc-strap sd-wipe-in">
          <span aria-hidden="true" className="bc-strap-tab" style={color ? { background: color } : undefined} />
          <span className={cn("bc-strap-plate", tone === "dark" ? "bg-white text-ink" : "bg-night text-white")}>{title}</span>
        </span>
      </h2>
      <span aria-hidden="true" className={cn("sd-rule absolute inset-x-0 bottom-0 h-px", tone === "dark" ? "bg-white/20" : "bg-ink/15")} />
      <span aria-hidden="true" className="sd-rule absolute bottom-0 left-0 h-[3px] w-16" style={{ background: color ?? "var(--color-orange)" }} />
      {href && (
        <Link
          href={href}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors",
            tone === "dark" ? "border-white/25 text-white hover:bg-white hover:text-ink" : "border-line bg-white text-ink hover:border-ink"
          )}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
