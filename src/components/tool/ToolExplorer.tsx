'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ToolCard } from '@/components/tool/ToolCard';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import type { CategorySlug, ToolCardData } from '@/lib/tools/types';

export interface ExplorerTool extends ToolCardData {
  /**
   * Lowercased name + keywords + description, joined on the server. Doing it
   * there keeps the keyword arrays out of the payload and means filtering is a
   * single `includes` per tool per keystroke.
   */
  search: string;
}

export interface ExplorerCategory {
  slug: CategorySlug;
  name: string;
  /**
   * The hub page, linked from the rail's selected state. Counts are not passed:
   * they are derived from `tools` against the live query, so a static count
   * here would only ever be the one case the rail does not need told to it.
   */
  href: string;
  /** One line of hub copy, shown when the category is the active filter. */
  description: string;
}

type Filter = CategorySlug | 'all';

/**
 * Filter-and-search surface for the full tool index.
 *
 * Laid out as a directory rather than as a page of stacked grids: a sticky rail
 * carries the categories and the whole right-hand column is results. The rail
 * is the reason the category hub cards no longer need their own band further
 * down — switching sections is one click from anywhere in the scroll instead of
 * a trip to the bottom of the page.
 *
 * The default state renders every tool, which matters for more than
 * convenience: this component is server-rendered, so the complete set of links
 * is in the static HTML for crawlers regardless of what the filters do
 * afterwards. Filtering is presentation on top of a full document, never a
 * gate in front of one.
 */
