import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

/**
 * The AI crawlers, named explicitly.
 *
 * A wildcard rule already permits them, so this changes nothing about what is
 * allowed today. It is here as a statement of intent, and it is load-bearing
 * for a specific reason: the default reflex when someone later tightens
 * robots.txt is to block these agents, and doing that on this site would be
 * self-defeating. Reference pages get their value from being quoted. An
 * assistant that cannot read a page cannot recommend it, and cannot attribute
 * an answer to it either.
 *
 * The list separates two jobs that are easy to conflate. Some of these fetch
 * pages to answer a user's question right now and cite the source — those are
 * the ones that send traffic. Others collect corpus for model training, which
 * returns nothing directly but is how a model comes to know the site exists at
 * all. Both are allowed here, which is a choice worth making knowingly.
 */
const AI_AGENTS = [
  // Answers user questions live and links the source.
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-User',
  'Claude-SearchBot',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  // Corpus collection.
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'CCBot',
  'Amazonbot',
  'Meta-ExternalAgent',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api is reserved for the contact endpoint; there is nothing there
        // worth crawling and a form endpoint in the index is only ever noise.
        disallow: ['/api/'],
      },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/'],
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
