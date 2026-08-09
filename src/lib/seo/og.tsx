import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import type { CategorySlug } from '@/lib/tools/types';

/**
 * Shared renderer for the file-convention Open Graph images.
 *
 * Every page had every OG tag except the image, so a share on Slack, LinkedIn
 * or X rendered as a bare text card. These are generated at build time from the
 * registry, so a new tool gets a card without anyone drawing one.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Accents duplicated from globals.css as hex.
 *
 * Satori, which renders these, does not parse `oklch()` or resolve CSS custom
 * properties — it never sees the stylesheet. These are the same eight colours
 * converted to sRGB. If a category accent changes in globals.css, change it
 * here too; there is no way to derive one from the other at build time.
 */
const ACCENTS: Record<CategorySlug, string> = {
  finance: '#007b43',
  health: '#bd1f44',
  math: '#0065d2',
  conversion: '#007979',
  'date-time': '#773ac1',
  developer: '#355dc6',
  seo: '#975800',
  lifestyle: '#b63325',
};

interface OgCardInput {
  /** The large line. Kept short — a long tool name wraps to three lines badly. */
  title: string;
  /** One line of context under the title. */
  subtitle: string;
  /** Small label above the title. */
  eyebrow: string;
  category?: CategorySlug;
}

export function ogCard({ title, subtitle, eyebrow, category }: OgCardInput) {
  const accent = category ? ACCENTS[category] : '#355dc6';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#f6f6f4',
          padding: '72px 80px',
          // The same white-card-on-grey relationship the site is built from,
          // with the category accent as the only chroma.
          borderTop: `16px solid ${accent}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: title.length > 34 ? 66 : 82,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: -2,
              color: '#16161a',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: '#54545c',
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#54545c',
          }}
        >
          <div style={{ display: 'flex', fontWeight: 700, color: '#16161a' }}>
            {site.url.replace('https://', '')}
          </div>
          <div style={{ display: 'flex' }}>{site.tagline}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

/**
 * Trims a description to what fits the card without running into the footer.
 *
 * The limit is set above the longest `shortDescription` in the registry (167
 * characters) so in practice nothing is cut at all — truncating mid-clause was
 * losing the interesting half of the sentence, which is the opposite of what a
 * share card is for. It stays as a guard against a future entry that runs long.
 */
export function ogSubtitle(text: string, limit = 175): string {
  if (text.length <= limit) return text;
  const window = text.slice(0, limit);
  const sentenceEnd = window.lastIndexOf('. ');
  if (sentenceEnd > limit * 0.5) return window.slice(0, sentenceEnd + 1);
  return `${window.slice(0, window.lastIndexOf(' '))}…`;
}
