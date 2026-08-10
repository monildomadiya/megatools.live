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

      <section className="hero-bg isolate overflow-hidden px-4 pb-14 pt-6 sm:px-6 sm:pt-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs crumbs={crumbs} />

          <header className="mt-6 max-w-3xl">
            <div className="flex items-center gap-3.5">
              <span
                className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border"
                style={{
                  color: accent,
                  backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                  borderColor: `color-mix(in oklab, ${accent} 22%, transparent)`,
                }}
              >
                <CategoryIcon category={category.slug} className="h-7 w-7" />
              </span>
              <div>
                <p className="eyebrow" style={{ color: accent }}>
                  {tools.length === 0
                    ? 'In progress'
                    : `${tools.length} ${tools.length === 1 ? 'tool' : 'tools'}`}
                </p>
                <h1 className="mt-2 text-display-lg text-ink-900">{category.h1}</h1>
              </div>
            </div>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">{category.intro}</p>
          </header>

          {/* Sibling categories, inline. A hub page is a dead end otherwise: a
              reader who lands here from search and finds the wrong section has
              to go back up through /tools to get anywhere else. */}
          <nav aria-label="Other categories" className="mt-8 flex flex-wrap gap-2">
            {categories
              .filter((other) => getToolsByCategory(other.slug).length > 0)
              .map((other) => {
                const current = other.slug === category.slug;
                const otherAccent = categoryAccent(other.slug);
                return (
                  <Link
                    key={other.slug}
                    href={`/tools/${other.slug}`}
                    aria-current={current ? 'page' : undefined}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                      current
                        ? 'border-transparent bg-invert text-on-invert'
                        : 'border-line bg-panel text-ink-700 hover:border-ink-300 hover:text-ink-900'
                    }`}
                  >
                    <CategoryIcon
                      category={other.slug}
                      className="h-4 w-4"
                      // The chip for the current category is near-black, so the
                      // accent would disappear into it.
                      style={current ? undefined : { color: otherAccent }}
                    />
                    {other.name}
                  </Link>
                );
              })}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        {tools.length > 0 ? (
          <ToolGrid tools={tools} />
        ) : (
          <div className="rounded-card-lg border border-dashed border-line bg-panel px-6 py-16 text-center">
            <p className="font-display text-xl font-extrabold tracking-tight text-ink-900">
              Still being written
            </p>
            <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
              Every tool in this section gets a worked example and cited sources before it
              goes live, which takes a while.
            </p>
            <Link href="/tools" className="btn btn-primary btn-md mt-7">
              Browse other tools
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
