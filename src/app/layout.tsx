import { siteOrigin } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/lib/site';
import './globals.css';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
export const metadata: Metadata = { metadataBase: new URL(siteOrigin()), verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined }, title: { default: site.name, template: '%s | MegaTools' }, description: site.tagline };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const ads=process.env.NEXT_PUBLIC_ADS_ENABLED==='true'&&/^ca-pub-\d{16}$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT??'');
  return <html lang="en" className={inter.variable}><body><a href="#main-content" className="skip-link">Skip to content</a><Header /><main id="main-content" tabIndex={-1}>{children}</main><Footer />{ads&&<Script id="adsense" strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}/>} {<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-LL4CZRXQJ7'}/>}</body></html>;
}


