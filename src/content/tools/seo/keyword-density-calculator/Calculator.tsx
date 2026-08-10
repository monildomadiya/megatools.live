'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultCard, ResultRows, SelectField } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const CONTROL =
  'mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

const LABEL = 'block text-sm font-semibold text-ink-800';

/**
 * Kept deliberately short, for the same reason the word counter's list is: an
 * aggressive stoplist starts discarding terms that carry real meaning in a
 * specific domain. These are excluded from the single-word frequency list only
 * — they stay in the denominator, because they are part of the text.
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

const PHRASE_LENGTHS = [
  { value: '1', label: 'Single words' },
  { value: '2', label: 'Two-word phrases' },
  { value: '3', label: 'Three-word phrases' },
];

/** Lowercased words with punctuation stripped, apostrophes and hyphens kept. */
function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((raw) => raw.replace(/[^\p{L}\p{N}'-]/gu, ''))
    .filter((word) => word !== '');
}

export default function KeywordDensityCalculator() {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const [size, setSize] = useState('1');

  const stats = useMemo(() => {
    const words = tokenise(text);
    const total = words.length;
    if (total === 0) return null;

    const n = Number(size);
    const counts = new Map<string, number>();

    for (let i = 0; i + n <= words.length; i += 1) {
      const gram = words.slice(i, i + n);
      // Single words drop stopwords entirely; phrases only drop the ones that
      // start or end with a stopword, since "rate of return" is a real phrase
      // and "of the" is not.
      if (n === 1) {
        if (STOPWORDS.has(gram[0]!) || gram[0]!.length < 3) continue;
      } else if (STOPWORDS.has(gram[0]!) || STOPWORDS.has(gram[n - 1]!)) {
        continue;
      }
      const key = gram.join(' ');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    const ranked = [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 12);

    // The target phrase is matched as a contiguous run of tokens, so "keyword
    // density" matches the phrase and not the two words used apart.
    const targetWords = tokenise(target);
    let targetCount = 0;
    if (targetWords.length > 0) {
      for (let i = 0; i + targetWords.length <= words.length; i += 1) {
        if (targetWords.every((word, offset) => words[i + offset] === word)) targetCount += 1;
      }
    }

    return {
      total,
      unique: new Set(words).size,
      ranked,
      targetWords,
      targetCount,
      targetDensity: (targetCount / total) * 100,
      topDensity: ranked.length > 0 ? (ranked[0]![1] / total) * 100 : 0,
    };
  }, [text, target, size]);

  function reset() {
    setText('');
    setTarget('');
    setSize('1');
  }

  const density = (count: number, total: number) => `${((count / total) * 100).toFixed(2)}%`;

  const verdict =
    stats === null
      ? null
      : stats.topDensity >= 6
        ? { label: 'Very repetitive — read it aloud', tone: 'bad' as const }
        : stats.topDensity >= 3.5
          ? { label: 'Repetitive for a single term', tone: 'warn' as const }
          : { label: 'Nothing dominating the text', tone: 'good' as const };

  return (
    <CalculatorPanel label="Text · frequency analysis">
      <div>
        <label htmlFor="density-text" className={LABEL}>
          Your text
        </label>
        <textarea
          id="density-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={10}
          placeholder="Paste the page copy here. Nothing is uploaded — the counting runs in your browser."
          className={`${CONTROL} resize-y leading-relaxed`}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="target-phrase" className={LABEL}>
            Target keyword or phrase (optional)
          </label>
          <input
            id="target-phrase"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="keyword density"
            autoComplete="off"
            className={CONTROL}
          />
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Matched as a contiguous phrase, so the words used apart do not count.
          </p>
        </div>

        <SelectField
          label="Count"
          value={size}
          onChange={setSize}
          options={PHRASE_LENGTHS}
          hint="Two and three-word groupings show what a page is about far better than single words do."
        />
      </div>

      {stats && verdict && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Total words"
            value={formatNumber(stats.total)}
            verdict={verdict.label}
            tone={verdict.tone}
          />

          {stats.targetWords.length > 0 && (
            <ResultRows
              rows={[
                {
                  label: `“${stats.targetWords.join(' ')}” occurrences`,
                  value: `${stats.targetCount}×`,
                  emphasis: true,
                },
                {
                  label: 'Density of that phrase',
                  value: `${stats.targetDensity.toFixed(2)}%`,
                  emphasis: true,
                },
                {
                  label: 'Words between occurrences, on average',
                  value:
                    stats.targetCount > 0
                      ? `${Math.round(stats.total / stats.targetCount)} words`
                      : '—',
                },
              ]}
            />
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Most frequent {Number(size) === 1 ? 'terms' : `${size}-word phrases`}
              <span className="ml-1.5 font-normal text-ink-500">
                (density is a share of all {formatNumber(stats.total)} words)
              </span>
            </p>
            {stats.ranked.length > 0 ? (
              <ResultRows
                rows={stats.ranked.map(([phrase, count]) => ({
                  label: phrase,
                  value: `${count}× · ${density(count, stats.total)}`,
                }))}
              />
            ) : (
              <p className="text-sm text-ink-500">
                Nothing repeated often enough to list yet.
              </p>
            )}
          </div>

          <ResultRows
            rows={[
              { label: 'Unique words', value: formatNumber(stats.unique) },
              {
                label: 'Vocabulary variety',
                value: `${((stats.unique / stats.total) * 100).toFixed(1)}% unique`,
              },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Density is a share of every word in the text, stop words included. No search
            engine publishes a target figure — use this to catch repetition you did not
            intend, not to hit a number.
          </p>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
