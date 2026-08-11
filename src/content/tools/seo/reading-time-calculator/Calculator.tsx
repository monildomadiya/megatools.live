'use client';

import { useMemo, useState } from 'react';
import { ResetButton, ResultCard, ResultRows, SelectField } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber } from '@/lib/format';

/**
 * Rates with a source behind each one, rather than the round 200 that most
 * tools use and none of them cite.
 *
 * The silent figures are Brysbaert's 2019 meta-analysis of 190 studies. The
 * aloud figure is the ordinary range for comfortable delivery — faster than
 * about 160 and audience comprehension starts to fall.
 */
const RATES = [
  { value: '238', label: 'Silent, non-fiction — 238 wpm (Brysbaert 2019)' },
  { value: '260', label: 'Silent, fiction — 260 wpm (Brysbaert 2019)' },
  { value: '200', label: 'Silent, conservative — 200 wpm (the usual convention)' },
  { value: '150', label: 'Read aloud / presenting — 150 wpm' },
  { value: '130', label: 'Read aloud, deliberate — 130 wpm' },
] as const;

const SAMPLE =
  'Reading time is word count divided by reading rate. The interesting part is not the division — it is that almost every tool doing this uses two hundred words per minute, and almost none of them say where that number came from.';

/** Same counting rule as the word counter: runs of non-whitespace. */
function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}

function describe(totalSeconds: number): string {
  if (totalSeconds < 60) return `${Math.max(Math.round(totalSeconds), 1)} sec`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }
  return seconds === 0 ? `${minutes} min` : `${minutes} min ${seconds} sec`;
}

export default function ReadingTimeCalculator() {
  const [text, setText] = useState(SAMPLE);
  const [rate, setRate] = useState('238');

  const words = useMemo(() => countWords(text), [text]);
  const wpm = Number(rate);
  const seconds = wpm > 0 ? (words / wpm) * 60 : 0;

  return (
    <CalculatorPanel label="Text · reading time">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Paste your text, or type a word count straight into the field below it.
        </p>
        <ResetButton onClick={() => { setText(SAMPLE); setRate('238'); }} />
      </div>

      <div className="mt-5">
        <label htmlFor="reading-text" className="block text-sm font-semibold text-ink-800">
          Text
        </label>
        <textarea
          id="reading-text"
          rows={7}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste the article, script or speech here."
          className="mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-4 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 sm:px-5"
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="word-count" className="block text-sm font-semibold text-ink-800">
            Or enter a word count
          </label>
          <input
            id="word-count"
            type="number"
            inputMode="numeric"
            min={0}
            value={words}
            onChange={(event) => {
              // Typing a count replaces the text with that many placeholder words,
              // so the two inputs can never disagree about what is being measured.
              const target = Math.max(Math.floor(Number(event.target.value)) || 0, 0);
              setText(Array.from({ length: target }, () => 'word').join(' '));
            }}
            className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-xl font-bold text-ink-900 outline-none transition-colors focus:border-brand-500 sm:px-5"
          />
        </div>
        <SelectField
          label="Reading rate"
          value={rate}
          onChange={setRate}
          options={RATES.map((entry) => ({ value: entry.value, label: entry.label }))}
          hint="Silent rates are from a meta-analysis of 190 studies."
        />
      </div>

      {words > 0 && (
        <div className="mt-7">
          <ResultCard
            label={`${words.toLocaleString('en-US')} ${words === 1 ? 'word' : 'words'} at ${wpm} wpm`}
            value={describe(seconds)}
            verdict={`Show it as "${Math.max(Math.ceil(seconds / 60), 1)} min read"`}
          >
            <ResultRows
              rows={[
                {
                  label: 'Exact minutes',
                  value: formatNumber(seconds / 60, 2),
                  emphasis: true,
                },
                { label: 'Total seconds', value: String(Math.round(seconds)) },
                {
                  label: 'Read aloud at 150 wpm',
                  value: describe((words / 150) * 60),
                },
                {
                  label: 'Slower reader, 175 wpm',
                  value: describe((words / 175) * 60),
                },
                {
                  label: 'Faster reader, 300 wpm',
                  value: describe((words / 300) * 60),
                },
              ]}
            />
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              The last two rows are roughly the middle 95% of readers. Any single figure
              is a midpoint, not a prediction about one person — which is why a label
              should round up rather than down.
            </p>
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
