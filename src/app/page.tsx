import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolGrid } from '@/components/tool/ToolCard';
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
  },
  {
    title: 'Sources you can follow',
    body: 'Reference values and formulas are cited to the bodies that publish them — WHO, NIH, NICE, national tax authorities — with links you can open.',
  },
  {
    title: 'Nothing leaves your browser',
    body: 'Calculations run entirely on your device. Weights, salaries, and everything else you type stay on your machine. There is no account and no upload.',
  },
  {
    title: 'We say where it breaks',
    body: 'Every tool has a section on when its answer stops being reliable. A number without its caveats is worse than no number at all.',
  },
];

export default function HomePage() {
  const populated = categories.filter((c) => getToolsByCategory(c.slug).length > 0);
  const latest = recentTools.slice(0, 6);

  return (
    <>
      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
            Free calculators that show their work
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl">
            Finance, health, math, and conversions. Each tool gives you the answer, the
            formula behind it, and an honest account of when that answer stops being
            reliable.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="rounded-lg bg-ink-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-ink-800"
            >
              Browse all {allTools.length} tools
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-ink-300 px-6 py-3 text-base font-semibold text-ink-800 transition-colors hover:bg-ink-50"
            >
              How we build them
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {latest.length > 0 && (
          <section aria-labelledby="latest-heading" className="py-14">
            <h2 id="latest-heading" className="text-2xl font-bold text-ink-900">
              Latest tools
            </h2>
            <div className="mt-6">
              <ToolGrid tools={latest} />
            </div>
          </section>
        )}

        <section aria-labelledby="promises-heading" className="border-t border-ink-200 py-14">
          <h2 id="promises-heading" className="text-2xl font-bold text-ink-900">
            What makes these different
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {promises.map((promise) => (
              <div key={promise.title}>
                <h3 className="font-semibold text-ink-900">{promise.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{promise.body}</p>
              </div>
            ))}
          </div>
        </section>

        {populated.length > 0 && (
          <section aria-labelledby="categories-heading" className="border-t border-ink-200 py-14">
            <h2 id="categories-heading" className="text-2xl font-bold text-ink-900">
              Browse by category
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {populated.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="group block h-full rounded-xl border border-ink-200 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-ink-900 group-hover:text-brand-700">
                        {category.name}
                      </span>
                      <span className="text-sm text-ink-400">
                        {getToolsByCategory(category.slug).length}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink-600">
                      {category.metaDescription}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
