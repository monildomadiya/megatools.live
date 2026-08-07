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
  children: React.ReactNode;
}

/** Shared shell for the about, contact, and policy pages. */
export function ProsePage({ title, path, updatedAt, intro, children }: ProsePageProps) {
  const crumbs: Crumb[] = [
    { name: 'Home', path: '/' },
    { name: title, path },
  ];

  return (
    <>
      <JsonLd json={jsonLdGraph([breadcrumbSchema(crumbs)])} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h1>
          {intro && <p className="mt-4 text-lg leading-relaxed text-ink-600">{intro}</p>}
          {updatedAt && (
            <p className="mt-4 text-sm text-ink-500">
              Last updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </p>
          )}
        </header>

        <div className="prose-content mt-10">{children}</div>
      </div>
    </>
  );
}
