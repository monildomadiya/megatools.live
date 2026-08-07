/**
 * Single source of truth for site-wide identity. Everything that ends up in
 * metadata, JSON-LD, or the sitemap reads from here so there is exactly one
 * place to change the domain, brand name, or contact address.
 */

export const site = {
  name: 'MegaTools',
  legalName: 'MegaTools',
  url: 'https://megatools.live',
  locale: 'en_US',
  language: 'en',
  tagline: 'Free online calculators that show their work',
  description:
    'Free online calculators and converters for finance, health, math, and everyday questions. Every tool shows the formula it uses, works out a real example, and tells you where the numbers stop being reliable.',
  email: 'hello@megatools.live',
  twitter: '@megatools_live',
  founded: '2024',
} as const;

/** Absolute URL builder. Every canonical, OG url, and sitemap entry goes through this. */
export function absoluteUrl(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? site.url : `${site.url}${clean.replace(/\/$/, '')}`;
}

/**
 * Ads stay off until AdSense approval lands. Shipping empty ad containers to a
 * reviewer reads as a site built for ads rather than for readers, so the switch
 * is deliberately a deploy-time decision rather than a code change.
 */
export const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
export const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? '';
