'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { NumberField, ResetButton, ResultCard } from '@/components/tool/fields';
import { formatNumber, parseNumber } from '@/lib/format';

type Mode = 'percentOf' | 'isWhatPercent' | 'change' | 'addSubtract';

const MODES: { value: Mode; tab: string }[] = [
  { value: 'percentOf', tab: '% of a number' },
  { value: 'isWhatPercent', tab: 'X is what % of Y' },
  { value: 'change', tab: '% change' },
  { value: 'addSubtract', tab: 'Add / subtract %' },
];

/** Trims trailing zeros so 36.00 shows as 36 but 9.09 keeps its precision. */
function tidy(value: number): string {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1e6) / 1e6;
  return formatNumber(rounded, Number.isInteger(rounded) ? 0 : 2);
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('percentOf');
  const [a, setA] = useState('15');
  const [b, setB] = useState('240');

  const result = useMemo(() => {
    const x = parseNumber(a);
    const y = parseNumber(b);
    if (x === null || y === null) return null;

    switch (mode) {
      case 'percentOf':
        return {
          label: `${tidy(x)}% of ${tidy(y)}`,
          value: tidy((x / 100) * y),
          working: `(${tidy(x)} ÷ 100) × ${tidy(y)} = ${tidy((x / 100) * y)}`,
        };

      case 'isWhatPercent': {
        if (y === 0) {
          return {
            label: 'Undefined',
            value: '—',
            working: 'A number cannot be expressed as a percentage of zero.',
          };
        }
        return {
          label: `${tidy(x)} as a percentage of ${tidy(y)}`,
          value: `${tidy((x / y) * 100)}%`,
          working: `(${tidy(x)} ÷ ${tidy(y)}) × 100 = ${tidy((x / y) * 100)}%`,
        };
      }

      case 'change': {
        if (x === 0) {
          return {
            label: 'Undefined',
            value: '—',
            working:
              'Percentage change divides by the starting value, so it is undefined when the starting value is zero.',
          };
        }
        const change = ((y - x) / x) * 100;
        return {
          label: `Change from ${tidy(x)} to ${tidy(y)}`,
          value: `${change > 0 ? '+' : ''}${tidy(change)}%`,
          working: `((${tidy(y)} − ${tidy(x)}) ÷ ${tidy(x)}) × 100 = ${tidy(change)}%`,
        };
      }

      case 'addSubtract': {
        const increased = x * (1 + y / 100);
        const decreased = x * (1 - y / 100);
        return {
          label: `${tidy(x)} with ${tidy(y)}% added`,
          value: tidy(increased),
          working: `${tidy(x)} × (1 + ${tidy(y)}/100) = ${tidy(increased)}   ·   with ${tidy(
            y,
          )}% removed: ${tidy(x)} × (1 − ${tidy(y)}/100) = ${tidy(decreased)}`,
        };
      }
    }
  }, [mode, a, b]);

  const fields: Record<Mode, { a: string; b: string; aUnit?: string; bUnit?: string }> = {
    percentOf: { a: 'Percentage', b: 'Of what number', aUnit: '%' },
    isWhatPercent: { a: 'This number', b: 'Is what percent of' },
    change: { a: 'From (starting value)', b: 'To (new value)' },
    addSubtract: { a: 'Starting number', b: 'Percentage to add or remove', bUnit: '%' },
  };

  const active = fields[mode];

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Calculation type" className="flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              role="tab"
              aria-selected={mode === m.value}
              onClick={() => setMode(m.value)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                mode === m.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }`}
            >
              {m.tab}
            </button>
          ))}
        </div>
        <ResetButton
          onClick={() => {
            setA('');
            setB('');
          }}
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField label={active.a} value={a} onChange={setA} unit={active.aUnit} />
        <NumberField label={active.b} value={b} onChange={setB} unit={active.bUnit} />
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard label={result.label} value={result.value} />

          <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-5">
            <p className="text-sm font-semibold text-ink-900">The working</p>
            <p className="mt-2 font-mono text-sm leading-relaxed text-ink-700">
              {result.working}
            </p>
          </div>
        </div>
      )}
    </CalculatorPanel>
  );
}
