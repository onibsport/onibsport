import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DashboardView, { type DashboardStory } from "@/components/admin/DashboardView";
import { getLatestArticles } from "@/lib/data/db-articles";
import { getCategory } from "@/lib/data/categories";

export const dynamic = "force-dynamic";

/**
 * The admin dashboard with sample numbers, so the redesign can be seen on a
 * preview link without signing in. Real published headlines fill the lists;
 * publishing is switched off. Not available on the live site.
 */
export default async function AdminPreviewPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  const latest = await getLatestArticles(8);
  const toStory = (a: (typeof latest)[number], i: number): DashboardStory => ({
    id: `sample-${i}`,
    slug: a.slug,
    title: a.title,
    image: a.image,
    author: a.author,
    source: a.source,
    createdAt: a.publishedAt,
    category: getCategory(a.category)?.name ?? "Football",
  });

  return (
    <>
      <p className="relative bg-orange px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-ink">
        Design preview with sample numbers. Nothing here changes the site.
      </p>
      <AdminShell email="editor@onibsport.com" pendingCount={3}>
        <DashboardView
          preview
          counts={{ pending: 3, published: 412, publishedThisWeek: 27, drafts: 6 }}
          pending={latest.slice(0, 3).map(toStory)}
          recent={latest.slice(3, 8).map((a, i) => toStory(a, i + 3))}
        />
      </AdminShell>
    </>
  );
}
