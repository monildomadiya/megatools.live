'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const FIELD =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

/**
 * Accepts whatever a reader is likely to paste: commas, spaces, newlines, tabs
 * or semicolons between values. Anything that is not a finite number is
 * dropped rather than failing the whole input, because a trailing comma or a
 * stray label at the top of a pasted column should not empty the results.
 */
function parseList(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token !== '')
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

function median(sorted: number[]): number {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  // Even counts have no middle element, so the median is the midpoint of the
  // two that straddle the centre.
  return n % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

function modes(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);

  const highest = Math.max(...counts.values());
  // Every value appearing once is "no mode", not "all of them are modes".
  if (highest <= 1) return [];

  return [...counts.entries()]
    .filter(([, count]) => count === highest)
    .map(([value]) => value)
    .sort((a, b) => a - b);
}

export default function AverageCalculator() {
  const [input, setInput] = useState('12, 15, 15, 18, 24, 31, 47');
  const [weightsInput, setWeightsInput] = useState('');

  const result = useMemo(() => {
    const values = parseList(input);
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const n = values.length;
    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / n;

    const squaredDeviations = values.reduce(
      (total, value) => total + (value - mean) ** 2,
      0,
    );
    const populationVariance = squaredDeviations / n;
    // Bessel's correction is undefined for a single observation — there is no
    // spread to estimate from one number.
    const sampleVariance = n > 1 ? squaredDeviations / (n - 1) : null;

    const allPositive = values.every((value) => value > 0);
    const geometric = allPositive
      ? Math.exp(values.reduce((total, value) => total + Math.log(value), 0) / n)
      : null;
    const harmonic = allPositive
      ? n / values.reduce((total, value) => total + 1 / value, 0)
      : null;

    const weights = parseList(weightsInput);
    let weighted: number | null = null;
    let weightMismatch = false;

    if (weights.length > 0) {
      if (weights.length !== n) {
        weightMismatch = true;
      } else {
        const weightSum = weights.reduce((total, weight) => total + weight, 0);
        if (weightSum !== 0) {
          weighted =
            values.reduce((total, value, i) => total + value * weights[i]!, 0) / weightSum;
        }
      }
    }

    const modeValues = modes(values);

    return {
      n,
      sum,
      mean,
      median: median(sorted),
      modeValues,
      min: sorted[0]!,
      max: sorted[n - 1]!,
      range: sorted[n - 1]! - sorted[0]!,
      populationSd: Math.sqrt(populationVariance),
      sampleSd: sampleVariance === null ? null : Math.sqrt(sampleVariance),
      geometric,
      harmonic,
      weighted,
      weightMismatch,
      weightCount: weights.length,
      // A large gap between mean and median is the single most useful diagnostic
      // this page can offer, so it is computed rather than left to the reader.
      skewed: Math.abs(mean - median(sorted)) > Math.sqrt(populationVariance) * 0.5,
    };
  }, [input, weightsInput]);

  function reset() {
    setInput('');
    setWeightsInput('');
  }

  const num = (value: number) => formatNumber(value, 4).replace(/\.?0+$/, '');

  return (
    <CalculatorPanel label="Input · your numbers">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Separate values with commas, spaces or new lines.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5">
        <label htmlFor="values-input" className="block text-sm font-semibold text-ink-800">
          Numbers
        </label>
        <textarea
          id="values-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={5}
          placeholder="12, 15, 15, 18, 24, 31, 47"
          className={`numeric ${FIELD}`}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="weights-input"
          className="block text-sm font-semibold text-ink-800"
        >
          Weights (optional)
        </label>
        <textarea
          id="weights-input"
          value={weightsInput}
          onChange={(event) => setWeightsInput(event.target.value)}
          rows={2}
          placeholder="Leave empty for a plain mean. One weight per number, in the same order."
          className={`numeric ${FIELD}`}
        />
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Use weights when the values represent groups of different sizes — credit hours
          per course, amount invested per holding, population per region.
        </p>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Arithmetic mean"
            value={num(result.mean)}
            verdict={`${formatNumber(result.n)} values · sum ${num(result.sum)}`}
          />

          <ResultRows
            rows={[
              { label: 'Median', value: num(result.median), emphasis: true },
              {
                label: 'Mode',
                value:
                  result.modeValues.length === 0
                    ? 'No mode — every value appears once'
                    : result.modeValues.map(num).join(', '),
              },
              { label: 'Range', value: num(result.range) },
              { label: 'Minimum', value: num(result.min) },
              { label: 'Maximum', value: num(result.max) },
              {
                label: 'Standard deviation (sample, n−1)',
                value: result.sampleSd === null ? '—' : num(result.sampleSd),
              },
              {
                label: 'Standard deviation (population, n)',
                value: num(result.populationSd),
              },
              {
                label: 'Geometric mean',
                value:
                  result.geometric === null
                    ? 'Needs all values positive'
                    : num(result.geometric),
              },
              {
                label: 'Harmonic mean',
                value:
                  result.harmonic === null
                    ? 'Needs all values positive'
                    : num(result.harmonic),
              },
            ]}
          />

          {result.weighted !== null && (
            <ResultCard
              label="Weighted mean"
              value={num(result.weighted)}
              verdict={`Weighted by ${formatNumber(result.weightCount)} values`}
              tone="good"
            />
          )}

          {result.weightMismatch && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                {formatNumber(result.weightCount)} weights for{' '}
                {formatNumber(result.n)} numbers
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                A weighted mean needs exactly one weight per value, in the same order.
                Clear the weights field to fall back to the plain mean.
              </p>
            </div>
          )}

          {result.skewed && (
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="eyebrow eyebrow-muted">Mean and median disagree</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                The mean is {num(result.mean)} and the median is {num(result.median)}. A
                gap that size relative to the spread means the data is skewed — the mean is
                being pulled by values at{' '}
                {result.mean > result.median ? 'the high end' : 'the low end'}. For a
                summary of what a typical value looks like, the median is the more honest
                figure here.
              </p>
            </div>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
