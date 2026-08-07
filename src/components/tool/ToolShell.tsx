import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { FaqAccordion } from '@/components/tool/FaqAccordion';
import { RelatedTools } from '@/components/tool/RelatedTools';
import { SourcesList } from '@/components/tool/SourcesList';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import {
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
  toolSchema,
  type Crumb,
} from '@/lib/seo/schema';
import { getCategory } from '@/lib/tools/categories';
import { getRelatedTools, toolHref } from '@/lib/tools/registry';
import type { ToolMeta } from '@/lib/tools/types';

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
export function ToolShell({ tool, calculator, children }: ToolShellProps) {
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

      <section className="hero-bg isolate overflow-hidden px-4 pb-24 pt-6 sm:px-6 sm:pb-28 sm:pt-8">
        <div className="relative z-10 mx-auto max-w-3xl">
          <Breadcrumbs crumbs={crumbs} />

          <header className="mt-6">
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

            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {tool.shortDescription}
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-panel px-4 py-2 text-xs text-ink-500 shadow-panel">
              <span className="font-medium text-ink-800">
                Updated <time dateTime={tool.updatedAt}>{formatDate(tool.updatedAt)}</time>
              </span>
              <span aria-hidden className="text-ink-300">
                •
              </span>
              <span>Runs in your browser — nothing is uploaded</span>
            </div>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative z-20 -mt-16 sm:-mt-20">{calculator}</div>

        <AdSlot slotId="tool-below-calculator" format="in-article" />

        <div className="prose-content mt-14">{children}</div>

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
