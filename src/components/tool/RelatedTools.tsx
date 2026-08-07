import Link from 'next/link';
import type { ToolWithHref } from '@/lib/tools/types';

export function RelatedTools({ tools }: { tools: ToolWithHref[] }) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-16">
      <p className="eyebrow">Keep going</p>
      <h2 id="related-heading" className="mt-3 text-display-sm">
        Related calculators
      </h2>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="card card-lift group flex h-full flex-col p-5 hover:border-ink-300"
            >
              <span className="font-display font-extrabold tracking-tight text-ink-900 group-hover:text-brand-700">
                {tool.name}
              </span>
              <span className="mt-2 block flex-1 text-sm leading-relaxed text-ink-600">
                {tool.shortDescription}
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Open calculator
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
