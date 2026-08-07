import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import { JsonLd } from '@/components/JsonLd';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { jsonLdGraph, organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { site } from '@/lib/site';
import './globals.css';

// Self-hosted by next/font at build time — no request to fonts.googleapis.com on
// page load, which removes a third-party connection from the critical path.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Free Online Calculators & Converters`,
    // Page titles supply their own brand suffix via withBrand() so they can opt
    // out when the title is already long enough to risk SERP truncation.
    template: '%s',
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: false, address: false, email: false },
  // Icons come from the app/icon.svg file convention — declaring them here as
  // well would emit duplicate <link rel="icon"> tags.
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.language} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <JsonLd json={jsonLdGraph([organizationSchema(), websiteSchema()])} />

        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
