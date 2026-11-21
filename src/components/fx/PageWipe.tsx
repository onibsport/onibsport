"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * The broadcast wipe between pages: when the address changes, an orange and
 * gold band sweeps across the screen once, like a TV replay transition. It is
 * an overlay that never blocks clicks or moves the page, it does not run on
 * the first load, and it is off for readers who prefer reduced motion
 * (see .bc-wipe-page in globals.css).
 */
export default function PageWipe() {
  const pathname = usePathname();
  const [last, setLast] = useState(pathname);
  const [count, setCount] = useState(0);
  // Count page changes during render (React's pattern for reacting to a changed prop).
  if (last !== pathname) {
    setLast(pathname);
    setCount((c) => c + 1);
  }
  if (count === 0) return null;
  // A new key each time restarts the sweep.
  return <div key={count} aria-hidden="true" className="bc-wipe bc-wipe-page" />;
}
