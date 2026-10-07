import type { MetadataRoute } from 'next';
import { sitemapSections } from '@/lib/routes';
import { canonicalUrl } from '@/lib/seo/metadata';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: sitemapSections.map((section) => canonicalUrl(`/sitemap/${section}.xml`)) };
}
