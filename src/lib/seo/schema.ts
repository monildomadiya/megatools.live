import { absoluteUrl, author, profiles, site } from '@/lib/site';
import type { Faq, ToolMeta } from '@/lib/tools/types';

type Json = Record<string, unknown>;

/** Stable @id values so the graph nodes can reference each other. */
const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
export const PERSON_ID = `${site.url}/#person`;

/** Only emitted when there is something real to point at — see `profiles`. */
const sameAs = profiles.length > 0 ? { sameAs: [...profiles] } : {};

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
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon.svg'),
      contentUrl: absoluteUrl('/icon.svg'),
    },
    founder: { '@id': PERSON_ID },
    ...sameAs,
  };
}

/**
 * The author entity, declared once at the root so every page can reference it
 * by @id rather than restating it.
 *
 * This is the node that was missing. A finance or health page with no
 * identifiable author is the classic thin-YMYL shape, and it is also what stops
 * an AI assistant from attributing anything to this site: with no Person entity
 * there is nobody for a citation to be *by*.
 */
export function personSchema(): Json {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: author.name,
    url: absoluteUrl(author.path),
    jobTitle: author.jobTitle,
    description: author.description,
    knowsAbout: [...author.knowsAbout],
    worksFor: { '@id': ORG_ID },
    ...sameAs,
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
    // Named authorship on every tool. These are finance and health pages —
    // the category where an unattributed answer is discounted hardest, by
    // ranking systems and by assistants deciding what to quote.
    author: { '@id': PERSON_ID },
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    datePublished: tool.publishedAt,
    dateModified: tool.updatedAt,
    inLanguage: site.language,
    ...(tool.sources.length > 0
      ? {
          // Full citation objects rather than bare URLs. A string tells a
          // parser where the source is; this tells it what the source is and
          // who published it, which is the part that carries weight.
          citation: tool.sources.map((source) => ({
            '@type': 'CreativeWork',
            name: source.title,
            publisher: { '@type': 'Organization', name: source.publisher },
            url: source.url,
          })),
        }
      : {}),
  };
}

/**
 * An enumerable list of tools, for the index and the category hubs.
 *
 * Without this, those pages present a wall of links that a parser has to infer
 * structure from. With it, "what calculators does this site have" is a
 * question with a machine-readable answer — which is exactly the question an
 * assistant asks before it can recommend anything here.
 */
export function itemListSchema(
  items: readonly { name: string; href: string; description?: string }[],
  listName: string,
): Json | null {
  if (items.length === 0) return null;

  return {
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

/**
 * The About page, tied to the two entities it actually describes.
 *
 * This is the page a search engine resolves an author claim against. Every tool
 * page says "by Darshan Gondaliya" and points at /about; without a node here
 * declaring that this page is about that Person, the byline is an unresolved
 * string rather than a reference to a known entity.
 */
export function aboutPageSchema(path: string): Json {
  return {
    '@type': 'AboutPage',
    '@id': `${absoluteUrl(path)}#aboutpage`,
    url: absoluteUrl(path),
    isPartOf: { '@id': SITE_ID },
    mainEntity: { '@id': ORG_ID },
    about: [{ '@id': ORG_ID }, { '@id': PERSON_ID }],
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
