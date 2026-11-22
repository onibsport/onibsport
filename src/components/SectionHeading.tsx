import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Direction B section title: large, calm type that rises out of its baseline,
 * with a lit orange line under it that draws across as the section scrolls in.
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
  /** Kit colour for the start of the lit line, e.g. on a league hub. */
  color?: string;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-end justify-between gap-4 pb-5", className)}>
      <h2 id={id} className={cn("font-display text-[42px] font-black leading-[0.9] sm:text-[60px]", tone === "dark" ? "text-white" : "text-ink")}>
        <span className="-my-1 block overflow-hidden py-1">
          <span className="sd-rise block">{title}</span>
        </span>
      </h2>
      <span
        aria-hidden="true"
        className="cinema-glow-line absolute bottom-0 left-0 w-full max-w-[420px]"
        style={color ? { background: `linear-gradient(90deg, ${color}, transparent 75%)` } : undefined}
      />
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
