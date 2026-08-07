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

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 text-base font-bold text-ink-900">
              <span
                aria-hidden
                className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white"
              >
                M
              </span>
              {site.name}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {site.tagline}. Every calculation runs in your browser — nothing you
              type is sent to a server.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink-900">Categories</h2>
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-ink-900">Site</h2>
            <ul className="mt-3 space-y-2">
              {siteLinks.map((link) => (
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

          <div>
            <h2 className="text-sm font-semibold text-ink-900">Legal</h2>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((link) => (
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
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="text-sm text-ink-500">
            Results are for general information only and are not professional
            financial or medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
