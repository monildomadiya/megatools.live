'use client';

import { useMemo, useState } from 'react';
import { NumberField, ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber, parseNumber } from '@/lib/format';

/**
 * The ratios worth naming, as decimal quotients.
 *
 * Held as width ÷ height rather than as a pair so the nearest-match search is a
 * single subtraction. The film ratios are the ones conventionally written
 * against a height of one, which is why they carry a decimal label.
 */
const STANDARDS = [
  { label: '1:1 — square', value: 1 },
  { label: '5:4', value: 5 / 4 },
  { label: '4:3 — classic TV, ITU-R BT.601', value: 4 / 3 },
  { label: '3:2 — 35mm photography', value: 3 / 2 },
  { label: '16:10 — computer displays', value: 16 / 10 },
  { label: '16:9 — HDTV, ITU-R BT.709', value: 16 / 9 },
  { label: '1.85:1 — widescreen cinema', value: 1.85 },
  { label: '2:1 — univisium', value: 2 },
  { label: '2.39:1 — anamorphic scope', value: 2.39 },
  { label: '4:5 — portrait social', value: 4 / 5 },
  { label: '9:16 — vertical video', value: 9 / 16 },
] as const;

function gcd(a: number, b: number): number {
  let x = Math.round(Math.abs(a));
  let y = Math.round(Math.abs(b));
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export default function AspectRatioCalculator() {
  const [originalWidth, setOriginalWidth] = useState('1920');
  const [originalHeight, setOriginalHeight] = useState('1080');
  const [newWidth, setNewWidth] = useState('800');
  const [newHeight, setNewHeight] = useState('');

  function reset() {
    setOriginalWidth('1920');
    setOriginalHeight('1080');
    setNewWidth('800');
    setNewHeight('');
  }

  const result = useMemo(() => {
    const w = parseNumber(originalWidth);
    const h = parseNumber(originalHeight);
    if (w === null || h === null || w <= 0 || h <= 0) return null;

    const quotient = w / h;
    const divisor = gcd(w, h);
    // Only meaningful when both sides are whole. A 1920.5-wide source is not a
    // thing anyone has, but the guard keeps the reduced pair honest if they do.
    const whole = Number.isInteger(w) && Number.isInteger(h);
    const reduced = whole ? `${Math.round(w / divisor)}:${Math.round(h / divisor)}` : null;

    const nearest = STANDARDS.reduce((best, entry) =>
      Math.abs(entry.value - quotient) < Math.abs(best.value - quotient) ? entry : best,
    );

    const targetWidth = parseNumber(newWidth);
    const targetHeight = parseNumber(newHeight);

    // Width wins when both are filled: it is the field people type first, and
    // silently honouring the other one would look like the tool ignored them.
    let derived: { width: number; height: number; from: 'width' | 'height' } | null = null;
    if (targetWidth !== null && targetWidth > 0) {
      derived = { width: targetWidth, height: targetWidth / quotient, from: 'width' };
    } else if (targetHeight !== null && targetHeight > 0) {
      derived = { width: targetHeight * quotient, height: targetHeight, from: 'height' };
    }

    return {
      quotient,
      reduced,
      nearest,
      exactMatch: Math.abs(nearest.value - quotient) < 0.005,
      derived,
    };
  }, [newHeight, newWidth, originalHeight, originalWidth]);

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Enter the original size, then whichever one of the new dimensions you know.
        </p>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Original width"
          value={originalWidth}
          onChange={setOriginalWidth}
          unit="px"
          min={0}
        />
        <NumberField
          label="Original height"
          value={originalHeight}
          onChange={setOriginalHeight}
          unit="px"
          min={0}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="New width"
          value={newWidth}
          onChange={(value) => {
            setNewWidth(value);
            if (value !== '') setNewHeight('');
          }}
          unit="px"
          min={0}
          hint="Leave blank to solve from the height instead."
        />
        <NumberField
          label="New height"
          value={newHeight}
          onChange={(value) => {
            setNewHeight(value);
            if (value !== '') setNewWidth('');
          }}
          unit="px"
          min={0}
          hint="Only one of these is needed."
        />
      </div>

      {result && (
        <div className="mt-7">
          {result.derived ? (
            <ResultCard
              label={`Proportional size, solved from the ${result.derived.from}`}
              value={`${formatNumber(result.derived.width, result.derived.width % 1 === 0 ? 0 : 2)} × ${formatNumber(result.derived.height, result.derived.height % 1 === 0 ? 0 : 2)}`}
              unit="px"
              verdict={result.reduced ? `${result.reduced} preserved` : undefined}
            >
              <ResultRows
                rows={[
                  {
                    label: 'Rounded to whole pixels',
                    value: `${Math.round(result.derived.width)} × ${Math.round(result.derived.height)}`,
                    emphasis: true,
                  },
                  { label: 'Ratio as a decimal', value: `${formatNumber(result.quotient, 3)}:1` },
                  ...(result.reduced ? [{ label: 'Ratio in lowest terms', value: result.reduced }] : []),
                  {
                    label: result.exactMatch ? 'Standard ratio' : 'Closest standard ratio',
                    value: result.nearest.label,
                  },
                  {
                    label: 'Scale factor',
                    value: `${formatNumber((result.derived.width / (parseNumber(originalWidth) ?? 1)) * 100, 1)}%`,
                  },
                ]}
              />
              {result.derived.height % 1 !== 0 && (
                <p className="mt-4 text-sm leading-relaxed text-ink-500">
                  The exact height is not a whole number of pixels. Rounding is unavoidable
                  and changes the ratio by a fraction of a per cent — invisible in practice,
                  but it is why a chain of resizes drifts and why you should always resize
                  from the original rather than from the last output.
                </p>
              )}
            </ResultCard>
          ) : (
            <ResultCard
              label={`${originalWidth} × ${originalHeight} is`}
              value={result.reduced ?? `${formatNumber(result.quotient, 3)}:1`}
              verdict={result.exactMatch ? result.nearest.label : `Closest: ${result.nearest.label}`}
            >
              <ResultRows
                rows={[
                  { label: 'As a decimal', value: `${formatNumber(result.quotient, 4)}:1` },
                  {
                    label: 'Orientation',
                    value:
                      result.quotient > 1
                        ? 'Landscape'
                        : result.quotient < 1
                          ? 'Portrait'
                          : 'Square',
                  },
                ]}
              />
              <p className="mt-4 text-sm leading-relaxed text-ink-500">
                Enter a new width or height above to get the matching dimension.
              </p>
            </ResultCard>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
