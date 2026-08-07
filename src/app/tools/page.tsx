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
import { breadcrumbSchema, jsonLdGraph, type Crumb } from '@/lib/seo/schema';
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
    count: getToolsByCategory(category.slug).length,
  }));

  return (
    <>
      <JsonLd json={jsonLdGraph([breadcrumbSchema(crumbs)])} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            All calculators and converters
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            {allTools.length} {allTools.length === 1 ? 'tool' : 'tools'}, each with the
            formula it uses, a worked example, and the sources the numbers came from.
            Everything runs locally in your browser.
          </p>
        </header>

        <div className="mt-10">
          <ToolExplorer tools={explorerTools} categories={explorerCategories} />
        </div>

        {/* The hubs are the pillar pages — each has real intro copy the grid
            above cannot carry, so they get their own route and their own link
            rather than only existing as a filter state. */}
        <section aria-labelledby="hubs-heading" className="mt-16 border-t border-line pt-12">
          <h2 id="hubs-heading" className="text-2xl font-bold tracking-tight text-ink-900">
            Browse by category
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Each category page explains what the tools in it assume and where those
            assumptions stop holding.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {populated.map((category) => {
              const accent = categoryAccent(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="card-lift group flex h-full flex-col rounded-2xl border border-line bg-panel p-5 hover:border-ink-300"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                        style={{
                          color: accent,
                          backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                        }}
                      >
                        <CategoryIcon category={category.slug} className="h-5 w-5" />
                      </span>
                      <span className="font-semibold text-ink-900">{category.name}</span>
                      <span className="ml-auto text-sm text-ink-500">
                        {getToolsByCategory(category.slug).length}
                      </span>
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-ink-600">
                      {category.metaDescription}
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
