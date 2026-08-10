import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';
import type { Category } from '@/lib/tools/types';

/**
 * The categories, as the homepage's content.
 *
 * These cards name no individual tool. The homepage's job is to get a visitor
 * into the right section — which of eight subjects their question belongs to —
 * and a card that also lists five calculators makes that a choice out of forty
 * rather than out of eight. Naming the tools is the hub page's job.
 *
 * The grid is deliberately uneven: the four largest sections take a double-wide
 * cell, the four smallest a single. That is not decoration. Eight identical
 * boxes tell a reader nothing about where the depth is, whereas a cell twice
 * the size of its neighbour says the section behind it is twice the size — which
 * here it very nearly is. Sorting by tool count is what keeps the layout honest
 * as tools are added: a section that grows earns the bigger cell on its own.
 */

/** How many of the largest sections get the double-wide treatment. */
const FEATURED_COUNT = 4;

function Band({
  category,
  className,
}: {
  category: Category;
  className: string;
}) {
  const accent = categoryAccent(category.slug);

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 62%, black))`,
      }}
    >
      {/* Oversized, cropped and low-contrast — a texture on the band rather
          than a second icon competing with the chip in front of it. */}
      <CategoryIcon
        category={category.slug}
        className="absolute -bottom-8 -right-6 h-40 w-40 text-white/20 transition-transform duration-500 group-hover:scale-110"
      />
      <div className="relative flex h-full items-start p-5">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
          <CategoryIcon category={category.slug} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function Meta({ category, count }: { category: Category; count: number }) {
  const accent = categoryAccent(category.slug);

  return (
    <div className="flex flex-1 flex-col p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight text-ink-900">
          {category.name}
        </h3>
        <span
          className="numeric shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            color: accent,
            backgroundColor: `color-mix(in oklab, ${accent} 12%, white)`,
          }}
        >
          {count} {count === 1 ? 'tool' : 'tools'}
        </span>
      </div>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-600">
        {category.metaDescription}
      </p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
        Explore {category.name.toLowerCase()}
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </div>
  );
}

export function CategoryShowcase() {
  const shown = categories
    .map((category) => ({ category, count: getToolsByCategory(category.slug).length }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count || a.category.name.localeCompare(b.category.name));

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {shown.map(({ category, count }, index) => {
        const featured = index < FEATURED_COUNT;

        return (
          <li key={category.slug} className={featured ? 'lg:col-span-2' : undefined}>
            <Link
              href={`/tools/${category.slug}`}
              className="card card-lift group flex h-full flex-col overflow-hidden p-0 hover:border-ink-300"
            >
              {featured ? (
                // Horizontal only where there is width for it. In a single
                // column the band would eat half the card.
                <div className="flex h-full flex-col lg:flex-row">
                  <Band category={category} className="h-28 lg:h-auto lg:w-44" />
                  <Meta category={category} count={count} />
                </div>
              ) : (
                <>
                  <Band category={category} className="h-28" />
                  <Meta category={category} count={count} />
                </>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
