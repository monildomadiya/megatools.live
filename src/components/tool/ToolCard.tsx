import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { getCategory } from '@/lib/tools/categories';
import type { ToolCardData } from '@/lib/tools/types';

/**
 * `showCategory` is off on category hubs, where every card would otherwise
 * carry the same redundant label, and on when the grid mixes categories.
 */
export function ToolCard({
  tool,
  showCategory = false,
}: {
  tool: ToolCardData;
  showCategory?: boolean;
}) {
  const accent = categoryAccent(tool.category);
  const category = getCategory(tool.category);

  return (
    <Link
      href={tool.href}
      className="card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel p-5 hover:border-ink-300"
    >
      {/* Accent wash, revealed on hover. Sits behind the content and is inert,
          so it never intercepts the pointer. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, ${accent} 10%, transparent), transparent 60%)`,
        }}
      />

      <div className="relative flex items-start gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
          style={{
            color: accent,
            backgroundColor: `color-mix(in oklab, ${accent} 12%, transparent)`,
          }}
        >
          <CategoryIcon category={tool.category} className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          {showCategory && category && (
            <span className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
              {category.name}
            </span>
          )}
          <h3 className="font-semibold leading-snug text-ink-900">{tool.name}</h3>
        </div>
      </div>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-ink-600">
        {tool.shortDescription}
      </p>

      <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
        Open calculator
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}

export function ToolGrid({
  tools,
  showCategory = false,
}: {
  tools: ToolCardData[];
  showCategory?: boolean;
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <li key={tool.href}>
          <ToolCard tool={tool} showCategory={showCategory} />
        </li>
      ))}
    </ul>
  );
}
