'use client';

import { useMemo, useState } from 'react';
import { NumberField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { parseNumber } from '@/lib/format';

/**
 * Significant-figure formatting rather than fixed decimals.
 *
 * A root can be 0.000031 or 41,000, often in the same problem, and a fixed
 * number of decimal places is wrong at one end or the other. Trailing zeros are
 * dropped so an exact root reads as `3` rather than `3.000000`.
 */
function fmt(value: number, digits = 8): string {
  if (!Number.isFinite(value)) return '—';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e9 || abs < 1e-5) return value.toExponential(5);
  return String(Number(value.toPrecision(digits)));
}

function fmtComplex(real: number, imaginary: number): string {
  const sign = imaginary < 0 ? '−' : '+';
  return `${fmt(real)} ${sign} ${fmt(Math.abs(imaginary))}i`;
}

type Solution =
  | { kind: 'degenerate'; message: string }
  | { kind: 'linear'; root: number }
  | {
      kind: 'quadratic';
      discriminant: number;
      real: boolean;
      /** Real roots, ordered ascending. Empty when the discriminant is negative. */
      roots: number[];
      /** Real and imaginary parts of the conjugate pair, when there is one. */
      complex: { real: number; imaginary: number } | null;
      repeated: boolean;
      vertexX: number;
      vertexY: number;
      sum: number;
      product: number;
      /**
       * The same roots from the textbook formula. Kept so the panel can show
       * the reader the digits the naive form loses rather than only asserting
       * that it loses them.
       */
      naive: number[];
      cancellation: boolean;
    };

function solve(a: number, b: number, c: number): Solution {
  if (a === 0) {
    if (b === 0) {
      return {
        kind: 'degenerate',
        message:
          c === 0
            ? 'With a, b and c all zero the equation is 0 = 0, which every value of x satisfies.'
            : 'With a and b both zero the equation reads c = 0, which is false for the c you entered. There is no solution.',
      };
    }
    return { kind: 'linear', root: -c / b };
  }

  const discriminant = b * b - 4 * a * c;
  const root = Math.sqrt(Math.abs(discriminant));
  const vertexX = -b / (2 * a);
  const vertexY = c - (b * b) / (4 * a);

  if (discriminant < 0) {
    return {
      kind: 'quadratic',
      discriminant,
      real: false,
      roots: [],
      complex: { real: vertexX, imaginary: root / (2 * a) },
      repeated: false,
      vertexX,
      vertexY,
      sum: -b / a,
      product: c / a,
      naive: [],
      cancellation: false,
    };
  }

  // The stable pairing: q takes the sign of b so the two terms add rather than
  // subtract, then the second root comes from the product of the roots (c/a)
  // instead of a second subtraction. See the article for what this rescues.
  const q = -0.5 * (b + Math.sign(b || 1) * root);
  const first = q / a;
  const second = q === 0 ? 0 : c / q;

  const naive = [(-b + root) / (2 * a), (-b - root) / (2 * a)].sort((x, y) => x - y);
  const roots = [first, second].sort((x, y) => x - y);

  // Flagged only when the difference is large enough to change a printed digit,
  // so the note appears on the equations where it matters and stays quiet
  // everywhere else.
  const cancellation = roots.some((value, index) => {
    const other = naive[index]!;
    if (value === 0) return Math.abs(other) > 1e-12;
    return Math.abs((other - value) / value) > 1e-9;
  });

  return {
    kind: 'quadratic',
    discriminant,
    real: true,
    roots,
    complex: null,
    repeated: discriminant === 0,
    vertexX,
    vertexY,
    sum: -b / a,
    product: c / a,
    naive,
    cancellation,
  };
}

const DEFAULTS = { a: '1', b: '-3', c: '-10' };

