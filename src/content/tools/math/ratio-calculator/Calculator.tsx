'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import { formatNumber, parseNumber } from '@/lib/format';

type Mode = 'simplify' | 'proportion' | 'divide';

const MODE_OPTIONS = [
  { value: 'simplify' as const, label: 'Simplify a ratio' },
  { value: 'proportion' as const, label: 'Solve a proportion — a : b = c : d' },
  { value: 'divide' as const, label: 'Divide a total in a ratio' },
];

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y > 0.5) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** Decimal places in a user-typed number, so decimals can be scaled to integers. */
function decimals(value: number): number {
  if (Number.isInteger(value)) return 0;
  const text = String(value);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : Math.min(text.length - dot - 1, 6);
}

/**
 * Simplifies any number of terms to lowest whole-number terms.
 *
 * Decimals are handled by scaling every term by the same power of ten before
 * taking the GCD, rather than by trying to run Euclid on floats — 1.5:2 has to
 * become 15:20 before it can become 3:4, and doing that first keeps the whole
 * routine in integer arithmetic where the answer is exact.
 */
function simplifyTerms(terms: number[]): { simplified: number[]; divisor: number } | null {
  if (terms.some((t) => t <= 0)) return null;

  const scale = Math.pow(10, Math.max(...terms.map(decimals)));
  const scaled = terms.map((t) => Math.round(t * scale));

  const divisor = scaled.reduce((acc, value) => gcd(acc, value));
  if (divisor === 0) return null;

  return { simplified: scaled.map((value) => value / divisor), divisor };
}

