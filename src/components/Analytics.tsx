import Script from 'next/script';

const measurementId = process.env.NEXT_PUBLIC_GA_ID;

/**
 * GA4, loaded with `afterInteractive` so it never competes with the calculator
 * for the main thread during hydration. Renders nothing when the measurement ID
 * is absent, which keeps local development and preview builds analytics-free.
 */
export function Analytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
