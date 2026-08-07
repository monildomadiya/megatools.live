import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { ToolGrid } from '@/components/tool/ToolCard';
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

        <div className="mt-12 space-y-14">
          {populated.map((category) => {
            const tools = getToolsByCategory(category.slug);
            return (
              <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2
                    id={`cat-${category.slug}`}
                    className="text-2xl font-bold text-ink-900"
                  >
                    {category.name}
                  </h2>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="text-sm font-medium text-brand-700 hover:text-brand-800"
                  >
                    About {category.name.toLowerCase()} tools →
                  </Link>
                </div>
                <p className="mt-2 max-w-3xl text-ink-600">{category.metaDescription}</p>
                <div className="mt-6">
                  <ToolGrid tools={tools} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
