import { site } from '@/lib/site';
import { canonicalUrl } from './metadata';
export type BreadcrumbData = { label: string; href?: string };
/** Breadcrumb markup follows the visible trail; the final item URL is optional. */
export function breadcrumbList(items: BreadcrumbData[]) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, ...(item.href ? { item: canonicalUrl(item.href) } : {}) })) };
}
/** Free browser application markup for calculators as they launch. */
export function webApplication({ name, path, description, category }: { name: string; path: string; description: string; category: string }) {
  return { '@context': 'https://schema.org', '@type': 'WebApplication', name, url: canonicalUrl(path), description, applicationCategory: category, operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
}
export function website() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${canonicalUrl('/')}#website`, name: site.name, url: canonicalUrl('/'), description: site.tagline, inLanguage: 'en-US', publisher: { '@id': `${canonicalUrl('/')}#organization` } };
}
export function organization() {
  return { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${canonicalUrl('/')}#organization`, name: site.name, url: canonicalUrl('/') };
}
/** Escape all opening angle brackets so data cannot terminate the script element. */
export function serializeJsonLd(data: object): string { return JSON.stringify(data).replace(/</g, '\\u003c'); }
