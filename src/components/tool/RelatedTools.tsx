import Link from 'next/link';
import type { ToolWithHref } from '@/lib/tools/types';

export function RelatedTools({ tools }: { tools: ToolWithHref[] }) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <h2 id="related-heading" className="text-2xl font-bold text-ink-900">
        Related calculators
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="group block h-full rounded-xl border border-ink-200 p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/50"
            >
              <span className="font-semibold text-ink-900 group-hover:text-brand-700">
                {tool.name}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-600">
                {tool.shortDescription}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
