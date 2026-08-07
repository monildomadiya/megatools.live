import type { Metadata } from 'next';
import { absoluteUrl, site } from '@/lib/site';

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. `/tools/health/bmi-calculator`. */
  path: string;
  keywords?: readonly string[];
  /** Set for article-type pages so OG reports the right type and dates. */
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

/**
 * Every page's metadata funnels through here. Canonicals in particular are easy
 * to get subtly wrong per-route, and a duplicated or missing canonical is one of
 * the cheapest ways to lose rankings on a site with hundreds of similar pages.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  publishedTime,
  modifiedTime,
  type = 'website',
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(type === 'article' && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: site.twitter,
      title,
      description,
    },
  };
}

/**
 * Titles are stored without the brand suffix so they can be reused as headings
 * and breadcrumb labels. The suffix is appended once, here, and skipped when it
 * would push the title past the point where Google truncates it.
 */
export function withBrand(title: string): string {
  const suffixed = `${title} | ${site.name}`;
  return suffixed.length <= 65 ? suffixed : title;
}
