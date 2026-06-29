import type { Metadata } from "next";
import Link from "next/link";

import { SiteNav } from "@/components/fqs/site-nav";
import { CtaCursor } from "@/components/fqs/cta-cursor";
import { BookAudit } from "@/components/fqs/book-audit";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "The 7 Deadly FiveM Server Mistakes — Free Checklist · Quasar Academy",
  description:
    "Most FiveM server owners are making at least 4 of these right now. Free checklist — diagnose what's killing your server before you waste another dollar.",
};

const MISTAKES = [
  {
    num: 1,
    title: "You Launched Before You Had a Hook",
    looksLike: '"Another RP server with custom cars and gangs."',
    kills: "Players have 50,000 servers to choose from. If they can't tell what makes yours different in 5 seconds, they're gone.",
    question: "Can a stranger explain what makes your server unique after reading your description once?",
  },
  {
    num: 2,
    title: "You're Optimizing Scripts While Your City Is Empty",
    looksLike: "Tweaking police job payouts, adding car packs, debugging housing — for a server with 3 players online.",
    kills: "You're polishing the engine of a car with no wheels. Players join because of other players, not perfect script balance.",
    question: "Are you spending >50% of your dev time on things players won't see until they've committed?",
  },
  {
    num: 3,
    title: "You Hired the Wrong Developer (or No Developer)",
    looksLike: "Paid $500 for a script that broke in 2 weeks. Or: spent 6 months learning Lua instead of launching.",
    kills: "Bad devs cost you money AND time. No dev costs you the entire market window. The right dev pays for themselves in 30 days.",
    question: "When was the last time a script you paid for actually shipped and worked without revision?",
  },
  {
    num: 4,
    title: "You Have No Monetization Plan (or the Wrong One)",
    looksLike: '"I\'ll figure out how to make money once people are playing." Or: donation-only with 0 donations.',
    kills: "Servers cost money. If you're not making money, your server WILL die — most die in months 4-6 when the owner runs out of cash and motivation simultaneously.",
    question: "Do you have at least one monetization stream that covers your monthly server costs right now?",
  },
  {
    num: 5,
    title: "Your Onboarding Is Hostile",
    looksLike: "Player joins → sees 20 rules → spawned in the middle of nowhere → alt+F4.",
    kills: "You paid real money (time, ads, content) to get that player. They decided within 90 seconds whether to stay.",
    question: "Can a brand new player accomplish something meaningful in their first 5 minutes?",
  },
  {
    num: 6,
    title: "You're Copying Servers That Already Won",
    looksLike: '"Let\'s do what NoPixel/Prodigy does but with our own twist."',
    kills: "Top servers have years of custom code, full-time dev teams, and 100K+ communities. You can't out-copy them — you have to out-position them.",
    question: 'If someone asked "why should I play YOUR server instead of the big ones?" — do you have a real answer?',
  },
  {
    num: 7,
    title: "You're Building Alone",
    looksLike: "Solo dev, solo admin, solo everything. Burning out in silence.",
    kills: "This is the #1 killer of FiveM servers. Not bad scripts. Not low player counts. Burnout. The owner quits because they're doing 12 jobs alone.",
    question: "Do you have at least ONE person you can call when you're stuck, frustrated, or about to quit?",
  },
];

export default function MistakesPage() {
  return (
    <div className="fqs">
      <SiteNav />

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-brand-soft/30 to-background">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-24">
          <span className="inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
            Free checklist
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            The 7 Deadly FiveM Server Mistakes
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
            Most owners are making at least <strong className="text-foreground">4 of these right now</strong>.
            Each one is silently killing your player count, your revenue, or both. Check yourself
            before you waste another dollar.
          </p>
          <p className="mt-2 text-sm text-ink-3">
            From {SITE_NAME} — the team behind 60,000+ scripts sold and 6 Tebex Legends Awards.
          </p>
        </div>
      </section>

      {/* The 7 Mistakes */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="space-y-16">
          {MISTAKES.map((m) => (
            <article key={m.num} id={`mistake-${m.num}`} className="group scroll-mt-24">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 font-mono text-lg font-bold text-destructive">
                  {m.num}
                </span>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">{m.title}</h2>

                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">
                        What it looks like
                      </span>
                      <p className="mt-1 rounded-lg border border-border bg-card px-4 py-3 text-ink-2 italic">
                        {m.looksLike}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                        Why it kills you
                      </span>
                      <p className="mt-1 text-ink-2 leading-relaxed">{m.kills}</p>
                    </div>

                    <div className="rounded-lg border border-brand/20 bg-brand-soft/20 px-4 py-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-hi">
                        Self-check
                      </span>
                      <p className="mt-1 text-sm font-medium text-foreground">{m.question}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">How bad is it?</h2>
          <p className="mt-2 text-ink-2">Count your &ldquo;yes&rdquo; answers. Be honest.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { range: "0–1", label: "You're ahead", sub: "of 90% of server owners. Keep going." },
              { range: "2–3", label: "Fixable leaks", sub: "Address the highest-impact one this week." },
              { range: "4–5", label: "Hemorrhaging", sub: "Fix onboarding + monetization first." },
              { range: "6–7", label: "You need help now", sub: "All of these are fixable. Start today." },
            ].map((tier) => (
              <div key={tier.range} className="rounded-xl border border-border bg-card p-5">
                <span className="font-mono text-3xl font-bold text-brand-hi">{tier.range}</span>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{tier.label}</h3>
                <p className="mt-1 text-sm text-ink-2">{tier.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Stop building alone
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-ink-2">
            If you checked 3+ boxes, you&apos;re leaving money on the table every day your server runs
            in this state. The Starterkit gives you templates, guides, and a community of owners
            who&apos;ve already solved these problems.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BookAudit className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-brand-hi hover:text-primary-foreground">
              Book a free FiveM audit
            </BookAudit>
            <Link
              href="https://whop.com/joined/quasar-elite-plan/five-m-courses-WQxnFRCXhfj6Zk/app/"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              See the Starterkit
              <CtaCursor />
            </Link>
            <Link
              href="https://discord.gg/quasaruniversity"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Join the Discord
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
