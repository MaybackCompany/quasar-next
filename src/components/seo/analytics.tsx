import Script from "next/script";

/**
 * Host-agnostic analytics (works on a VPS or Vercel). Renders nothing unless an
 * env var is set, so it is safe by default:
 *   - NEXT_PUBLIC_PLAUSIBLE_DOMAIN -> Plausible (privacy-friendly, no cookie banner)
 *   - NEXT_PUBLIC_GA_ID            -> Google Analytics 4 (gtag)
 * Set either or both. CSP already allows plausible.io + googletagmanager.
 */
export function SiteAnalytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  const ga = process.env.NEXT_PUBLIC_GA_ID?.trim();

  return (
    <>
      {plausible ? (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.outbound-links.js"
          strategy="afterInteractive"
        />
      ) : null}

      {ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
