import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { CategoryRail, type RailCategory } from '@/components/tool/CategoryRail';
import { ToolLedger } from '@/components/tool/ToolLedger';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { buildMetadata, withBrand } from '@/lib/seo/metadata';
import {
  breadcrumbSchema,
  itemListSchema,
  jsonLdGraph,
  type Crumb,
} from '@/lib/seo/schema';
import { site } from '@/lib/site';
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

  // Every hub carries its accent through the same custom property, so the
  // masthead, the rail and the index rows all read one value rather than each
  // rebuilding the `var(--color-cat-*)` string.
  const accentVar = { '--cat': accent } as React.CSSProperties;

  const railCategories: RailCategory[] = categories
    .map((other) => ({
      slug: other.slug,
      name: other.name,
      count: getToolsByCategory(other.slug).length,
    }))
    .filter((other) => other.count > 0);

  // Stated from the tools themselves rather than written by hand, so the
  // masthead can never claim a freshness the pages below it do not have.
  const lastUpdated = tools.reduce((latest, tool) => {
    return tool.updatedAt > latest ? tool.updatedAt : latest;
  }, '');

  const facts = [
    { label: 'Tools', value: String(tools.length) },
    {
      label: 'Updated',
      value: lastUpdated
        ? new Date(`${lastUpdated}T00:00:00Z`).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          })
        : '—',
    },
    { label: 'Runs', value: 'In browser' },
    { label: 'Cost', value: 'Free' },
  ];

  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: category.name, path: `/tools/${category.slug}` },
  ];

  return (
    <>
      <JsonLd
        json={jsonLdGraph([
          breadcrumbSchema(crumbs),
          itemListSchema(
            tools.map((tool) => ({
              name: tool.name,
              href: tool.href,
              description: tool.shortDescription,
            })),
            `${category.name} calculators on ${site.name}`,
          ),
        ])}
      />

      <section className="cat-hero border-b border-line" style={accentVar}>
        {/* The section glyph, blown up and held at the edge of legibility. It is
            the same mark the rail and the nav use, so at this size it works as
            a letterhead: recognisable before the heading is read, and quiet
            enough that it never competes with it. */}
        <CategoryIcon
          category={category.slug}
          className="pointer-events-none absolute -right-16 -top-10 hidden h-[26rem] w-[26rem] opacity-[0.055] lg:block"
          style={{ color: accent }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
          <Breadcrumbs crumbs={crumbs} />

          <div className="mt-8 grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <header className="max-w-2xl">
              <p className="eyebrow" style={{ color: accent }}>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {tools.length === 0
                  ? 'Section in progress'
                  : `${category.name} · ${tools.length} ${tools.length === 1 ? 'tool' : 'tools'}`}
              </p>

              <h1 className="mt-4 text-display-lg text-ink-900">{category.h1}</h1>

              <p className="mt-5 text-lg leading-relaxed text-ink-600">{category.intro}</p>
            </header>

            {/* The masthead figures, set as a ledger block. Every value here is
                checkable from the page it sits on, which is the reason it is
                mono type and not a row of marketing badges. */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-4 lg:w-64 lg:grid-cols-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-ink-400">
                    {fact.label}
                  </dt>
                  <dd className="numeric mt-1.5 text-base font-bold text-ink-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-12">
          {/* Sits second in the source on narrow screens: on a phone the rail is
              a list of eight links the reader did not come for, and putting it
              above the index would bury the thing they did. */}
          <div className="order-2 lg:order-1">
            <CategoryRail categories={railCategories} current={category.slug} />
          </div>

          <div className="order-1 lg:order-2">
            {tools.length > 0 ? (
              <>
                <div className="mb-4 flex items-baseline justify-between gap-4">
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                    Every {category.name.toLowerCase()} tool
                  </h2>
                  <p className="numeric shrink-0 text-xs text-ink-400">
                    A–Z · {tools.length}
                  </p>
                </div>

                <ToolLedger tools={tools} />
              </>
            ) : (
              <div className="rounded-card border border-dashed border-line bg-panel px-6 py-16 text-center">
                <p className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                  Still being written
                </p>
                <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
                  Every tool in this section gets a worked example and cited sources before
                  it goes live, which takes a while.
                </p>
                <Link href="/tools" className="btn btn-primary btn-md mt-7">
                  Browse other tools
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
