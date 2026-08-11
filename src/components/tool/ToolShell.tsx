import Link from 'next/link';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { FaqAccordion } from '@/components/tool/FaqAccordion';
import { RelatedTools } from '@/components/tool/RelatedTools';
import { SourcesList } from '@/components/tool/SourcesList';
import {
  TableOfContents,
  TableOfContentsDisclosure,
} from '@/components/tool/TableOfContents';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  toolSchema,
  type Crumb,
} from '@/lib/seo/schema';
import { author } from '@/lib/site';
import { getCategory } from '@/lib/tools/categories';
import { getRelatedTools, toolHref } from '@/lib/tools/registry';
import type { ToolMeta, TocEntry } from '@/lib/tools/types';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

interface ToolShellProps {
  tool: ToolMeta;
  /** The interactive calculator — a client island. */
  calculator: React.ReactNode;
  /**
   * The article's `##` sections, read from the MDX at build time by the page.
   * Passed in rather than derived here because deriving it needs `node:fs`, and
   * every client calculator imports `CalculatorPanel` out of this module.
   */
  toc: TocEntry[];
  /** The long-form MDX body. */
  children: React.ReactNode;
}

/**
 * The single page template every tool renders through. Section order is
 * deliberate: the calculator sits directly under the H1 because that is what the
 * reader came for, and the explanatory content follows it rather than gating it.
 *
 * The header band and the calculator overlap by design. A tool page that opens
 * with a headline, then a gap, then a bordered box reads as two pages stapled
 * together; pulling the panel up into the band makes the calculator look like
 * the subject of the heading rather than the first item after it.
 */
export function ToolShell({ tool, calculator, toc, children }: ToolShellProps) {
  const category = getCategory(tool.category);
  const href = toolHref(tool);
  const related = getRelatedTools(tool);
  const accent = categoryAccent(tool.category);

  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    ...(category ? [{ name: category.name, path: `/tools/${category.slug}` }] : []),
    { name: tool.name, path: href },
  ];

  return (
    <>
      <JsonLd
        json={jsonLdGraph([
          toolSchema(tool, href),
          breadcrumbSchema(crumbs),
          faqSchema(tool.faqs),
        ])}
      />

      {/* The masthead carries the section's accent, the same way its hub page
          does. Fifty-two tool pages share one template, so the tint and the
          ruled ground are what stop a health page and a finance page from being
          the same page with different words in it. */}
      <section
        className="cat-hero px-4 pb-24 pt-6 sm:px-6 sm:pb-28 sm:pt-8"
        style={{ '--cat': accent } as React.CSSProperties}
      >
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs crumbs={crumbs} />

          {/*
            Held to 48rem rather than the page's 72rem. The heading and the lead
            answer are prose, and prose set to the full width of a six-column
            page runs past 120 characters a line — long enough that the eye
            starts losing its place on the return sweep. The calculator below is
            a different kind of object and still takes the whole width.
          */}
          <header className="mt-6 max-w-3xl">
            {category && (
              <span className="inline-flex items-center gap-2.5">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                  style={{
                    color: accent,
                    backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
                  }}
                >
                  <CategoryIcon category={tool.category} className="h-4.5 w-4.5" />
                </span>
                <span className="eyebrow" style={{ color: accent }}>
                  {category.name}
                </span>
              </span>
            )}

            <h1 className="mt-4 text-display-lg text-ink-900">{tool.h1}</h1>

            {/*
              The lead answer stands in for `shortDescription` here rather than
              sitting beneath it.

              Two intro paragraphs before the calculator was one too many — and
              of the two, `shortDescription` is the weaker thing to put under the
              H1, because it narrates a tool the reader is already looking at.
              The lead answer defines the subject instead, which is what someone
              arriving cold actually needs and the only one of the two that
              means anything quoted on its own.

              `shortDescription` still does its real job on cards, hub pages and
              search results, where the reader has not opened the tool yet.
            */}
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{tool.leadAnswer}</p>

            {/* The byline is not decoration and not only an SEO artefact. The
                page's JSON-LD names an author; a reader should be able to see
                the same claim without opening the source, and on finance and
                health pages the name is part of the argument for trusting the
                number.

                Set as a ruled masthead line rather than the rounded pill it
                used to be. A pill reads as a badge — something applied to the
                page — where the same three facts above a rule read as the
                page's own imprint, which is what they are. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-sm text-ink-500">
              <span>
                By{' '}
                <Link
                  href={author.path}
                  rel="author"
                  className="font-semibold text-ink-800 hover:text-brand-700"
                >
                  {author.name}
                </Link>
              </span>

              <span>
                Updated{' '}
                <time dateTime={tool.updatedAt} className="font-semibold text-ink-800">
                  {formatDate(tool.updatedAt)}
                </time>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <svg
                  aria-hidden
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink-400"
                >
                  <rect x="3" y="7" width="10" height="7" rx="1.5" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                </svg>
                Runs in your browser — nothing is uploaded
              </span>
            </div>
          </header>
        </div>
      </section>

      {/* The calculator keeps the full six-column width — it is a control
          panel, and its fields and result tables use every inch of it. The
          article does not.

          Splitting the body into a column plus a contents rail fixes the one
          thing most visibly wrong with these pages: at 72rem the article ran to
          about 115 characters a line, roughly half again the measure prose is
          readable at. The rail is not filler in the space that frees up — on an
          eight-section, three-thousand-word page it is the only way to reach a
          section without scrolling past everything before it. */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative z-20 -mt-16 sm:-mt-20">{calculator}</div>

        <AdSlot slotId="tool-below-calculator" format="in-article" />

        <div className="mt-14 grid gap-x-12 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="min-w-0">
            <TableOfContentsDisclosure entries={toc} />

            {/* The body copy is set on a white card rather than straight onto
                the page: a card gives the text an edge to start and stop
                against, which is most of what stops a long column from feeling
                unmoored. */}
            <article className="card prose-content px-5 py-8 sm:px-10 sm:py-12">
              {children}
            </article>
          </div>

          <aside className="hidden lg:block">
            <TableOfContents entries={toc} />
          </aside>
        </div>

        <FaqAccordion faqs={tool.faqs} />

        <AdSlot slotId="tool-below-faq" format="in-article" />

        <SourcesList sources={tool.sources} />

        <RelatedTools tools={related} />
      </div>
    </>
  );
}

/**
 * Frame around the interactive part.
 *
 * The eyebrow is not decoration: this panel is the one thing on the page a
 * reader interacts with, and labelling it separates "the tool" from "the article
 * about the tool" without needing a heavier border to do it.
 */
export function CalculatorPanel({
  label = 'Input · parameters',
  children,
}: {
  /** Overrides the eyebrow for tools that are not parameter-driven. */
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-card-lg border border-line bg-panel shadow-lift">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-panel-2 px-5 py-3.5 sm:px-8">
        <p className="eyebrow eyebrow-muted">{label}</p>
        <span className="eyebrow eyebrow-muted hidden sm:inline">Live</span>
      </div>
      <div className="p-5 sm:p-8">{children}</div>
    </div>
  );
}
