'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

/**
 * The GSM 03.38 basic alphabet, plus the extension set.
 *
 * It matters because a message containing only these characters is sent as
 * 7-bit and fits 160 per part; one character outside it switches the entire
 * message to UCS-2 and drops the limit to 70. A curly quote pasted from a word
 * processor is the usual culprit, and it more than doubles the cost of a bulk
 * send without changing anything visible.
 */
const GSM_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';

/** Each of these costs two septets rather than one. */
const GSM_EXTENDED = '^{}\\[~]|€';

const GSM_BASIC_SET = new Set(GSM_BASIC);
const GSM_EXTENDED_SET = new Set(GSM_EXTENDED);

function gsmSeptets(text: string): number | null {
  let septets = 0;
  for (const char of text) {
    if (GSM_BASIC_SET.has(char)) septets += 1;
    else if (GSM_EXTENDED_SET.has(char)) septets += 2;
    else return null; // Outside GSM-7 entirely — the message becomes UCS-2.
  }
  return septets;
}

/**
 * Grapheme clusters via Intl.Segmenter — the count that matches what a reader
 * sees and what backspace deletes.
 *
 * Falls back to code points where Segmenter is unavailable. The fallback
 * over-counts combined emoji, which is exactly the case Segmenter exists to
 * handle, so the UI labels the figure rather than pretending the two are
 * interchangeable.
 */
function countGraphemes(text: string): { count: number; exact: boolean } {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return { count: [...segmenter.segment(text)].length, exact: true };
  }
  return { count: Array.from(text).length, exact: false };
}

interface Limit {
  label: string;
  max: number;
  /** Which of the counts this platform actually applies. */
  basis: 'codepoints' | 'units';
}

const LIMITS: Limit[] = [
  { label: 'X / Twitter post', max: 280, basis: 'codepoints' },
  { label: 'SEO title (rule of thumb)', max: 60, basis: 'codepoints' },
  { label: 'Meta description (rule of thumb)', max: 155, basis: 'codepoints' },
  { label: 'Single SMS (7-bit)', max: 160, basis: 'codepoints' },
];

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const units = text.length;
    const codePoints = Array.from(text).length;
    const graphemes = countGraphemes(text);
    const withoutSpaces = Array.from(text.replace(/\s/g, '')).length;
    const bytes = new TextEncoder().encode(text).length;

    const septets = gsmSeptets(text);
    const smsLimit = septets === null ? 70 : 160;
    const smsUsed = septets ?? codePoints;

    // A concatenated SMS spends part of each segment on a header identifying
    // the sequence, so multipart messages hold 153 septets (or 67 UCS-2
    // characters) each rather than the full single-message limit. Dividing by
    // the single-message limit understates the part count on long sends, which
    // is exactly where the cost is.
    const perPart = septets === null ? 67 : 153;
    const smsParts =
      smsUsed === 0 ? 0 : smsUsed <= smsLimit ? 1 : Math.ceil(smsUsed / perPart);

    return {
      units,
      codePoints,
      graphemes: graphemes.count,
      graphemesExact: graphemes.exact,
      withoutSpaces,
      bytes,
      lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
      // A wide gap between what you see and what a platform counts is the
      // single most useful thing this page can surface.
      hiddenCost: codePoints - graphemes.count,
      septets,
      smsLimit,
      smsUsed,
      smsParts,
      perPart,
    };
  }, [text]);

  return (
    <CalculatorPanel label="Input · your text">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="char-input" className="text-sm font-semibold text-ink-800">
          Your text
        </label>
        <ResetButton onClick={() => setText('')} />
      </div>

      <textarea
        id="char-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Type or paste here. Nothing is sent anywhere — counting happens in your browser."
        className="mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
      />

      <div className="mt-7 space-y-4">
        <ResultCard
          label="Characters (including spaces)"
          value={formatNumber(stats.codePoints)}
          verdict={`${formatNumber(stats.withoutSpaces)} without spaces · ${formatNumber(
            stats.bytes,
          )} bytes in UTF-8`}
        />

        <ResultRows
          rows={[
            {
              label: `Grapheme clusters — what you see${
                stats.graphemesExact ? '' : ' (approximate on this browser)'
              }`,
              value: formatNumber(stats.graphemes),
              emphasis: true,
            },
            { label: 'Unicode code points', value: formatNumber(stats.codePoints) },
            {
              label: 'UTF-16 code units (JavaScript length)',
              value: formatNumber(stats.units),
            },
            { label: 'UTF-8 bytes', value: formatNumber(stats.bytes) },
            { label: 'Characters excluding whitespace', value: formatNumber(stats.withoutSpaces) },
            { label: 'Lines', value: formatNumber(stats.lines) },
          ]}
        />

        {stats.hiddenCost > 0 && (
          <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-900">
              {formatNumber(stats.hiddenCost)} more code points than visible characters
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-900">
              Your text contains emoji or combining marks that are built from several code
              points each. You see {formatNumber(stats.graphemes)} characters; a platform
              counting code points sees {formatNumber(stats.codePoints)}. Near a limit,
              that difference is what makes a post that looks short get rejected.
            </p>
          </div>
        )}

        <div>
          <p className="eyebrow eyebrow-muted mb-3">Against common limits</p>
          <div className="space-y-2.5">
            {LIMITS.map((limit) => {
              const used = limit.basis === 'units' ? stats.units : stats.codePoints;
              const pct = Math.min((used / limit.max) * 100, 100);
              const over = used > limit.max;
              return (
                <div key={limit.label} className="rounded-control border border-line bg-panel p-3.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-ink-800">{limit.label}</span>
                    <span
                      className={`numeric text-sm font-bold ${
                        over ? 'text-red-600' : 'text-ink-900'
                      }`}
                    >
                      {formatNumber(used)} / {formatNumber(limit.max)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-2">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        over ? 'bg-red-500' : 'bg-brand-solid'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {text !== '' && (
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="eyebrow eyebrow-muted">SMS encoding</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {stats.septets === null ? (
                <>
                  This text contains at least one character outside the GSM 7-bit alphabet,
                  so the whole message is sent as UCS-2 and the limit drops from 160 to{' '}
                  <strong>70</strong> characters per part. It currently needs{' '}
                  <strong>{formatNumber(stats.smsParts)}</strong>{' '}
                  {stats.smsParts === 1 ? 'part' : 'parts'}. Replacing curly quotes, dashes
                  and emoji with plain ASCII would put it back on the 160-character limit.
                </>
              ) : (
                <>
                  Every character is in the GSM 7-bit alphabet, so this sends at 160
                  characters in a single message — currently{' '}
                  <strong>{formatNumber(stats.smsParts)}</strong>{' '}
                  {stats.smsParts === 1 ? 'part' : 'parts'} using{' '}
                  {formatNumber(stats.smsUsed)} septets.
                </>
              )}
              {stats.smsParts > 1 && (
                <>
                  {' '}
                  Concatenated messages spend part of each segment on a sequence header, so
                  they hold {formatNumber(stats.perPart)} rather than{' '}
                  {formatNumber(stats.smsLimit)} each.
                </>
              )}
            </p>
          </div>
        )}

        <p className="text-sm leading-relaxed text-ink-500">
          The SEO figures are conventions, not rules. Google states there is no character
          limit on a title element or a meta description — results are truncated to fit the
          device width, so a title of narrow letters survives longer than one of capitals.
          Treat 60 and 155 as guides and check how the result actually renders.
        </p>
      </div>
    </CalculatorPanel>
  );
}
