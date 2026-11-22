"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/** The reader's own clock, refreshed every half minute. Empty until the page is running in the browser. */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
}
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const onServer = () => "";

/**
 * A small on-air clock, as on a broadcast: a pulsing dot and the reader's
 * local time. Used in the programme masthead next to the edition date.
 */
export default function LiveClock({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, now, onServer);
  if (!time) return null;
  return (
    <span className={cn("bc-cut inline-flex items-center gap-1.5 bg-ink py-1 pl-2 font-display text-[15px] font-black tabular-nums leading-none tracking-normal text-white", className)}>
      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
      <span className="sr-only">Your local time </span>
      {time}
    </span>
  );
}
