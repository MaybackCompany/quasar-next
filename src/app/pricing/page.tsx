import type { Metadata } from "next";
import { SiteNav } from "@/components/fqs/site-nav";
import { SiteFooter } from "@/components/fqs/site-footer";
import { PricingPlans } from "@/components/fqs/pricing-plans";
import { CtaCursor } from "@/components/fqs/cta-cursor";

export const metadata: Metadata = {
  title: "Pricing · FiveM School",
  description:
    "Builder, Elite, and Enterprise. Monthly, yearly, or lifetime. Builder unlocks every course; Elite adds expert review; Enterprise is done-for-you. 30-day working-server guarantee.",
};

const DISCORD_URL = "https://discord.gg/quasaruniversity";

export default function PricingPage() {
  return (
    <div className="fqs">
      <SiteNav active="pricing" />
      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 740 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            PRICING
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(32px, 5vw, 46px)" }}>
            Learn it yourself, build it with us, or have it done for you.
          </h1>
          <p style={{ fontSize: 17, color: "var(--fg-2)", margin: "16px 0 0" }}>
            Builder unlocks every course and build path. Elite adds expert reviews and launch planning. Enterprise
            puts our team on your server. Pay monthly, yearly, or once for lifetime. Elite and Enterprise carry a
            30-day working-server guarantee.
          </p>
        </div>

        <PricingPlans />

        <div
          style={{
            marginTop: 28,
            maxWidth: 1080,
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0, maxWidth: 640 }}>
            The guarantee, on Elite and Enterprise: a live, working FiveM server within 30 days, or we keep building
            with you for free until it is. Every plan is one seat; add teammates anytime.
          </p>
          <a className="btn btn-ghost" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            Already a member? Claim your role <CtaCursor />
          </a>
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
