import Link from 'next/link';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { allTools, getToolsByCategory } from '@/lib/tools/registry';
import { network, site } from '@/lib/site';

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

/** How many tools each category names before it defers to its hub. */
const NAMED_TOOLS = 5;

export function Footer() {
  const populated = categories.filter((category) => getToolsByCategory(category.slug).length > 0);

  return (
    <footer className="relative mt-28 bg-panel">
      {/* A hairline of brand colour across the very top, fading at both ends.
          The footer is the one full-width band on the page with no border to
          separate it from the content above; this gives it an edge without
          drawing a hard rule under the whole site. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            'linear-gradient(to right, transparent, var(--color-brand-500) 50%, transparent)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ----------------------------------------------------------------
            Masthead. The wordmark set at display size rather than as another
            16px link — this is the one place on the site where the name is the
            subject rather than a way back to the homepage.
        ---------------------------------------------------------------- */}
        <div className="grid gap-10 border-b border-line py-14 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-mark-from to-mark-to text-lg font-extrabold text-white shadow-panel transition-transform duration-300 group-hover:scale-105"
              >
                M
              </span>
              <span className="font-display text-display-sm text-ink-900">{site.name}</span>
            </Link>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">
              {site.tagline}. Every calculation runs in your browser — nothing you type is
              sent to a server, there is no account, and every formula on the site is
              traced to the body that published it.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end">
            <Link href="/tools" className="btn btn-primary btn-md">
              Browse all {allTools.length} tools
              <span aria-hidden>→</span>
            </Link>
            <Link href="/editorial-policy" className="btn btn-outline btn-md">
              How we check the numbers
            </Link>
          </div>
        </div>

        {/* ----------------------------------------------------------------
            The directory.

            A footer listing eight category names is a table of contents for a
            table of contents. Naming the tools makes every page on the site
            reachable from every other page in one hop, which is worth more to
            someone hunting for a converter than a tidier column would be.
        ---------------------------------------------------------------- */}
        <nav
          aria-label="All tools"
          className="grid gap-x-8 gap-y-10 border-b border-line py-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {populated.map((category) => {
            const tools = getToolsByCategory(category.slug);
            const named = tools.slice(0, NAMED_TOOLS);
            const remaining = tools.length - named.length;
            const accent = categoryAccent(category.slug);

            return (
              <div key={category.slug}>
                <h2 className="flex items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                    style={{
                      color: accent,
                      backgroundColor: `color-mix(in oklab, ${accent} 12%, white)`,
                    }}
                  >
                    <CategoryIcon category={category.slug} className="h-4 w-4" />
                  </span>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="font-display text-sm font-extrabold tracking-tight text-ink-900 transition-colors hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                  <span className="numeric ml-auto text-xs text-ink-400">{tools.length}</span>
                </h2>

                <ul className="mt-4 space-y-2.5">
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
                        className="text-sm font-bold text-brand-700 hover:underline"
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

        {/* ----------------------------------------------------------------
            Sister sites. Set apart from the site and legal links below rather
            than mixed in with them, because they leave the site and a reader
            is owed that signal before they click. The label says "us" for the
            same reason — these are ours, and pretending otherwise would be the
            one dishonest thing in the footer.
        ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-4 border-b border-line py-9 sm:flex-row sm:items-center sm:gap-8">
          <p className="eyebrow eyebrow-muted shrink-0">Also from us</p>

          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {network.map((entry) => (
              <li key={entry.url}>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex flex-wrap items-baseline gap-x-2 text-sm"
                >
                  <span className="font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                    {entry.name}
                    <span aria-hidden className="ml-1 text-ink-400">
                      ↗
                    </span>
                  </span>
                  <span className="text-ink-500">{entry.blurb}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------------
            Base. Site and legal links share one row — they are the same kind
            of thing to a reader looking for them, and two columns of four
            short links each is more furniture than the content deserves.
        ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
            {[...siteLinks, ...legalLinks].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="numeric text-sm text-ink-400">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>

        <p className="border-t border-line py-6 text-sm leading-relaxed text-ink-500">
          Results are for general information only and are not professional financial,
          medical, or legal advice. Every tool states the limits of the method it uses —
          read that section before acting on a number.
        </p>
      </div>
    </footer>
  );
}
