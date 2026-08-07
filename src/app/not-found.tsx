import Link from 'next/link';
import { ToolGrid } from '@/components/tool/ToolCard';
import { recentTools } from '@/lib/tools/registry';

export default function NotFound() {
  const suggestions = recentTools.slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-600">
        The tool you were looking for may have moved, or may not exist yet. Browsing all
        tools is usually the quickest way to find what you need.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/tools"
          className="rounded-lg bg-invert px-5 py-2.5 text-sm font-semibold text-on-invert transition-colors hover:bg-invert-hover"
        >
          Browse all tools
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-ink-800 transition-colors hover:bg-panel-2"
        >
          Request a tool
        </Link>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-ink-900">Recently added</h2>
          <div className="mt-5">
            <ToolGrid tools={suggestions} />
          </div>
        </section>
      )}
    </div>
  );
}
