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

/**
 * One `##` section of an article body, for the on-page contents rail. `id` is
 * the anchor the MDX heading override puts on the heading itself.
 */
export interface TocEntry {
  id: string;
  text: string;
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
  /**
   * 40-60 words of direct, self-contained answer, rendered between the H1 and
   * the calculator.
   *
   * This is the definition a reader wants before they touch the inputs — what
   * the thing is and what the formula does — written so it stands on its own if
   * it is lifted out of the page entirely. `shortDescription` says what the tool
   * does; this says what the subject *is*.
   *
   * Kept to a tight word range by the content gate. Long enough to be a real
   * answer, short enough that it never pushes the calculator below the fold.
   */
  leadAnswer: string;
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
  /**
   * Replaces the masthead's "Runs in your browser — nothing is uploaded" line.
   *
   * Every calculator on the site earns that default, and the claim is repeated
   * in the privacy policy — so the one tool that does reach the network cannot
   * be allowed to carry it. Set this to say what actually leaves the browser,
   * in the reader's terms, on the page where it happens rather than only in the
   * policy they will not open.
   */
  privacyNote?: string;
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
