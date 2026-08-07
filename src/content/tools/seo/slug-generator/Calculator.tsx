'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultRows, SelectField } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const SEPARATOR_OPTIONS = [
  { value: '-', label: 'Hyphen (-) — recommended by Google' },
  { value: '_', label: 'Underscore (_)' },
];

const LENGTH_OPTIONS = [
  { value: '0', label: 'No limit' },
  { value: '40', label: 'Trim to 40 characters' },
  { value: '60', label: 'Trim to 60 characters' },
  { value: '80', label: 'Trim to 80 characters' },
];

const STOP_WORD_OPTIONS = [
  { value: 'keep', label: 'Keep every word' },
  { value: 'strip', label: 'Remove common stop words' },
];

/**
 * Deliberately short. An aggressive stop-word list destroys meaning — "the
 * who" and "who" are different bands, "war of the worlds" reads worse as "war
 * worlds" — so this covers only articles, the most common prepositions and
 * conjunctions, and stops there.
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'in', 'is',
  'it', 'of', 'on', 'or', 'that', 'the', 'to', 'was', 'were', 'will', 'with',
]);

/**
 * Characters that NFD does not decompose, because they are distinct letters
 * rather than a base letter plus a mark. Stripping combining marks turns "é"
 * into "e" for free but leaves "ß", "ø" and "æ" untouched, so they need an
 * explicit map or they would be dropped entirely by the filter below.
 */
const TRANSLITERATIONS: Record<string, string> = {
  'ß': 'ss', 'æ': 'ae', 'Æ': 'ae', 'œ': 'oe', 'Œ': 'oe', 'ø': 'o', 'Ø': 'o',
  'đ': 'd', 'Đ': 'd', 'ð': 'd', 'Ð': 'd', 'þ': 'th', 'Þ': 'th', 'ł': 'l', 'Ł': 'l',
  'ı': 'i', 'ŋ': 'n',
  '&': ' and ', '@': ' at ', '€': ' eur ', '£': ' gbp ', '$': ' usd ', '%': ' percent ',
};

function slugify(
  input: string,
  { separator, stripStopWords, maxLength }: {
    separator: string;
    stripStopWords: boolean;
    maxLength: number;
  },
): string {
  // Expand the letters NFD cannot handle before normalising, so "straße"
  // becomes "strasse" rather than "strae".
  let text = input.replace(
    /[ßæÆœŒøØđĐðÐþÞłŁıŋ&@€£$%]/g,
    (char) => TRANSLITERATIONS[char] ?? char,
  );

  // NFD splits an accented letter into base + combining mark; the replace then
  // strips the marks, leaving the base letter. The range is the combining
  // diacritical marks block, U+0300 to U+036F.
  text = text.normalize('NFD').replace(/[̀-ͯ]/g, '');

  text = text.toLowerCase();

  let words = text
    .split(/[^a-z0-9]+/)
    .filter((word) => word !== '');

  if (stripStopWords) {
    const kept = words.filter((word) => !STOP_WORDS.has(word));
    // Never return an empty slug because every word happened to be a stop
    // word — "The Who" would vanish entirely.
    if (kept.length > 0) words = kept;
  }

  let slug = words.join(separator);

  if (maxLength > 0 && slug.length > maxLength) {
    // Trim at a word boundary rather than mid-word, so a truncated slug still
    // reads as words.
    const cut = slug.slice(0, maxLength);
    const lastBreak = cut.lastIndexOf(separator);
    slug = lastBreak > 0 ? cut.slice(0, lastBreak) : cut;
  }

  return slug;
}

export default function SlugGenerator() {
  const [text, setText] = useState('The 10 Best Cafés in Zürich — A Complete Guide!');
  const [separator, setSeparator] = useState('-');
  const [stopWords, setStopWords] = useState('keep');
  const [maxLength, setMaxLength] = useState('0');

  const result = useMemo(() => {
    const slug = slugify(text, {
      separator,
      stripStopWords: stopWords === 'strip',
      maxLength: Number(maxLength),
    });

    const full = slugify(text, {
      separator,
      stripStopWords: stopWords === 'strip',
      maxLength: 0,
    });

    return {
      slug,
      words: slug === '' ? 0 : slug.split(separator).length,
      truncated: slug !== full,
      // Anything outside the RFC 3986 unreserved set would have to be
      // percent-encoded, so confirming none survived is a real check rather
      // than decoration.
      safe: /^[a-z0-9]+([-_][a-z0-9]+)*$/.test(slug) || slug === '',
    };
  }, [text, separator, stopWords, maxLength]);

  return (
    <CalculatorPanel label="Input · your title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor="slug-input" className="text-sm font-semibold text-ink-800">
          Title or heading
        </label>
        <ResetButton onClick={() => setText('')} />
      </div>

      <textarea
        id="slug-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        placeholder="Paste a page title here"
        className="mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
      />

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <SelectField
          label="Word separator"
          value={separator}
          onChange={setSeparator}
          options={SEPARATOR_OPTIONS}
        />
        <SelectField
          label="Stop words"
          value={stopWords}
          onChange={setStopWords}
          options={STOP_WORD_OPTIONS}
        />
        <SelectField
          label="Length"
          value={maxLength}
          onChange={setMaxLength}
          options={LENGTH_OPTIONS}
        />
      </div>

      {result.slug !== '' && (
        <div className="mt-7 space-y-4">
          <div
            aria-live="polite"
            className="rounded-card border border-line bg-surface p-5 sm:p-7"
          >
            <p className="eyebrow eyebrow-muted">Your slug</p>
            <p className="numeric mt-3 break-all text-2xl font-bold text-ink-900">
              {result.slug}
            </p>
            <p className="mt-4 break-all text-sm text-ink-500">
              https://example.com/<span className="text-ink-800">{result.slug}</span>
            </p>
          </div>

          <ResultRows
            rows={[
              { label: 'Characters', value: formatNumber(result.slug.length), emphasis: true },
              { label: 'Words', value: formatNumber(result.words) },
              {
                label: 'Safe without percent-encoding',
                value: result.safe ? 'Yes' : 'No',
              },
              ...(result.truncated
                ? [{ label: 'Trimmed to fit', value: `${maxLength} character cap` }]
                : []),
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Accented letters were transliterated to their base forms, punctuation removed,
            and everything lowercased. RFC 3986 allows letters, digits, hyphen, period,
            underscore and tilde unencoded; sticking to letters, digits and hyphens avoids
            every ambiguity at once.
          </p>
        </div>
      )}

      {text.trim() !== '' && result.slug === '' && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Nothing survived the conversion — the text contains no Latin letters or digits.
          A non-Latin title needs transliterating by hand, or a decision to publish the
          slug in its own script.
        </p>
      )}
    </CalculatorPanel>
  );
}
