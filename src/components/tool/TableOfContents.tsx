'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/tools/types';

/**
 * The on-page contents rail.
 *
 * These articles are three to four thousand words across eight or nine
 * sections, and until now the only way to find the one that answered your
 * question was to scroll the whole thing. The rail is also what lets the body
 * column be narrower than the page: without something in the space beside it,
 * a 72rem measure was the only option that did not leave a hole.
 *
 * The list itself is plain server-rendered links and works with JavaScript off.
 * Everything the client adds is the highlight showing where you are.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const active = useActiveSection(entries);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="eyebrow eyebrow-muted">On this page</p>

      {/* The hairline is the rail's spine: each item's own marker sits on top
          of it, so the active section reads as a position along the article
          rather than as one highlighted link in a list. */}
      <ol className="mt-4 border-l border-line">
        {entries.map((entry) => {
          const current = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={current ? 'true' : undefined}
                className={`-ml-px block border-l-2 py-2 pl-4 text-sm leading-snug transition-colors ${
                  current
                    ? 'border-brand-500 font-semibold text-ink-900'
                    : 'border-transparent text-ink-500 hover:border-ink-300 hover:text-ink-800'
                }`}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The same list as a disclosure, for viewports too narrow to carry a rail.
 *
 * Closed by default: on a phone the calculator has just been pushed off the
 * screen by the article, and nine open links would push it further.
 */
export function TableOfContentsDisclosure({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <details className="card group mb-6 px-5 py-4 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow eyebrow-muted">On this page</span>
        <span
          aria-hidden
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-panel-2 text-ink-500 transition-transform duration-200 group-open:rotate-180"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4.5 7l4.5 4.5L13.5 7" />
          </svg>
        </span>
      </summary>

      <ol className="mt-4 space-y-1 border-t border-line pt-4">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="flex gap-3 py-1.5 text-sm leading-snug text-ink-600"
            >
              <span aria-hidden className="numeric shrink-0 text-xs text-ink-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}

/**
 * Which section the reader is in.
 *
 * Measured off `getBoundingClientRect` on scroll rather than through an
 * IntersectionObserver. An observer only fires when a heading crosses the
 * band, which leaves the rail unset on load and stale after an in-page jump;
 * reading positions answers "which heading did I last pass" directly, which is
 * the actual question. The work is one rAF-throttled loop over nine elements.
 */
function useActiveSection(entries: TocEntry[]): string {
  const [active, setActive] = useState('');

  // Depend on the ids, not the array: the entries arrive from a server
  // component and are a fresh array on every render of it.
  const key = entries.map((entry) => entry.id).join('|');

  useEffect(() => {
    const ids = key ? key.split('|') : [];
    if (ids.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      // Matches the `scroll-margin-top` the headings carry, so the section the
      // rail claims you are in is the one an anchor jump would land on.
      const line = 96;
      let current = ids[0]!;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > line) break;
        current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key]);

  return active;
}
