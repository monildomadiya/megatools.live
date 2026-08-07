import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory, latestUpdate } from '@/lib/tools/registry';

/**
 * Generated from the registry rather than maintained by hand — the old site's
 * sitemap had drifted to list URLs that no longer matched what was published,
 * which is exactly the failure mode this removes.
 *
 * Empty category hubs are deliberately excluded. They are reachable through the
 * nav but there is nothing on them worth crawling yet, and submitting thin pages
 * dilutes the crawl budget for the pages that do have content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: latestUpdate(), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/tools'), lastModified: latestUpdate(), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: absoluteUrl('/contact'), lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/editorial-policy'), lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/privacy-policy'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/terms'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/disclaimer'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/cookie-policy'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((category) => getToolsByCategory(category.slug).length > 0)
    .map((category) => ({
      url: absoluteUrl(`/tools/${category.slug}`),
      lastModified: latestUpdate(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const toolPages: MetadataRoute.Sitemap = allTools.map((tool) => ({
    url: absoluteUrl(tool.href),
    lastModified: tool.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
