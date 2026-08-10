import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { HeroDemo } from '@/components/home/HeroDemo';
import { StatsMarquee } from '@/components/home/StatsMarquee';
import { HeroSearch } from '@/components/search/HeroSearch';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { buildMetadata } from '@/lib/seo/metadata';
import { categories } from '@/lib/tools/categories';
import {
  allTools,
  getToolByKey,
  getToolsByCategory,
  latestUpdate,
  recentTools,
} from '@/lib/tools/registry';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — Free Online Calculators That Show Their Work`,
  description:
    'Free calculators for finance, health, math, and unit conversion. Each one shows the formula it uses, works through a real example, and cites where the numbers come from.',
  path: '/',
});

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

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

const steps = [
  {
    title: 'Pick the calculator',
    body: 'Search with the / key, or browse the categories. Every tool page says up front what it assumes about your inputs.',
  },
  {
    title: 'Type your numbers',
    body: 'Results update as you type — there is no submit button and nothing is sent anywhere. Units switch between metric and US where it matters.',
  },
  {
    title: 'Check the working',
    body: 'Under each result sits the formula, a worked example, the limits of the method, and links to the sources the constants came from.',
  },
];

/**
 * The four tools the hero offers as one-tap shortcuts. Hand-picked rather than
 * derived from a popularity metric the site does not collect — these are the
 * queries people arrive with, one from each of the largest categories.
 */
const POPULAR_KEYS = [
  'health/bmi-calculator',
  'finance/mortgage-calculator',
  'math/percentage-calculator',
  'finance/vat-calculator',
];

export default function HomePage() {
  const populated = categories.filter((c) => getToolsByCategory(c.slug).length > 0);
  const latest = recentTools.slice(0, 5);
  const updated = latestUpdate();

  const popular = POPULAR_KEYS.map((key) => getToolByKey(key))
    .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)
    .map((tool) => ({ href: tool.href, name: tool.name }));

  // Facts about the build, not claims about the audience. Every one of these is
  // checkable from the site itself, which is what lets them run in a marquee
  // without reading as the usual "1M+ happy users" filler.
  const stats = [
    { value: String(allTools.length), label: 'Calculators live' },
    { value: String(populated.length), label: 'Categories covered' },
    { value: '$0', label: 'Cost, forever' },
    { value: '0', label: 'Bytes uploaded' },
    { value: '100%', label: 'Runs in your browser' },
    { value: '2+', label: 'Cited sources per tool' },
    { value: '1,000+', label: 'Words of working per page' },
  ];

  return (
    <>
      {/* ------------------------------------------------------------------
          Hero. Search first, then a working calculator — the two things a
          visitor actually came for, both above the fold. Everything that used
          to occupy this space (stats, recently added) moved below it: none of
          it helps someone who arrived wanting to convert a number.
      ------------------------------------------------------------------ */}
      {/* No `overflow-hidden` here, unlike the other hero bands: the search
          field's result list is absolutely positioned and has to be allowed to
          hang past the bottom of the section. The decorative layers are all
          `inset-0`, so nothing else can escape. `z-20` on the copy column keeps
          that list above the demo card, which is a later sibling. */}
      <section className="hero-bg isolate px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
        {/* Accent blobs, the sister site's backdrop. Two rather than one: a
            single centred glow reads as a vignette, while an off-centre pair
            gives the band a direction the eye can follow down to the demo. */}
        <span
          aria-hidden
          className="blob -z-10 right-0 top-0 h-96 w-96 bg-brand-500/15"
        />
        <span
          aria-hidden
          className="blob -z-10 left-1/2 top-0 h-24 w-1/3 -translate-x-1/2 bg-accent-500/10"
        />

        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="animate-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-panel px-4 py-2 shadow-panel">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            <span className="eyebrow">
              {allTools.length} tools live · free · no sign-up
            </span>
          </p>

          <h1
            className="animate-rise mt-6 text-display-xl text-ink-900"
            style={{ animationDelay: '60ms' }}
          >
            Calculators that <span className="text-gradient-accent">show their work</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 sm:text-xl"
            style={{ animationDelay: '120ms' }}
          >
            Finance, health, math, and conversions. Each tool gives you the answer, the{' '}
            <strong className="font-semibold text-ink-900">formula behind it</strong>, and
            an honest account of{' '}
            <strong className="font-semibold text-ink-900">
              when that answer stops being reliable
            </strong>
            .
          </p>

          <div className="animate-rise mt-9 flex w-full justify-center" style={{ animationDelay: '180ms' }}>
            <HeroSearch suggestions={popular} />
          </div>
        </div>

        {/* The demo sits in the hero rather than below it. Wider than the copy
            above so it reads as the subject of the page, not a footnote to it. */}
        <div
          className="animate-rise relative z-10 mx-auto mt-12 max-w-5xl text-left sm:mt-14"
          style={{ animationDelay: '260ms' }}
        >
          <HeroDemo />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-ink-500">
            <span className="font-medium text-ink-800">Sources cited on every tool</span>
            <Link
              href="/editorial-policy"
              className="font-semibold text-brand-700 hover:underline"
            >
              Editorial policy
            </Link>
            <span aria-hidden className="text-ink-300">
              •
            </span>
            <span>
              Last updated <time dateTime={updated}>{formatDate(updated)}</time>
            </span>
          </div>
        </div>
      </section>

      {/* Full-bleed, unlike everything below it: a strip that slides has to run
          off both edges of the window, or it reads as a box with text moving
          inside it. */}
      <StatsMarquee stats={stats} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ----------------------------------------------------------------
            Recently added.
        ---------------------------------------------------------------- */}
        <section aria-labelledby="recent-heading" className="border-t border-line py-20">
          <div className="reveal mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recently added</p>
              <h2 id="recent-heading" className="mt-3 text-display-md">
                The newest calculators
              </h2>
            </div>
            <Link href="/tools" className="btn btn-outline btn-md">
              All {allTools.length} tools
              <span aria-hidden>→</span>
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((tool) => {
              const accent = categoryAccent(tool.category);
              return (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="card card-lift group flex h-full items-center gap-3.5 p-4"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                      style={{
                        color: accent,
                        backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                      }}
                    >
                      <CategoryIcon category={tool.category} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-900">
                        {tool.name}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-ink-500">
                        {tool.shortDescription}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-brand-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ----------------------------------------------------------------
            Why these tools are different.
        ---------------------------------------------------------------- */}
        <section aria-labelledby="promises-heading" className="border-t border-line py-20">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow">Important facts</p>
            <h2 id="promises-heading" className="mt-3 text-display-md">
              What makes these different
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => (
              <div
                key={promise.title}
                className="card card-topline card-lift relative overflow-hidden p-6"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-brand-200 bg-brand-50 text-brand-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                    aria-hidden
                  >
                    {promise.icon}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-bold tracking-tight">{promise.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{promise.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------------
            Category hubs.
        ---------------------------------------------------------------- */}
        {populated.length > 0 && (
          <section
            aria-labelledby="categories-heading"
            className="border-t border-line py-20"
          >
            <div className="reveal mb-12 text-center">
              <p className="eyebrow">Browse</p>
              <h2 id="categories-heading" className="mt-3 text-display-md">
                Pick a category
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-600 sm:text-lg">
                Every category page explains what its tools assume before you use them,
                and where those assumptions stop holding.
              </p>
            </div>

            <CategoryShowcase />
          </section>
        )}

        {/* ----------------------------------------------------------------
            How it works. Numbered because the whole point is that it is a
            sequence — a three-card grid without the ordinals reads as three
            unrelated features.
        ---------------------------------------------------------------- */}
        <section aria-labelledby="steps-heading" className="border-t border-line py-20">
          <div className="reveal mb-12 text-center">
            <p className="eyebrow">How it works</p>
            <h2 id="steps-heading" className="mt-3 text-display-md">
              Three steps to an answer you can check
            </h2>
          </div>

          <ol className="grid gap-5 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="card relative overflow-hidden p-6 sm:p-7">
                {/* The ordinal is set in mono at display size rather than in a
                    numbered circle: at three cards the sequence has to be
                    readable at a glance from across the page. */}
                <span className="numeric block text-4xl font-bold leading-none text-brand-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 leading-relaxed text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ----------------------------------------------------------------
            Closing call to action.
        ---------------------------------------------------------------- */}
        <section className="border-t border-line py-20">
          <div className="card relative isolate overflow-hidden px-6 py-16 text-center sm:px-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-bloom" />
            <p className="eyebrow">Get started</p>
            <h2 className="mt-3 text-display-sm">Find the calculator you need</h2>
            <p className="mx-auto mt-4 max-w-xl text-ink-600 sm:text-lg">
              {allTools.length} tools so far, each with its formula, a worked example, and
              the sources behind it. More are being written.
            </p>
            <Link href="/tools" className="btn btn-primary btn-lg mt-8">
              Browse all tools
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
