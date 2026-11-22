import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const [session, pendingCount] = await Promise.all([
    token ? verifySession(token) : null,
    prisma.article.count({ where: { status: "PENDING_REVIEW" } }).catch(() => 0),
  ]);

  return (
    <AdminShell email={session?.email} pendingCount={pendingCount}>
      {children}
    </AdminShell>
  );
}
