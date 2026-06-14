import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

import { SiteNav } from "@/components/fqs/site-nav";
import { CtaCursor } from "@/components/fqs/cta-cursor";
import { AUTH_ENABLED, getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Member access required · Quasar Academy",
  description: "Quasar Academy course access requires the Builder, Elite, or Enterprise role in Discord. Builder unlocks every course.",
};

export const dynamic = "force-dynamic";

export default async function PaywallPage() {
  if (!AUTH_ENABLED) {
    redirect("/");
  }

  const session = await getSession();
  const username = session.user?.username || "there";

  return (
    <div className="fqs">
      <SiteNav />
      <main className="min-h-[calc(100vh-3.5rem)] border-t border-border bg-background">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
              Members only
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
              Hey {username}, this lesson needs an active member role.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
              The Quasar Academy courses are open to Discord members with the Builder, Elite, or Enterprise
              role. Builder unlocks every course. If you already have access, roles can take a minute to sync.
              Sign in again and you should land back in the course.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://fivemcoach.com/en"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-brand-hi hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                See plans
                <CtaCursor />
              </a>
              <a
                href="https://discord.gg/quasaruniversity"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Open Discord
              </a>
              <a
                href="/"
                className="inline-flex items-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Try again
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Access check</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="text-ink-2">Discord account</dt>
                <dd className="font-medium text-foreground">{session.user ? username : "Not signed in"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="text-ink-2">Server membership</dt>
                <dd className="font-medium text-foreground">{session.inGuild ? "Found" : "Not found"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-2">Required role</dt>
                <dd className="font-medium text-foreground">Builder, Elite, or Enterprise</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-ink-2">
              Have the role but still stuck? Wait a minute, try again, or ask staff to check the Discord role.
            </p>
            <a
              href="/auth/logout"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-hi hover:text-brand"
            >
              <LogOut className="size-4" />
              Use a different Discord account
            </a>
          </aside>
        </section>
      </main>
    </div>
  );
}
