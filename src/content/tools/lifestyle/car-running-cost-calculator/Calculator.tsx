'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { CURRENCIES, formatCurrency, formatNumber, parseNumber, type CurrencyCode } from '@/lib/format';

/**
 * Three unit systems rather than a grid of independent unit pickers.
 *
 * Nobody holds fuel economy in one system and fuel price in another: an
 * American thinks in miles, mpg and dollars per gallon, a British driver in
 * miles, mpg and pence per litre, and everyone else in kilometres, litres per
 * 100 km and price per litre. Offering the combinations separately would let a
 * reader build a mixture that does not exist.
 */
const SYSTEMS = {
  us: {
    label: 'US — miles, mpg, per gallon',
    distance: 'mile',
    distancePlural: 'miles',
    economyLabel: 'Fuel economy (US mpg)',
    priceLabel: 'Fuel price (per US gallon)',
    /** Fuel units burned per distance unit. */
    fuelPerDistance: (economy: number) => 1 / economy,
  },
  uk: {
    label: 'UK — miles, mpg, per litre',
    distance: 'mile',
    distancePlural: 'miles',
    economyLabel: 'Fuel economy (imperial mpg)',
    priceLabel: 'Fuel price (per litre)',
    fuelPerDistance: (economy: number) => 4.54609 / economy,
  },
  metric: {
    label: 'Metric — km, L/100 km, per litre',
    distance: 'km',
    distancePlural: 'km',
    economyLabel: 'Fuel consumption (L/100 km)',
    priceLabel: 'Fuel price (per litre)',
    fuelPerDistance: (economy: number) => economy / 100,
  },
} as const;

type SystemKey = keyof typeof SYSTEMS;

const DEFAULTS = {
  price: '30000',
  resale: '15000',
  years: '5',
  distance: '10000',
  economy: '32',
  fuelPrice: '3.40',
  insurance: '1200',
  tax: '200',
  servicing: '600',
  other: '150',
};

