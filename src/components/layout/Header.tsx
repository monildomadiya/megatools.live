'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SiteSearch } from '@/components/search/SiteSearch';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { countToolsByCategory } from '@/lib/tools/registry';
import { site } from '@/lib/site';

// Only category data crosses into the client bundle here — never calculator
// components, which would drag every tool into first load.
const navCategories = categories.map((category) => ({
  slug: category.slug,
  name: category.name,
  count: countToolsByCategory(category.slug),
}));

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close everything on navigation; without this a menu stays open behind the
  // new page after a client-side transition.
  useEffect(() => {
    setMenuOpen(false);
    setPanelOpen(false);
  }, [pathname]);

  // The header is transparent at the top and gains its border and shadow once
  // the page moves, so the hero reads as full-bleed on arrival.
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Dismiss the category panel on outside click or Escape.
  useEffect(() => {
    if (!panelOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setPanelOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPanelOpen(false);
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen]);

  const onToolsSection = pathname.startsWith('/tools');

  // One shape for every top-level nav item. Pulled out because it is repeated
  // across the dropdown trigger and the plain links, and drifting between them
  // is the kind of thing nobody notices until the bar looks subtly wrong.
  const navItem = (active: boolean) =>
    `flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
      active ? 'bg-panel-2 text-ink-900' : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
    }`;

  return (
    // The bar floats: the sticky wrapper is full width and transparent to the
    // pointer, and the island inside it is inset from all three edges. That is
    // what lets the page scroll visibly past the bar on both sides instead of
    // disappearing under a full-width band.
    <div className="pointer-events-none sticky top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <header
        className={`glass-bar pointer-events-auto mx-auto max-w-6xl ${
          scrolled ? 'shadow-lift' : ''
        }`}
      >
        <div className="flex h-[64px] items-center gap-3 px-4 sm:h-[68px] sm:px-5 md:h-[72px] md:px-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink-900"
        >
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-mark-from to-mark-to text-base font-extrabold text-white shadow-panel transition-transform duration-300 group-hover:scale-105"
          >
            M
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-2 hidden items-center gap-1 md:flex">
          <div ref={panelRef} className="relative">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
              className={navItem(onToolsSection || panelOpen)}
            >
              Categories
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`text-brand-600 transition-transform duration-300 ${
                  panelOpen ? 'rotate-180' : ''
                }`}
              >
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </button>

            {/* A panel rather than a row of links: eight categories already
                crowd the bar, and the count only goes up from here. */}
            {panelOpen && (
              <div className="animate-dialog-in absolute left-0 top-full mt-2 w-[30rem] overflow-hidden rounded-card-lg border border-line bg-panel p-2 shadow-pop">
                <ul className="grid grid-cols-2 gap-0.5">
                  {navCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/tools/${category.slug}`}
                        className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-panel-2"
                      >
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
                          style={{
                            color: categoryAccent(category.slug),
                            backgroundColor: `color-mix(in oklab, ${categoryAccent(category.slug)} 12%, transparent)`,
                          }}
                        >
                          <CategoryIcon category={category.slug} className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink-900">
                            {category.name}
                          </span>
                          <span className="block text-xs text-ink-500">
                            {category.count === 0
                              ? 'Coming soon'
                              : `${category.count} ${category.count === 1 ? 'tool' : 'tools'}`}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/tools"
                  className="mt-1 flex items-center justify-between rounded-xl border-t border-line px-3 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-panel-2"
                >
                  Browse everything
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/tools" className={navItem(pathname === '/tools')}>
            All tools
          </Link>
          <Link href="/about" className={navItem(pathname === '/about')}>
            About
          </Link>
          {/* The Guides link goes back once /blog exists. Linking to it before
              then would put a 404 in the nav of every page on the site. */}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SiteSearch />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-ink-700 transition-colors hover:border-brand-400 hover:text-ink-900 md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden
            >
              {menuOpen ? (
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

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          // Rounded to match the island it hangs from, and clipped so the grid
          // inside cannot square off the bar's bottom corners.
          className="animate-dialog-in overflow-hidden rounded-b-[15px] border-t border-line bg-panel/95 backdrop-blur-xl md:hidden"
        >
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1.5 px-4 py-3 sm:px-6">
            {navCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/tools/${category.slug}`}
                  className="flex items-center gap-2.5 rounded-xl border border-line bg-panel px-2.5 py-2.5 transition-colors hover:border-brand-400"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                    style={{
                      color: categoryAccent(category.slug),
                      backgroundColor: `color-mix(in oklab, ${categoryAccent(category.slug)} 12%, transparent)`,
                    }}
                  >
                    <CategoryIcon category={category.slug} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold text-ink-800">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-4 sm:px-6">
            <Link href="/tools" className="btn btn-primary btn-md flex-1">
              All tools
            </Link>
            <Link href="/about" className="btn btn-outline btn-md flex-1">
              About
            </Link>
          </div>
        </nav>
      )}
      </header>
    </div>
  );
}