export function ToolExplorer({
  tools,
  categories,
}: {
  tools: ExplorerTool[];
  categories: ExplorerCategory[];
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Filter>('all');

  const q = query.trim().toLowerCase();
  const filtering = q !== '' || active !== 'all';

  const matched = useMemo(
    () => (q === '' ? tools : tools.filter((tool) => tool.search.includes(q))),
    [tools, q],
  );

  const visible = useMemo(
    () => (active === 'all' ? matched : matched.filter((tool) => tool.category === active)),
    [matched, active],
  );

  /**
   * Per-category counts recomputed against the current query, so the rail
   * reports how many matches each section actually holds. A rail that keeps
   * advertising "Finance 8" while the query matches one of them is telling the
   * reader something false about where to click next.
   */
  const counts = useMemo(() => {
    const map = new Map<CategorySlug, number>();
    for (const tool of matched) map.set(tool.category, (map.get(tool.category) ?? 0) + 1);
    return map;
  }, [matched]);

  const activeCategory =
    active === 'all' ? undefined : categories.find((category) => category.slug === active);

  function clear() {
    setQuery('');
    setActive('all');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[16.5rem_minmax(0,1fr)]">
      {/* ------------------------------------------------------------------
          The rail. Hidden below lg, where the same filters ride as a scrolling
          chip row above the results — a 240px column on a phone is the whole
          screen.
      ------------------------------------------------------------------ */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <nav
            aria-label="Filter by category"
            className="card max-h-[calc(100vh-8rem)] overflow-y-auto p-2"
          >
            <p className="eyebrow eyebrow-muted px-3 pb-2 pt-2.5">Browse</p>

            <ul>
              <li>
                <RailItem
                  label="All tools"
                  count={matched.length}
                  selected={active === 'all'}
                  icon={<AllIcon />}
                  onSelect={() => setActive('all')}
                />
              </li>

              <li aria-hidden className="mx-3 my-1.5 h-px bg-line-soft" />

              {categories.map((category) => {
                const count = counts.get(category.slug) ?? 0;
                return (
                  <li key={category.slug}>
                    <RailItem
                      label={category.name}
                      count={count}
                      selected={active === category.slug}
                      accent={categoryAccent(category.slug)}
                      icon={<CategoryIcon category={category.slug} className="h-4 w-4" />}
                      // Nothing to show behind it. Left clickable when it is
                      // already the active filter, or the reader would be stuck
                      // in an empty section.
                      disabled={count === 0 && active !== category.slug}
                      onSelect={() => setActive(category.slug)}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          <p className="mt-4 px-3 text-xs leading-relaxed text-ink-500">
            Everything here runs on your device. Nothing you type into a calculator is
            uploaded.
          </p>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      <div>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, keyword, or what you are trying to work out…"
            aria-label="Filter tools by name or keyword"
            className="h-[3.25rem] w-full rounded-2xl border border-line bg-panel pl-12 pr-12 text-[0.9375rem] text-ink-900 shadow-panel outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
          {query !== '' && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-panel-2 hover:text-ink-900"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
                className="h-4 w-4"
              >
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>

        {/* The rail's mobile form. */}
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
          <FilterChip
            label="All"
            count={matched.length}
            selected={active === 'all'}
            onSelect={() => setActive('all')}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.slug}
              label={category.name}
              count={counts.get(category.slug) ?? 0}
              selected={active === category.slug}
              accent={categoryAccent(category.slug)}
              icon={<CategoryIcon category={category.slug} className="h-3.5 w-3.5" />}
              onSelect={() => setActive(category.slug)}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="eyebrow eyebrow-muted">
            {filtering
              ? `${visible.length} of ${tools.length} tools`
              : `Showing all ${tools.length} tools`}
          </p>

          {filtering && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition-colors hover:text-ink-900"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden
                className="h-3.5 w-3.5"
              >
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
              Reset
            </button>
          )}
        </div>

        {/* The hub copy that used to sit on the category cards, surfaced only
            for the section being looked at — and with it the link out to the
            hub page itself, which carries far more than this grid can. */}
        {activeCategory && (
          <div
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card border p-4 sm:flex-nowrap sm:p-5"
            style={{
              borderColor: `color-mix(in oklab, ${categoryAccent(activeCategory.slug)} 22%, transparent)`,
              backgroundColor: `color-mix(in oklab, ${categoryAccent(activeCategory.slug)} 6%, var(--color-panel))`,
            }}
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{
                color: categoryAccent(activeCategory.slug),
                backgroundColor: `color-mix(in oklab, ${categoryAccent(activeCategory.slug)} 14%, white)`,
              }}
            >
              <CategoryIcon category={activeCategory.slug} className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-extrabold tracking-tight text-ink-900">
                {activeCategory.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">
                {activeCategory.description}
              </p>
            </div>

            <Link
              href={activeCategory.href}
              className="btn btn-outline btn-sm shrink-0 whitespace-nowrap"
            >
              Open hub
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}

        <div className="mt-4">
          {visible.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((tool) => (
                <li key={tool.href}>
                  <ToolCard tool={tool} showCategory={active === 'all'} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card-lg border border-dashed border-line bg-panel px-6 py-16 text-center">
              <p className="font-display text-lg font-extrabold tracking-tight text-ink-900">
                Nothing matches that filter
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                {q === ''
                  ? 'This section is still being written.'
                  : `No tool matches “${query.trim()}”. Try a broader term, or clear the filters to see everything.`}
              </p>
              <button type="button" onClick={clear} className="btn btn-ink btn-sm mt-6">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * A row in the sticky rail. Selection is carried by a tinted fill plus a bar
 * down the left edge in the category's own colour — the tint alone is too faint
 * at these accents to survive on a white card.
 */
function RailItem({
  label,
  count,
  selected,
  accent,
  icon,
  disabled = false,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  accent?: string;
  icon: React.ReactNode;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const hue = accent ?? 'var(--color-ink-900)';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`group relative flex w-full items-center gap-2.5 rounded-xl py-2 pl-3 pr-2 text-left transition-colors ${
        selected
          ? 'text-ink-900'
          : disabled
            ? 'cursor-not-allowed text-ink-400 opacity-60'
            : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
      }`}
      style={
        selected
          ? { backgroundColor: `color-mix(in oklab, ${hue} 10%, transparent)` }
          : undefined
      }
    >
      {selected && (
        <span
          aria-hidden
          className="absolute inset-y-1.5 left-0 w-[3px] rounded-full"
          style={{ backgroundColor: hue }}
        />
      )}

      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-105"
        style={{
          color: hue,
          backgroundColor: `color-mix(in oklab, ${hue} 12%, white)`,
        }}
      >
        {icon}
      </span>

      <span
        className={`min-w-0 flex-1 truncate text-sm ${selected ? 'font-bold' : 'font-semibold'}`}
      >
        {label}
      </span>

      <span
        className={`numeric shrink-0 rounded-full px-1.5 py-0.5 text-xs ${
          selected ? 'text-ink-700' : 'text-ink-500'
        }`}
        style={
          selected ? { backgroundColor: `color-mix(in oklab, ${hue} 14%, white)` } : undefined
        }
      >
        {count}
      </span>
    </button>
  );
}

function AllIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </svg>
  );
}

function FilterChip({
  label,
  count,
  selected,
  accent,
  icon,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  accent?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
        selected
          ? 'border-transparent bg-invert text-on-invert'
          : 'border-line bg-panel text-ink-600 hover:border-brand-400 hover:text-ink-900'
      }`}
    >
      {icon && (
        <span style={selected || !accent ? undefined : { color: accent }}>{icon}</span>
      )}
      {label}
      <span className={`numeric ${selected ? 'opacity-60' : 'text-ink-500'}`}>{count}</span>
    </button>
  );
}
