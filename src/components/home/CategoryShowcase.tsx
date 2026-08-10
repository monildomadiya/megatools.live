import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';

/**
 * Category cards that list the tools inside them.
 *
 * A card that says only "Finance — 8 tools" asks the reader to take a second
 * navigation on faith. Naming the tools on the card answers the question the
 * click was going to ask, and it puts every tool one hop from the homepage
 * instead of two, which is worth something to a crawler as well as to a person.
 *
 * The header band is tinted with the category's own accent rather than a shared
 * brand colour: on a page showing eight of these at once, the tint is what makes
 * the grid scannable before any word has been read.
 */

/** How many tools each card names before it falls back to a count. */
const NAMED_TOOLS = 5;

export function CategoryShowcase() {
  const populated = categories.filter((category) => getToolsByCategory(category.slug).length > 0);

  return (
    <ul className="grid gap-5 lg:grid-cols-2">
      {populated.map((category) => {
        const tools = getToolsByCategory(category.slug);
        const accent = categoryAccent(category.slug);
        const named = tools.slice(0, NAMED_TOOLS);
        const remaining = tools.length - named.length;

        return (
          <li key={category.slug}>
            <div className="card group flex h-full flex-col overflow-hidden p-0 transition-colors duration-300 hover:border-ink-300">
              <div
                className="flex items-center gap-3.5 border-b border-line px-5 py-4"
                style={{
                  backgroundColor: `color-mix(in oklab, ${accent} 7%, transparent)`,
                }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                  style={{
                    color: accent,
                    backgroundColor: `color-mix(in oklab, ${accent} 14%, white)`,
                  }}
                >
                  <CategoryIcon category={category.slug} className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-ink-900">
                    {category.name}
                  </h3>
                </div>

                <span
                  className="numeric shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    color: accent,
                    backgroundColor: `color-mix(in oklab, ${accent} 12%, white)`,
                  }}
                >
                  {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm leading-relaxed text-ink-600">
                  {category.metaDescription}
                </p>

                <ul className="mt-4 flex-1 space-y-0.5">
                  {named.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-700 transition-colors hover:bg-panel-2 hover:text-ink-900"
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: accent }}
                        />
                        <span className="truncate">{tool.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/tools/${category.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 self-start border-t border-transparent pt-1 text-sm font-bold text-brand-700 hover:underline"
                >
                  {remaining > 0
                    ? `All ${tools.length} ${category.name.toLowerCase()} tools`
                    : `Explore ${category.name.toLowerCase()}`}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
