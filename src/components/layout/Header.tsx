'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SiteSearch } from '@/components/search/SiteSearch';
import { CategoryIcon, categoryAccent } from '@/components/ui/CategoryIcon';
import { categories } from '@/lib/tools/categories';
import { allTools, countToolsByCategory } from '@/lib/tools/registry';
import { site } from '@/lib/site';

/**
 * The site header, built for the tool count going up by an order of magnitude
 * rather than for the number live today.
 *
 * Three decisions follow from that:
 *
 * Search is a field, not an icon. Below about fifty tools a menu is a
 * reasonable way in; past a few hundred it stops being navigation and becomes
 * a list nobody reads. The field is the widest thing in the bar after the
 * wordmark, because at a thousand tools it is how almost every visit starts.
 *
 * The menu lists categories and never tools. A panel that names tools has to
 * choose which ones, and any choice out of a thousand is arbitrary. Categories
 * are a fixed, small set whatever happens to the tool count.
 *
 * The panel is a scrolling grid rather than a fixed two columns, so adding
 * categories widens the grid instead of pushing the layout apart.
 */

// Only category data crosses into the client bundle here — never calculator
// components, which would drag every tool into first load.
const navCategories = categories.map((category) => ({
  slug: category.slug,
  name: category.name,
  count: countToolsByCategory(category.slug),
}));

const toolCount = allTools.length;

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

  const navItem = (active: boolean) =>
    `flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold transition-colors ${
      active ? 'bg-panel-2 text-ink-900' : 'text-ink-600 hover:bg-panel-2 hover:text-ink-900'
    }`;

  return (
    // The bar floats: the sticky wrapper is full width and transparent to the
    // pointer, and the island inside it is inset from all three edges.
    <div className="pointer-events-none sticky top-0 z-50 w-full px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
      <header
        ref={panelRef}
        className={`glass-bar pointer-events-auto relative mx-auto max-w-6xl ${
          scrolled ? 'shadow-lift' : ''
        }`}
      >
        <div className="flex h-[64px] items-center gap-2 px-3 sm:h-[68px] sm:gap-3 sm:px-4 md:h-[72px] md:px-5">
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
            <span className="hidden lg:inline">{site.name}</span>
          </Link>

          <nav aria-label="Main" className="hidden shrink-0 items-center gap-0.5 md:flex">
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

            <Link href="/about" className={navItem(pathname === '/about')}>
              About
            </Link>
          </nav>

          {/* The field takes every pixel the bar can spare. At a thousand tools
              this is the primary control in the header, not an accessory to the
              menu beside it. */}
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
            <SiteSearch />

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line bg-panel text-ink-700 transition-colors hover:border-brand-400 hover:text-ink-900 md:hidden"
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

        {/* ------------------------------------------------------------------
            Category panel. Full island width and a fluid grid, so a ninth or a
            twentieth category widens the grid rather than lengthening a column
            nobody scrolls. The scroll cap is what keeps it usable past that.
        ------------------------------------------------------------------ */}
        {panelOpen && (
          <div className="animate-dialog-in absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-card-lg border border-line bg-panel shadow-pop">
            <div className="max-h-[65vh] overflow-y-auto p-3">
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {navCategories.map((category) => {
                  const accent = categoryAccent(category.slug);
                  return (
                    <li key={category.slug}>
                      <Link
                        href={`/tools/${category.slug}`}
                        className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-panel-2"
                      >
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105"
                          style={{
                            color: accent,
                            backgroundColor: `color-mix(in oklab, ${accent} 12%, white)`,
                          }}
                        >
                          <CategoryIcon category={category.slug} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink-900">
                            {category.name}
                          </span>
                          <span className="block text-xs text-ink-500">
                            {category.count === 0
                              ? 'Coming soon'
                              : `${category.count} ${category.count === 1 ? 'tool' : 'tools'}`}
                          </span>
                        </span>
                        <span
                          aria-hidden
                          className="shrink-0 text-brand-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-line bg-panel-2 px-4 py-3">
              <Link
                href="/tools"
                className="text-sm font-bold text-brand-700 hover:underline"
              >
                Browse all {toolCount} tools →
              </Link>
              <span className="hidden items-center gap-1.5 text-xs text-ink-500 sm:flex">
                Press
                <kbd className="rounded-md border border-line bg-panel px-1.5 py-0.5 font-mono text-[11px] text-ink-600">
                  /
                </kbd>
                to search
              </span>
            </div>
          </div>
        )}

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="animate-dialog-in overflow-hidden rounded-b-[15px] border-t border-line bg-panel/95 backdrop-blur-xl md:hidden"
          >
            {/* Capped and scrollable for the same reason the panel is: this list
                grows with the category count, and a menu taller than the phone
                is a menu with a hidden bottom. */}
            <ul className="grid max-h-[60vh] grid-cols-2 gap-1.5 overflow-y-auto px-3 py-3">
              {navCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/tools/${category.slug}`}
                    className="flex items-center gap-2.5 rounded-2xl border border-line bg-panel px-2.5 py-2.5 transition-colors hover:border-brand-400"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                      style={{
                        color: categoryAccent(category.slug),
                        backgroundColor: `color-mix(in oklab, ${categoryAccent(category.slug)} 12%, white)`,
                      }}
                    >
                      <CategoryIcon category={category.slug} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink-800">
                        {category.name}
                      </span>
                      <span className="numeric block text-xs text-ink-500">
                        {category.count}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 px-3 pb-3">
              <Link href="/tools" className="btn btn-primary btn-md flex-1">
                All {toolCount} tools
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
