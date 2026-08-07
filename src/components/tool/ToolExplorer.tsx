'use client';

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
  count: number;
}

/**
 * Filter-and-search surface for the full tool index.
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
  const [active, setActive] = useState<CategorySlug | 'all'>('all');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter(
      (tool) =>
        (active === 'all' || tool.category === active) &&
        (q === '' || tool.search.includes(q)),
    );
  }, [tools, query, active]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter tools…"
            aria-label="Filter tools by name or keyword"
            className="h-11 w-full rounded-xl border border-line bg-panel pl-10 pr-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
          <FilterChip
            label="All"
            count={tools.length}
            selected={active === 'all'}
            onSelect={() => setActive('all')}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.slug}
              label={category.name}
              count={category.count}
              selected={active === category.slug}
              accent={categoryAccent(category.slug)}
              icon={<CategoryIcon category={category.slug} className="h-3.5 w-3.5" />}
              onSelect={() => setActive(category.slug)}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-ink-500">
        {visible.length === tools.length
          ? `Showing all ${tools.length} tools`
          : `${visible.length} of ${tools.length} tools`}
      </p>

      <div className="mt-4">
        {visible.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tool) => (
              <li key={tool.href}>
                <ToolCard tool={tool} showCategory={active === 'all'} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-medium text-ink-900">Nothing matches that filter</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500">
              Try a broader term, or clear the filters to see everything.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setActive('all');
              }}
              className="mt-5 rounded-lg bg-invert px-4 py-2 text-sm font-semibold text-on-invert transition-colors hover:bg-invert-hover"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
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
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${
        selected
          ? 'border-transparent bg-invert text-on-invert'
          : 'border-line text-ink-600 hover:border-ink-300 hover:text-ink-900'
      }`}
    >
      {icon && (
        <span style={selected || !accent ? undefined : { color: accent }}>{icon}</span>
      )}
      {label}
      <span className={selected ? 'opacity-60' : 'text-ink-500'}>{count}</span>
    </button>
  );
}