export default function RatioCalculator() {
  const [mode, setMode] = useState<Mode>('simplify');

  const [a, setA] = useState('18');
  const [b, setB] = useState('24');
  const [c, setC] = useState('');

  const [pa, setPa] = useState('3');
  const [pb, setPb] = useState('4');
  const [pc, setPc] = useState('15');

  const [total, setTotal] = useState('1200');
  const [parts, setParts] = useState('2:3:7');

  const simplify = useMemo(() => {
    if (mode !== 'simplify') return null;

    const values = [parseNumber(a), parseNumber(b), parseNumber(c)];
    const terms = values.filter((v): v is number => v !== null && v > 0);
    if (terms.length < 2) return null;

    const result = simplifyTerms(terms);
    if (!result) return null;

    const sum = terms.reduce((acc, t) => acc + t, 0);

    return {
      original: terms,
      simplified: result.simplified,
      divisor: result.divisor,
      // Part-to-whole alongside part-to-part, because confusing the two is the
      // most common ratio error and showing both makes it hard to make.
      shares: terms.map((t) => (t / sum) * 100),
      decimal: terms.length === 2 ? terms[0]! / terms[1]! : null,
    };
  }, [mode, a, b, c]);

  const proportion = useMemo(() => {
    if (mode !== 'proportion') return null;

    const av = parseNumber(pa);
    const bv = parseNumber(pb);
    const cv = parseNumber(pc);
    if (av === null || bv === null || cv === null) return null;
    if (av === 0) return null;

    // a : b = c : d  →  d = (b × c) ÷ a
    return { d: (bv * cv) / av, av, bv, cv };
  }, [mode, pa, pb, pc]);

  const divide = useMemo(() => {
    if (mode !== 'divide') return null;

    const totalValue = parseNumber(total);
    if (totalValue === null) return null;

    const terms = parts
      .split(/[:\s,]+/)
      .map((token) => token.trim())
      .filter((token) => token !== '')
      .map(Number)
      .filter((value) => Number.isFinite(value) && value > 0);

    if (terms.length < 2) return null;

    const shareCount = terms.reduce((acc, t) => acc + t, 0);
    if (shareCount === 0) return null;

    const unit = totalValue / shareCount;

    return {
      terms,
      shareCount,
      unit,
      amounts: terms.map((t) => t * unit),
      total: totalValue,
    };
  }, [mode, total, parts]);

  function reset() {
    setA('');
    setB('');
    setC('');
    setPa('');
    setPb('');
    setPc('');
    setTotal('');
    setParts('');
  }

  const num = (value: number) => formatNumber(value, 4).replace(/\.?0+$/, '');

  return (
    <CalculatorPanel label="Input · ratio">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-80">
          <SelectField
            label="What do you want to do?"
            value={mode}
            onChange={setMode}
            options={MODE_OPTIONS}
          />
        </div>
        <ResetButton onClick={reset} />
      </div>

      {mode === 'simplify' && (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <NumberField label="First term" value={a} onChange={setA} placeholder="18" min={0} />
            <NumberField label="Second term" value={b} onChange={setB} placeholder="24" min={0} />
            <NumberField
              label="Third term (optional)"
              value={c}
              onChange={setC}
              placeholder="—"
              min={0}
            />
          </div>

          {simplify && (
            <div className="mt-7 space-y-4">
              <ResultCard
                label="Simplified ratio"
                value={simplify.simplified.join(' : ')}
                verdict={
                  simplify.divisor > 1
                    ? `Every term divided by ${num(simplify.divisor)}`
                    : 'Already in lowest terms'
                }
              />

              <ResultRows
                rows={[
                  { label: 'Original', value: simplify.original.map(num).join(' : ') },
                  ...(simplify.decimal !== null
                    ? [
                        {
                          label: 'As a decimal (first ÷ second)',
                          value: num(simplify.decimal),
                        },
                      ]
                    : []),
                  ...simplify.shares.map((share, i) => ({
                    label: `Term ${i + 1} as a share of the whole`,
                    value: `${formatNumber(share, 2)}%`,
                  })),
                ]}
              />

              <p className="text-sm leading-relaxed text-ink-500">
                The ratio compares the terms to <strong>each other</strong>; the
                percentages compare each term to the <strong>total</strong>. A 2:3 ratio
                is 40 percent and 60 percent, not 20 and 30 — mixing those two readings is
                the most common way ratios go wrong.
              </p>
            </div>
          )}
        </>
      )}

      {mode === 'proportion' && (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <NumberField label="a" value={pa} onChange={setPa} placeholder="3" />
            <NumberField label="b" value={pb} onChange={setPb} placeholder="4" />
            <NumberField label="c" value={pc} onChange={setPc} placeholder="15" />
          </div>
          <p className="mt-3 text-sm text-ink-500">
            Solves <span className="numeric">a : b = c : d</span> for the missing fourth
            term.
          </p>

          {proportion && (
            <div className="mt-7 space-y-4">
              <ResultCard
                label="d — the missing term"
                value={num(proportion.d)}
                verdict={`${num(proportion.av)} : ${num(proportion.bv)} = ${num(
                  proportion.cv,
                )} : ${num(proportion.d)}`}
              >
                <p className="numeric text-sm text-ink-600">
                  d = (b × c) ÷ a = ({num(proportion.bv)} × {num(proportion.cv)}) ÷{' '}
                  {num(proportion.av)}
                </p>
              </ResultCard>

              <p className="text-sm leading-relaxed text-ink-500">
                This is cross-multiplication, and it is the arithmetic behind scaling a
                recipe, converting a distance on a map, and resizing an image without
                distorting it. A 16:9 image 1,000 pixels wide needs a = 16, b = 9, c =
                1,000.
              </p>
            </div>
          )}
        </>
      )}

      {mode === 'divide' && (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberField
              label="Total to divide"
              value={total}
              onChange={setTotal}
              placeholder="1200"
            />
            <div>
              <label
                htmlFor="ratio-parts"
                className="block text-sm font-semibold text-ink-800"
              >
                In the ratio
              </label>
              <input
                id="ratio-parts"
                type="text"
                value={parts}
                onChange={(event) => setParts(event.target.value)}
                placeholder="2:3:7"
                className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
              />
              <p className="mt-2 text-sm text-ink-500">
                Any number of terms, separated by colons.
              </p>
            </div>
          </div>

          {divide && (
            <div className="mt-7 space-y-4">
              <ResultCard
                label="One share is worth"
                value={num(divide.unit)}
                verdict={`${num(divide.total)} ÷ ${num(divide.shareCount)} shares`}
              />

              <ResultRows
                rows={[
                  ...divide.amounts.map((amount, i) => ({
                    label: `Part ${i + 1} — ${num(divide.terms[i]!)} share${
                      divide.terms[i] === 1 ? '' : 's'
                    }`,
                    value: num(amount),
                    emphasis: true,
                  })),
                  {
                    label: 'Parts add back to',
                    value: num(divide.amounts.reduce((acc, x) => acc + x, 0)),
                  },
                ]}
              />

              <p className="text-sm leading-relaxed text-ink-500">
                The last row is the check: if the parts do not add back to the total, the
                ratio was misread. Add the terms to get the number of shares, divide the
                total by that, then give each part its share count.
              </p>
            </div>
          )}
        </>
      )}
    </CalculatorPanel>
  );
}
