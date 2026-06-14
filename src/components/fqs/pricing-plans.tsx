"use client";

import { useState } from "react";
import { FreshBadge } from "@/components/fqs/fresh-badge";
import { CtaCursor } from "@/components/fqs/cta-cursor";

type Billing = "monthly" | "yearly" | "lifetime";

interface Price {
  amount: string;
  unit: string;
  sub: string;
}
interface Plan {
  id: string;
  name: string;
  tag: string;
  tagline: string;
  model: Record<Billing, string>;
  bestIf: string;
  features: string[];
  value: string;
  highlight?: boolean;
  note?: string;
  prices?: Record<Billing, Price>;
  oneTime?: Price;
  checkout: (billing: Billing) => string;
}

const CHECKOUT = "https://fivemcoach.com/en/checkout";

const PLANS: Plan[] = [
  {
    id: "builder",
    name: "Builder",
    tag: "Learn it yourself",
    tagline: "Follow the roadmap, lessons, and support to build it yourself without guessing.",
    note: "Every course unlocked.",
    model: {
      monthly: "Monthly membership. Cancel anytime.",
      yearly: "Billed yearly. Cancel anytime.",
      lifetime: "Self-serve access, kept forever.",
    },
    bestIf: "Best if you have 5+ hours a week and want the exact path. 30-day working-server guarantee.",
    features: [
      "Builder roadmap, your exact next steps",
      "Full course library + build paths",
      "Crash + script conflict fixes",
      "Operator community access",
      "Quasar Store script discounts",
      "Templates + server configs",
      "Lua + NUI fundamentals",
      "Script install guidance",
      "Modora Discord bot",
    ],
    value: "€720",
    prices: {
      monthly: { amount: "37,99 €", unit: " / month", sub: "Pause or cancel anytime" },
      yearly: { amount: "349,99 €", unit: " / year", sub: "Billed once a year" },
      lifetime: { amount: "911,76 €", unit: " one-time", sub: "Pay once, use forever" },
    },
    checkout: (b) => `${CHECKOUT}?tier=pro&billing=${b}&path=server_owner&step=1`,
  },
  {
    id: "elite",
    name: "Elite",
    tag: "Build it with us",
    tagline: "Build with expert reviews, audits, launch planning, and priority guidance.",
    note: "Most owners pick Elite.",
    highlight: true,
    model: {
      monthly: "Monthly membership. You build, we review and guide. Cancel anytime.",
      yearly: "Billed yearly. You build, we review and guide.",
      lifetime: "You build, we review and guide. Kept forever.",
    },
    bestIf: "Best if you are building now and want expert review before launch. 30-day working-server guarantee.",
    features: [
      "Everything in Builder",
      "Personalized server roadmap",
      "Direct operator support, priority lane",
      "Server X-Ray review + audits",
      "Launch planning, done with you",
      "Tebex monetization plan",
      "Stack recommendations + setup guidance",
      "1 month free VPS hosting",
    ],
    value: "€1,660+",
    prices: {
      monthly: { amount: "99,99 €", unit: " / month", sub: "Pause or cancel anytime" },
      yearly: { amount: "599,99 €", unit: " / year", sub: "Billed once a year" },
      lifetime: { amount: "2.399,76 €", unit: " one-time", sub: "Pay once, use forever" },
    },
    checkout: (b) => `${CHECKOUT}?tier=elite&billing=${b}&path=server_owner&step=1`,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tag: "Done for you",
    tagline: "Buy build hours. Our team works directly on your server.",
    model: {
      monthly: "One-time. We build, you own it.",
      yearly: "One-time. We build, you own it.",
      lifetime: "One-time. We build, you own it.",
    },
    bestIf: "Best if you want it done for you, in weeks not months. Scoped with you first, no surprises.",
    features: [
      "Everything in Elite",
      "Our team builds on your server",
      "Direct line to senior operators",
      "Architecture + dev workflow setup",
      "Launch operations planning",
      "Monetization systems built in",
      "Advanced server audits",
      "1 month free VPS hosting",
    ],
    value: "€5,900+",
    oneTime: { amount: "from 500,00 €", unit: "", sub: "8 dev hours at 62,50 €/hr · choose 8 to 50h" },
    checkout: () => `${CHECKOUT}?tier=enterprise&hours=8`,
  },
];

const BILLING_TABS: { id: Billing; label: string; badge?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "save" },
  { id: "lifetime", label: "Lifetime", badge: "best" },
];

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Billing period"
        style={{
          display: "inline-flex",
          gap: 4,
          padding: 4,
          border: "1px solid var(--hairline)",
          borderRadius: 999,
          background: "var(--surface-2)",
          marginTop: 28,
        }}
      >
        {BILLING_TABS.map((t) => {
          const active = billing === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setBilling(t.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                fontSize: 13.5,
                background: active ? "var(--accent)" : "transparent",
                color: active ? "var(--accent-ink)" : "var(--fg-2)",
                transition: "background 160ms ease, color 160ms ease",
              }}
            >
              {t.label}
              {t.badge ? (
                <span
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "2px 6px",
                    borderRadius: 999,
                    background: active ? "var(--accent-ink)" : "var(--accent-line)",
                    color: active ? "var(--accent)" : "var(--accent-strong)",
                  }}
                >
                  {t.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 18,
          maxWidth: 1080,
          marginTop: 24,
        }}
      >
        {PLANS.map((plan) => {
          const price = plan.prices ? plan.prices[billing] : plan.oneTime!;
          return (
            <div
              key={plan.id}
              className="track-card"
              style={plan.highlight ? { borderColor: "var(--accent-line)", boxShadow: "0 0 0 1px var(--accent-line)" } : undefined}
            >
              <div className="eyebrow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{plan.tag.toUpperCase()}</span>
                {plan.highlight ? <FreshBadge compact /> : null}
              </div>
              <h3 className="fqs-h" style={{ fontSize: 22, margin: "10px 0 2px" }}>
                {plan.name}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--fg-2)", margin: "0 0 12px", lineHeight: 1.5 }}>{plan.tagline}</p>

              <div style={{ minHeight: 70 }}>
                <div className="fqs-h" style={{ fontSize: 30, color: "var(--fg)" }}>
                  {price.amount}
                  {price.unit ? <span style={{ fontSize: 15, color: "var(--muted)", fontWeight: 500 }}>{price.unit}</span> : null}
                </div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "4px 0 0" }}>{price.sub}</p>
                <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "2px 0 0" }}>{plan.model[billing]}</p>
              </div>

              {plan.note ? (
                <p style={{ fontSize: 12.5, color: "var(--accent-strong)", fontWeight: 600, margin: "6px 0 0" }}>{plan.note}</p>
              ) : null}

              <ul style={{ margin: "14px 0 0", padding: "0 0 0 18px", color: "var(--fg-2)", fontSize: 13.5, display: "grid", gap: 6 }}>
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <p style={{ fontSize: 12, color: "var(--muted)", margin: "14px 0 0" }}>
                What this costs separately: <strong style={{ color: "var(--fg-2)" }}>{plan.value}</strong>
              </p>

              <div style={{ marginTop: 16 }}>
                <a
                  className={plan.highlight ? "btn btn-primary" : "btn btn-ghost"}
                  style={{ width: "100%", justifyContent: "center" }}
                  href={plan.checkout(billing)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {plan.id === "enterprise" ? "Get build hours" : `Start ${plan.name}`} <CtaCursor />
                </a>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "10px 0 0", lineHeight: 1.5 }}>{plan.bestIf}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
