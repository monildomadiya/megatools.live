import type { CategorySlug } from '@/lib/tools/types';

/**
 * One icon per category, drawn inline rather than pulled from an icon package.
 * Eight 24px glyphs cost less than the dependency, and shipping them as JSX
 * keeps them themeable with `currentColor`.
 *
 * Typed as a total Record over CategorySlug on purpose: adding a category to
 * `categories.ts` without adding its icon here is a build error rather than a
 * blank square that only shows up when someone visits the new hub.
 */
const paths: Record<CategorySlug, React.ReactNode> = {
  finance: (
    <>
      <path d="M3 17.5 9 11l4 4 8-8.5" />
      <path d="M15 6.5h6v6" />
    </>
  ),
  health: (
    <>
      <path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.5a4.7 4.7 0 0 1 8.5 2.7c0 1.4-.5 2.7-1.3 3.9" />
      <path d="M21 15.5h-3.5l-1.5 3-2.5-5.5-1.5 2.5H9" />
    </>
  ),
  math: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 8h8" />
      <path d="M8.5 13h1M14.5 13h1M8.5 17h1M14.5 17h1" />
    </>
  ),
  conversion: (
    <>
      <path d="M4 8h13l-3.5-3.5" />
      <path d="M20 16H7l3.5 3.5" />
    </>
  ),
  'date-time': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  developer: (
    <>
      <path d="M8.5 8 4 12.5 8.5 17" />
      <path d="M15.5 8 20 12.5 17 20" />
      <path d="M14 4.5 10.5 20" />
    </>
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
      <path d="M8.5 11.5h5M8.5 8.5h5" />
    </>
  ),
  lifestyle: (
    <>
      <path d="m12 3 2.1 4.6 5 .6-3.7 3.4 1 4.9L12 14.1 7.6 16.5l1-4.9L4.9 8.2l5-.6z" />
      <path d="M18.5 17.5 19 19l1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 19l1.5-.5z" />
    </>
  ),
};

export function CategoryIcon({
  category,
  className = 'h-5 w-5',
}: {
  category: CategorySlug;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[category]}
    </svg>
  );
}

/**
 * The accent hue for a category, as a CSS value. Every category token is
 * declared in globals.css as `--color-cat-<slug>`, so this stays a pure string
 * build rather than a second lookup table that could drift from the first.
 */
export function categoryAccent(category: CategorySlug): string {
  return `var(--color-cat-${category})`;
}
