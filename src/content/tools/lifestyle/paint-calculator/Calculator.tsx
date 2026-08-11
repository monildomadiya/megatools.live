'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber, parseNumber } from '@/lib/format';

const SYSTEMS = [
  { value: 'metric', label: 'Metric' },
  { value: 'us', label: 'US' },
] as const;

type System = (typeof SYSTEMS)[number]['value'];

/**
 * Defaults per system, in that system's own units.
 *
 * The opening sizes are the standard ones rather than a guess: a UK internal
 * door is 1981 x 762 mm and a US interior door 80 x 30 inches, which come to
 * almost exactly the same area by different routes. Window sizes vary far more,
 * so the figure here is a common mid-size casement and the field is editable
 * for that reason.
 */
const DEFAULTS = {
  metric: {
    length: '4',
    width: '4',
    height: '2.4',
    coverage: '12',
    doorArea: 1.51,
    windowArea: 1.5,
    areaUnit: 'm²',
    lengthUnit: 'm',
    volumeUnit: 'litres',
    coverageUnit: 'm² per litre',
  },
  us: {
    length: '13',
    width: '13',
    height: '8',
    coverage: '375',
    doorArea: 16.7,
    windowArea: 16,
    areaUnit: 'sq ft',
    lengthUnit: 'ft',
    volumeUnit: 'gallons',
    coverageUnit: 'sq ft per gallon',
  },
} as const;

/** Tin sizes actually sold, largest first, for the "what to buy" suggestion. */
const TINS = {
  metric: [10, 5, 2.5, 1],
  us: [5, 1, 0.25],
} as const;

/**
 * The smallest set of stocked tins that covers the requirement.
 *
 * Greedy from the largest size down, then one more of the smallest tin to cover
 * whatever is left. Greedy is only correct here because each size divides into
 * the ones above it, which the sizes actually sold happen to do in both systems.
 *
 * Counts are accumulated per size rather than pushed as they are found: the
 * leftover top-up is nearly always another of the smallest tin, and pushing it
 * separately would print "1 × 1 litre + 1 × 1 litre" instead of "2 × 1 litre".
 */
function tinPlan(needed: number, sizes: readonly number[]): { size: number; count: number }[] {
  const smallest = sizes[sizes.length - 1]!;
  const counts = new Map<number, number>();
  let remaining = needed;

  for (const size of sizes) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      counts.set(size, (counts.get(size) ?? 0) + count);
      remaining -= count * size;
    }
  }

  // Running out mid-wall is a far worse outcome than a part-used tin, so any
  // remainder rounds up to one more of the smallest size.
  if (remaining > 0.001) {
    counts.set(smallest, (counts.get(smallest) ?? 0) + 1);
  }

  return sizes
    .filter((size) => counts.has(size))
    .map((size) => ({ size, count: counts.get(size)! }));
}

