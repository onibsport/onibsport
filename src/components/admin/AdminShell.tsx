import Link from "next/link";
import Image from "next/image";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminNav from "@/components/admin/AdminNav";
import LiveClock from "@/components/ui/LiveClock";

/**
 * The newsroom frame, in the programme style of the site: an ink press-room
 * sidebar with the logo on a white slip, square nav tabs, and the work area
 * on programme paper. Shared by the real admin and its sample preview.
 */
export default function AdminShell({ email, pendingCount, children }: { email?: string; pendingCount: number; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative flex shrink-0 flex-col overflow-hidden bg-night text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-8 -left-3 hidden select-none font-display text-[150px] font-black uppercase leading-none text-transparent lg:block"
          style={{ WebkitTextStroke: "2px rgb(255 255 255 / 0.07)" }}
        >
          Press
        </span>
        <div className="relative flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-5 lg:py-6">
          <Link href="/admin" className="inline-flex rotate-[-2deg] items-center gap-2.5 bg-white px-3 py-2 shadow-[4px_4px_0_var(--color-orange)]">
            <Image src="/logo.png" alt="" width={32} height={28} className="h-7 w-auto" />
            <span className="font-display text-xl font-black uppercase leading-none text-indigo">
              Onib<span className="text-orange-deep">sport</span>
            </span>
          </Link>
          <p className="hidden items-center justify-between border-b-2 border-white/20 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 lg:mt-6 lg:flex">
            Newsroom
            <LiveClock className="whitespace-nowrap text-[12px]" />
          </p>
          <div className="w-32 lg:hidden">
            <LogoutButton />
          </div>
        </div>
        <div className="relative px-3 pb-3 lg:hidden">
          <AdminNav pendingCount={pendingCount} horizontal />
        </div>
        <div className="relative hidden flex-1 px-3 lg:block">
          <AdminNav pendingCount={pendingCount} />
        </div>
        <div className="relative hidden border-t-2 border-dashed border-white/15 p-3 lg:block">
          {email && <p className="truncate px-3 pb-2 text-[11px] font-semibold text-white/50">{email}</p>}
          <Link href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white">
            <ArrowSquareOut size={18} weight="bold" aria-hidden="true" />
            View the site
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main className="programme-paper min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
