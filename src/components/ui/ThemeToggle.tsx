'use client';

import { useEffect, useState } from 'react';

/**
 * Inlined into <head> and run before first paint, so the correct theme is on
 * <html> by the time anything renders. Without this the page paints light, then
 * flips to dark once React hydrates — the flash is worse on a dark theme than
 * having no dark theme at all.
 *
 * Kept as a string because it has to execute ahead of the bundle, which means
 * it cannot be a component.
 */
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored ? stored === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export function ThemeToggle() {
  // Starts undefined rather than 'light': the real value lives on <html>, put
  // there by the script above, and guessing here would render the wrong icon on
  // the first client paint.
  const [dark, setDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains('dark');

    // Suppress transitions for the frame the class lands in. See the
    // `.theme-switching` rule in globals.css — without it, controls that
    // transition a var()-driven colour keep the previous theme's background.
    root.classList.add('theme-switching');
    root.classList.toggle('dark', next);
    // Force the new styles to be resolved while transitions are still off.
    void root.offsetHeight;
    requestAnimationFrame(() => root.classList.remove('theme-switching'));

    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Private mode with storage denied — the theme still applies for this
      // page view, it just will not be remembered.
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={dark ?? false}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-600 transition-colors hover:bg-panel-2 hover:text-ink-900"
    >
      {/* Both glyphs ship; which one shows is a CSS concern, so the button is
          not blank during the tick before the effect runs. */}
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="hidden dark:block"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="dark:hidden"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5" />
      </svg>
    </button>
  );
}
