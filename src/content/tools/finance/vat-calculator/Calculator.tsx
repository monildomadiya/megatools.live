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

type Direction = 'add' | 'remove';

const DIRECTIONS = [
  { value: 'add' as const, label: 'Add VAT' },
  { value: 'remove' as const, label: 'Remove VAT' },
];

/**
 * Presets rather than a free-text rate alone, because the two mistakes readers
 * actually make are typing the wrong country's rate and typing 0.2 where 20 was
 * meant. A named list makes the first visible and the second unlikely.
 *
 * `custom` keeps the tool useful for a rate not listed here — rates move, and a
 * calculator that can only do today's list ages badly.
 */
const PRESETS = [
  { value: '20', label: 'UK standard — 20%' },
  { value: '5', label: 'UK reduced — 5%' },
  { value: '0', label: 'UK zero rate — 0%' },
  { value: '23', label: 'Ireland standard — 23%' },
  { value: '19', label: 'Germany standard — 19%' },
  { value: '21', label: 'Netherlands / Spain standard — 21%' },
  { value: 'custom', label: 'Custom rate' },
] as const;

export default function VatCalculator() {
  const [direction, setDirection] = useState<Direction>('add');
  const [amount, setAmount] = useState('');
  const [preset, setPreset] = useState<string>('20');
  const [customRate, setCustomRate] = useState('20');
  const [currency, setCurrency] = useState<CurrencyCode>('GBP');

  const rate = preset === 'custom' ? parseNumber(customRate) : Number(preset);

  const result = useMemo(() => {
    const value = parseNumber(amount);
    if (value === null || value < 0) return null;
    if (rate === null || rate < 0 || rate > 100) return null;

    const multiplier = 1 + rate / 100;

    // Both branches derive the other two figures from the one the reader typed,
    // so the three always reconcile exactly. Deriving VAT independently and
    // adding it back would let rounding leave net + VAT ≠ gross.
    const net = direction === 'add' ? value : value / multiplier;
    const gross = direction === 'add' ? value * multiplier : value;
    const vat = gross - net;

    return { net, gross, vat, multiplier };
  }, [amount, direction, rate]);

  function reset() {
    setAmount('');
    setPreset('20');
    setCustomRate('20');
    setDirection('add');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });
  const rateLabel = rate === null ? '—' : `${rate}%`;

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={DIRECTIONS}
        />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label={direction === 'add' ? 'Net amount (before VAT)' : 'Gross amount (VAT included)'}
          value={amount}
          onChange={setAmount}
          placeholder={direction === 'add' ? '100' : '120'}
          min={0}
          hint={
            direction === 'add'
              ? 'The price as quoted business-to-business, before tax is added.'
              : 'The price as shown to a consumer, with tax already inside it.'
          }
        />

        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />

        <SelectField
          label="VAT rate"
          value={preset}
          onChange={setPreset}
          options={PRESETS.map((p) => ({ value: p.value, label: p.label }))}
        />

        {preset === 'custom' && (
          <NumberField
            label="Custom rate"
            value={customRate}
            onChange={setCustomRate}
            unit="%"
            placeholder="20"
            min={0}
            max={100}
            hint="Enter the percentage, not the decimal — 20, not 0.2."
          />
        )}
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={direction === 'add' ? 'Gross price to charge' : 'Net price before VAT'}
            value={money(direction === 'add' ? result.gross : result.net)}
            verdict={`${rateLabel} VAT = ${money(result.vat)}`}
          />

          <ResultRows
            rows={[
              { label: 'Net (excluding VAT)', value: money(result.net) },
              { label: `VAT at ${rateLabel}`, value: money(result.vat), emphasis: true },
              { label: 'Gross (including VAT)', value: money(result.gross) },
              {
                label: direction === 'add' ? 'Multiply the net by' : 'Divide the gross by',
                value: result.multiplier.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''),
              },
              {
                label: 'VAT fraction of the gross',
                value:
                  rate === null || rate === 0
                    ? '—'
                    : `${(rate / (100 + rate)).toFixed(4)} (${rate}/${100 + rate})`,
              },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Figures are rounded to two decimal places, so an invoice total may differ by a
            penny depending on whether your accounting software rounds per line or per
            invoice. VAT rates and the goods each one applies to are set by the tax
            authority of the country where the supply is taxed — check the current list
            before relying on a rate for filing.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
