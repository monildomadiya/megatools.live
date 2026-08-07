import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { FaqAccordion } from '@/components/tool/FaqAccordion';
import { RelatedTools } from '@/components/tool/RelatedTools';
import { SourcesList } from '@/components/tool/SourcesList';
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
 */
export function ToolShell({ tool, calculator, children }: ToolShellProps) {
  const category = getCategory(tool.category);
  const href = toolHref(tool);
  const related = getRelatedTools(tool);

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

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {tool.h1}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-600">
            {tool.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-500">
            <span>
              Updated{' '}
              <time dateTime={tool.updatedAt}>{formatDate(tool.updatedAt)}</time>
            </span>
            <span aria-hidden className="text-ink-300">
              •
            </span>
            <span>Runs in your browser — nothing is uploaded</span>
          </div>
        </header>

        <div className="mt-8">{calculator}</div>

        <AdSlot slotId="tool-below-calculator" format="in-article" />

        <div className="prose-content mt-12">{children}</div>

        <FaqAccordion faqs={tool.faqs} />

        <AdSlot slotId="tool-below-faq" format="in-article" />

        <SourcesList sources={tool.sources} />

        <RelatedTools tools={related} />
      </div>
    </>
  );
}

/**
 * Frame around the interactive part. Bordered and slightly raised so the
 * boundary between "the tool" and "the article about the tool" is unambiguous.
 */
export function CalculatorPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-5 shadow-panel sm:p-7">
      {children}
    </div>
  );
}
