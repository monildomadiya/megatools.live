import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolGrid } from '@/components/tool/ToolCard';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { buildMetadata } from '@/lib/seo/metadata';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory, recentTools } from '@/lib/tools/registry';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Free Online Calculators That Show Their Work`,
  description:
    'Free calculators for finance, health, math, and unit conversion. Each one shows the formula it uses, works through a real example, and cites where the numbers come from.',
  path: '/',
});

const promises = [
  {
    title: 'The formula is on the page',
    body: 'Every calculator shows the equation it runs and works through a real example with real numbers, so you can check the result by hand if it matters.',
    icon: (
      <>
        <path d="M4 6h16M4 12h10M4 18h7" />
        <path d="m16 15 5 5m0-5-5 5" />
      </>
    ),
  },
  {
    title: 'Sources you can follow',
    body: 'Reference values and formulas are cited to the bodies that publish them — WHO, NIH, NICE, national tax authorities — with links you can open.',
    icon: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M8 8h7M8 11.5h5" />
      </>
    ),
  },
  {
    title: 'Nothing leaves your browser',
    body: 'Calculations run entirely on your device. Weights, salaries, and everything else you type stay on your machine. There is no account and no upload.',
    icon: (
      <>
        <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    title: 'We say where it breaks',
    body: 'Every tool has a section on when its answer stops being reliable. A number without its caveats is worse than no number at all.',
    icon: (
      <>
        <path d="M12 3.5 21 19H3z" />
        <path d="M12 10v4M12 16.5v.5" />
      </>
    ),
  },
];

export default function HomePage() {
  const populated = categories.filter((c) => getToolsByCategory(c.slug).length > 0);
  const latest = recentTools.slice(0, 6);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-bloom" />

        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3 py-1.5 text-xs font-medium text-ink-600 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            {allTools.length} tools live · free, no sign-up
          </p>

          <h1
            className="animate-rise mt-6 text-4xl font-bold tracking-tight text-ink-900 sm:text-6xl"
            style={{ animationDelay: '60ms' }}
          >
            Calculators that{' '}
            <span className="text-gradient">show their work</span>
          </h1>

          <p
            className="animate-rise mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl"
            style={{ animationDelay: '120ms' }}
          >
            Finance, health, math, and conversions. Each tool gives you the answer, the
            formula behind it, and an honest account of when that answer stops being
            reliable.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Link
              href="/tools"
              className="rounded-xl bg-invert px-6 py-3 text-base font-semibold text-on-invert shadow-lift transition-colors hover:bg-invert-hover"
            >
              Browse all {allTools.length} tools
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-line bg-panel/70 px-6 py-3 text-base font-semibold text-ink-800 backdrop-blur transition-colors hover:bg-panel-2"
            >
              How we build them
            </Link>
          </div>

          <p
            className="animate-rise mt-8 text-sm text-ink-500"
            style={{ animationDelay: '240ms' }}
          >
            Press{' '}
            <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-sans text-xs text-ink-600">
              /
            </kbd>{' '}
            anywhere to search
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {populated.length > 0 && (
          <section aria-labelledby="categories-heading" className="py-16">
            <h2
              id="categories-heading"
              className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
            >
              Browse by category
            </h2>
            <p className="mt-2 max-w-2xl text-ink-600">
              Every category page explains what its tools assume before you use them.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {populated.map((category) => {
                const accent = categoryAccent(category.slug);
                const count = getToolsByCategory(category.slug).length;
                return (
                  <li key={category.slug}>
                    <Link
                      href={`/tools/${category.slug}`}
                      className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-5 hover:border-ink-300"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, ${accent} 10%, transparent), transparent 60%)`,
                        }}
                      />
                      <span className="relative flex items-center gap-3">
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                          style={{
                            color: accent,
                            backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                          }}
                        >
                          <CategoryIcon category={category.slug} className="h-5 w-5" />
                        </span>
                        <span className="font-semibold text-ink-900">{category.name}</span>
                        <span className="ml-auto text-sm text-ink-500">{count}</span>
                      </span>
                      <span className="relative mt-3 block text-sm leading-relaxed text-ink-600">
                        {category.metaDescription}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {latest.length > 0 && (
          <section aria-labelledby="latest-heading" className="border-t border-line py-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="latest-heading"
                  className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
                >
                  Latest tools
                </h2>
                <p className="mt-2 text-ink-600">Most recently published.</p>
              </div>
              <Link
                href="/tools"
                className="text-sm font-medium text-brand-700 transition-colors hover:text-brand-800"
              >
                View all →
              </Link>
            </div>
            <div className="mt-8">
              <ToolGrid tools={latest} showCategory />
            </div>
          </section>
        )}

        <section aria-labelledby="promises-heading" className="border-t border-line py-16">
          <h2
            id="promises-heading"
            className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
          >
            What makes these different
          </h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {promises.map((promise) => (
              <div key={promise.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    {promise.icon}
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold text-ink-900">{promise.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{promise.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line py-16">
          <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-panel px-6 py-14 text-center sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-bloom" />
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Find the calculator you need
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-600">
              {allTools.length} tools so far, each with its formula, a worked example, and
              the sources behind it. More are being written.
            </p>
            <Link
              href="/tools"
              className="mt-7 inline-block rounded-xl bg-invert px-6 py-3 text-base font-semibold text-on-invert shadow-lift transition-colors hover:bg-invert-hover"
            >
              Browse all tools
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
