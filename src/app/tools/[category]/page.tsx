import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { ToolGrid } from '@/components/tool/ToolCard';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';
import { breadcrumbSchema, jsonLdGraph, type Crumb } from '@/lib/seo/schema';
import { categories, getCategory } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';

interface PageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  const tools = getToolsByCategory(category.slug);

  return buildMetadata({
    title: withBrand(category.metaTitle),
    description: category.metaDescription,
    path: `/tools/${category.slug}`,
    // A hub page with nothing on it is a thin page. Categories stay in the build
    // so the nav never links to a 404, but they are held out of the index until
    // they have something worth ranking.
    noIndex: tools.length === 0,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(category.slug);
  const accent = categoryAccent(category.slug);

  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: category.name, path: `/tools/${category.slug}` },
  ];

  return (
    <>
      <JsonLd json={jsonLdGraph([breadcrumbSchema(crumbs)])} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
              style={{
                color: accent,
                backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
              }}
            >
              <CategoryIcon category={category.slug} className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                {category.h1}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {tools.length === 0
                  ? 'In progress'
                  : `${tools.length} ${tools.length === 1 ? 'tool' : 'tools'}`}
              </p>
            </div>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">{category.intro}</p>
        </header>

        <div className="mt-10">
          {tools.length > 0 ? (
            <ToolGrid tools={tools} />
          ) : (
            <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-medium text-ink-900">Still being written</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
                Every tool in this section gets a worked example and cited sources before
                it goes live, which takes a while.
              </p>
              <Link
                href="/tools"
                className="mt-6 inline-block rounded-lg bg-invert px-4 py-2 text-sm font-semibold text-on-invert transition-colors hover:bg-invert-hover"
              >
                Browse other tools
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
