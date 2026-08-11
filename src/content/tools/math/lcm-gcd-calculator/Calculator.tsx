'use client';

import { useMemo, useState } from 'react';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/** Euclid, with each division recorded so the page can show the working. */
function gcdWithSteps(a: number, b: number) {
  const steps: { a: number; b: number; quotient: number; remainder: number }[] = [];
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const quotient = Math.floor(x / y);
    const remainder = x % y;
    steps.push({ a: x, b: y, quotient, remainder });
    x = y;
    y = remainder;
  }

  return { gcd: x, steps };
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

/**
 * Divide before multiplying, always.
 *
 * `a * b / gcd` is the version everyone writes and it overflows a double for
 * inputs this tool happily accepts — two nine-digit numbers multiply past 2^53
 * and the result comes back silently wrong rather than as an error. Dividing
 * first keeps every intermediate value no larger than the answer itself.
 */
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b)) * Math.abs(b);
}

/** Trial division to the square root — ample for the range a person types in. */
function primeFactors(n: number): Map<number, number> {
  const factors = new Map<number, number>();
  let value = Math.abs(n);

  for (let divisor = 2; divisor * divisor <= value; divisor += divisor === 2 ? 1 : 2) {
    while (value % divisor === 0) {
      factors.set(divisor, (factors.get(divisor) ?? 0) + 1);
      value /= divisor;
    }
  }
  // Whatever survives is prime — there can only ever be one such factor left.
  if (value > 1) factors.set(value, (factors.get(value) ?? 0) + 1);

  return factors;
}

function factorString(n: number): string {
  if (n === 1) return '1';
  const parts: string[] = [];
  for (const [prime, power] of primeFactors(n)) {
    parts.push(power === 1 ? String(prime) : `${prime}^${power}`);
  }
  return parts.join(' × ');
}

export default function LcmGcdCalculator() {
  const [raw, setRaw] = useState('12, 18, 30');

  const parsed = useMemo(() => {
    const tokens = raw.split(/[\s,;]+/).filter(Boolean);
    const numbers: number[] = [];
    let invalid = false;

    for (const token of tokens) {
      const value = Number(token);
      if (!Number.isInteger(value) || value <= 0 || value > Number.MAX_SAFE_INTEGER) {
        invalid = true;
        continue;
      }
      numbers.push(value);
    }

    return { numbers, invalid };
  }, [raw]);

  const result = useMemo(() => {
    const { numbers } = parsed;
    if (numbers.length < 2) return null;

    // Both fold pairwise across the list. For the GCD that is simply
    // associativity; for the LCM it is the only correct way, because the
    // product identity that works for two numbers does not extend to three.
    const overallGcd = numbers.reduce((acc, value) => gcd(acc, value));
    const overallLcm = numbers.reduce((acc, value) => lcm(acc, value));

    // The steps are shown for the first pair only. Nine divisions is a worked
    // example; the full fold across six numbers is a wall of them.
    const [first, second] = numbers;
    const worked = gcdWithSteps(first!, second!);

    return { overallGcd, overallLcm, worked, first: first!, second: second! };
  }, [parsed]);

  const { numbers, invalid } = parsed;

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Two or more positive whole numbers, separated by commas or spaces.
        </p>
        <ResetButton onClick={() => setRaw('12, 18, 30')} />
      </div>

      <div className="mt-5">
        <label htmlFor="lcm-input" className="block text-sm font-semibold text-ink-800">
          Numbers
        </label>
        <input
          id="lcm-input"
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          placeholder="12, 18, 30"
          spellCheck={false}
          className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-xl font-bold text-ink-900 outline-none transition-colors placeholder:font-normal placeholder:text-ink-400 focus:border-brand-500 sm:px-5 sm:text-2xl"
        />
        {invalid && (
          <p className="mt-2 text-sm text-amber-700">
            Ignoring entries that are not positive whole numbers — decimals, negatives
            and zero have no useful LCM.
          </p>
        )}
        {numbers.length === 1 && (
          <p className="mt-2 text-sm text-ink-500">Add at least one more number.</p>
        )}
      </div>

      {result && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <ResultCard label="Greatest common divisor" value={result.overallGcd.toLocaleString('en-US')} />
          <ResultCard label="Lowest common multiple" value={result.overallLcm.toLocaleString('en-US')} />
        </div>
      )}

      {result && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-600">
            Euclidean algorithm — {result.first} and {result.second}
          </p>
          <ResultRows
            rows={result.worked.steps.map((step) => ({
              label: `${step.a} = ${step.b} × ${step.quotient} + ${step.remainder}`,
              value: step.remainder === 0 ? `GCD = ${step.b}` : `remainder ${step.remainder}`,
              emphasis: step.remainder === 0,
            }))}
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Each line divides the previous divisor by the previous remainder. The last
            non-zero remainder is the greatest common divisor.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-600">Prime factorisations</p>
          <ResultRows
            rows={[
              ...numbers.map((value) => ({
                label: String(value),
                value: factorString(value),
              })),
              {
                label: 'GCD — lowest power of every shared prime',
                value: factorString(result.overallGcd),
                emphasis: true,
              },
              {
                label: 'LCM — highest power of every prime present',
                value: factorString(result.overallLcm),
                emphasis: true,
              },
            ]}
          />
        </div>
      )}
    </CalculatorPanel>
  );
}
