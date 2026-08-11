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
import { CURRENCIES, formatCurrency, formatNumber, parseNumber, type CurrencyCode } from '@/lib/format';

/** Refuse to run forever on a payment that never clears the balance. */
const MAX_MONTHS = 720;

interface Schedule {
  months: number;
  interest: number;
  total: number;
  neverClears: boolean;
}

/**
 * Month-by-month rather than a closed-form solution.
 *
 * The formula for the number of periods exists, but it cannot express the
 * minimum-payment case: the minimum is recalculated from the balance every
 * month and stops falling once it hits the floor, which is a piecewise rule
 * rather than a constant payment. Running the schedule handles both modes with
 * one code path, and 720 iterations costs nothing.
 */
function amortise(
  balance: number,
  monthlyRate: number,
  payment: number | null,
  minimum: { percent: number; floor: number } | null,
): Schedule {
  let remaining = balance;
  let interestPaid = 0;
  let months = 0;

  while (remaining > 0.005 && months < MAX_MONTHS) {
    const interest = remaining * monthlyRate;

    const due =
      payment ?? Math.max(remaining * minimum!.percent + interest, Math.min(minimum!.floor, remaining + interest));

    // A payment that does not cover the interest never reduces anything.
    if (due <= interest + 0.005) {
      return { months: MAX_MONTHS, interest: Infinity, total: Infinity, neverClears: true };
    }

    const applied = Math.min(due, remaining + interest);
    interestPaid += interest;
    remaining = remaining + interest - applied;
    months += 1;
  }

  return {
    months,
    interest: interestPaid,
    total: balance + interestPaid,
    neverClears: months >= MAX_MONTHS,
  };
}

function describeMonths(months: number): string {
  if (months >= MAX_MONTHS) return 'Never';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
  return rest === 0 ? `${years}y` : `${years}y ${rest}m`;
}

export default function CreditCardPayoffCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('22');
  const [payment, setPayment] = useState('150');
  const [extra, setExtra] = useState('50');

  function reset() {
    setCurrency('USD');
    setBalance('5000');
    setApr('22');
    setPayment('150');
    setExtra('50');
  }

  const result = useMemo(() => {
    const principal = parseNumber(balance);
    const rate = parseNumber(apr);
    const monthly = parseNumber(payment);
    if (principal === null || rate === null || monthly === null) return null;
    if (principal <= 0 || rate < 0 || monthly <= 0) return null;

    const monthlyRate = rate / 100 / 12;
    const extraAmount = Math.max(parseNumber(extra) ?? 0, 0);

    return {
      yours: amortise(principal, monthlyRate, monthly, null),
      // The common industry rule: 1% of the balance plus that month's interest,
      // with a floor so the payment does not shrink to nothing.
      minimumOnly: amortise(principal, monthlyRate, null, { percent: 0.01, floor: 25 }),
      withExtra:
        extraAmount > 0 ? amortise(principal, monthlyRate, monthly + extraAmount, null) : null,
      monthlyRate,
      firstInterest: principal * monthlyRate,
      monthly,
      principal,
    };
  }, [apr, balance, extra, payment]);

  const money = (value: number) =>
    Number.isFinite(value) ? formatCurrency(value, currency) : '—';

  return (
    <CalculatorPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField label="Balance" value={balance} onChange={setBalance} min={0} />
        <NumberField label="Annual rate (APR)" value={apr} onChange={setApr} unit="%" min={0} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Monthly payment"
          value={payment}
          onChange={setPayment}
          min={0}
          hint="What you actually pay each month."
        />
        <NumberField
          label="Extra per month"
          value={extra}
          onChange={setExtra}
          min={0}
          hint="To see what a small increase changes."
        />
      </div>

      {result && (
        <div className="mt-7">
          {result.yours.neverClears ? (
            <ResultCard
              label="At this payment"
              value="Never clears"
              tone="bad"
              verdict={`Interest alone is ${money(result.firstInterest)} in month one`}
            >
              <p className="text-sm leading-relaxed text-red-800">
                Your payment of {money(result.monthly)} does not cover the interest charged,
                so the balance grows every month no matter how long you keep paying. The
                payment has to exceed {money(result.firstInterest)} before any of it reaches
                the debt.
              </p>
            </ResultCard>
          ) : (
            <ResultCard
              label={`Paying ${money(result.monthly)} a month`}
              value={describeMonths(result.yours.months)}
              verdict={`${money(result.yours.interest)} in interest`}
            >
              <ResultRows
                rows={[
                  {
                    label: 'Total you will pay',
                    value: money(result.yours.total),
                    emphasis: true,
                  },
                  {
                    label: 'Interest as a share of the balance',
                    value: `${formatNumber((result.yours.interest / result.principal) * 100, 1)}%`,
                  },
                  {
                    label: 'Interest in the first month',
                    value: money(result.firstInterest),
                  },
                  {
                    label: 'Of your first payment, reaching the debt',
                    value: money(Math.max(result.monthly - result.firstInterest, 0)),
                  },
                ]}
              />

              <div className="mt-5">
                <p className="mb-2 text-sm font-medium text-ink-600">For comparison</p>
                <ResultRows
                  rows={[
                    {
                      label: 'Paying only the minimum (1% + interest, floor 25)',
                      value: `${describeMonths(result.minimumOnly.months)} · ${money(result.minimumOnly.interest)} interest`,
                    },
                    ...(result.withExtra
                      ? [
                          {
                            label: `Paying ${money(result.monthly + (parseNumber(extra) ?? 0))} a month`,
                            value: `${describeMonths(result.withExtra.months)} · ${money(result.withExtra.interest)} interest`,
                            emphasis: true,
                          },
                        ]
                      : []),
                  ]}
                />
              </div>

              {result.withExtra && !result.withExtra.neverClears && !result.yours.neverClears && (
                <p className="mt-4 rounded-control border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
                  The extra {money(parseNumber(extra) ?? 0)} a month clears it{' '}
                  <strong>{result.yours.months - result.withExtra.months} months sooner</strong>{' '}
                  and saves <strong>{money(result.yours.interest - result.withExtra.interest)}</strong>{' '}
                  in interest.
                </p>
              )}

              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Interest here is charged monthly at the APR divided by twelve. Real cards
                compound daily, which costs slightly more — under one percent of the
                interest total at typical rates. This also assumes no further spending on
                the card.
              </p>
            </ResultCard>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
