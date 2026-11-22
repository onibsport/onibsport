"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-night p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pitch-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative inline-flex w-fit rotate-[-2deg] items-center gap-2.5 bg-white px-3 py-2 shadow-[4px_4px_0_var(--color-orange)]">
          <Image src="/logo.png" alt="" width={36} height={32} className="h-8 w-auto" />
          <span className="font-display text-2xl font-black uppercase leading-none text-indigo">
            Onib<span className="text-orange-deep">sport</span>
          </span>
        </div>
        <div className="relative">
          <p className="font-display text-[120px] font-black uppercase leading-[0.8]">Newsroom</p>
          <span aria-hidden="true" className="mt-5 block h-2 w-24 bg-orange" />
          <p className="mt-4 max-w-sm text-white/70">Write stories, review AI drafts and publish to every league hub.</p>
        </div>
      </div>
      <div className="programme-paper flex flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center lg:hidden">
            <Image src="/logo.png" alt="Onibsport" width={64} height={56} className="h-14 w-auto" />
          </div>
          <h1 className="mt-6 font-display text-6xl font-black uppercase leading-none text-ink lg:mt-0">Sign in</h1>
          <p className="mt-2 text-sm text-muted">Editors only. Use the email and password set for this site.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                Email
              </label>
              <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full border-2 border-ink bg-white px-3.5 py-3 text-[15px] focus:outline-none focus:ring-4 focus:ring-orange/40" />
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full border-2 border-ink bg-white px-3.5 py-3 text-[15px] focus:outline-none focus:ring-4 focus:ring-orange/40"
              />
            </div>

            {error && (
              <p role="alert" className="border-2 border-[#b42318] bg-[#fde8e8] p-3 text-sm font-semibold text-[#b42318]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer border-2 border-ink bg-ink py-3 text-sm font-bold uppercase tracking-wide text-paper shadow-[4px_4px_0_var(--color-orange)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
