import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/tool/Breadcrumbs';
import { breadcrumbSchema, jsonLdGraph, type Crumb } from '@/lib/seo/schema';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

interface ProsePageProps {
  title: string;
  path: string;
  /** Shown under the H1. Legal pages need a visible effective date. */
  updatedAt?: string;
  intro?: string;
  /**
   * Extra JSON-LD nodes merged into this page's graph. Most prose pages need
   * nothing beyond breadcrumbs; /about needs to declare which entities it
   * describes, which is what resolves the byline on every tool page.
   */
  schemaNodes?: (Record<string, unknown> | null)[];
  children: React.ReactNode;
}

/** Shared shell for the about, contact, and policy pages. */
export function ProsePage({
  title,
  path,
  updatedAt,
  intro,
  schemaNodes = [],
  children,
}: ProsePageProps) {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: title, path },
  ];

  return (
    <>
      <JsonLd json={jsonLdGraph([breadcrumbSchema(crumbs), ...schemaNodes])} />

      <section className="border-b border-line px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs crumbs={crumbs} />

          <header className="mt-6">
            <h1 className="text-display-lg text-ink-900">{title}</h1>
            {intro && <p className="mt-4 text-lg leading-relaxed text-ink-600">{intro}</p>}
            {updatedAt && (
              <p className="mt-5 inline-flex items-center rounded-full border border-line bg-panel px-4 py-2 text-xs text-ink-500 shadow-panel">
                Last updated&nbsp;
                <time dateTime={updatedAt} className="font-medium text-ink-800">
                  {formatDate(updatedAt)}
                </time>
              </p>
            )}
          </header>
        </div>
      </section>

      {/* The article sits on its own white card rather than directly on the grey
          page. Long-form copy needs a paper to sit on — running 60 characters of
          17px text straight onto the page background makes it read as an
          annotation rather than as the content. */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="card prose-content px-5 py-8 sm:px-10 sm:py-12">{children}</div>
      </div>
    </>
  );
}
