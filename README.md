# MegaTools

Free online calculators that show their work. Next.js 16 (App Router), React 19, Tailwind 4, MDX. Statically generated, self-hosted behind nginx.

The premise of the site is that a calculator without its formula, its worked example, its sources, and its limitations is worth less than no calculator at all. That shapes most of the decisions below.

## Commands

```bash
npm run dev            # local dev server
npm run build          # production build (all routes prerendered)
npm run typecheck      # tsc --noEmit
npm run check:content  # content gate — word counts, citations, placeholders
npm run check:urls     # legacy URL coverage report
npm run verify         # typecheck + content gate + build + URL report
```

`npm run verify` is what has to pass before anything is deployed.

## Adding a tool

Three files and two registrations. Nothing else — routing, the sitemap, breadcrumbs, JSON-LD, related links, and the category hub all derive from the registry.

### 1. Create the tool directory

```
src/content/tools/<category>/<slug>/
  meta.ts         # ToolMeta — titles, keywords, FAQs, sources, dates
  Calculator.tsx  # 'use client' — default-exported interactive component
  content.mdx     # the long-form body (1000+ words, enforced by the gate)
```

`meta.ts` default-exports a `ToolMeta` (see `src/lib/tools/types.ts`). The category must be one of the slugs in `src/lib/tools/categories.ts`.

`Calculator.tsx` should compose the shared primitives from `src/components/tool/fields.tsx` — `NumberField`, `SelectField`, `UnitToggle`, `ResultCard`, `ResultRows`, `ResetButton` — and wrap its body in `CalculatorPanel`. Using them keeps touch targets, error states, and the `aria-live` result announcement identical across every tool. `src/content/tools/health/bmi-calculator/` is the reference implementation.

`content.mdx` starts at `##` — the `<h1>` comes from `meta.h1`. Do not add an FAQ section or a sources list; those render from `meta.ts` so they stay in sync with the JSON-LD.

### 2. Register the metadata

In `src/lib/tools/registry.ts`, import the meta and add it to `toolMetas`.

### 3. Register the components

In `src/content/tools/modules.ts`, import the calculator and content and add an entry keyed `'<category>/<slug>'`.

### 4. Verify

```bash
npm run verify
```

The gate fails if the body is under 1000 words, there are fewer than 5 FAQs or 2 sources, a `relatedSlugs` entry points at a tool that does not exist, or the registry and `modules.ts` disagree.

## Content rules

These are not style preferences — they are why the site exists.

**Primary sources only.** Formulas come from the body that defines them (WHO, NIH, NICE, a tax authority, the original paper), never from another calculator site. Every tool needs at least two real citations with working links.

**No invented authority.** Do not attribute a page to a reviewer who has not reviewed it. Cite the source directly instead.

**Real dates.** `updatedAt` moves when the content actually changes, and never otherwise.

**Say where it breaks.** Every tool needs a limitations section. It is the part competitors omit and the main reason to read this site instead of theirs.

**Nothing copied.** All prose is written for this site.

## Placeholders

`[[NEEDS INPUT: ...]]` marks a fact only the site owner can supply — legal entity, governing law, contact address, founder bio. `npm run check:content` fails while any remain, so one can never reach production.

## Architecture notes

**`src/lib/tools/registry.ts` holds data only.** It is imported by client components such as the nav. Importing calculator components there would drag every tool into the first-load bundle, which is why the component map lives separately in `src/content/tools/modules.ts` and is imported only by the tool route.

**Ads are off by default.** `AdSlot` renders nothing unless `NEXT_PUBLIC_ADS_ENABLED=true` and a client ID is set. Empty ad containers on a site awaiting AdSense review read as a site built for ads rather than for readers, so the pre-approval build ships with no ad markup at all. Reserved heights are already wired so enabling them introduces no layout shift.

**Empty category hubs are noindexed** and excluded from the sitemap until they have a tool on them.

**`dynamicParams = false`** on the tool and category routes, so an unknown slug is a real 404 rather than a soft 404 that could get indexed.

## Environment

```bash
NEXT_PUBLIC_GA_ID=                  # GA4 measurement ID; analytics is off when unset
NEXT_PUBLIC_ADS_ENABLED=false       # flip to true only after AdSense approval
NEXT_PUBLIC_ADSENSE_CLIENT_ID=      # ca-pub-XXXXXXXXXXXXXXXX
```

## Migrating from the previous site

`scripts/legacy-urls.json` lists the 38 URLs the previous build had indexed. `npm run check:urls` reports coverage; `npm run check:urls -- --strict` fails on any gap and is the gate for cutover. Renamed routes (`/terms-and-conditions`, `/sitemap`, `/advertise`, and the `brm-calculator` typo) are handled by redirects in `next.config.ts`.

Do not replace the live site until every legacy URL resolves.
