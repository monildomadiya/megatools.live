'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { allTools } from '@/lib/tools/registry';
import type { CategorySlug } from '@/lib/tools/types';

/**
 * Site-wide search, opened with the header button or Cmd/Ctrl-K.
 *
 * This is the part of the UI built for the tool count going up rather than for
 * the seven that exist today. A grid is a fine way to browse a screenful; past
 * roughly thirty tools it stops being discovery and search becomes the primary
 * way in. Building it now means the growth is a data change, not a redesign.
 *
 * Only `registry.ts` and `categories.ts` cross into this bundle — both are plain
 * data. Importing anything that reaches a calculator component would pull every
 * tool into first load.
 */

interface Hit {
  href: string;
  name: string;
  description: string;
  category: CategorySlug;
  categoryName: string;
  /** Lower sorts first. */
  rank: number;
}

const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

const countByCategory = new Map<string, number>();
for (const tool of allTools) {
  countByCategory.set(tool.category, (countByCategory.get(tool.category) ?? 0) + 1);
}

function countFor(slug: string): number {
  return countByCategory.get(slug) ?? 0;
}

// Built once at module scope rather than per keystroke: the haystack never
// changes, so rebuilding it inside the filter would be pure waste on every
// character typed.
const index = allTools.map((tool) => ({
  href: tool.href,
  name: tool.name,
  description: tool.shortDescription,
  category: tool.category,
  categoryName: categoryName.get(tool.category) ?? tool.category,
  haystackName: tool.name.toLowerCase(),
  haystackKeywords: tool.keywords.join(' ').toLowerCase(),
  haystackDescription: tool.shortDescription.toLowerCase(),
}));

/**
 * Ranked substring matching, not fuzzy matching. For a set of tools with names
 * as plain as "Mortgage Calculator", a prefix-then-substring ordering puts the
 * obvious answer first, and it cannot produce the surprising matches a fuzzy
 * matcher does on short queries.
 */
