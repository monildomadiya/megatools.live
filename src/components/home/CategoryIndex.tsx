import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';

/**
 * The categories, set as an index rather than as a grid of cards.
 *
 * A card grid asks the eye to compare eight boxes of similar weight and pick
 * one. An index does not ask anything: it is read down, in order, the way a
 * contents page is, and the reader stops at the line that matches their
 * question. For a directory that intends to hold a thousand tools, that is the
 * form that keeps working — rows stack, boxes tile, and tiling stops being
 * legible long before stacking does.
 *
 * The rules between rows are the structure. Everything else is left alone: no
 * card, no shadow, no fill, until the row is hovered and takes a wash of its
 * own accent. The restraint is the point — on a page whose subject is cited
 * arithmetic, a quiet index reads as a reference work, and a wall of coloured
 * tiles reads as an app store.
 */
export function CategoryIndex() {
  const shown = categories
    .map((category) => ({ category, count: getToolsByCategory(category.slug).length }))
    .filter((entry) => entry.count > 0);

  return (
    <ol className="border-t border-line">
      {shown.map(({ category, count }, index) => {
        const accent = categoryAccent(category.slug);

        return (
          <li key={category.slug} className="border-b border-line">
            <Link
              href={`/tools/${category.slug}`}
              className="group relative flex items-baseline gap-5 py-7 transition-colors sm:gap-8 sm:py-9"
            >
              {/* The wash bleeds past the container on both sides so a hovered
                  row reads as a full-width band rather than as a tinted box
                  sitting inside the column. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-4 -right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-left-6 sm:-right-6"
                style={{
                  background: `linear-gradient(to right, color-mix(in oklab, ${accent} 8%, transparent), transparent 70%)`,
                }}
              />

              {/* Ordinal in mono. It is an index, and an index is numbered. */}
              <span className="numeric relative w-8 shrink-0 text-sm text-ink-400 sm:w-12 sm:text-base">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span className="relative min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-display text-2xl font-extrabold leading-none tracking-tight text-ink-900 transition-colors group-hover:text-brand-700 sm:text-4xl">
                    {category.name}
                  </span>
                  <span
                    className="numeric text-sm font-bold"
                    style={{ color: accent }}
                  >
                    {count} {count === 1 ? 'tool' : 'tools'}
                  </span>
                </span>
                <span className="mt-2.5 block max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
                  {category.metaDescription}
                </span>
              </span>

              <span className="relative flex shrink-0 items-center gap-4 self-center">
                <CategoryIcon
                  category={category.slug}
                  className="hidden h-8 w-8 opacity-60 transition-opacity duration-300 group-hover:opacity-100 lg:block"
                  style={{ color: accent }}
                />
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-500 transition-all duration-300 group-hover:border-transparent group-hover:bg-invert group-hover:text-on-invert"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
