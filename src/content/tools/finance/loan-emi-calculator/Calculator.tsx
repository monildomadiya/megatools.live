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
  amortisingPayment,
  formatCurrency,
  formatPercent,
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

const TERM_UNIT_OPTIONS = [
  { value: 'years', label: 'Years' },
  { value: 'months', label: 'Months' },
];

/**
 * Runs the schedule forward to find the real payoff point when an overpayment
 * is applied. There is a closed form for this, but it breaks down when the
 * final instalment is partial — which it almost always is — and reports a
 * fractional month that does not correspond to anything the borrower will see
 * on a statement.
 */
function simulateWithExtra(principal: number, monthlyRate: number, payment: number) {
  let balance = principal;
  let interestPaid = 0;
  let months = 0;

  // 1200 months is a hard stop for the case where the payment does not cover
  // the interest and the balance would grow forever.
  while (balance > 0 && months < 1200) {
    const interest = balance * monthlyRate;
    const due = Math.min(payment, balance + interest);
    balance = balance + interest - due;
    interestPaid += interest;
    months++;
  }

  return { months, interestPaid, cleared: balance <= 0 };
}

export default function LoanEmiCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState('25000');
  const [rate, setRate] = useState('11');
  const [term, setTerm] = useState('5');
  const [termUnit, setTermUnit] = useState('years');
  const [extra, setExtra] = useState('');

  const result = useMemo(() => {
    const principal = parseNumber(amount);
    const annualRate = parseNumber(rate);
    const termValue = parseNumber(term);

    if (principal === null || principal <= 0) return null;
    if (annualRate === null || annualRate < 0 || annualRate > 100) return null;
    if (termValue === null || termValue <= 0) return null;

    const months = Math.round(termUnit === 'years' ? termValue * 12 : termValue);
    if (months < 1 || months > 600) return null;

    const monthlyRate = annualRate / 100 / 12;
    const emi = amortisingPayment(principal, monthlyRate, months);

    const totalPaid = emi * months;
    const totalInterest = totalPaid - principal;

    const firstInterest = principal * monthlyRate;
    const firstPrincipal = emi - firstInterest;

    const extraValue = parseNumber(extra) ?? 0;
    const overpayment =
      extraValue > 0 ? simulateWithExtra(principal, monthlyRate, emi + extraValue) : null;

    return {
      emi,
      months,
      totalPaid,
      totalInterest,
      firstInterest,
      firstPrincipal,
      interestShare: (totalInterest / totalPaid) * 100,
      overpayment:
        overpayment && overpayment.cleared
          ? {
              months: overpayment.months,
              monthsSaved: months - overpayment.months,
              interestPaid: overpayment.interestPaid,
              interestSaved: totalInterest - overpayment.interestPaid,
              newPayment: emi + extraValue,
            }
          : null,
    };
  }, [amount, rate, term, termUnit, extra]);

  function reset() {
    setAmount('');
    setRate('');
    setTerm('');
    setExtra('');
  }

  const money = (value: number, decimals = 2) => formatCurrency(value, currency, { decimals });

  return (
    <CalculatorPanel>
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
          label="Loan amount"
          value={amount}
          onChange={setAmount}
          placeholder="25000"
          min={0}
        />
        <NumberField
          label="Annual interest rate"
          value={rate}
          onChange={setRate}
          unit="%"
          placeholder="11"
          min={0}
          hint="Reducing balance, not flat rate"
        />
        <NumberField label="Loan term" value={term} onChange={setTerm} placeholder="5" min={0} />
        <SelectField
          label="Term unit"
          value={termUnit}
          onChange={setTermUnit}
          options={TERM_UNIT_OPTIONS}
        />
        <div className="sm:col-span-2">
          <NumberField
            label="Extra payment each month (optional)"
            value={extra}
            onChange={setExtra}
            placeholder="0"
            min={0}
            hint="Paid on top of the instalment and applied straight to the principal."
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard label="Monthly instalment (EMI)" value={money(result.emi)} />

          <ResultRows
            rows={[
              { label: 'Number of instalments', value: `${result.months}` },
              { label: 'Total interest', value: money(result.totalInterest), emphasis: true },
              { label: 'Total amount payable', value: money(result.totalPaid) },
              {
                label: 'Interest as a share of what you pay',
                value: formatPercent(result.interestShare, 1),
              },
            ]}
          />

          <div className="rounded-xl border border-ink-200 bg-ink-50/60 p-5">
            <p className="text-sm font-semibold text-ink-900">Your first instalment</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              <strong className="text-ink-900">{money(result.firstInterest)}</strong> of it is
              interest and <strong className="text-ink-900">{money(result.firstPrincipal)}</strong>{' '}
              reduces the balance. That ratio inverts steadily over the term.
            </p>
          </div>

          {result.overpayment && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold text-emerald-900">
                Paying {money(result.overpayment.newPayment)} a month instead
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-emerald-900">
                <div className="flex justify-between gap-4">
                  <dt>Loan clears in</dt>
                  <dd className="numeric font-semibold">
                    {result.overpayment.months} months ({result.overpayment.monthsSaved} sooner)
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Interest saved</dt>
                  <dd className="numeric font-semibold">
                    {money(result.overpayment.interestSaved)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-sm leading-relaxed text-emerald-800">
                Check for early repayment charges before overpaying, and confirm the lender
                applies the extra to principal rather than holding it as a prepaid instalment.
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            Processing fees, insurance bundled into the loan, and interest charged from the
            disbursement date are not included. Compare offers on APR.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
