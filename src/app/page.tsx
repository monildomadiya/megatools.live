import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryIndex } from '@/components/home/CategoryIndex';
import { HeroSearch } from '@/components/search/HeroSearch';
import { buildMetadata } from '@/lib/seo/metadata';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory, latestUpdate } from '@/lib/tools/registry';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Free Online Calculators That Show Their Work`,
  description:
    'Free calculators for finance, health, math, and unit conversion. Each one shows the formula it uses, works through a real example, and cites where the numbers come from.',
  path: '/',
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });
}

/**
 * The four claims, written as claims rather than as features. Each is checkable
 * on any tool page, which is the only reason to make it on the homepage.
 */
const principles = [
  {
    title: 'The formula is on the page',
    body: 'Every calculator shows the equation it runs and works through a real example with real numbers, so you can check the result by hand if it matters.',
  },
  {
    title: 'Sources you can follow',
    body: 'Reference values are cited to the bodies that publish them — WHO, NIH, NICE, HMRC, the IETF — with links you can open and read.',
  },
  {
    title: 'Nothing leaves your browser',
    body: 'Calculations run on your device. Weights, salaries and everything else you type stay on your machine. No account, no upload, no analytics on your inputs.',
  },
  {
    title: 'We say where it breaks',
    body: 'Every tool has a section on when its answer stops being reliable. A number without its caveats is worse than no number at all.',
  },
];

const steps = [
  {
    title: 'Find it',
    body: 'Search from any page with the / key, or read down the index below. Nothing is more than two clicks from here.',
  },
  {
    title: 'Type your numbers',
    body: 'Results update as you type. There is no submit button and nothing is sent anywhere. Units switch between metric and US where it matters.',
  },
  {
    title: 'Check the working',
    body: 'Under every result sits the formula, a worked example, the limits of the method, and links to the sources the constants came from.',
  },
];

export default function HomePage() {
  const populated = categories.filter((c) => getToolsByCategory(c.slug).length > 0);
  const updated = latestUpdate();

  // Set as a colophon — the facts a reference work states about itself. Every
  // one is checkable from the site, which is why none of them is a user count.
  const colophon = [
    { label: 'Calculators', value: String(allTools.length) },
    { label: 'Categories', value: String(populated.length) },
    { label: 'Sources per tool', value: '2+' },
    { label: 'Cost', value: '£0' },
    { label: 'Last updated', value: formatDate(updated) },
  ];

  return (
    <>
      {/* ==================================================================
          Hero. Left-aligned and asymmetric: a statement column and a
          colophon, the way a reference work opens. No centred stack, no
          gradient headline, no decorative glow — on a site whose subject is
          cited arithmetic, restraint is the thing that reads as authority.
      ================================================================== */}
      <section className="border-b border-line px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="eyebrow animate-rise">
                {site.name} · Independent · Free · No account
              </p>

              <h1
                className="animate-rise mt-6 text-display-xl text-ink-900"
                style={{ animationDelay: '60ms' }}
              >
                Calculators that show their&nbsp;work.
              </h1>

              <p
                className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-ink-600"
                style={{ animationDelay: '120ms' }}
              >
                {allTools.length} calculators across {populated.length} subjects. Each one
                gives you the answer, the formula behind it, and an honest account of when
                that answer stops being reliable.
              </p>

              <div
                className="animate-rise mt-9 flex w-full"
                style={{ animationDelay: '180ms' }}
              >
                <HeroSearch />
              </div>
            </div>

            {/* The colophon. Mono, right-hand column, rules between rows — the
                masthead block of a reference work rather than a stat card. */}
            <div className="animate-rise lg:col-span-5" style={{ animationDelay: '240ms' }}>
              <dl className="border-t border-line">
                {colophon.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-3.5"
                  >
                    <dt className="text-sm text-ink-500">{item.label}</dt>
                    <dd className="numeric text-base font-bold text-ink-900">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-sm leading-relaxed text-ink-500">
                Every formula on this site traces to the body that defines it. Where a
                method is contested, the page says so.{' '}
                <Link
                  href="/editorial-policy"
                  className="font-semibold text-brand-700 hover:underline"
                >
                  Editorial policy →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          The index. This is the homepage's content.
      ================================================================== */}
      <section aria-labelledby="index-heading" className="px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The index</p>
              <h2 id="index-heading" className="mt-4 text-display-md">
                Start with the subject
              </h2>
            </div>
            <p className="max-w-md text-ink-600">
              Every section opens with what its tools assume before you use them, and where
              those assumptions stop holding.
            </p>
          </div>

          <CategoryIndex />
        </div>
      </section>

      {/* ==================================================================
          The claims. Heading left, list right — a spread rather than a row
          of feature cards.
      ================================================================== */}
      <section
        aria-labelledby="principles-heading"
        className="border-t border-line px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="reveal lg:col-span-4">
            <p className="eyebrow">What we promise</p>
            <h2 id="principles-heading" className="mt-4 text-display-md">
              Four things, on every page
            </h2>
            <p className="mt-5 text-ink-600">
              None of these is a claim about this site you have to take on trust. Open any
              calculator and check.
            </p>
          </div>

          <dl className="lg:col-span-8">
            {principles.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-5 border-b border-line py-7 first:border-t sm:gap-8"
              >
                <dt className="numeric w-8 shrink-0 pt-1 text-sm text-ink-400 sm:w-12">
                  {String(index + 1).padStart(2, '0')}
                </dt>
                <dd className="min-w-0">
                  <p className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                    {item.title}
                  </p>
                  <p className="mt-2 leading-relaxed text-ink-600">{item.body}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================================================================
          How it works.
      ================================================================== */}
      <section
        aria-labelledby="steps-heading"
        className="border-t border-line px-4 py-20 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-12">
            <p className="eyebrow">How it works</p>
            <h2 id="steps-heading" className="mt-4 text-display-md">
              Three steps to an answer you can check
            </h2>
          </div>

          <ol className="grid gap-10 border-t border-line pt-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="numeric text-sm text-ink-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-xl font-extrabold tracking-tight text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==================================================================
          Close. The one dark band on a light site — a full stop rather than
          another panel. It is a section, not a theme: nothing here toggles.
      ================================================================== */}
      <section className="bg-invert px-4 py-20 text-on-invert sm:px-6 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-8">
            <p className="eyebrow text-brand-300">Get started</p>
            <h2 className="mt-4 text-display-lg text-on-invert">
              Find the calculator you need.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              {allTools.length} tools across {populated.length} categories, each with its
              formula, a worked example, and the sources behind it. More are being written.
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-4 lg:justify-end">
            <Link
              href="/tools"
              className="btn btn-lg bg-panel text-ink-900 hover:bg-panel-2"
            >
              Browse all tools
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/about"
              className="btn btn-lg border border-white/25 text-on-invert hover:bg-white/10"
            >
              How we build them
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
