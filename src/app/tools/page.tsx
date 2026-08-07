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

      <section className="hero-bg isolate overflow-hidden px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs crumbs={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="eyebrow">The full index</p>
            <h1 className="mt-3 text-display-lg text-ink-900">
              All calculators and converters
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {allTools.length} {allTools.length === 1 ? 'tool' : 'tools'}, each with the
              formula it uses, a worked example, and the sources the numbers came from.
              Everything runs locally in your browser.
            </p>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="card relative z-10 p-5 sm:p-8">
          <ToolExplorer tools={explorerTools} categories={explorerCategories} />
        </div>

        {/* The hubs are the pillar pages — each has real intro copy the grid
            above cannot carry, so they get their own route and their own link
            rather than only existing as a filter state. */}
        <section aria-labelledby="hubs-heading" className="mt-20 border-t border-line pt-16">
          <div className="mb-12 text-center">
            <p className="eyebrow">Browse</p>
            <h2 id="hubs-heading" className="mt-3 text-display-md">
              Browse by category
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-600 sm:text-lg">
              Each category page explains what the tools in it assume and where those
              assumptions stop holding.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {populated.map((category) => {
              const accent = categoryAccent(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="card card-lift group flex h-full flex-col p-5 hover:border-ink-300"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                        style={{
                          color: accent,
                          backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                        }}
                      >
                        <CategoryIcon category={category.slug} className="h-5 w-5" />
                      </span>
                      <span className="font-display font-extrabold tracking-tight text-ink-900">
                        {category.name}
                      </span>
                      <span className="numeric ml-auto text-sm text-ink-500">
                        {getToolsByCategory(category.slug).length}
                      </span>
                    </span>
                    <span className="mt-3.5 block text-sm leading-relaxed text-ink-600">
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
