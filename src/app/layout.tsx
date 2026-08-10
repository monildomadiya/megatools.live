import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Readex_Pro } from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import { JsonLd } from '@/components/JsonLd';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { jsonLdGraph, organizationSchema, websiteSchema } from '@/lib/seo/schema';
import { site } from '@/lib/site';
import './globals.css';

// Self-hosted by next/font at build time — no request to fonts.googleapis.com on
// page load, which removes a third-party connection from the critical path.
//
// Both are variable fonts, so the whole weight range arrives in one file each
// rather than one request per weight.

// Headings and body both. Two faces rather than three: Readex Pro has enough
// width and weight range to carry a 70px headline without going thin and to
// read comfortably at 17px, and dropping the second text face removes a font
// file from the critical path entirely.
//
// It is a rounder, softer geometric than the face it replaces, which suits a
// site of small everyday utilities better than something more austere.
const readex = Readex_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-readex',
});

// Carries every figure the site outputs, plus the eyebrow labels. A
// calculator's result is the one place where digits have to line up column to
// column and never reflow as they change, which is exactly what a mono's fixed
// advance width gives you; using the same face for the small uppercase labels
// ties them visually to the numbers they introduce.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
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
  // Matches `--color-surface`, so the browser chrome continues the page rather
  // than sitting on top of it as a white band. One entry, because the site
  // renders in one theme.
  themeColor: '#f4f5f7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={site.language}
      className={`${readex.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-invert focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-invert"
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
