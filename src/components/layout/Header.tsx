'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { categories } from '@/lib/tools/categories';
import { site } from '@/lib/site';

// Only category data crosses into the client bundle here — never the tool
// registry, which would drag calculator code into first load.
const navCategories = categories.map((c) => ({ slug: c.slug, name: c.name }));

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation; without this the menu stays open behind the
  // new page after a client-side transition.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-ink-900"
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-sm font-bold text-white"
          >
            M
          </span>
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/tools/${category.slug}`}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith(`/tools/${category.slug}`)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              }`}
            >
              {category.name}
            </Link>
          ))}
          {/* The Guides link goes back once /blog exists. Linking to it before
              then would put a 404 in the nav of every page on the site. */}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/tools"
            className="hidden rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-800 sm:block"
          >
            All tools
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-200 text-ink-700 lg:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <>
                  <path d="M4 4l10 10" />
                  <path d="M14 4L4 14" />
                </>
              ) : (
                <>
                  <path d="M2.5 5h13" />
                  <path d="M2.5 9h13" />
                  <path d="M2.5 13h13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-ink-200 bg-white lg:hidden"
        >
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:px-6">
            {navCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/tools/${category.slug}`}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tools"
                className="block rounded-md px-3 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
              >
                All tools
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
