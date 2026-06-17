// Single source of truth for site identity, used by metadata, sitemap, robots,
// JSON-LD, and OG tags. Set NEXT_PUBLIC_SITE_URL to the live origin in prod
// (e.g. on the VPS: NEXT_PUBLIC_SITE_URL=https://quasaracademy.dev).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://quasaracademy.dev").replace(/\/$/, "");

export const SITE_NAME = "Quasar School";
export const SITE_TAGLINE = "Learn FiveM by shipping";
export const SITE_DESCRIPTION =
  "Quasar School teaches you to build a FiveM server by shipping, not just watching: run a server, write Lua resources, and build the game world. Every lesson ends with something that boots, runs, or works, verified for 2026 from the team behind 60,000+ scripts sold and 6 Tebex Legends Awards.";

// 708x452 transparent PNG of the Quasar mark.
export const OG_IMAGE = "/headlogo.png";
export const OG_IMAGE_W = 708;
export const OG_IMAGE_H = 452;

// External brand links (used in JSON-LD sameAs + footers).
export const DISCORD_INVITE = "https://discord.gg/quasaruniversity";
export const COACH_URL = "https://fivemcoach.com/en";
