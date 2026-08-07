'use client';

import { useMemo, useState } from 'react';
import { ResetButton, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber } from '@/lib/format';

/**
 * Reading rate from Brysbaert (2019), a meta-analysis of 190 studies: 238 words
 * per minute for silent reading of English non-fiction. Speaking rate is 130,
 * a typical measured pace for prepared delivery to an audience.
 *
 * Both are averages with wide spreads, which the page body says plainly rather
 * than presenting the output as precise.
 */
const READING_WPM = 238;
const SPEAKING_WPM = 130;

/**
 * Words the frequency list ignores. Deliberately short: the aim is to surface
 * what a piece of writing is about, and an aggressive stopword list starts
 * discarding terms that carry real meaning in a specific domain.
 */
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'of', 'to', 'in', 'on', 'at', 'for',
  'with', 'from', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'it', 'its', 'this', 'that', 'these', 'those', 'you', 'your', 'we', 'our', 'they',
  'their', 'he', 'she', 'his', 'her', 'i', 'not', 'no', 'so', 'than', 'then',
  'there', 'here', 'can', 'will', 'would', 'should', 'could', 'do', 'does', 'did',
  'have', 'has', 'had', 'what', 'which', 'who', 'when', 'where', 'how', 'all',
  'any', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'up',
  'out', 'about', 'into', 'over', 'also', 'because', 'while',
]);

/**
 * Counts user-perceived characters, not UTF-16 code units.
 *
 * `"héllo".length` and `"👍".length` both lie: the first can be 5 or 6 depending
 * on whether the accent is composed, and the second is 2. Intl.Segmenter walks
 * grapheme clusters per UAX #29, which is what a reader would call a character.
 * The spread fallback at least counts code points rather than code units.
 */
function countCharacters(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    let count = 0;
    for (const _ of segmenter.segment(text)) count += 1;
    return count;
  }
  return [...text].length;
}

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();

    // A word is a run of non-whitespace. This keeps "state-of-the-art" as one
    // word, which matches Word and Google Docs; tools that split on the hyphen
    // report four. Neither is wrong, but the rule has to be stated.
    const words = trimmed === '' ? [] : trimmed.split(/\s+/);

    const sentences =
      trimmed === '' ? 0 : (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [trimmed]).length;

    const paragraphs =
      trimmed === '' ? 0 : trimmed.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;

    const charsWithSpaces = countCharacters(text);
    const charsNoSpaces = countCharacters(text.replace(/\s/g, ''));

    const frequency = new Map<string, number>();
    for (const raw of words) {
      const word = raw.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '');
      if (word.length < 3 || STOPWORDS.has(word)) continue;
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }

    const top = [...frequency.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6);

    const readingSeconds = Math.round((words.length / READING_WPM) * 60);
    const speakingSeconds = Math.round((words.length / SPEAKING_WPM) * 60);

    return {
      words: words.length,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      avgWordLength: words.length === 0 ? 0 : charsNoSpaces / words.length,
      avgSentenceLength: sentences === 0 ? 0 : words.length / sentences,
      readingSeconds,
      speakingSeconds,
      top,
    };
  }, [text]);

  return (
    <CalculatorPanel>
      <label htmlFor="text-input" className="block text-sm font-medium text-ink-800">
        Your text
      </label>
      <textarea
        id="text-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={10}
        placeholder="Start typing or paste your text here. Nothing is sent anywhere — counting happens in your browser."
        className="mt-1.5 w-full resize-y rounded-lg border border-ink-300 bg-panel-2 px-3.5 py-2.5 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-brand-500"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Words" value={formatNumber(stats.words)} emphasis />
        <Stat label="Characters" value={formatNumber(stats.charsWithSpaces)} emphasis />
        <Stat label="Sentences" value={formatNumber(stats.sentences)} />
        <Stat label="Paragraphs" value={formatNumber(stats.paragraphs)} />
      </div>

      <div className="mt-6">
        <ResultRows
          rows={[
            {
              label: 'Characters without spaces',
              value: formatNumber(stats.charsNoSpaces),
            },
            { label: 'Reading time', value: duration(stats.readingSeconds) },
            { label: 'Speaking time', value: duration(stats.speakingSeconds) },
            {
              label: 'Average word length',
              value: `${stats.avgWordLength.toFixed(1)} characters`,
            },
            {
              label: 'Average sentence length',
              value: `${stats.avgSentenceLength.toFixed(1)} words`,
            },
          ]}
        />
      </div>

      {stats.top.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-600">
            Most frequent terms
            <span className="ml-1.5 font-normal text-ink-500">
              (common words excluded)
            </span>
          </p>
          <ResultRows
            rows={stats.top.map(([word, count]) => ({
              label: word,
              value: `${count}× · ${((count / Math.max(stats.words, 1)) * 100).toFixed(1)}%`,
            }))}
          />
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={() => setText('')} />
      </div>
    </CalculatorPanel>
  );
}

function Stat({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    // `polite` so a screen reader hears the running total without the
    // announcement interrupting every keystroke.
    <div aria-live="polite" className="rounded-xl border border-line bg-ink-50 px-4 py-3">
      <p className="text-xs font-medium text-ink-600">{label}</p>
      <p
        className={`mt-0.5 tabular-nums ${
          emphasis ? 'text-2xl font-bold text-ink-900' : 'text-2xl font-semibold text-ink-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function duration(seconds: number): string {
  if (seconds === 0) return '0 sec';
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} sec`;
}
