import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { getToolsByCategory } from '@/lib/tools/registry';
import { site } from '@/lib/site';

const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
];

const siteLinks = [
  { href: '/about', label: 'About' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
  { href: '/contact', label: 'Contact' },
  // '/blog' returns here once the guides exist.
];

/** How many tools each category names before the column defers to its hub. */
const NAMED_TOOLS = 5;

export function Footer() {
  const populated = categories.filter((category) => getToolsByCategory(category.slug).length > 0);

  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink-900">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-mark-from to-mark-to text-sm font-bold text-white"
              >
                M
              </span>
              {site.name}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              {site.tagline}. Every calculation runs in your browser — nothing you type
              is sent to a server.
            </p>
          </div>

          <Link href="/tools" className="btn btn-outline btn-md shrink-0 self-start sm:self-auto">
            Browse every tool
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* The directory itself.

            A footer listing eight category names is a table of contents for a
            table of contents. Naming the tools instead makes every page on the
            site reachable from every other page in one hop, which is worth more
            to a reader hunting for a converter than a tidier column would be. */}
        <nav aria-label="All tools" className="grid gap-x-8 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {populated.map((category) => {
            const tools = getToolsByCategory(category.slug);
            const named = tools.slice(0, NAMED_TOOLS);
            const remaining = tools.length - named.length;
            const accent = categoryAccent(category.slug);

            return (
              <div key={category.slug}>
                <h2 className="flex items-center gap-2">
                  <CategoryIcon
                    category={category.slug}
                    className="h-4 w-4"
                    style={{ color: accent }}
                  />
                  <Link
                    href={`/tools/${category.slug}`}
                    className="font-display text-sm font-bold tracking-tight text-ink-900 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                </h2>

                <ul className="mt-3.5 space-y-2">
                  {named.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  {remaining > 0 && (
                    <li>
                      <Link
                        href={`/tools/${category.slug}`}
                        className="text-sm font-semibold text-brand-700 hover:underline"
                      >
                        +{remaining} more
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[...siteLinks, ...legalLinks].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Results are for general information only and are not professional financial
            or medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
