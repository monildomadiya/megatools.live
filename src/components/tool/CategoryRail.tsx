import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import type { Category } from '@/lib/tools/types';

export interface RailCategory {
  slug: Category['slug'];
  name: Category['name'];
  count: number;
}

/**
 * Sibling categories, as a rail rather than a row of chips.
 *
 * A hub reached from search is a dead end without this: the reader who wanted
 * Health and landed on Finance has to go back up through /tools to get
 * anywhere. Chips said that in one line; a vertical rail also has room for the
 * count, which is the figure that tells someone whether a section is worth the
 * click. It sticks, so the whole map of the site stays on screen while the
 * index beside it scrolls.
 */
export function CategoryRail({
  categories,
  current,
}: {
  categories: RailCategory[];
  current: Category['slug'];
}) {
  return (
    <nav aria-label="Other categories" className="lg:sticky lg:top-24">
      <p className="eyebrow eyebrow-muted">Sections</p>

      <ul className="mt-4 space-y-0.5">
        {categories.map((category) => {
          const active = category.slug === current;
          const accent = categoryAccent(category.slug);

          return (
            <li key={category.slug}>
              <Link
                href={`/tools/${category.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-control px-3 py-2.5 transition-colors ${
                  active ? 'bg-panel shadow-panel' : 'hover:bg-panel'
                }`}
                style={{ '--cat': accent } as React.CSSProperties}
              >
                <CategoryIcon
                  category={category.slug}
                  className="h-[18px] w-[18px] shrink-0 text-ink-400 transition-colors group-hover:text-[var(--cat)]"
                  // Only the current section carries its hue at rest. Eight
                  // saturated glyphs stacked in a column read as a legend, not
                  // as navigation.
                  style={active ? { color: accent } : undefined}
                />
                <span
                  className={`min-w-0 flex-1 truncate text-sm transition-colors ${
                    active
                      ? 'font-bold text-ink-900'
                      : 'font-medium text-ink-600 group-hover:text-ink-900'
                  }`}
                >
                  {category.name}
                </span>
                <span
                  className={`numeric shrink-0 text-xs ${
                    active ? 'text-[var(--cat)]' : 'text-ink-400'
                  }`}
                >
                  {category.count}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/tools"
        className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
      >
        All
        <span aria-hidden>→</span>
      </Link>
    </nav>
  );
}
