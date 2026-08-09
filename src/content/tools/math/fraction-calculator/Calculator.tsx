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

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

const OPERATIONS = [
  { value: 'add' as const, label: 'Add (+)', symbol: '+' },
  { value: 'subtract' as const, label: 'Subtract (−)', symbol: '−' },
  { value: 'multiply' as const, label: 'Multiply (×)', symbol: '×' },
  { value: 'divide' as const, label: 'Divide (÷)', symbol: '÷' },
];

interface Fraction {
  numerator: number;
  denominator: number;
}

/**
 * Euclid's algorithm. Iterative rather than recursive because the inputs can be
 * large after a common-denominator step and there is no reason to spend stack
 * on it.
 */
function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x === 0 ? 1 : x;
}

function simplify({ numerator, denominator }: Fraction): Fraction {
  const divisor = gcd(numerator, denominator);
  // The sign lives on the numerator by convention: −3/4 rather than 3/−4, so
  // that two fractions with the same value always print the same way.
  const sign = denominator < 0 ? -1 : 1;
  return {
    numerator: (sign * numerator) / divisor,
    denominator: (sign * denominator) / divisor,
  };
}

function parseInt10(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null;
  return parsed;
}

/**
 * Builds an improper fraction from a whole-number part and a fraction part.
 *
 * A negative whole number makes the whole quantity negative, including the
 * fraction part: −2 1/2 is −5/2, not −2 + 1/2 = −3/2. Getting this wrong is the
 * classic mixed-number bug.
 */
function toImproper(whole: number, numerator: number, denominator: number): Fraction {
  const magnitude = Math.abs(whole) * Math.abs(denominator) + Math.abs(numerator);
  const negative = whole < 0 || (whole === 0 && numerator < 0);
  return {
    numerator: negative ? -magnitude : magnitude,
    denominator: Math.abs(denominator),
  };
}

function toMixed({ numerator, denominator }: Fraction): string {
  const whole = Math.trunc(numerator / denominator);
  const remainder = Math.abs(numerator % denominator);
  if (remainder === 0) return String(whole);
  if (whole === 0) return `${numerator < 0 ? '−' : ''}${remainder}/${denominator}`;
  return `${whole} ${remainder}/${denominator}`;
}

function format({ numerator, denominator }: Fraction): string {
  if (denominator === 1) return String(numerator);
  return `${numerator}/${denominator}`;
}

/**
 * A fraction in lowest terms terminates as a decimal exactly when the only
 * prime factors of its denominator are 2 and 5 — the primes that divide ten.
 * Everything else repeats forever.
 */
function terminates(denominator: number): boolean {
  let d = Math.abs(denominator);
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1;
}

