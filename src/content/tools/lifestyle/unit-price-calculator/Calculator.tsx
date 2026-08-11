'use client';

import { useMemo, useState } from 'react';
import { ResetButton, SelectField } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { formatNumber, parseNumber } from '@/lib/format';

/**
 * Units grouped by what they measure, with a factor into that group's base.
 *
 * The group is what makes a comparison legitimate: grams and ounces can be put
 * on one basis, grams and millilitres cannot. Anything mixing groups is
 * refused rather than silently compared, because a tool that happily reports
 * "£2 per kg" against "£3 per litre" is worse than one that says it cannot.
 */
const UNITS = [
  { value: 'g', label: 'Grams (g)', group: 'mass', factor: 1, base: 'kg', baseFactor: 1000 },
  { value: 'kg', label: 'Kilograms (kg)', group: 'mass', factor: 1000, base: 'kg', baseFactor: 1000 },
  { value: 'oz', label: 'Ounces (oz)', group: 'mass', factor: 28.349523125, base: 'kg', baseFactor: 1000 },
  { value: 'lb', label: 'Pounds (lb)', group: 'mass', factor: 453.59237, base: 'kg', baseFactor: 1000 },
  { value: 'ml', label: 'Millilitres (ml)', group: 'volume', factor: 1, base: 'litre', baseFactor: 1000 },
  { value: 'l', label: 'Litres (l)', group: 'volume', factor: 1000, base: 'litre', baseFactor: 1000 },
  { value: 'floz', label: 'US fluid ounces (fl oz)', group: 'volume', factor: 29.5735295625, base: 'litre', baseFactor: 1000 },
  { value: 'item', label: 'Items / count', group: 'count', factor: 1, base: 'item', baseFactor: 1 },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

interface Row {
  id: number;
  label: string;
  price: string;
  quantity: string;
  unit: UnitCode;
}

const BLANK: Row[] = [
  { id: 1, label: 'Small pack', price: '2.50', quantity: '400', unit: 'g' },
  { id: 2, label: 'Large pack', price: '5.60', quantity: '1', unit: 'kg' },
  { id: 3, label: '', price: '', quantity: '', unit: 'g' },
  { id: 4, label: '', price: '', quantity: '', unit: 'g' },
];

export default function UnitPriceCalculator() {
  const [rows, setRows] = useState<Row[]>(BLANK);

  function update(id: number, patch: Partial<Row>) {
    setRows((previous) => previous.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  const analysis = useMemo(() => {
    const priced = rows
      .map((row) => {
        const price = parseNumber(row.price);
        const quantity = parseNumber(row.quantity);
        if (price === null || quantity === null || price <= 0 || quantity <= 0) return null;

        const spec = unitFor(row.unit);
        // Everything lands on the group's base unit — per kg, per litre, per item.
        const inBase = (quantity * spec.factor) / spec.baseFactor;
        return {
          row,
          group: spec.group,
          base: spec.base,
          unitPrice: price / inBase,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    if (priced.length === 0) return null;

    const groups = new Set(priced.map((entry) => entry.group));
    if (groups.size > 1) {
      return { mixed: true as const, priced: [] as typeof priced, cheapest: null, dearest: null };
    }

    const sorted = [...priced].sort((a, b) => a.unitPrice - b.unitPrice);
    return {
      mixed: false as const,
      priced: sorted,
      cheapest: sorted[0]!,
      dearest: sorted[sorted.length - 1]!,
    };
  }, [rows]);

  const saving =
    analysis && !analysis.mixed && analysis.cheapest && analysis.dearest && analysis.priced.length > 1
      ? (1 - analysis.cheapest.unitPrice / analysis.dearest.unitPrice) * 100
      : null;

  return (
    <CalculatorPanel label="Products · unit price">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          Enter price and pack size. Leave a row blank to ignore it.
        </p>
        <ResetButton onClick={() => setRows(BLANK)} />
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((row, index) => (
          <div key={row.id} className="rounded-control border border-line bg-panel-2 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="numeric text-xs text-ink-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <input
                type="text"
                value={row.label}
                onChange={(event) => update(row.id, { label: event.target.value })}
                placeholder={`Product ${index + 1}`}
                aria-label={`Name for product ${index + 1}`}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-ink-800 outline-none placeholder:font-normal placeholder:text-ink-400"
              />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="block text-sm font-medium text-ink-700">
                Price
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  value={row.price}
                  onChange={(event) => update(row.id, { price: event.target.value })}
                  placeholder="0.00"
                  className="numeric mt-1.5 w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-base font-bold text-ink-900 outline-none focus:border-brand-500"
                />
              </label>
              <label className="block text-sm font-medium text-ink-700">
                Quantity
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  value={row.quantity}
                  onChange={(event) => update(row.id, { quantity: event.target.value })}
                  placeholder="0"
                  className="numeric mt-1.5 w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-base font-bold text-ink-900 outline-none focus:border-brand-500"
                />
              </label>
              <SelectField
                label="Unit"
                value={row.unit}
                onChange={(unit) => update(row.id, { unit })}
                options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
              />
            </div>
          </div>
        ))}
      </div>

      {analysis?.mixed && (
        <p role="alert" className="mt-6 rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
          These rows mix weight, volume and count, which cannot be compared on one basis.
          Pick a single kind of measure — or convert to one first, if you know what a unit
          of the odd one out weighs.
        </p>
      )}

      {analysis && !analysis.mixed && analysis.priced.length > 0 && (
        <div className="mt-7">
          <p className="mb-2 text-sm font-medium text-ink-600">
            Ranked by price per {analysis.cheapest!.base}
          </p>

          <ol className="overflow-hidden rounded-card border border-line bg-panel">
            {analysis.priced.map((entry, index) => {
              const best = index === 0 && analysis.priced.length > 1;
              return (
                <li
                  key={entry.row.id}
                  className={`flex items-center justify-between gap-4 border-t border-line-soft px-5 py-4 first:border-t-0 ${
                    best ? 'bg-emerald-50' : ''
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink-900">
                      {entry.row.label || `Product ${entry.row.id}`}
                    </span>
                    <span className="numeric block text-xs text-ink-500">
                      {entry.row.price} for {entry.row.quantity} {entry.row.unit}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      className={`numeric block text-base font-bold ${
                        best ? 'text-emerald-800' : 'text-ink-900'
                      }`}
                    >
                      {formatNumber(entry.unitPrice, entry.unitPrice < 1 ? 3 : 2)}
                    </span>
                    <span className="block text-xs text-ink-500">
                      per {entry.base}
                      {best ? ' · cheapest' : ''}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          {saving !== null && saving > 0.05 && (
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              The cheapest is <strong>{formatNumber(saving, 1)}% less</strong> per{' '}
              {analysis.cheapest!.base} than the dearest here. That is a comparison of
              unit price only — it says nothing about whether you will use the larger
              quantity before it spoils.
            </p>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
