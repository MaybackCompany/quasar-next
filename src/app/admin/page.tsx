import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SiteNav } from "@/components/fqs/site-nav";
import { AdminPanel } from "@/components/fqs/admin-panel";
import { getGrantableRoles } from "@/lib/auth/roles";
import { AUTH_ENABLED, getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Director admin · FiveM School",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!AUTH_ENABLED) redirect("/");

  const session = await getSession();
  if (!session.user) redirect("/auth/login?returnTo=%2Fadmin");
  if (!session.isAdmin) redirect("/");

  const roles = getGrantableRoles().map((r) => ({ id: r.id, label: r.label, tier: r.tier }));

  return (
    <div className="fqs">
      <SiteNav />
      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            DIRECTOR ADMIN
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(28px, 4vw, 38px)" }}>
            Grant course access
          </h1>
          <p style={{ fontSize: 16, color: "var(--fg-2)", margin: "14px 0 0", maxWidth: "60ch" }}>
            Signed in as <strong style={{ color: "var(--fg)" }}>{session.user.username}</strong>. Look up a Discord
            user by ID, then grant or revoke a membership role. Granting a role unlocks every course for that user.
          </p>
        </div>
        <AdminPanel roles={roles} />
      </main>
    </div>
  );
}