export default function FractionCalculator() {
  const [whole1, setWhole1] = useState('');
  const [num1, setNum1] = useState('2');
  const [den1, setDen1] = useState('3');
  const [whole2, setWhole2] = useState('');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('4');
  const [operation, setOperation] = useState<Operation>('add');

  const result = useMemo(() => {
    const w1 = whole1.trim() === '' ? 0 : parseInt10(whole1);
    const n1 = parseInt10(num1);
    const d1 = parseInt10(den1);
    const w2 = whole2.trim() === '' ? 0 : parseInt10(whole2);
    const n2 = parseInt10(num2);
    const d2 = parseInt10(den2);

    if (w1 === null || n1 === null || d1 === null || w2 === null || n2 === null || d2 === null) {
      return { error: 'Enter whole numbers in every box — fractions take integers only.' };
    }
    if (d1 === 0 || d2 === 0) {
      return { error: 'A denominator cannot be zero — the fraction would be undefined.' };
    }

    const a = toImproper(w1, n1, d1);
    const b = toImproper(w2, n2, d2);

    if (operation === 'divide' && b.numerator === 0) {
      return { error: 'Cannot divide by zero — the second fraction has no reciprocal.' };
    }

    // Cross-multiplication for add and subtract uses the product of the
    // denominators rather than their LCM. It is always valid, and the
    // simplification step at the end brings it back to lowest terms; showing
    // both is more useful than hiding the unsimplified stage.
    let raw: Fraction;
    let working: string;

    switch (operation) {
      case 'add':
        raw = {
          numerator: a.numerator * b.denominator + b.numerator * a.denominator,
          denominator: a.denominator * b.denominator,
        };
        working = `(${a.numerator} × ${b.denominator}) + (${b.numerator} × ${a.denominator}) = ${raw.numerator}, over ${a.denominator} × ${b.denominator} = ${raw.denominator}`;
        break;
      case 'subtract':
        raw = {
          numerator: a.numerator * b.denominator - b.numerator * a.denominator,
          denominator: a.denominator * b.denominator,
        };
        working = `(${a.numerator} × ${b.denominator}) − (${b.numerator} × ${a.denominator}) = ${raw.numerator}, over ${a.denominator} × ${b.denominator} = ${raw.denominator}`;
        break;
      case 'multiply':
        raw = { numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator };
        working = `${a.numerator} × ${b.numerator} = ${raw.numerator}, over ${a.denominator} × ${b.denominator} = ${raw.denominator}`;
        break;
      case 'divide':
        raw = { numerator: a.numerator * b.denominator, denominator: a.denominator * b.numerator };
        working = `${format(a)} × ${b.denominator}/${b.numerator} (the reciprocal) = ${raw.numerator}/${raw.denominator}`;
        break;
    }

    const simplified = simplify(raw);
    const decimal = simplified.numerator / simplified.denominator;
    const divisor = gcd(raw.numerator, raw.denominator);

    return {
      a,
      b,
      raw,
      simplified,
      working,
      divisor,
      decimal,
      lcd: (a.denominator * b.denominator) / gcd(a.denominator, b.denominator),
      exact: terminates(simplified.denominator),
    };
  }, [whole1, num1, den1, whole2, num2, den2, operation]);

  function reset() {
    setWhole1('');
    setNum1('2');
    setDen1('3');
    setWhole2('');
    setNum2('1');
    setDen2('4');
    setOperation('add');
  }

  const symbol = OPERATIONS.find((o) => o.value === operation)!.symbol;

  return (
    <CalculatorPanel>
      <div className="space-y-6">
        <FractionInput
          legend="First fraction"
          whole={whole1}
          onWhole={setWhole1}
          numerator={num1}
          onNumerator={setNum1}
          denominator={den1}
          onDenominator={setDen1}
        />

        <SelectField
          label="Operation"
          value={operation}
          onChange={setOperation}
          options={OPERATIONS.map((o) => ({ value: o.value, label: o.label }))}
        />

        <FractionInput
          legend="Second fraction"
          whole={whole2}
          onWhole={setWhole2}
          numerator={num2}
          onNumerator={setNum2}
          denominator={den2}
          onDenominator={setDen2}
        />
      </div>

      {'error' in result ? (
        <p role="alert" className="mt-7 text-sm text-red-600">
          {result.error}
        </p>
      ) : (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={`${format(result.a)} ${symbol} ${format(result.b)}`}
            value={format(result.simplified)}
            verdict={
              result.simplified.denominator === 1
                ? 'A whole number'
                : Math.abs(result.simplified.numerator) > result.simplified.denominator
                  ? // Only worth saying for an improper fraction — for a proper
                    // one the mixed form is the same string, which reads as a
                    // glitch rather than as extra information.
                    `${toMixed(result.simplified)} as a mixed number`
                  : `${result.exact ? '' : 'about '}${(result.decimal * 100).toFixed(1)}% as a decimal`
            }
          />

          <ResultRows
            rows={[
              { label: 'Simplified', value: format(result.simplified), emphasis: true },
              { label: 'As a mixed number', value: toMixed(result.simplified) },
              {
                label: 'As a decimal',
                value: result.exact
                  ? String(result.decimal)
                  : `${result.decimal.toFixed(6)}… (repeats)`,
              },
              {
                label: 'As a percentage',
                value: `${(result.decimal * 100).toFixed(result.exact ? 2 : 4)}%`,
              },
              { label: 'Before simplifying', value: format(result.raw) },
              {
                label: 'Divided top and bottom by',
                value: result.divisor === 1 ? 'nothing — already in lowest terms' : String(result.divisor),
              },
              ...(operation === 'add' || operation === 'subtract'
                ? [{ label: 'Lowest common denominator', value: String(result.lcd) }]
                : []),
            ]}
          />

          <div className="rounded-card border border-line bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink-800">The working</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{result.working}</p>
            {result.divisor > 1 && (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Both parts share a factor of {result.divisor}, so {format(result.raw)} reduces
                to {format(result.simplified)}.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}

function FractionInput({
  legend,
  whole,
  onWhole,
  numerator,
  onNumerator,
  denominator,
  onDenominator,
}: {
  legend: string;
  whole: string;
  onWhole: (value: string) => void;
  numerator: string;
  onNumerator: (value: string) => void;
  denominator: string;
  onDenominator: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-800">{legend}</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <NumberField
          label="Whole number"
          value={whole}
          onChange={onWhole}
          placeholder="0"
          inputMode="numeric"
          hint="Optional"
        />
        <NumberField
          label="Numerator"
          value={numerator}
          onChange={onNumerator}
          placeholder="2"
          inputMode="numeric"
        />
        <NumberField
          label="Denominator"
          value={denominator}
          onChange={onDenominator}
          placeholder="3"
          inputMode="numeric"
        />
      </div>
    </fieldset>
  );
}
