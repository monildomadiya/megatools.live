import Link from 'next/link';
import type { Crumb } from '@/lib/seo/schema';

/**
 * Visual breadcrumbs. The matching BreadcrumbList JSON-LD is emitted separately
 * from the same crumb array, so the two can never drift apart.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-x-1.5">
              {isLast ? (
                <span className="text-ink-700" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="transition-colors hover:text-brand-700"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden className="text-ink-300">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
