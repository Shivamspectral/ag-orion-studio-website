import Script from "next/script";
import type { SiteConfiguration } from "@/content/types";

/**
 * Optional, non-blocking analytics. Nothing is loaded unless
 * NEXT_PUBLIC_ANALYTICS_ID is configured.
 */
export function Analytics({ config }: { config: SiteConfiguration }) {
  const { provider, id } = config.analytics;
  if (!id) return null;

  if (provider === "plausible") {
    let domain = "";
    try {
      domain = new URL(config.url).hostname;
    } catch {
      domain = "";
    }
    return <Script defer data-domain={domain || id} src="https://plausible.io/js/script.js" strategy="afterInteractive" />;
  }

  const measurementId = id.replace(/[^A-Za-z0-9_-]/g, "");
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true, allow_google_signals: false });`}
      </Script>
    </>
  );
}