export default function PaintCalculator() {
  const [system, setSystem] = useState<System>('metric');
  const [length, setLength] = useState(DEFAULTS.metric.length);
  const [width, setWidth] = useState(DEFAULTS.metric.width);
  const [height, setHeight] = useState(DEFAULTS.metric.height);
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('1');
  const [coats, setCoats] = useState('2');
  const [coverage, setCoverage] = useState(DEFAULTS.metric.coverage);
  const [includeCeiling, setIncludeCeiling] = useState(false);

  const units = DEFAULTS[system];

  function switchSystem(next: System) {
    // Dimensions are re-seeded rather than converted. Someone switching units is
    // almost always changing which set of numbers they have in front of them,
    // not asking for 4 metres expressed in feet.
    setSystem(next);
    setLength(DEFAULTS[next].length);
    setWidth(DEFAULTS[next].width);
    setHeight(DEFAULTS[next].height);
    setCoverage(DEFAULTS[next].coverage);
  }

  function reset() {
    switchSystem('metric');
    setDoors('1');
    setWindows('1');
    setCoats('2');
    setIncludeCeiling(false);
  }

  const result = useMemo(() => {
    const l = parseNumber(length);
    const w = parseNumber(width);
    const h = parseNumber(height);
    const cov = parseNumber(coverage);
    const coatCount = parseNumber(coats) ?? 0;
    const doorCount = parseNumber(doors) ?? 0;
    const windowCount = parseNumber(windows) ?? 0;

    if (l === null || w === null || h === null || cov === null) return null;
    if (l <= 0 || w <= 0 || h <= 0 || cov <= 0 || coatCount <= 0) return null;

    const wallArea = 2 * (l + w) * h;
    const ceilingArea = l * w;
    const openings = doorCount * units.doorArea + windowCount * units.windowArea;

    // An opening deduction larger than the wall means the inputs disagree with
    // each other; clamping is friendlier than reporting a negative area.
    const paintable = Math.max(wallArea - openings, 0) + (includeCeiling ? ceilingArea : 0);
    const volume = (paintable * coatCount) / cov;

    return {
      wallArea,
      ceilingArea,
      openings,
      paintable,
      volume,
      coats: coatCount,
      plan: tinPlan(volume, TINS[system]),
    };
  }, [
    coats,
    coverage,
    doors,
    height,
    includeCeiling,
    length,
    system,
    units.doorArea,
    units.windowArea,
    width,
    windows,
  ]);

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Unit system"
          value={system}
          onChange={switchSystem}
          options={SYSTEMS}
        />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <NumberField
          label="Room length"
          value={length}
          onChange={setLength}
          unit={units.lengthUnit}
          min={0}
        />
        <NumberField
          label="Room width"
          value={width}
          onChange={setWidth}
          unit={units.lengthUnit}
          min={0}
        />
        <NumberField
          label="Wall height"
          value={height}
          onChange={setHeight}
          unit={units.lengthUnit}
          min={0}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Doors"
          value={doors}
          onChange={setDoors}
          inputMode="numeric"
          min={0}
          hint={`Each deducted as ${units.doorArea} ${units.areaUnit}.`}
        />
        <NumberField
          label="Windows"
          value={windows}
          onChange={setWindows}
          inputMode="numeric"
          min={0}
          hint={`Each deducted as ${units.windowArea} ${units.areaUnit}.`}
        />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Coats"
          value={coats}
          onChange={setCoats}
          inputMode="numeric"
          min={1}
          hint="Two for a colour change. Three going dark to light."
        />
        <NumberField
          label="Coverage"
          value={coverage}
          onChange={setCoverage}
          unit={system === 'metric' ? 'm²/L' : 'ft²/gal'}
          min={0}
          hint={`From the tin. Typical emulsion is ${units.coverage} ${units.coverageUnit}.`}
        />
      </div>

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
        <input
          type="checkbox"
          checked={includeCeiling}
          onChange={(event) => setIncludeCeiling(event.target.checked)}
          className="h-4 w-4 accent-brand-solid"
        />
        <span className="text-ink-800">
          Include the ceiling — only if painting it with the same product
        </span>
      </label>

      {result && (
        <div className="mt-7">
          <ResultCard
            label={`Paint for ${result.coats} ${result.coats === 1 ? 'coat' : 'coats'}`}
            value={formatNumber(result.volume, 1)}
            unit={units.volumeUnit}
          >
            <ResultRows
              rows={[
                {
                  label: 'Wall area',
                  value: `${formatNumber(result.wallArea, 1)} ${units.areaUnit}`,
                },
                {
                  label: 'Openings deducted',
                  value: `−${formatNumber(result.openings, 1)} ${units.areaUnit}`,
                },
                ...(includeCeiling
                  ? [
                      {
                        label: 'Ceiling area',
                        value: `${formatNumber(result.ceilingArea, 1)} ${units.areaUnit}`,
                      },
                    ]
                  : []),
                {
                  label: 'Paintable area',
                  value: `${formatNumber(result.paintable, 1)} ${units.areaUnit}`,
                  emphasis: true,
                },
                {
                  label: 'Area across all coats',
                  value: `${formatNumber(result.paintable * result.coats, 1)} ${units.areaUnit}`,
                },
              ]}
            />

            {result.plan.length > 0 && (
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                <span className="font-semibold text-ink-800">Tins to buy:</span>{' '}
                {result.plan
                  .map((entry) => `${entry.count} × ${entry.size} ${units.volumeUnit}`)
                  .join(' + ')}
                . Buy it in one purchase so every tin is from the same batch — two
                batches of the same colour can differ visibly across a large wall.
              </p>
            )}

            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Spreading rates on a tin are measured on smooth, sealed, previously
              painted surfaces. Bare plaster, new plasterboard and textured walls drink
              considerably more, so treat this as a floor rather than a ceiling.
            </p>
          </ResultCard>
        </div>
      )}
    </CalculatorPanel>
  );
}
