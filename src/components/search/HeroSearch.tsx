'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useRef, useState } from 'react';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { searchTools } from '@/lib/tools/search';

/**
 * The search field in the hero.
 *
 * The ⌘K palette already exists and is better for anyone who knows it is there.
 * This is for everyone else: on a site whose product is forty-odd calculators,
 * the fastest route to the thing a visitor came for is a field they can see on
 * arrival, not a shortcut they have to be told about.
 *
 * It resolves inline rather than posting to a results page. There is no query
 * that needs a page of its own here — every answer is a single tool, so an
 * extra navigation would only put a list between the reader and the calculator.
 */
export function HeroSearch({
  suggestions = [],
}: {
  /** Optional one-tap shortcuts under the field. Omitted on the homepage,
   *  which deliberately names no individual calculator. */
  suggestions?: { href: string; name: string }[];
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listId = useId();

  const hits = useMemo(() => searchTools(query, 6), [query]);
  const open = focused && query.trim() !== '';

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
      return;
    }
    if (hits.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i - 1 + hits.length) % hits.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const href = hits[active]?.href;
      if (href) router.push(href);
    }
  }

  return (
    <div
      ref={containerRef}
      // Focus tracked on the wrapper rather than the input, so clicking a result
      // does not close the list before the navigation fires.
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) setFocused(false);
      }}
      className="relative w-full max-w-2xl"
    >
      <div
        className={`flex items-center gap-3 rounded-full border bg-panel pl-5 pr-3 transition-all duration-200 ${
          focused
            ? 'border-brand-400 shadow-lift ring-4 ring-brand-500/12'
            : 'border-line shadow-panel hover:border-ink-300'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          className="h-5 w-5 shrink-0 text-ink-500"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search calculators — BMI, mortgage, VAT…"
          aria-label="Search calculators"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          className="h-14 flex-1 bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-500 sm:h-16 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
        />

        {query.trim() === '' ? (
          <kbd className="hidden shrink-0 rounded-lg border border-line bg-panel-2 px-2 py-1 font-mono text-xs font-medium text-ink-500 sm:inline">
            /
          </kbd>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-panel-2 hover:text-ink-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div className="animate-dialog-in absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-card-lg border border-line bg-panel text-left shadow-pop">
          {hits.length > 0 ? (
            <ul id={listId} role="listbox" className="max-h-[22rem] overflow-y-auto p-2">
              {hits.map((hit, i) => (
                <li key={hit.href}>
                  <Link
                    href={hit.href}
                    role="option"
                    aria-selected={active === i}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      active === i ? 'bg-panel-2' : ''
                    }`}
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                      style={{
                        color: categoryAccent(hit.category),
                        backgroundColor: `color-mix(in oklab, ${categoryAccent(hit.category)} 12%, transparent)`,
                      }}
                    >
                      <CategoryIcon category={hit.category} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {hit.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-500">
                        {hit.description}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-ink-500">{hit.categoryName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-ink-600">Nothing matches “{query.trim()}”.</p>
              <Link
                href="/contact"
                className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Request this calculator →
              </Link>
            </div>
          )}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-ink-500">Popular:</span>
          {suggestions.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full border border-line bg-panel px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-400 hover:text-ink-900"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
