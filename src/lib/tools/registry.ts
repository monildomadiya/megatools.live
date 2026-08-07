import type { CategorySlug, ToolMeta, ToolWithHref } from './types';

// --- Tool metadata imports -------------------------------------------------
// Adding a tool means: (1) create src/content/tools/<category>/<slug>/ with
// meta.ts, Calculator.tsx and content.mdx, (2) import the meta here and add it
// to `toolMetas`, (3) register the components in src/content/tools/modules.ts.
// Everything else — routing, sitemap, nav, breadcrumbs, JSON-LD, related links
// — is derived from this list.
//
// This module must stay free of React components: it is imported by client
// components (nav, search), and pulling calculator code in here would drag
// every tool into the first-load bundle.

import lengthConverter from '@/content/tools/conversion/length-converter/meta';
import ageCalculator from '@/content/tools/date-time/age-calculator/meta';
import passwordGenerator from '@/content/tools/developer/password-generator/meta';
import compoundInterestCalculator from '@/content/tools/finance/compound-interest-calculator/meta';
import loanEmiCalculator from '@/content/tools/finance/loan-emi-calculator/meta';
import mortgageCalculator from '@/content/tools/finance/mortgage-calculator/meta';
import bmiCalculator from '@/content/tools/health/bmi-calculator/meta';
import bmrCalculator from '@/content/tools/health/bmr-calculator/meta';
import tdeeCalculator from '@/content/tools/health/tdee-calculator/meta';
import percentageCalculator from '@/content/tools/math/percentage-calculator/meta';
import tipCalculator from '@/content/tools/lifestyle/tip-calculator/meta';
import wordCounter from '@/content/tools/seo/word-counter/meta';

const toolMetas: ToolMeta[] = [
  compoundInterestCalculator,
  loanEmiCalculator,
  mortgageCalculator,
  bmiCalculator,
  bmrCalculator,
  tdeeCalculator,
  percentageCalculator,
  lengthConverter,
  ageCalculator,
  passwordGenerator,
  tipCalculator,
  wordCounter,
];

// --- Derived structures ----------------------------------------------------

export function toolHref(tool: Pick<ToolMeta, 'category' | 'slug'>): string {
  return `/tools/${tool.category}/${tool.slug}`;
}

export const allTools: ToolWithHref[] = toolMetas
  .map((tool) => ({ ...tool, href: toolHref(tool) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const byKey = new Map<string, ToolWithHref>(
  allTools.map((tool) => [`${tool.category}/${tool.slug}`, tool]),
);

export function getTool(category: string, slug: string): ToolWithHref | undefined {
  return byKey.get(`${category}/${slug}`);
}

export function getToolByKey(key: string): ToolWithHref | undefined {
  return byKey.get(key);
}

export function getToolsByCategory(category: CategorySlug): ToolWithHref[] {
  return allTools.filter((tool) => tool.category === category);
}

export function countToolsByCategory(category: CategorySlug): number {
  return getToolsByCategory(category).length;
}

export const featuredTools: ToolWithHref[] = allTools.filter((tool) => tool.featured);

/**
 * Related tools = the editorially chosen cross-category links first (those are
 * the ones a reader is actually likely to want next), topped up with siblings
 * from the same category so a new tool always has somewhere to link to.
 */
export function getRelatedTools(tool: ToolMeta, limit = 4): ToolWithHref[] {
  const seen = new Set<string>([`${tool.category}/${tool.slug}`]);
  const out: ToolWithHref[] = [];

  for (const key of tool.relatedSlugs) {
    const related = byKey.get(key);
    if (related && !seen.has(key)) {
      seen.add(key);
      out.push(related);
    }
  }

  for (const sibling of getToolsByCategory(tool.category)) {
    if (out.length >= limit) break;
    const key = `${sibling.category}/${sibling.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(sibling);
    }
  }

  return out.slice(0, limit);
}

/** Newest first — powers the "recently added" strip on the homepage. */
export const recentTools: ToolWithHref[] = [...allTools].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

/** Most recent content change across the whole site, for the homepage lastModified. */
export function latestUpdate(): string {
  return allTools.reduce(
    (latest, tool) => (tool.updatedAt > latest ? tool.updatedAt : latest),
    '1970-01-01',
  );
}

export { toolMetas };
