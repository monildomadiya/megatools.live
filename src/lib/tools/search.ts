import { categories } from './categories';
import { allTools } from './registry';
import type { CategorySlug } from './types';

/**
 * The one search index the site has.
 *
 * Lives here rather than inside a component because two surfaces now query it —
 * the ⌘K palette and the hero field on the homepage — and a second copy of the
 * index would mean a second copy of every tool name in the client bundle, plus
 * two ranking rules that drift apart the first time either is touched.
 *
 * Only plain data is imported. Anything that reaches a calculator component
 * would pull every tool into first load.
 */

export interface Hit {
  href: string;
  name: string;
  description: string;
  category: CategorySlug;
  categoryName: string;
  /** Lower sorts first. */
  rank: number;
}

const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

const countByCategory = new Map<string, number>();
for (const tool of allTools) {
  countByCategory.set(tool.category, (countByCategory.get(tool.category) ?? 0) + 1);
}

export function countFor(slug: string): number {
  return countByCategory.get(slug) ?? 0;
}

/** Categories that actually have tools on them — the browse fallback. */
export const populatedCategories = categories.filter((c) => countFor(c.slug) > 0);

// Built once at module scope rather than per keystroke: the haystack never
// changes, so rebuilding it inside the filter would be pure waste on every
// character typed.
const index = allTools.map((tool) => ({
  href: tool.href,
  name: tool.name,
  description: tool.shortDescription,
  category: tool.category,
  categoryName: categoryName.get(tool.category) ?? tool.category,
  haystackName: tool.name.toLowerCase(),
  haystackKeywords: tool.keywords.join(' ').toLowerCase(),
  haystackDescription: tool.shortDescription.toLowerCase(),
}));

/**
 * Ranked substring matching, not fuzzy matching. For a set of tools with names
 * as plain as "Mortgage Calculator", a prefix-then-substring ordering puts the
 * obvious answer first, and it cannot produce the surprising matches a fuzzy
 * matcher does on short queries.
 */
export function searchTools(query: string, limit = 8): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: Hit[] = [];

  for (const entry of index) {
    let rank = -1;

    if (entry.haystackName.startsWith(q)) rank = 0;
    else if (entry.haystackName.includes(q)) rank = 1;
    else if (entry.categoryName.toLowerCase().includes(q)) rank = 2;
    else if (entry.haystackKeywords.includes(q)) rank = 3;
    else if (entry.haystackDescription.includes(q)) rank = 4;

    if (rank >= 0) {
      hits.push({
        href: entry.href,
        name: entry.name,
        description: entry.description,
        category: entry.category,
        categoryName: entry.categoryName,
        rank,
      });
    }
  }

  return hits
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .slice(0, limit);
}
