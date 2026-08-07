import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { ToolGrid } from '@/components/tool/ToolCard';
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
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {category.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{category.intro}</p>
        </header>

        <div className="mt-10">
          {tools.length > 0 ? (
            <ToolGrid tools={tools} />
          ) : (
            <p className="rounded-xl border border-dashed border-ink-300 p-8 text-center text-ink-500">
              We are still writing the tools for this section. Every one of them gets a
              worked example and cited sources before it goes live, which takes a while.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
