'use client';

import { useMemo, useState } from 'react';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { CURRENCIES, formatCurrency, parseNumber, type CurrencyCode } from '@/lib/format';

const PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState('60');
  const [tipPercent, setTipPercent] = useState('20');
  const [people, setPeople] = useState('2');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [taxPercent, setTaxPercent] = useState('0');
  const [tipOnPreTax, setTipOnPreTax] = useState(false);
  const [roundUp, setRoundUp] = useState(false);

  const parsedBill = parseNumber(bill);
  const parsedTip = parseNumber(tipPercent);
  const parsedPeople = parseNumber(people);
  const parsedTax = parseNumber(taxPercent) ?? 0;

  const result = useMemo(() => {
    if (parsedBill === null || parsedTip === null || parsedBill < 0 || parsedTip < 0) {
      return null;
    }

    const headcount = parsedPeople !== null && parsedPeople >= 1 ? Math.floor(parsedPeople) : 1;

    // The bill entered is the total on the receipt. When the reader chooses to
    // tip pre-tax we have to work backwards to the pre-tax subtotal rather than
    // just subtracting a percentage of the total, which would be the wrong base.
    const preTax = tipOnPreTax && parsedTax > 0 ? parsedBill / (1 + parsedTax / 100) : parsedBill;

    const tipBase = tipOnPreTax ? preTax : parsedBill;
    const tip = tipBase * (parsedTip / 100);
    const total = parsedBill + tip;

    const exactPerPerson = total / headcount;
    const perPerson = roundUp ? Math.ceil(exactPerPerson) : exactPerPerson;
    // Rounding each person up means the group hands over slightly more than the
    // bill; that surplus goes to the tip, so it is reported rather than hidden.
    const collected = perPerson * headcount;

    return {
      headcount,
      preTax,
      tipBase,
      tip,
      total,
      exactPerPerson,
      perPerson,
      surplus: collected - total,
      effectiveTipPercent: parsedBill > 0 ? ((collected - parsedBill) / parsedBill) * 100 : 0,
    };
  }, [parsedBill, parsedTip, parsedPeople, parsedTax, tipOnPreTax, roundUp]);

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

  function reset() {
    setBill('60');
    setTipPercent('20');
    setPeople('2');
    setTaxPercent('0');
    setTipOnPreTax(false);
    setRoundUp(false);
  }

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Bill total"
          value={bill}
          onChange={setBill}
          min={0}
          placeholder="60.00"
          hint="The amount at the bottom of the receipt."
        />
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />
      </div>

      <div className="mt-5">
        <span className="block text-sm font-medium text-ink-800">Tip percentage</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active = parsedTip === preset;
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={active}
                onClick={() => setTipPercent(String(preset))}
                className={`h-10 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-transparent bg-brand-solid text-on-brand'
                    : 'border-line text-ink-700 hover:bg-panel-2'
                }`}
              >
                {preset}%
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Custom tip"
          value={tipPercent}
          onChange={setTipPercent}
          unit="%"
          min={0}
        />
        <NumberField
          label="Split between"
          value={people}
          onChange={setPeople}
          unit="people"
          min={1}
          step={1}
          inputMode="numeric"
        />
      </div>

      <div className="mt-5 grid gap-3">
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={tipOnPreTax}
            onChange={(event) => setTipOnPreTax(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">
            Tip on the pre-tax amount
            <span className="mt-0.5 block text-ink-500">
              Enter your sales tax rate below and the tip is calculated on the subtotal
              instead of the receipt total.
            </span>
          </span>
        </label>

        {tipOnPreTax && (
          <NumberField
            label="Sales tax included in the bill"
            value={taxPercent}
            onChange={setTaxPercent}
            unit="%"
            min={0}
            hint="Used to work back to the pre-tax subtotal."
          />
        )}

        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={roundUp}
            onChange={(event) => setRoundUp(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">
            Round each person up to a whole {currency}
            <span className="mt-0.5 block text-ink-500">
              Easier when everyone is paying cash. The extra goes to the tip.
            </span>
          </span>
        </label>
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={
              result.headcount === 1 ? 'Total to pay' : `Each person pays (${result.headcount} people)`
            }
            value={money(result.headcount === 1 ? result.perPerson : result.perPerson)}
            verdict={`Tip ${money(result.tip)} · Total ${money(result.total)}`}
          />

          <ResultRows
            rows={[
              ...(tipOnPreTax && parsedTax > 0
                ? [{ label: 'Pre-tax subtotal', value: money(result.preTax) }]
                : []),
              { label: 'Tip calculated on', value: money(result.tipBase) },
              { label: `Tip at ${parsedTip ?? 0}%`, value: money(result.tip), emphasis: true },
              { label: 'Bill plus tip', value: money(result.total), emphasis: true },
              ...(result.headcount > 1
                ? [
                    { label: 'Exact share each', value: money(result.exactPerPerson) },
                    { label: 'Rounded share each', value: money(result.perPerson) },
                  ]
                : []),
              ...(result.surplus > 0.004
                ? [{ label: 'Extra from rounding', value: money(result.surplus) }]
                : []),
              {
                label: 'Effective tip on the bill',
                value: `${result.effectiveTipPercent.toFixed(1)}%`,
              },
            ]}
          />
        </div>
      )}

      {(parsedBill === null || parsedBill < 0) && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a bill amount of zero or more.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
