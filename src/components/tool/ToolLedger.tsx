import Link from 'next/link';
import { categoryAccent } from '@/components/ui/CategoryIcon';
import type { ToolCardData } from '@/lib/tools/types';

/**
 * The category hub's tool list, set as a numbered index rather than a card grid.
 *
 * A hub holds one subject's tools, so every card in a grid carries the same
 * icon, the same accent and the same shape — the wall is uniform and the only
 * thing separating one tile from the next is its label, which is the thing a
 * reader has to stop and read. A single ruled column puts those labels on one
 * scan line, gives each description the full measure instead of a 30-character
 * column, and fits a section that grows past a screenful without turning into
 * a mosaic.
 *
 * The accent arrives per row through `--cat` rather than as a Tailwind colour:
 * the hue is a CSS variable chosen at runtime by category, which no utility
 * class can name.
 */
export function ToolLedger({ tools }: { tools: ToolCardData[] }) {
  return (
    <ol className="overflow-hidden rounded-card border border-line bg-panel shadow-panel">
      {tools.map((tool, index) => (
        <li key={tool.href} className="border-t border-line-soft first:border-t-0">
          <Link
            href={tool.href}
            className="group relative flex items-start gap-4 px-4 py-5 sm:gap-6 sm:px-6 sm:py-6"
            style={{ '--cat': categoryAccent(tool.category) } as React.CSSProperties}
          >
            {/* The spine. Grows from the middle of the row on hover, which reads
                as the row being picked up rather than as a border appearing. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-[3px] scale-y-0 bg-[var(--cat)] transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-y-100"
            />
            {/* Accent wash, strongest at the spine and gone by the middle of the
                row, so the description never sits on tinted ground. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                backgroundImage:
                  'linear-gradient(to right, color-mix(in oklab, var(--cat) 8%, transparent), transparent 55%)',
              }}
            />

            {/* Index number. Mono and tabular so the column of figures stays a
                straight edge down the left of the list. */}
            <span
              aria-hidden
              className="numeric relative mt-0.5 w-6 shrink-0 text-sm text-ink-300 transition-colors duration-200 group-hover:text-[var(--cat)] sm:w-7 sm:text-base"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <span className="relative min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold leading-snug tracking-tight text-ink-900 transition-colors duration-200 group-hover:text-[var(--cat)]">
                {tool.name}
              </span>
              <span className="mt-1.5 block max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">
                {tool.shortDescription}
              </span>
            </span>

            <span
              aria-hidden
              className="relative mt-1 hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--cat)] sm:inline-flex"
            >
              Open
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
