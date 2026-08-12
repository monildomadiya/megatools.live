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
 * Compounding frequencies, as periods per year.
 *
 * Both daily conventions are here because both are used and they are not
 * interchangeable: 365 is what a card issuer applies to a purchase balance,
 * while 360 survives in commercial lending, where it quietly makes a stated
 * rate slightly more expensive than it looks. Continuous is the limiting case
 * and carries no period count at all.
 */
const FREQUENCIES = [
  { value: 'annual', label: 'Annually', periods: 1 },
  { value: 'semi', label: 'Semi-annually (twice a year)', periods: 2 },
  { value: 'quarter', label: 'Quarterly', periods: 4 },
  { value: 'month', label: 'Monthly', periods: 12 },
  { value: 'fortnight', label: 'Fortnightly (26 a year)', periods: 26 },
  { value: 'week', label: 'Weekly', periods: 52 },
  { value: 'day365', label: 'Daily (365-day year)', periods: 365 },
  { value: 'day360', label: 'Daily (360-day banker’s year)', periods: 360 },
  { value: 'continuous', label: 'Continuously', periods: Infinity },
] as const;

type FrequencyCode = (typeof FREQUENCIES)[number]['value'];

const frequencyFor = (code: FrequencyCode) => FREQUENCIES.find((f) => f.value === code)!;

/** Nominal annual rate → effective annual rate. Both as decimals. */
function toEffective(nominal: number, periods: number): number {
  if (!Number.isFinite(periods)) return Math.expm1(nominal);
  return Math.pow(1 + nominal / periods, periods) - 1;
}

/** Effective annual rate → the nominal rate that produces it. */
function toNominal(effective: number, periods: number): number {
  if (!Number.isFinite(periods)) return Math.log1p(effective);
  return periods * (Math.pow(1 + effective, 1 / periods) - 1);
}

type Direction = 'to-apy' | 'to-apr';

export default function AprToApyCalculator() {
  const [direction, setDirection] = useState<Direction>('to-apy');
  const [rate, setRate] = useState('12');
  const [frequency, setFrequency] = useState<FrequencyCode>('month');
  const [balance, setBalance] = useState('10000');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const parsed = parseNumber(rate);
  const principal = parseNumber(balance);
  const periods = frequencyFor(frequency).periods;

  const result = useMemo(() => {
    if (parsed === null) return null;
    const input = parsed / 100;
    // A rate below −100% is not a rate, and the power terms stop being real.
    if (input <= -1) return null;

    const nominal = direction === 'to-apy' ? input : toNominal(input, periods);
    const effective = direction === 'to-apy' ? toEffective(input, periods) : input;

    return {
      nominal,
      effective,
      gap: effective - nominal,
      periodic: Number.isFinite(periods) ? nominal / periods : null,
      // The ceiling for this nominal rate however often it compounds. Shown
      // because it settles the "what if it were hourly" question permanently.
      continuous: Math.expm1(nominal),
    };
  }, [parsed, direction, periods]);

  const money = useMemo(() => {
    if (result === null || principal === null || principal <= 0) return null;
    return {
      effective: principal * result.effective,
      nominal: principal * result.nominal,
    };
  }, [result, principal]);

  function reset() {
    setDirection('to-apy');
    setRate('12');
    setFrequency('month');
    setBalance('10000');
    setCurrency('USD');
  }

  const pct = (value: number, digits = 3) => `${formatNumber(value * 100, digits)}%`;

  return (
    <CalculatorPanel>
      <div className="mb-5">
        <UnitToggle
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'to-apy', label: 'Nominal APR → APY' },
            { value: 'to-apr', label: 'APY → nominal APR' },
          ]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label={direction === 'to-apy' ? 'Nominal annual rate (APR)' : 'Effective annual rate (APY)'}
          value={rate}
          onChange={setRate}
          unit="%"
          hint={
            direction === 'to-apy'
              ? 'The headline rate, before compounding is counted.'
              : 'The figure a savings account advertises as its yield.'
          }
        />
        <SelectField
          label="Compounded"
          value={frequency}
          onChange={setFrequency}
          options={FREQUENCIES.map((f) => ({ value: f.value, label: f.label }))}
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={direction === 'to-apy' ? 'Effective annual rate (APY)' : 'Nominal annual rate (APR)'}
            value={pct(direction === 'to-apy' ? result.effective : result.nominal)}
            verdict={
              Math.abs(result.gap) < 1e-9
                ? 'Compounded once a year, so the nominal and effective rates are the same figure'
                : `${pct(Math.abs(result.gap), 3)} ${
                    result.gap > 0 ? 'more' : 'less'
                  } than the nominal rate — that difference is the compounding`
            }
          />

          <ResultRows
            rows={[
              { label: 'Nominal annual rate', value: pct(result.nominal), emphasis: direction === 'to-apr' },
              {
                label: 'Effective annual rate',
                value: pct(result.effective),
                emphasis: direction === 'to-apy',
              },
              {
                label: 'Rate per compounding period',
                value: result.periodic === null ? 'n/a — continuous' : pct(result.periodic, 5),
              },
              {
                label: 'Periods per year',
                value: Number.isFinite(periods) ? String(periods) : 'infinite',
              },
              {
                label: 'Ceiling if compounded continuously',
                value: pct(result.continuous),
              },
            ]}
          />

          <div className="border-t border-line pt-6">
            <p className="text-sm font-semibold text-ink-800">What it comes to on a balance</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <NumberField label="Balance" value={balance} onChange={setBalance} min={0} />
              <SelectField
                label="Currency"
                value={currency}
                onChange={setCurrency}
                options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
              />
            </div>

            {money && (
              <div className="mt-4">
                <ResultRows
                  rows={[
                    {
                      label: 'Interest over one year, as it actually compounds',
                      value: formatCurrency(money.effective, currency, { decimals: 2 }),
                      emphasis: true,
                    },
                    {
                      label: 'Interest if the nominal rate were paid once a year',
                      value: formatCurrency(money.nominal, currency, { decimals: 2 }),
                    },
                    {
                      label: 'Difference the compounding makes',
                      value: formatCurrency(money.effective - money.nominal, currency, {
                        decimals: 2,
                      }),
                    },
                  ]}
                />
              </div>
            )}
          </div>

          {frequency === 'day360' && (
            <p className="rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
              A 360-day year divides the annual rate into 360 parts and then charges it on all
              365 days, so the borrower pays about 1.4% more interest than the stated rate
              implies. It is a convention rather than an error, and it is worth knowing it is
              in the contract.
            </p>
          )}
        </div>
      )}

      {parsed !== null && parsed <= -100 && (
        <p role="alert" className="mt-6 text-sm text-red-600">
          Enter a rate above −100%. Below that the arithmetic stops describing anything real.
        </p>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
