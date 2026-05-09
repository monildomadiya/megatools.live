import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://megatools.live';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${SITE_URL}/tools`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${SITE_URL}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/privacy-policy`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${SITE_URL}/terms-and-conditions`, priority: 0.4, changeFrequency: 'monthly' as const },
  ].map(p => ({ ...p, lastModified: new Date() }));

  const categoryPages = categories.map(category => ({
    url: `${SITE_URL}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const toolPages = tools.map(tool => ({
    url: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
    lastModified: new Date(tool.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
