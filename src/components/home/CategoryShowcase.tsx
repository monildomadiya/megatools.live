import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';

/**
 * The eight categories, as the homepage's main content.
 *
 * These cards name no individual tool on purpose. The homepage's job is to get
 * a visitor into the right section — which of eight subjects their question
 * belongs to — and a card that also lists five calculators makes that choice
 * out of forty rather than out of eight. Naming the tools is the hub page's
 * job, and it does it on a page where that is the only question being asked.
 *
 * Each card opens with a filled band in the category's own accent, carrying an
 * oversized watermark of its icon. That band is what makes a grid of eight read
 * as eight distinct places rather than eight instances of one card: the colour
 * is recognisable before a single word has been read, and it is the same colour
 * the reader will meet again on the hub, on the tool page header, and on every
 * card belonging to that category.
 */
export function CategoryShowcase() {
  const shown = categories.filter((category) => getToolsByCategory(category.slug).length > 0);

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {shown.map((category) => {
        const tools = getToolsByCategory(category.slug);
        const accent = categoryAccent(category.slug);

        return (
          <li key={category.slug}>
            <Link
              href={`/tools/${category.slug}`}
              className="card card-lift group flex h-full flex-col overflow-hidden p-0 hover:border-ink-300"
            >
              <div
                className="relative h-28 overflow-hidden"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 62%, black))`,
                }}
              >
                {/* Oversized, cropped, and low-contrast — a texture on the band
                    rather than a second icon competing with the one below it. */}
                <CategoryIcon
                  category={category.slug}
                  className="absolute -bottom-6 -right-5 h-32 w-32 text-white/20 transition-transform duration-500 group-hover:scale-110"
                />

                <div className="relative flex h-full flex-col justify-between p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                    <CategoryIcon category={category.slug} className="h-5 w-5" />
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-extrabold leading-tight tracking-tight text-ink-900">
                    {category.name}
                  </h3>
                  <span
                    className="numeric shrink-0 text-sm font-bold"
                    style={{ color: accent }}
                  >
                    {tools.length}
                  </span>
                </div>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-600">
                  {category.metaDescription}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  Explore {category.name.toLowerCase()}
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
