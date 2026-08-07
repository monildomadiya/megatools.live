import Link from 'next/link';
import { ToolGrid } from '@/components/tool/ToolCard';
import { recentTools } from '@/lib/tools/registry';

export default function NotFound() {
  const suggestions = recentTools.slice(0, 3);

  return (
    <>
      <section className="hero-bg isolate overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 text-display-lg text-ink-900">
            We could not find that page
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            The tool you were looking for may have moved, or may not exist yet. Browsing
            all tools is usually the quickest way to find what you need.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools" className="btn btn-primary btn-md">
              Browse all tools
              <span aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="btn btn-outline btn-md">
              Request a tool
            </Link>
          </div>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <p className="eyebrow">Try these</p>
          <h2 className="mt-3 text-display-sm">Recently added</h2>
          <div className="mt-7">
            <ToolGrid tools={suggestions} />
          </div>
        </section>
      )}
    </>
  );
}
