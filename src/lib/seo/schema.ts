import { absoluteUrl, site } from '@/lib/site';
import type { Faq, ToolMeta } from '@/lib/tools/types';

type Json = Record<string, unknown>;

/** Stable @id values so the graph nodes can reference each other. */
const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationSchema(): Json {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    email: site.email,
    foundingDate: site.founded,
  };
}

export function websiteSchema(): Json {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { '@id': ORG_ID },
    inLanguage: site.language,
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]): Json | null {
  if (faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/**
 * Calculators are browser-based applications, so WebApplication is the honest
 * type. `offers` at price 0 is what marks it as genuinely free rather than a
 * trial, which is the distinction Google's parser cares about.
 */
export function toolSchema(tool: ToolMeta, path: string): Json {
  return {
    '@type': 'WebApplication',
    '@id': `${absoluteUrl(path)}#app`,
    name: tool.name,
    url: absoluteUrl(path),
    description: tool.metaDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORG_ID },
    datePublished: tool.publishedAt,
    dateModified: tool.updatedAt,
    inLanguage: site.language,
    ...(tool.sources.length > 0
      ? { citation: tool.sources.map((source) => source.url) }
      : {}),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  authorPath: string;
}

export function articleSchema(input: ArticleSchemaInput): Json {
  return {
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: {
      '@type': 'Person',
      name: input.authorName,
      url: absoluteUrl(input.authorPath),
    },
    publisher: { '@id': ORG_ID },
    inLanguage: site.language,
  };
}

/**
 * Wraps nodes in a single @graph. One script tag per page beats several
 * disconnected ones — it lets nodes reference the Organization by @id instead of
 * repeating it, and it is easier to eyeball in the Rich Results Test.
 */
export function jsonLdGraph(nodes: (Json | null)[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': nodes.filter((node): node is Json => node !== null),
  });
}
