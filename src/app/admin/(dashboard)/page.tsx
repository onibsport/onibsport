import { prisma } from "@/lib/prisma";
import DashboardView, { type DashboardStory } from "@/components/admin/DashboardView";

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 3600 * 1000);
}

export default async function AdminDashboard() {
  const weekAgo = daysAgo(7);
  const [draftCount, pendingCount, publishedCount, publishedThisWeek, pending, recent] = await Promise.all([
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "PUBLISHED", publishedAt: { gte: weekAgo } } }),
    prisma.article.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
    }),
  ]);

  const toStory = (a: (typeof pending)[number]): DashboardStory => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    image: a.image,
    author: a.author,
    source: a.source,
    createdAt: a.createdAt.toISOString(),
    category: a.category.name,
  });

  return (
    <DashboardView
      counts={{ pending: pendingCount, published: publishedCount, publishedThisWeek, drafts: draftCount }}
      pending={pending.map(toStory)}
      recent={recent.map(toStory)}
    />
  );
}
