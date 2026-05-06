import { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { categories } from '@/data/categories';
import { blogPosts } from '@/data/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://megatools.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages = [
    '',
    '/tools',
    '/blog',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclaimer',
    '/cookie-policy',
    '/advertise',
  ].map(route => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Tool pages
  const toolPages = tools.map(tool => ({
    url: `${SITE_URL}/tools/${tool.category}/${tool.slug}`,
    lastModified: new Date(tool.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages = categories.map(category => ({
    url: `${SITE_URL}/tools/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Blog pages
  const blogPages = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
