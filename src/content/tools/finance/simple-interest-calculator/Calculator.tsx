'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  NumberField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';
import {
  CURRENCIES,
  formatCurrency,
  formatNumber,
  formatPercent,
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

type TermUnit = 'years' | 'months' | 'days';

const TERM_UNITS = [
  { value: 'years' as const, label: 'Years' },
  { value: 'months' as const, label: 'Months' },
  { value: 'days' as const, label: 'Days' },
];

/**
 * Day-count basis. Only consulted when the term is entered in days, which is
 * the only place the choice changes the answer.
 *
 * It is offered at all because actual/360 is not a rounding quirk — it is the
 * standard on most US commercial lending, and it makes a full year cost
 * 365/360 of the quoted rate. That is a real 1.4 percent that borrowers
 * routinely do not know they are paying.
 */
const DAY_BASIS = [
  { value: '365', label: 'Actual/365 — days ÷ 365' },
  { value: '360', label: 'Actual/360 — days ÷ 360 (US commercial standard)' },
];

export default function SimpleInterestCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('6');
  const [term, setTerm] = useState('5');
  const [termUnit, setTermUnit] = useState<TermUnit>('years');
  const [basis, setBasis] = useState('365');

  const result = useMemo(() => {
    const principalValue = parseNumber(principal);
    const rateValue = parseNumber(rate);
    const termValue = parseNumber(term);

    if (principalValue === null || principalValue <= 0) return null;
    if (rateValue === null || rateValue < 0) return null;
    if (termValue === null || termValue <= 0) return null;

    // Everything is converted to years, because the rate is annual and mixing
    // an annual rate with a term in months is the single most common way this
    // formula gets used wrong.
    const years =
      termUnit === 'years'
        ? termValue
        : termUnit === 'months'
          ? termValue / 12
          : termValue / Number(basis);

    const r = rateValue / 100;
    const interest = principalValue * r * years;
    const total = principalValue + interest;

    // Same principal, same rate, same term, compounded annually — the honest
    // comparison, and the reason this page exists rather than just the formula.
    const compoundTotal = principalValue * Math.pow(1 + r, years);
    const compoundInterest = compoundTotal - principalValue;

    return {
      interest,
      total,
      years,
      perDay: interest / (years * 365),
      perMonth: interest / (years * 12),
      compoundInterest,
      compoundGap: compoundInterest - interest,
      // Reversing the formula: the effective annual rate implied by the total
      // interest, which is what lets a reader check a quoted deal.
      impliedRate: years > 0 ? (interest / (principalValue * years)) * 100 : 0,
      showsBasis: termUnit === 'days',
      basisPenalty:
        termUnit === 'days' && basis === '360'
          ? principalValue * r * (termValue / 360 - termValue / 365)
          : 0,
    };
  }, [principal, rate, term, termUnit, basis]);

  function reset() {
    setPrincipal('');
    setRate('');
    setTerm('');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

  return (
    <CalculatorPanel label="Input · principal, rate, time">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="w-full sm:w-56">
          <SelectField
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
          />
        </div>
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Principal (P)"
          value={principal}
          onChange={setPrincipal}
          placeholder="10000"
          min={0}
        />
        <NumberField
          label="Annual interest rate (r)"
          value={rate}
          onChange={setRate}
          unit="%"
          placeholder="6"
          min={0}
        />
        <NumberField
          label="Time (t)"
          value={term}
          onChange={setTerm}
          placeholder="5"
          min={0}
        />
        <SelectField
          label="Time unit"
          value={termUnit}
          onChange={setTermUnit}
          options={TERM_UNITS}
        />
        {termUnit === 'days' && (
          <div className="sm:col-span-2">
            <SelectField
              label="Day-count basis"
              value={basis}
              onChange={setBasis}
              options={DAY_BASIS}
              hint="Your loan agreement states which one applies. Dividing by 360 makes every day slightly more expensive."
            />
          </div>
        )}
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Simple interest"
            value={money(result.interest)}
            verdict={`Total repayable ${money(result.total)}`}
          >
            <p className="numeric text-sm text-ink-600">
              {formatNumber(parseNumber(principal) ?? 0, 2)} × {formatPercent(parseNumber(rate) ?? 0, 2)} ×{' '}
              {formatNumber(result.years, 4)} yr
            </p>
          </ResultCard>

          <ResultRows
            rows={[
              { label: 'Total repayable', value: money(result.total), emphasis: true },
              { label: 'Interest per month', value: money(result.perMonth) },
              { label: 'Interest per day', value: money(result.perDay) },
              { label: 'Term in years', value: formatNumber(result.years, 4) },
              {
                label: 'Implied annual rate (interest ÷ P ÷ t)',
                value: formatPercent(result.impliedRate, 3),
              },
            ]}
          />

          {/* The comparison is the point. Simple interest is almost always being
              weighed against a compounding alternative, and quoting it alone
              hides the only number that makes it meaningful. */}
          <div className="rounded-card border border-line bg-surface p-5">
            <p className="eyebrow eyebrow-muted">Against annual compounding</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-ink-500">Simple</dt>
                <dd className="numeric mt-1 text-xl font-bold text-ink-900">
                  {money(result.interest)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-500">Compounded annually</dt>
                <dd className="numeric mt-1 text-xl font-bold text-ink-900">
                  {money(result.compoundInterest)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Compounding costs a further <strong>{money(result.compoundGap)}</strong> over
              the same term at the same rate. Under a year the two are nearly identical;
              the gap widens exponentially with time, which is why the distinction barely
              matters on a 90-day note and matters enormously on a 20-year one.
            </p>
          </div>

          {result.showsBasis && result.basisPenalty > 0 && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                The 360-day basis is costing {money(result.basisPenalty)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                Dividing an annual rate by 360 while charging for actual calendar days
                makes each day worth 365/360 of what the quoted rate implies — about 1.4
                percent more interest across a full year. It is a standard convention
                rather than an error, but it means the effective rate is slightly above the
                one on the paperwork.
              </p>
            </div>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
