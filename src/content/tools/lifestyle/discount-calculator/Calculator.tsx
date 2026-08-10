'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
  UnitToggle,
} from '@/components/tool/fields';
import { CURRENCIES, formatCurrency, parseNumber, type CurrencyCode } from '@/lib/format';

type Mode = 'percent' | 'amount';

const MODES = [
  { value: 'percent' as const, label: 'Percent off' },
  { value: 'amount' as const, label: 'Money off' },
];

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>('percent');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [second, setSecond] = useState('');
  const [tax, setTax] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const result = useMemo(() => {
    const original = parseNumber(price);
    const first = parseNumber(discount);
    if (original === null || original <= 0) return null;
    if (first === null || first < 0) return null;
    if (mode === 'percent' && first > 100) return null;
    if (mode === 'amount' && first > original) return null;

    const afterFirst = mode === 'percent' ? original * (1 - first / 100) : original - first;

    // The second discount is always a percentage and always applies to the
    // already-reduced price — that is the whole reason it is here, since the
    // instinct to add the two percentages together is what makes stacked
    // offers look better than they are.
    const secondPercent = parseNumber(second);
    const hasSecond = secondPercent !== null && secondPercent > 0 && secondPercent <= 100;
    const afterSecond = hasSecond ? afterFirst * (1 - secondPercent / 100) : afterFirst;

    const taxPercent = parseNumber(tax);
    const hasTax = taxPercent !== null && taxPercent > 0 && taxPercent <= 100;
    const taxAmount = hasTax ? afterSecond * (taxPercent / 100) : 0;

    const saving = original - afterSecond;

    return {
      original,
      afterFirst,
      afterSecond,
      hasSecond,
      secondPercent: hasSecond ? secondPercent : 0,
      hasTax,
      taxAmount,
      total: afterSecond + taxAmount,
      saving,
      effectivePercent: (saving / original) * 100,
    };
  }, [price, discount, second, tax, mode]);

  function reset() {
    setPrice('');
    setDiscount('');
    setSecond('');
    setTax('');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Discount type" value={mode} onChange={setMode} options={MODES} />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Original price"
          value={price}
          onChange={setPrice}
          placeholder="80"
          min={0}
        />

        <NumberField
          label={mode === 'percent' ? 'Discount' : 'Amount off'}
          value={discount}
          onChange={setDiscount}
          unit={mode === 'percent' ? '%' : undefined}
          placeholder={mode === 'percent' ? '25' : '20'}
          min={0}
          max={mode === 'percent' ? 100 : undefined}
        />

        <NumberField
          label="Second discount (optional)"
          value={second}
          onChange={setSecond}
          unit="%"
          placeholder="10"
          min={0}
          max={100}
          hint="An extra percentage taken off the already-reduced price — a checkout code on top of a sale."
        />

        <NumberField
          label="Sales tax or VAT (optional)"
          value={tax}
          onChange={setTax}
          unit="%"
          placeholder="20"
          min={0}
          max={100}
          hint="Added to the discounted price. Leave blank if the price already includes tax."
        />

        <div className="sm:col-span-2">
          <SelectField
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={result.hasTax ? 'Price you pay, tax included' : 'Sale price'}
            value={money(result.total)}
            verdict={`You save ${money(result.saving)} — ${result.effectivePercent.toFixed(1)}% off`}
            tone="good"
          />

          <ResultRows
            rows={[
              { label: 'Original price', value: money(result.original) },
              ...(result.hasSecond
                ? [
                    { label: 'After the first discount', value: money(result.afterFirst) },
                    {
                      label: `After a further ${result.secondPercent}%`,
                      value: money(result.afterSecond),
                    },
                  ]
                : []),
              { label: 'Total saving', value: money(result.saving), emphasis: true },
              {
                label: 'Effective discount',
                value: `${result.effectivePercent.toFixed(1)}%`,
                emphasis: result.hasSecond,
              },
              ...(result.hasTax
                ? [
                    { label: 'Price before tax', value: money(result.afterSecond) },
                    { label: 'Tax added', value: money(result.taxAmount) },
                  ]
                : []),
              { label: 'You pay', value: money(result.total) },
            ]}
          />

          {result.hasSecond && (
            <p className="text-sm leading-relaxed text-ink-500">
              The two discounts come to {result.effectivePercent.toFixed(1)}% together, not
              the sum of the two percentages. The second one is taken off what is left after
              the first, so part of it is a discount on a discount.
            </p>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
