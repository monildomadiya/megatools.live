import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import {
  ToolExplorer,
  type ExplorerCategory,
  type ExplorerTool,
} from '@/components/tool/ToolExplorer';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLdGraph,
  type Crumb,
} from '@/lib/seo/schema';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory } from '@/lib/tools/registry';

export const metadata: Metadata = buildMetadata({
  title: withBrand('All Free Calculators & Converters'),
  description:
    'Every calculator on MegaTools, grouped by category. Finance, health, math, unit conversion, dates, and developer utilities — all free and all running in your browser.',
  path: '/tools',
});

const crumbs: Crumb[] = [
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
];

export default function ToolsIndexPage() {
  const populated = categories.filter((category) => getToolsByCategory(category.slug).length > 0);

  // Flattened on the server so the client component receives only what it
  // renders and searches — never the FAQ and source arrays.
  const explorerTools: ExplorerTool[] = allTools.map((tool) => ({
    href: tool.href,
    name: tool.name,
    shortDescription: tool.shortDescription,
    category: tool.category,
    search: [tool.name, tool.keywords.join(' '), tool.shortDescription]
      .join(' ')
      .toLowerCase(),
  }));

  const explorerCategories: ExplorerCategory[] = populated.map((category) => ({
    slug: category.slug,
    name: category.name,
    href: `/tools/${category.slug}`,
    description: category.metaDescription,
  }));

  // Stated as a masthead rather than as marketing: each figure is checkable
  // from the page it sits on.
  const stats = [
    { label: 'Calculators', value: String(allTools.length) },
    { label: 'Categories', value: String(populated.length) },
    { label: 'Cost', value: 'Free' },
    { label: 'Account', value: 'None' },
  ];

  return (
    <>
      <JsonLd
        json={jsonLdGraph([
          breadcrumbSchema(crumbs),
          // The complete index, enumerated. This is the page that answers
          // "what does this site have", so it should answer it in a form a
          // parser can read rather than only as a grid of links.
          itemListSchema(
            allTools.map((tool) => ({
              name: tool.name,
              href: tool.href,
              description: tool.shortDescription,
            })),
            'All MegaTools calculators and converters',
          ),
        ])}
      />

      <section className="border-b border-line px-4 pb-10 pt-6 sm:px-6 sm:pt-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs crumbs={crumbs} />

          <header className="mt-6">
            <p className="eyebrow">The full index</p>
            <h1 className="mt-3 max-w-3xl text-display-lg text-ink-900">
              All calculators and converters
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-ink-600">
              {allTools.length} {allTools.length === 1 ? 'tool' : 'tools'}, each with the
              formula it uses, a worked example, and the sources the numbers came from.
              Every calculation runs locally in your browser.
            </p>

            <dl className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-line pt-5 sm:gap-x-12">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2">
                  <dt className="text-sm text-ink-500">{stat.label}</dt>
                  <dd className="numeric text-base font-bold text-ink-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <ToolExplorer tools={explorerTools} categories={explorerCategories} />

        {/* The hubs are the pillar pages — each carries intro copy no grid can,
            so they keep their own route and their own permanent link. The rail
            above filters in place and its links only exist for the selected
            section, which is exactly why this strip stays: it is the crawl path
            to every hub, present in the static HTML whatever the filters do. */}
        <section aria-labelledby="hubs-heading" className="mt-16 border-t border-line pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h2 id="hubs-heading" className="font-display text-xl font-extrabold tracking-tight">
              Category hubs
            </h2>
            <p className="text-sm text-ink-500">
              Each hub explains what its tools assume and where those assumptions stop
              holding.
            </p>
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {populated.map((category) => {
              const accent = categoryAccent(category.slug);
              const count = getToolsByCategory(category.slug).length;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-line bg-panel px-3.5 py-3 transition-colors hover:border-ink-300"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{
                        color: accent,
                        backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                      }}
                    >
                      <CategoryIcon category={category.slug} className="h-[18px] w-[18px]" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-900">
                        {category.name}
                      </span>
                      <span className="numeric block text-xs text-ink-500">
                        {count} {count === 1 ? 'tool' : 'tools'}
                      </span>
                    </span>

                    <span
                      aria-hidden
                      className="shrink-0 text-brand-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
