import type { Metadata } from 'next';
import { site } from '@/lib/site';
/** Configured public origin, normalized independently of request headers. */
export function siteOrigin(base = site.url): string {
  const url = new URL(base);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Site URL must use HTTP or HTTPS.');
  url.hostname = url.hostname.replace(/^www\./, '');
  return url.origin;
}
/** Canonicals never contain a query, fragment, www prefix, or trailing slash. */
export function canonicalUrl(path: string, base = site.url): string {
  const origin = siteOrigin(base);
  const pathname = new URL(path, `${origin}/`).pathname.replace(/\/+$/, '');
  return `${origin}${pathname}`;
}
export type MetadataInput = { title: string; description: string; path: string; ogImage?: string };
/** Shared page metadata with an explicit absolute title to avoid template duplication. */
export function buildMetadata({ title, description, path, ogImage }: MetadataInput): Metadata {
  const pageTitle = title === site.name ? title : `${title} | ${site.name}`;
  if (pageTitle.length > 60) throw new Error(`SEO title exceeds 60 characters: ${pageTitle}`);
  if (description.length > 155) throw new Error(`SEO description exceeds 155 characters: ${path}`);
  const canonical = canonicalUrl(path);
  const image = new URL(ogImage ?? '/opengraph-image', `${siteOrigin()}/`).toString();
  return {
    title: { absolute: pageTitle }, description,
    alternates: { canonical },
    openGraph: { type: 'website', title: pageTitle, description, url: canonical, siteName: site.name, locale: 'en_US', images: [{ url: image, width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }] },
    twitter: { card: 'summary_large_image', title: pageTitle, description, images: [image] },
    robots: { index: true, follow: true },
  };
}
