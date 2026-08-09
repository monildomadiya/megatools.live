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
  { value: 'add' as const, label: 'Add tax' },
  { value: 'remove' as const, label: 'Remove tax' },
];

/**
 * Presets only for rates set nationally and stable enough to be worth pinning.
 * Deliberately no US state rates: a US rate is a stack of state, county, city
 * and district rates that varies street by street, and offering a "California
 * rate" would be wrong for most of California.
 */
const PRESETS = [
  { value: 'custom', label: 'Custom rate', rate: null },
  { value: 'uk-standard', label: 'UK VAT — standard, 20%', rate: 20 },
  { value: 'uk-reduced', label: 'UK VAT — reduced, 5%', rate: 5 },
  { value: 'uk-zero', label: 'UK VAT — zero rated, 0%', rate: 0 },
  { value: 'ie', label: 'Ireland VAT — standard, 23%', rate: 23 },
  { value: 'de', label: 'Germany VAT — standard, 19%', rate: 19 },
  { value: 'fr', label: 'France VAT — standard, 20%', rate: 20 },
  { value: 'au', label: 'Australia GST, 10%', rate: 10 },
  { value: 'nz', label: 'New Zealand GST, 15%', rate: 15 },
  { value: 'ca-gst', label: 'Canada GST, 5%', rate: 5 },
  { value: 'in-18', label: 'India GST — 18% slab', rate: 18 },
] as const;

export default function SalesTaxCalculator() {
  const [direction, setDirection] = useState<Direction>('add');
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('20');
  const [preset, setPreset] = useState<(typeof PRESETS)[number]['value']>('uk-standard');
  const [currency, setCurrency] = useState<CurrencyCode>('GBP');

  const result = useMemo(() => {
    const value = parseNumber(amount);
    const percent = parseNumber(rate);
    if (value === null || percent === null || value < 0) return null;
    if (percent < 0 || percent > 100) return null;

    const multiplier = 1 + percent / 100;

    // The whole point of the tool: going from gross to net is a division by
    // (1 + rate), never a subtraction of the rate. Taking 20% off a £120 gross
    // gives £96, and the correct answer is £100.
    const net = direction === 'add' ? value : value / multiplier;
    const tax = direction === 'add' ? value * (percent / 100) : value - net;
    const gross = net + tax;

    return {
      net,
      tax,
      gross,
      percent,
      // The share of the gross price that is tax, which is a smaller number
      // than the rate and the one people are surprised by.
      taxShareOfGross: gross === 0 ? 0 : (tax / gross) * 100,
      divisor: multiplier,
    };
  }, [amount, rate, direction]);

  function applyPreset(value: (typeof PRESETS)[number]['value']) {
    setPreset(value);
    const found = PRESETS.find((option) => option.value === value);
    if (found && found.rate !== null) setRate(String(found.rate));
  }

  function reset() {
    setAmount('');
    setRate('20');
    setPreset('uk-standard');
    setDirection('add');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

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
          label={direction === 'add' ? 'Price before tax' : 'Price including tax'}
          value={amount}
          onChange={setAmount}
          placeholder={direction === 'add' ? '100' : '120'}
          min={0}
          hint={
            direction === 'add'
              ? 'The net figure — what the item costs before tax is applied.'
              : 'The gross figure — the total on the price tag or receipt.'
          }
        />
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((option) => ({ value: option.value, label: option.label }))}
        />
        <SelectField
          label="Rate preset"
          value={preset}
          onChange={applyPreset}
          options={PRESETS.map((option) => ({ value: option.value, label: option.label }))}
          hint="No US presets — a US rate is a stack of state, county and city rates that varies by address."
        />
        <NumberField
          label="Tax rate"
          value={rate}
          onChange={(value) => {
            setRate(value);
            setPreset('custom');
          }}
          unit="%"
          placeholder="20"
          min={0}
          max={100}
        />
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label={direction === 'add' ? 'Total including tax' : 'Price before tax'}
            value={money(direction === 'add' ? result.gross : result.net)}
            verdict={`${money(result.tax)} of tax at ${result.percent}%`}
          />

          <ResultRows
            rows={[
              { label: 'Net — price before tax', value: money(result.net) },
              { label: 'Tax', value: money(result.tax), emphasis: true },
              { label: 'Gross — price including tax', value: money(result.gross) },
              {
                label: 'Tax as a share of the gross price',
                value: `${result.taxShareOfGross.toFixed(2)}%`,
              },
            ]}
          />

          <div className="rounded-card border border-line bg-panel-2 p-5">
            <p className="text-sm font-semibold text-ink-800">The working</p>
            {direction === 'add' ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {money(result.net)} × {result.percent}% = {money(result.tax)} of tax, and{' '}
                {money(result.net)} + {money(result.tax)} = {money(result.gross)}.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {money(result.gross)} ÷ {result.divisor.toFixed(4)} = {money(result.net)} net,
                so the tax is {money(result.gross)} − {money(result.net)} ={' '}
                {money(result.tax)}. Dividing by 1 plus the rate is the step that matters —
                taking {result.percent}% off the gross would give{' '}
                {money(result.gross * (1 - result.percent / 100))}, which is wrong.
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            Rates change and exemptions are everywhere — zero-rated goods, reduced rates,
            and thresholds that decide whether you have to charge tax at all. Check the
            current rate with the relevant tax authority before invoicing on it.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
