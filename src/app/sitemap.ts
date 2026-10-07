import type { MetadataRoute } from 'next';
import { getSectionUrls, sitemapSections } from '@/lib/routes';
import { canonicalUrl } from '@/lib/seo/metadata';
export function generateSitemaps() { return sitemapSections.map((id) => ({ id })); }
export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const section = await id;
  const known = sitemapSections.find((value) => value === section);
  if (!known) return [];
  return (await getSectionUrls(known)).map(({ path, lastModified }) => ({ url: canonicalUrl(path), ...(lastModified ? { lastModified } : {}) }));
}