function search(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: Hit[] = [];

  for (const entry of index) {
    let rank = -1;

    if (entry.haystackName.startsWith(q)) rank = 0;
    else if (entry.haystackName.includes(q)) rank = 1;
    else if (entry.categoryName.toLowerCase().includes(q)) rank = 2;
    else if (entry.haystackKeywords.includes(q)) rank = 3;
    else if (entry.haystackDescription.includes(q)) rank = 4;

    if (rank >= 0) {
      hits.push({
        href: entry.href,
        name: entry.name,
        description: entry.description,
        category: entry.category,
        categoryName: entry.categoryName,
        rank,
      });
    }
  }

  return hits
    .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
    .slice(0, 8);
}

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const listId = useId();

  const hits = useMemo(() => search(query), [query]);

  // Fallback when nothing is typed yet: the categories, so the palette is a
  // browse surface as well as a search one and never opens empty.
  const populated = useMemo(
    () => categories.filter((c) => allTools.some((t) => t.category === c.slug)),
    [],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    restoreFocusTo.current?.focus();
  }, []);

  // Cmd/Ctrl-K from anywhere, and "/" when the user is not already typing.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isPaletteKey = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);

      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;
      const isSlash = event.key === '/' && !typing;

      if (isPaletteKey || isSlash) {
        event.preventDefault();
        restoreFocusTo.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus the field on open, and hold the background still. Without the scroll
  // lock the page behind the overlay scrolls under the palette on a trackpad.
  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the highlighted row in view when arrowing past the visible window.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    const count = query.trim() ? hits.length : populated.length;
    if (count === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % count);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + count) % count);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const href = query.trim()
        ? hits[active]?.href
        : `/tools/${populated[active]?.slug}`;
      if (href) {
        close();
        router.push(href);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          restoreFocusTo.current = event.currentTarget;
          setOpen(true);
        }}
        className="group flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-3 text-sm text-ink-500 transition-colors hover:border-brand-400 hover:text-ink-700 sm:w-60"
      >
        <SearchGlyph className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search tools</span>
        <kbd className="ml-auto hidden shrink-0 rounded-md border border-line bg-panel-2 px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-500 sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Click-away. A sibling rather than a parent of the panel, so a click
              inside the panel cannot bubble out to it and close the dialog. */}
          <button
            type="button"
            aria-label="Close search"
            tabIndex={-1}
            onClick={close}
            // Fixed black rather than an ink token: the scrim's job is to darken
            // whatever is behind it, which a near-black from the neutral ramp
            // does less reliably against the site's already-light surfaces.
            className="animate-overlay-in absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 top-0 flex justify-center px-4 pt-[10vh]">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search tools"
              className="animate-dialog-in w-full max-w-xl overflow-hidden rounded-card-lg border border-line bg-panel shadow-pop"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <SearchGlyph className="h-4.5 w-4.5 shrink-0 text-ink-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search calculators and converters…"
                  aria-label="Search calculators and converters"
                  aria-autocomplete="list"
                  aria-controls={listId}
                  className="h-14 flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-500"
                />
                <kbd className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-ink-500 sm:inline">
                  Esc
                </kbd>
              </div>

              <ul ref={listRef} id={listId} role="listbox" className="max-h-80 overflow-y-auto p-2">
                {query.trim() === '' &&
                  populated.map((category, i) => (
                    <li key={category.slug}>
                      <Link
                        href={`/tools/${category.slug}`}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        role="option"
                        aria-selected={active === i}
                        data-active={active === i}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          active === i ? 'bg-panel-2' : ''
                        }`}
                      >
                        <span
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                          style={{
                            color: categoryAccent(category.slug),
                            backgroundColor: `color-mix(in oklab, ${categoryAccent(category.slug)} 12%, transparent)`,
                          }}
                        >
                          <CategoryIcon category={category.slug} className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-ink-900">{category.name}</span>
                        <span className="ml-auto text-xs text-ink-500">
                          {countFor(category.slug)}{' '}
                          {countFor(category.slug) === 1 ? 'tool' : 'tools'}
                        </span>
                      </Link>
                    </li>
                  ))}

                {query.trim() !== '' &&
                  hits.map((hit, i) => (
                    <li key={hit.href}>
                      <Link
                        href={hit.href}
                        onClick={close}
                        onMouseEnter={() => setActive(i)}
                        role="option"
                        aria-selected={active === i}
                        data-active={active === i}
                        className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                          active === i ? 'bg-panel-2' : ''
                        }`}
                      >
                        <span
                          className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                          style={{
                            color: categoryAccent(hit.category),
                            backgroundColor: `color-mix(in oklab, ${categoryAccent(hit.category)} 12%, transparent)`,
                          }}
                        >
                          <CategoryIcon category={hit.category} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink-900">
                            {hit.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-ink-500">
                            {hit.description}
                          </span>
                        </span>
                        <span className="ml-auto shrink-0 pt-0.5 text-xs text-ink-500">
                          {hit.categoryName}
                        </span>
                      </Link>
                    </li>
                  ))}

                {query.trim() !== '' && hits.length === 0 && (
                  <li className="px-3 py-8 text-center">
                    <p className="text-sm text-ink-600">
                      Nothing matches “{query.trim()}”.
                    </p>
                    <Link
                      href="/tools"
                      onClick={close}
                      className="mt-2 inline-block text-sm font-medium text-brand-700 hover:text-brand-800"
                    >
                      Browse all tools →
                    </Link>
                  </li>
                )}
              </ul>

              <div className="flex items-center gap-4 border-t border-line bg-panel-2 px-4 py-2.5 text-[11px] text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Key>↑</Key>
                  <Key>↓</Key>
                  to navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <Key>↵</Key>
                  to open
                </span>
                <span className="ml-auto hidden sm:flex sm:items-center sm:gap-1.5">
                  <Key>/</Key>
                  to search
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded-md border border-line bg-panel-2 px-1.5 py-0.5 font-mono text-[11px] text-ink-600">
      {children}
    </kbd>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
