'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SiteSearch } from '@/components/search/SiteSearch';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
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

  // The header is transparent-ish at the top and gains its border and shadow
  // once the page moves, so the hero reads as full-bleed on arrival.
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

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'border-b border-line shadow-panel' : 'border-b border-transparent'
      }`}
    >
      {/* Separate layer for the blur so the border above can fade independently
          of the background, which stays constant. */}
      <div className="absolute inset-0 -z-10 bg-surface/85 backdrop-blur-xl" />

      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-[17px] font-bold tracking-tight text-ink-900"
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-mark-from to-mark-to text-sm font-bold text-white shadow-panel"
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
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                onToolsSection || panelOpen
                  ? 'bg-panel-2 text-ink-900'
                  : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
              }`}
            >
              Categories
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={`transition-transform duration-200 ${panelOpen ? 'rotate-180' : ''}`}
              >
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </button>

            {/* A panel rather than a row of links: eight categories already
                crowd the bar, and the count only goes up from here. */}
            {panelOpen && (
              <div className="animate-dialog-in absolute left-0 top-full mt-2 w-[30rem] overflow-hidden rounded-2xl border border-line bg-panel p-2 shadow-pop">
                <ul className="grid grid-cols-2 gap-0.5">
                  {navCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/tools/${category.slug}`}
                        className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-panel-2"
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
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-ink-900">
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
                  className="mt-1 flex items-center justify-between rounded-xl border-t border-line px-3 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-panel-2"
                >
                  Browse everything
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/tools"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === '/tools'
                ? 'bg-panel-2 text-ink-900'
                : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
            }`}
          >
            All tools
          </Link>
          <Link
            href="/about"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === '/about'
                ? 'bg-panel-2 text-ink-900'
                : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
            }`}
          >
            About
          </Link>
          {/* The Guides link goes back once /blog exists. Linking to it before
              then would put a 404 in the nav of every page on the site. */}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SiteSearch />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-700 transition-colors hover:bg-panel-2 md:hidden"
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
          className="animate-dialog-in border-t border-line bg-surface md:hidden"
        >
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 sm:px-6">
            {navCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/tools/${category.slug}`}
                  className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-panel-2"
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
                  <span className="min-w-0 truncate text-sm font-medium text-ink-800">
                    {category.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-6xl gap-2 px-4 pb-4 sm:px-6">
            <Link
              href="/tools"
              className="flex-1 rounded-xl bg-invert px-4 py-2.5 text-center text-sm font-semibold text-on-invert"
            >
              All tools
            </Link>
            <Link
              href="/about"
              className="flex-1 rounded-xl border border-line px-4 py-2.5 text-center text-sm font-semibold text-ink-800"
            >
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