export default function QuadraticEquationSolver() {
  const [aText, setAText] = useState(DEFAULTS.a);
  const [bText, setBText] = useState(DEFAULTS.b);
  const [cText, setCText] = useState(DEFAULTS.c);

  const a = parseNumber(aText);
  const b = parseNumber(bText);
  const c = parseNumber(cText);

  const solution = useMemo(
    () => (a === null || b === null || c === null ? null : solve(a, b, c)),
    [a, b, c],
  );

  const equation =
    a === null || b === null || c === null
      ? 'ax² + bx + c = 0'
      : `${fmt(a)}x² ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))}x ${c < 0 ? '−' : '+'} ${fmt(
          Math.abs(c),
        )} = 0`;

  return (
    <CalculatorPanel label="Input · coefficients">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="numeric text-sm font-semibold text-ink-700">{equation}</p>
        <ResetButton
          onClick={() => {
            setAText(DEFAULTS.a);
            setBText(DEFAULTS.b);
            setCText(DEFAULTS.c);
          }}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <NumberField
          label="a — coefficient of x²"
          value={aText}
          onChange={setAText}
          hint="Zero makes the equation linear."
        />
        <NumberField label="b — coefficient of x" value={bText} onChange={setBText} />
        <NumberField label="c — constant term" value={cText} onChange={setCText} />
      </div>

      {solution?.kind === 'degenerate' && (
        <p
          role="alert"
          className="mt-7 rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800"
        >
          {solution.message}
        </p>
      )}

      {solution?.kind === 'linear' && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Single root — this equation is linear"
            value={fmt(solution.root)}
            verdict="a is zero, so there is no x² term and the quadratic formula does not apply"
          />
          <p className="text-sm leading-relaxed text-ink-500">
            Solved as bx + c = 0, giving x = −c/b. The quadratic formula divides by 2a and
            would fail here, which is why the case is handled separately rather than left to
            produce an infinity.
          </p>
        </div>
      )}

      {solution?.kind === 'quadratic' && (
        <div className="mt-7 space-y-4">
          {solution.real ? (
            <ResultCard
              label={solution.repeated ? 'Repeated root' : 'Roots'}
              value={
                solution.repeated
                  ? fmt(solution.roots[0]!)
                  : `${fmt(solution.roots[0]!)},  ${fmt(solution.roots[1]!)}`
              }
              tone={solution.repeated ? 'warn' : 'good'}
              verdict={
                solution.repeated
                  ? 'Discriminant is zero — the parabola touches the x-axis at one point'
                  : 'Discriminant is positive — two distinct real roots'
              }
            />
          ) : (
            <ResultCard
              label="Complex conjugate roots"
              value={fmtComplex(solution.complex!.real, solution.complex!.imaginary)}
              tone="warn"
              verdict={`and ${fmtComplex(
                solution.complex!.real,
                -solution.complex!.imaginary,
              )} — the discriminant is negative, so the parabola never meets the x-axis`}
            />
          )}

          <ResultRows
            rows={[
              { label: 'Discriminant (b² − 4ac)', value: fmt(solution.discriminant), emphasis: true },
              { label: 'Axis of symmetry (x = −b/2a)', value: fmt(solution.vertexX) },
              {
                label: 'Vertex',
                value: `(${fmt(solution.vertexX)}, ${fmt(solution.vertexY)})`,
              },
              { label: 'Sum of roots (−b/a)', value: fmt(solution.sum) },
              { label: 'Product of roots (c/a)', value: fmt(solution.product) },
              ...(solution.real
                ? [
                    {
                      label: 'Factored form',
                      value: `${fmt(a!)}(x − ${fmt(solution.roots[0]!)})(x − ${fmt(
                        solution.roots[1]!,
                      )})`,
                    },
                  ]
                : []),
            ]}
          />

          {solution.cancellation && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                The textbook formula loses digits on this equation
              </p>
              <p className="numeric mt-2 text-sm leading-relaxed text-amber-900">
                Stable: {fmt(solution.roots[0]!)}, {fmt(solution.roots[1]!)}
                <br />
                Naive: {fmt(solution.naive[0]!)}, {fmt(solution.naive[1]!)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                Here b² is far larger than 4ac, so −b and the square root are nearly equal and
                subtracting them cancels most of the significant digits. The roots above come
                from the stable pairing instead; the naive line is what the formula as usually
                written returns.
              </p>
            </div>
          )}
        </div>
      )}

      {solution === null && (
        <p className="mt-7 text-sm leading-relaxed text-ink-500">
          Enter all three coefficients. Any real numbers are accepted, including decimals and
          negatives.
        </p>
      )}
    </CalculatorPanel>
  );
}
