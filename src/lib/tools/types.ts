export type CategorySlug =
  | 'finance'
  | 'health'
  | 'math'
  | 'conversion'
  | 'date-time'
  | 'developer'
  | 'seo'
  | 'lifestyle';

export interface Category {
  slug: CategorySlug;
  /** Display name used in nav, breadcrumbs, and card headings. */
  name: string;
  /** Hub page <h1>. */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** 2-3 sentences of real intro copy for the hub page — not filler. */
  intro: string;
  order: number;
}

export interface Faq {
  question: string;
  /** Plain text. Feeds both the rendered accordion and FAQPage JSON-LD. */
  answer: string;
}

/**
 * Outbound citation. These are the E-E-A-T backbone of every tool page: the
 * formula on the page has to trace to a body that actually defines it.
 */
export interface Source {
  title: string;
  publisher: string;
  url: string;
}

export interface ToolMeta {
  slug: string;
  category: CategorySlug;
  /** Short label for nav, cards, breadcrumbs. */
  name: string;
  h1: string;
  /** Aim for <= 60 characters so it survives the SERP without truncation. */
  metaTitle: string;
  /** Aim for 140-158 characters. */
  metaDescription: string;
  /** One sentence used on category/index cards. */
  shortDescription: string;
  keywords: string[];
  faqs: Faq[];
  sources: Source[];
  /**
   * Explicit cross-links as `category/slug`. Same-category tools are related
   * automatically, so this is for links that cross a category boundary
   * (BMI -> Calorie, Mortgage -> Sales Tax) where the editorial connection is
   * real rather than structural.
   */
  relatedSlugs: string[];
  /** ISO date. */
  publishedAt: string;
  /** ISO date. Must be updated when the page content genuinely changes. */
  updatedAt: string;
  /** Surfaces the tool on the homepage. */
  featured?: boolean;
}

export interface ToolWithHref extends ToolMeta {
  href: string;
}

/**
 * The subset a card or a search result actually renders.
 *
 * `ToolWithHref` carries FAQs, sources, and keywords — several KB per tool once
 * there are a hundred of them. Anything crossing into a client component takes
 * this instead, so the RSC payload stays proportional to what is on screen
 * rather than to the whole registry. `ToolWithHref` is structurally assignable
 * to it, so server components can keep passing what they already have.
 */
export interface ToolCardData {
  href: string;
  name: string;
  shortDescription: string;
  category: CategorySlug;
}
