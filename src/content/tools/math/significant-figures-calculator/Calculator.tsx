'use client';

import { useId, useMemo, useState } from 'react';
import { NumberField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * Analyses the number *as written*, which is the whole point of the tool.
 *
 * This is why the value field below is a text input rather than the shared
 * NumberField: `1.200` and `1.2` are the same quantity and different
 * measurements, and anything that parses the input to a JavaScript number
 * before counting has already destroyed the distinction the reader came here
 * to resolve.
 */
interface Analysis {
  /** Digits that count, in order, after the rules are applied. */
  significant: string;
  count: number;
  /** True when trailing zeros in a whole number could go either way. */
  ambiguous: boolean;
  /** The count if those trailing zeros are treated as significant. */
  maxCount: number;
  decimalPlaces: number;
  value: number;
  isZero: boolean;
}

const PATTERN = /^[+-]?(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

function analyse(raw: string): Analysis | null {
  const cleaned = raw.replace(/[,\s_]/g, '');
  if (cleaned === '' || cleaned === '+' || cleaned === '-') return null;

  const match = PATTERN.exec(cleaned);
  if (!match) return null;

  const [, intPart = '', fracPart, exponent] = match;
  const hasDecimalPoint = fracPart !== undefined;

  // A bare "." or a sign with no digits is not a number.
  if (intPart === '' && (fracPart ?? '') === '') return null;

  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;

  const digits = `${intPart}${fracPart ?? ''}`;
  const withoutLeadingZeros = digits.replace(/^0+/, '');

  // Zero is genuinely special: every digit in it is a placeholder, so the usual
  // rules produce no significant digits at all. Convention treats it as one.
  if (withoutLeadingZeros === '') {
    return {
      significant: '0',
      count: 1,
      ambiguous: false,
      maxCount: 1,
      decimalPlaces: (fracPart ?? '').length,
      value: 0,
      isZero: true,
    };
  }

  const trimmedTrailing = withoutLeadingZeros.replace(/0+$/, '');

  // Exponential notation is unambiguous by construction — the mantissa states
  // exactly which digits were measured, which is why it is the recommended way
  // to write a number whose precision matters.
  const inExponentialForm = exponent !== undefined;
  const ambiguous =
    !hasDecimalPoint && !inExponentialForm && trimmedTrailing.length < withoutLeadingZeros.length;

  return {
    significant: hasDecimalPoint || inExponentialForm ? withoutLeadingZeros : trimmedTrailing,
    count: hasDecimalPoint || inExponentialForm ? withoutLeadingZeros.length : trimmedTrailing.length,
    ambiguous,
    maxCount: withoutLeadingZeros.length,
    decimalPlaces: (fracPart ?? '').length,
    value,
    isZero: false,
  };
}

/** Strips the exponent form JavaScript reaches for at modest magnitudes. */
function plain(value: number, precision: number): string {
  const fixed = value.toPrecision(precision);
  if (!fixed.includes('e')) return fixed;
  // toPrecision drops to exponential outside a narrow band; for display we want
  // the ordinary form wherever it is readable.
  const abs = Math.abs(value);
  if (abs >= 1e-6 && abs < 1e21) return Number(fixed).toString();
  return fixed;
}

export default function SignificantFiguresCalculator() {
  const [input, setInput] = useState('0.004560');
  const [precision, setPrecision] = useState('3');
  const [countTrailing, setCountTrailing] = useState(false);
  const valueId = useId();

  const analysis = useMemo(() => analyse(input), [input]);

  const targetPrecision = useMemo(() => {
    const parsed = Number(precision);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 21) return null;
    return parsed;
  }, [precision]);

  const reported = analysis
    ? analysis.ambiguous && countTrailing
      ? analysis.maxCount
      : analysis.count
    : 0;

  function reset() {
    setInput('0.004560');
    setPrecision('3');
    setCountTrailing(false);
  }

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={valueId} className="block text-sm font-semibold text-ink-800">
            Number, exactly as written
          </label>
          <input
            id={valueId}
            type="text"
            inputMode="decimal"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="0.004560"
            spellCheck={false}
            autoComplete="off"
            className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-4 py-3 text-xl font-bold text-ink-900 transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 sm:px-5 sm:text-2xl"
          />
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Trailing zeros are preserved as typed — they are the whole question. Scientific
            notation such as 3.40e-3 works too.
          </p>
        </div>

        <NumberField
          label="Round to"
          value={precision}
          onChange={setPrecision}
          unit="sig figs"
          min={1}
          max={21}
          step={1}
          inputMode="numeric"
          hint="Between 1 and 21."
        />
      </div>

      {analysis?.ambiguous && (
        <div className="mt-5 rounded-card border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-bold">Those trailing zeros are ambiguous</p>
          <p className="mt-1.5">
            Written without a decimal point, this number could have {analysis.count} or{' '}
            {analysis.maxCount} significant figures and the notation cannot say which. Write
            it in scientific notation, or add a decimal point, to remove the doubt.
          </p>
          <label className="mt-3 flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={countTrailing}
              onChange={(event) => setCountTrailing(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-brand-solid"
            />
            <span>Treat the trailing zeros as measured ({analysis.maxCount} figures)</span>
          </label>
        </div>
      )}

      {analysis && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label="Significant figures"
            value={String(reported)}
            verdict={
              analysis.isZero
                ? 'Zero is conventionally treated as one significant figure'
                : `Significant digits: ${analysis.significant}`
            }
          />

          <ResultRows
            rows={[
              { label: 'Decimal places', value: String(analysis.decimalPlaces) },
              {
                label: 'Scientific notation',
                value: analysis.value.toExponential(Math.max(reported - 1, 0)),
              },
              ...(targetPrecision
                ? [
                    {
                      label: `Rounded to ${targetPrecision} sig figs`,
                      value: plain(analysis.value, targetPrecision),
                      emphasis: true,
                    },
                    {
                      label: 'Rounded, in scientific notation',
                      value: analysis.value.toExponential(targetPrecision - 1),
                    },
                  ]
                : []),
              ...(targetPrecision && targetPrecision > reported
                ? [
                    {
                      label: 'Note',
                      value: 'Rounding up adds digits the input never had',
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}

      {input.trim() !== '' && !analysis && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          That is not a number this calculator can read. Digits, one optional decimal point,
          and an optional exponent such as e-3.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
