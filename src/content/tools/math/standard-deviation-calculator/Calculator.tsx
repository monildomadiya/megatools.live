'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const FIELD =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

/** Same permissive parsing as the average calculator — commas, spaces, newlines. */
function parseList(input: string): number[] {
  return input
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token !== '')
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

/**
 * Quartiles by linear interpolation between order statistics — the method R
 * calls type 7 and the one Excel's QUARTILE and NumPy's percentile both use by
 * default. There are nine defensible definitions; naming which one is in play
 * matters more than the choice between them.
 */
function quantile(sorted: number[], p: number): number {
  const n = sorted.length;
  if (n === 1) return sorted[0]!;
  const position = (n - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower]!;
  return sorted[lower]! + (position - lower) * (sorted[upper]! - sorted[lower]!);
}

function present(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-4 || abs >= 1e9)) return value.toExponential(4);
  return formatNumber(value, abs >= 100 ? 2 : 4).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

type Basis = 'sample' | 'population';

const BASIS_OPTIONS = [
  { value: 'sample' as const, label: 'Sample (n − 1)' },
  { value: 'population' as const, label: 'Population (n)' },
];

export default function StandardDeviationCalculator() {
  const [input, setInput] = useState('12, 15, 15, 18, 24, 31, 47');
  const [basis, setBasis] = useState<Basis>('sample');

  const result = useMemo(() => {
    const values = parseList(input);
    const n = values.length;
    if (n === 0) return null;

    const sum = values.reduce((total, value) => total + value, 0);
    const mean = sum / n;

    const deviations = values.map((value) => value - mean);
    const squares = deviations.map((d) => d * d);
    const sumSquares = squares.reduce((total, value) => total + value, 0);

    // Bessel's correction has nothing to divide by at n = 1: one observation
    // carries no information about spread, so the sample statistics are
    // genuinely undefined rather than zero.
    const divisor = basis === 'sample' ? n - 1 : n;
    const variance = divisor > 0 ? sumSquares / divisor : null;
    const sd = variance === null ? null : Math.sqrt(variance);

    const sorted = [...values].sort((a, b) => a - b);
    const q1 = quantile(sorted, 0.25);
    const q3 = quantile(sorted, 0.75);

    return {
      values,
      n,
      sum,
      mean,
      sumSquares,
      divisor,
      variance,
      sd,
      standardError: sd === null ? null : sd / Math.sqrt(n),
      cv: sd === null || mean === 0 ? null : (sd / Math.abs(mean)) * 100,
      min: sorted[0]!,
      max: sorted[n - 1]!,
      median: quantile(sorted, 0.5),
      q1,
      q3,
      iqr: q3 - q1,
      // Shown only for the sample basis, where n − 1 is the divisor and the
      // comparison against the population figure is the interesting one.
      otherSd:
        basis === 'sample'
          ? Math.sqrt(sumSquares / n)
          : n > 1
            ? Math.sqrt(sumSquares / (n - 1))
            : null,
      // First few deviation rows, to show the working rather than assert it.
      workings: values.slice(0, 8).map((value, index) => ({
        value,
        deviation: deviations[index]!,
        square: squares[index]!,
      })),
      truncated: n > 8,
    };
  }, [input, basis]);

  const withinOne = useMemo(() => {
    if (!result || result.sd === null || result.sd === 0) return null;
    const count = result.values.filter(
      (v) => Math.abs(v - result.mean) <= result.sd!,
    ).length;
    return (count / result.n) * 100;
  }, [result]);

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Which formula"
          value={basis}
          onChange={setBasis}
          options={BASIS_OPTIONS}
        />
        <ResetButton onClick={() => setInput('')} />
      </div>

      <label htmlFor="sd-input" className="mt-6 block text-sm font-semibold text-ink-800">
        Your numbers
      </label>
      <textarea
        id="sd-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={5}
        placeholder="12, 15, 15, 18, 24, 31, 47"
        className={FIELD}
      />
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Separate values with commas, spaces or line breaks — a pasted spreadsheet column
        works. Use the sample formula unless these numbers are the entire group you care
        about.
      </p>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={basis === 'sample' ? 'Sample standard deviation (s)' : 'Population standard deviation (σ)'}
            value={result.sd === null ? '—' : present(result.sd)}
            verdict={
              result.sd === null
                ? 'A single value has no spread to measure'
                : `Mean ${present(result.mean)} · n = ${result.n}`
            }
          />

          <ResultRows
            rows={[
              {
                label: basis === 'sample' ? 'Sample variance (s²)' : 'Population variance (σ²)',
                value: result.variance === null ? '—' : present(result.variance),
                emphasis: true,
              },
              { label: 'Mean', value: present(result.mean) },
              { label: 'Count (n)', value: formatNumber(result.n) },
              { label: 'Sum', value: present(result.sum) },
              {
                label: 'Standard error of the mean',
                value: result.standardError === null ? '—' : present(result.standardError),
              },
              {
                label: 'Coefficient of variation',
                value: result.cv === null ? '—' : `${present(result.cv)}%`,
              },
              {
                label:
                  basis === 'sample'
                    ? 'Population SD, for comparison'
                    : 'Sample SD, for comparison',
                value: result.otherSd === null ? '—' : present(result.otherSd),
              },
            ]}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">Spread and shape</p>
            <ResultRows
              rows={[
                { label: 'Minimum', value: present(result.min) },
                { label: 'First quartile (Q1)', value: present(result.q1) },
                { label: 'Median', value: present(result.median) },
                { label: 'Third quartile (Q3)', value: present(result.q3) },
                { label: 'Maximum', value: present(result.max) },
                { label: 'Interquartile range', value: present(result.iqr), emphasis: true },
                { label: 'Range', value: present(result.max - result.min) },
                ...(withinOne !== null
                  ? [
                      {
                        label: 'Values within 1 SD of the mean',
                        value: `${present(withinOne)}% (normal data: ~68%)`,
                      },
                    ]
                  : []),
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              The working, step by step
            </p>
            <div className="overflow-x-auto rounded-card border border-line bg-panel">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-600">
                    <th scope="col" className="px-4 py-2.5 font-medium">Value (x)</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">x − mean</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">(x − mean)²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {result.workings.map((row, index) => (
                    <tr key={index}>
                      <td className="numeric px-4 py-2.5 text-ink-800">{present(row.value)}</td>
                      <td className="numeric px-4 py-2.5 text-ink-800">{present(row.deviation)}</td>
                      <td className="numeric px-4 py-2.5 text-ink-800">{present(row.square)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              {result.truncated && `First 8 of ${result.n} values shown. `}
              Sum of squared deviations = {present(result.sumSquares)}, divided by{' '}
              {result.divisor} gives the variance, and its square root is the standard
              deviation.
            </p>
          </div>
        </div>
      )}
    </CalculatorPanel>
  );
}