export default function CarRunningCostCalculator() {
  const [system, setSystem] = useState<SystemKey>('us');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [fields, setFields] = useState({ ...DEFAULTS });

  const spec = SYSTEMS[system];

  const set = (key: keyof typeof DEFAULTS) => (value: string) =>
    setFields((previous) => {
      const next = { ...previous };
      next[key] = value;
      return next;
    });

  const result = useMemo(() => {
    const price = parseNumber(fields.price);
    const resale = parseNumber(fields.resale);
    const years = parseNumber(fields.years);
    const distance = parseNumber(fields.distance);
    const economy = parseNumber(fields.economy);
    const fuelPrice = parseNumber(fields.fuelPrice);

    if (price === null || resale === null || years === null || years <= 0) return null;
    if (distance === null || distance <= 0) return null;
    if (economy === null || economy <= 0 || fuelPrice === null || fuelPrice < 0) return null;

    const fixed =
      (parseNumber(fields.insurance) ?? 0) +
      (parseNumber(fields.tax) ?? 0) +
      (parseNumber(fields.servicing) ?? 0) +
      (parseNumber(fields.other) ?? 0);

    const depreciation = Math.max(price - resale, 0) / years;
    const fuelPerDistance = spec.fuelPerDistance(economy) * fuelPrice;
    const fuelPerYear = fuelPerDistance * distance;
    const total = depreciation + fixed + fuelPerYear;

    return {
      depreciation,
      fixed,
      fuelPerYear,
      fuelPerDistance,
      total,
      perDistance: total / distance,
      perMonth: total / 12,
      // What one more journey costs, as against what the year costs divided by
      // the year's distance. The gap between the two is the whole point of the
      // page: the second is the cost of owning, the first the cost of going.
      marginal: fuelPerDistance,
      shares: {
        depreciation: (depreciation / total) * 100,
        fixed: (fixed / total) * 100,
        fuel: (fuelPerYear / total) * 100,
      },
      distance,
    };
  }, [fields, spec]);

  const cash = (value: number, decimals = 0) => formatCurrency(value, currency, { decimals });

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Units"
          value={system}
          onChange={setSystem}
          options={[
            { value: 'us' as const, label: 'US' },
            { value: 'uk' as const, label: 'UK' },
            { value: 'metric' as const, label: 'Metric' },
          ]}
        />
        <ResetButton onClick={() => setFields({ ...DEFAULTS })} />
      </div>

      <p className="mt-4 text-sm font-semibold text-ink-800">The car</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <NumberField label="Purchase price" value={fields.price} onChange={set('price')} min={0} />
        <NumberField
          label="Value when you sell it"
          value={fields.resale}
          onChange={set('resale')}
          min={0}
          hint="A guess is fine — it is usually the largest cost, so it is worth guessing."
        />
        <NumberField
          label="Years you will keep it"
          value={fields.years}
          onChange={set('years')}
          unit="years"
          min={0}
        />
        <NumberField
          label={`Distance per year (${spec.distancePlural})`}
          value={fields.distance}
          onChange={set('distance')}
          min={0}
          inputMode="numeric"
        />
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-800">Fuel</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <NumberField label={spec.economyLabel} value={fields.economy} onChange={set('economy')} min={0} />
        <NumberField label={spec.priceLabel} value={fields.fuelPrice} onChange={set('fuelPrice')} min={0} />
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-800">Standing costs, per year</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <NumberField label="Insurance" value={fields.insurance} onChange={set('insurance')} min={0} />
        <NumberField label="Road tax or registration" value={fields.tax} onChange={set('tax')} min={0} />
        <NumberField
          label="Servicing, tyres and repairs"
          value={fields.servicing}
          onChange={set('servicing')}
          min={0}
          hint="An average year. Older cars are lumpier than this figure suggests."
        />
        <NumberField label="Anything else" value={fields.other} onChange={set('other')} min={0} />
      </div>

      <div className="mt-6">
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`Total cost per ${spec.distance}`}
            value={cash(result.perDistance, 2)}
            verdict={`${cash(result.total)} a year · ${cash(result.perMonth)} a month · everything included`}
          />

          <ResultRows
            rows={[
              {
                label: `Depreciation — ${formatNumber(result.shares.depreciation, 0)}% of the total`,
                value: `${cash(result.depreciation)} a year`,
                emphasis: result.shares.depreciation >= result.shares.fuel,
              },
              {
                label: `Fuel — ${formatNumber(result.shares.fuel, 0)}%`,
                value: `${cash(result.fuelPerYear)} a year`,
              },
              {
                label: `Insurance, tax and servicing — ${formatNumber(result.shares.fixed, 0)}%`,
                value: `${cash(result.fixed)} a year`,
              },
              {
                label: `Fuel alone, per ${spec.distance}`,
                value: cash(result.fuelPerDistance, 2),
              },
              {
                label: `Cost of one extra ${spec.distance} (marginal)`,
                value: cash(result.marginal, 2),
                emphasis: true,
              },
              {
                label: `A 100-${spec.distance} round trip`,
                value: `${cash(result.marginal * 100)} in fuel · ${cash(
                  result.perDistance * 100,
                )} at the full rate`,
              },
            ]}
          />

          {result.shares.depreciation > result.shares.fuel && (
            <p className="rounded-control border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-600">
              Depreciation is the largest single cost here — bigger than the fuel, and the
              only one that never arrives as a bill. It is the reason a car feels cheaper to
              run than it is, and the reason the published reimbursement rates are so much
              higher than a fuel-only calculation suggests.
            </p>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            The two per-{spec.distance} figures answer different questions. Use the marginal
            one to decide whether to make a particular journey, since insurance and
            depreciation are being paid either way. Use the full one to decide whether to keep
            the car — that is what the whole arrangement costs.
          </p>
        </div>
      )}

      {result === null && (
        <p className="mt-6 text-sm leading-relaxed text-ink-500">
          Fill in the price, the years, the annual distance, the fuel economy and the fuel
          price. The standing costs can be left at zero if you only want the running figure.
        </p>
      )}
    </CalculatorPanel>
  );
}
