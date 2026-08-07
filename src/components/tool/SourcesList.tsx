import type { Source } from '@/lib/tools/types';

/**
 * Outbound citations for the formula and reference values used on the page.
 * These links are intentionally followed: they are genuine references to the
 * bodies that define the equations, and the whole point of the section is to let
 * a reader verify the numbers at the primary source.
 */
export function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="sources-heading" className="mt-16">
      <p className="eyebrow">References</p>
      <h2 id="sources-heading" className="mt-3 text-display-sm">
        Sources
      </h2>
      <p className="mt-3 text-ink-600">
        The formulas and reference ranges on this page come from the following
        publications. Where a source has been revised, we cite the current edition.
      </p>

      <ol className="card mt-6 divide-y divide-line overflow-hidden">
        {sources.map((source, index) => (
          <li key={source.url} className="flex gap-3.5 px-5 py-4 text-sm leading-relaxed">
            <span className="numeric mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
              {index + 1}
            </span>
            <span className="text-ink-600">
              <a
                href={source.url}
                target="_blank"
                rel="noopener"
                className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {source.title}
              </a>
              <span className="text-ink-500"> — {source.publisher}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
