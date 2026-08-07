import Link from 'next/link';
import type { ToolWithHref } from '@/lib/tools/types';

export function ToolCard({ tool }: { tool: ToolWithHref }) {
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-xl border border-ink-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-sm"
    >
      <h3 className="font-semibold text-ink-900 group-hover:text-brand-700">{tool.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
        {tool.shortDescription}
      </p>
      <span className="mt-4 text-sm font-medium text-brand-700">
        Open calculator{' '}
        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}

export function ToolGrid({ tools }: { tools: ToolWithHref[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <li key={tool.href}>
          <ToolCard tool={tool} />
        </li>
      ))}
    </ul>
  );
}
