import type { Metadata } from "next";
import { Space_Grotesk, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";

// FiveM School design system fonts: Space Grotesk (head) · Instrument Sans (body) · JetBrains Mono (code).
// CSS variables match the design tokens (--font-head / --font-body / --font-mono).
const spaceGrotesk = Space_Grotesk({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FiveM School — Learn FiveM by shipping",
  description:
    "Free, beginner-first FiveM lessons. Run a server, write Lua resources, and build the game world. Every lesson ends with something that actually boots, runs, or works. Verified for 2026.",
  icons: { icon: "/headlogo.png" },
};

// Set data-theme before paint to avoid a flash of the wrong theme.
const themeBootstrap = `(function(){try{var s=localStorage.getItem("fqs-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",d?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full">
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
