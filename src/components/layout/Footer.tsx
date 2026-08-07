import Link from 'next/link';
import { categories } from '@/lib/tools/categories';
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

/** Column heading. Mono eyebrows here rather than bold sans: at four columns of
 *  short links, the labels need to read as signposts, not as content. */
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow eyebrow-muted">{children}</h2>;
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-ink-600 transition-colors hover:text-brand-700"
      >
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink-900">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-mark-from to-mark-to text-sm font-extrabold text-white"
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

          <div>
            <ColumnHeading>Categories</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <FooterLink
                  key={category.slug}
                  href={`/tools/${category.slug}`}
                  label={category.name}
                />
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Site</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {siteLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>

          <div>
            <ColumnHeading>Legal</ColumnHeading>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <FooterLink key={link.href} {...link} />
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">
            Results are for general information only and are not professional financial
            or medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
