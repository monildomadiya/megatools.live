'use client';

import { useMemo, useState } from 'react';
import { ResetButton, ResultRows, SelectField } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** The four bases that get their own row, plus whatever the reader picks. */
const COMMON = [
  { base: 2, label: 'Binary', prefix: '0b' },
  { base: 8, label: 'Octal', prefix: '0o' },
  { base: 10, label: 'Decimal', prefix: '' },
  { base: 16, label: 'Hexadecimal', prefix: '0x' },
] as const;

const BASE_OPTIONS = Array.from({ length: 35 }, (_, index) => {
  const base = index + 2;
  const named = COMMON.find((entry) => entry.base === base);
  return { value: String(base), label: named ? `Base ${base} — ${named.label}` : `Base ${base}` };
});

/**
 * Parsed with BigInt rather than `parseInt`.
 *
 * `parseInt('12345678901234567890', 10)` returns 12345678901234567000 — the
 * tail is gone and nothing reports it, because an ordinary JavaScript number
 * only holds integers exactly to 2^53. A base converter that quietly rounds is
 * worse than one that refuses, and most of the ones online do exactly this.
 * BigInt has no such ceiling, so the accumulate loop is written by hand.
 */
function parseInBase(text: string, base: number): bigint | null {
  const trimmed = text.trim().replace(/[\s_,]/g, '');
  if (trimmed === '') return null;

  const negative = trimmed.startsWith('-');
  // Prefixes are accepted on input as a convenience — someone pasting 0xFF
  // means 255, not a hex string starting with a zero and an x.
  const body = trimmed
    .replace(/^-/, '')
    .replace(/^0[bBoOxX]/, '')
    .toLowerCase();
  if (body === '') return null;

  const radix = BigInt(base);
  let value = 0n;

  for (const character of body) {
    const digit = DIGITS.indexOf(character);
    if (digit < 0 || digit >= base) return null;
    value = value * radix + BigInt(digit);
  }

  return negative ? -value : value;
}

/** Groups a binary string into bytes, which is the only way it is readable. */
function groupBinary(bits: string): string {
  const negative = bits.startsWith('-');
  const body = negative ? bits.slice(1) : bits;
  const padded = body.padStart(Math.ceil(body.length / 4) * 4, '0');
  const groups = padded.match(/.{1,4}/g) ?? [body];
  return (negative ? '-' : '') + groups.join(' ');
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState('10');
  const [customBase, setCustomBase] = useState('36');

  const base = Number(fromBase);
  const value = useMemo(() => parseInBase(input, base), [base, input]);
  const custom = Number(customBase);

  const bitLength = value !== null && value !== 0n ? (value < 0n ? -value : value).toString(2).length : value === 0n ? 1 : 0;

  function reset() {
    setInput('255');
    setFromBase('10');
    setCustomBase('36');
  }

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Whole numbers only, at any size. Prefixes like <span className="numeric">0x</span>{' '}
          are accepted and stripped.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor="base-input" className="block text-sm font-semibold text-ink-800">
            Value
          </label>
          <input
            id="base-input"
            type="text"
            inputMode="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="255"
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={input.trim() !== '' && value === null ? true : undefined}
            className={`numeric mt-2 w-full rounded-control border bg-panel-2 px-4 py-3 text-xl font-bold text-ink-900 outline-none transition-colors placeholder:font-normal placeholder:text-ink-400 sm:px-5 sm:text-2xl ${
              input.trim() !== '' && value === null
                ? 'border-red-400'
                : 'border-line focus:border-brand-500'
            }`}
          />
          {input.trim() !== '' && value === null && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              Not a valid base {base} number. Base {base} uses the digits{' '}
              <span className="numeric">{DIGITS.slice(0, base)}</span>.
            </p>
          )}
        </div>

        <SelectField
          label="Input is in"
          value={fromBase}
          onChange={setFromBase}
          options={BASE_OPTIONS}
        />
      </div>

      {value !== null && (
        <>
          <div className="mt-7">
            <p className="mb-2 text-sm font-medium text-ink-600">The same number, four ways</p>
            <ResultRows
              rows={COMMON.map((entry) => ({
                label: `${entry.label} (base ${entry.base})`,
                value:
                  entry.base === 2
                    ? groupBinary(value.toString(2))
                    : entry.prefix + value.toString(entry.base).toUpperCase(),
                emphasis: entry.base === base,
              }))}
            />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Also show in"
              value={customBase}
              onChange={setCustomBase}
              options={BASE_OPTIONS}
            />
            <div>
              <p className="block text-sm font-semibold text-ink-800">Base {custom}</p>
              <p className="numeric mt-2 break-all rounded-control border border-line bg-panel-2 px-4 py-3 text-lg font-bold text-ink-900">
                {value.toString(custom).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink-600">Properties</p>
            <ResultRows
              rows={[
                { label: 'Bits needed', value: String(bitLength), emphasis: true },
                {
                  label: 'Fits in',
                  value:
                    bitLength <= 8
                      ? '8-bit byte'
                      : bitLength <= 16
                        ? '16 bits'
                        : bitLength <= 32
                          ? '32 bits'
                          : bitLength <= 64
                            ? '64 bits'
                            : 'more than 64 bits',
                },
                {
                  label: 'Decimal digits',
                  value: String((value < 0n ? -value : value).toString(10).length),
                },
                {
                  label: 'Exact in a JavaScript number',
                  value:
                    (value < 0n ? -value : value) <= BigInt(Number.MAX_SAFE_INTEGER)
                      ? 'Yes'
                      : 'No — above 2^53',
                },
              ]}
            />
            {(value < 0n ? -value : value) > BigInt(Number.MAX_SAFE_INTEGER) && (
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                This value is past the point where an ordinary JavaScript number stays
                exact. The conversion above is still correct — it uses arbitrary-precision
                integers — but a converter built on <span className="numeric">parseInt</span>{' '}
                would silently round it.
              </p>
            )}
          </div>
        </>
      )}
    </CalculatorPanel>
  );
}
