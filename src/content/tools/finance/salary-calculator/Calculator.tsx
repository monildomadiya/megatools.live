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
  parseNumber,
  type CurrencyCode,
} from '@/lib/format';

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c.value, label: c.label }));

type Period = 'hour' | 'day' | 'week' | 'biweek' | 'semimonth' | 'month' | 'year';

const PERIOD_OPTIONS = [
  { value: 'hour' as const, label: 'Per hour' },
  { value: 'day' as const, label: 'Per day' },
  { value: 'week' as const, label: 'Per week' },
  { value: 'biweek' as const, label: 'Every two weeks (26 a year)' },
  { value: 'semimonth' as const, label: 'Twice a month (24 a year)' },
  { value: 'month' as const, label: 'Per month' },
  { value: 'year' as const, label: 'Per year' },
];

export default function SalaryCalculator() {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState('25');
  const [period, setPeriod] = useState<Period>('hour');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [paidWeeks, setPaidWeeks] = useState('52');
  const [overtimeHours, setOvertimeHours] = useState('0');

  const result = useMemo(() => {
    const amountValue = parseNumber(amount);
    const hours = parseNumber(hoursPerWeek);
    const days = parseNumber(daysPerWeek);
    const weeks = parseNumber(paidWeeks);
    const otHours = parseNumber(overtimeHours) ?? 0;

    if (amountValue === null || amountValue <= 0) return null;
    if (hours === null || hours <= 0 || hours > 168) return null;
    if (days === null || days <= 0 || days > 7) return null;
    if (weeks === null || weeks <= 0 || weeks > 53) return null;

    // Everything routes through an annual figure, so there is one conversion
    // in and one set of conversions out rather than a 7×7 grid of special
    // cases that could disagree with each other.
    //
    // The two families are deliberately different. Hourly, daily and weekly
    // pay depends on how many weeks you are actually paid for; biweekly,
    // semi-monthly and monthly salary does not — a salaried employee taking
    // paid leave still receives twelve equal payments.
    const annual =
      period === 'hour'
        ? amountValue * hours * weeks
        : period === 'day'
          ? amountValue * days * weeks
          : period === 'week'
            ? amountValue * weeks
            : period === 'biweek'
              ? amountValue * 26
              : period === 'semimonth'
                ? amountValue * 24
                : period === 'month'
                  ? amountValue * 12
                  : amountValue;

    const annualHours = hours * weeks;
    const hourly = annual / annualHours;

    // FLSA: at least 1.5× the regular rate beyond 40 hours in a workweek. The
    // premium is the extra half, which is the part people forget when they
    // estimate what an overtime week is worth.
    const overtimeRate = hourly * 1.5;
    const overtimeWeekly = otHours * overtimeRate;

    return {
      annual,
      annualHours,
      hourly,
      daily: annual / (days * weeks),
      weekly: annual / weeks,
      biweekly: annual / 26,
      semimonthly: annual / 24,
      monthly: annual / 12,
      overtimeRate,
      overtimeWeekly,
      overtimeAnnual: overtimeWeekly * weeks,
      annualWithOvertime: annual + overtimeWeekly * weeks,
      otHours,
      // The standard 2,080-hour conversion, shown alongside so a reader who
      // reduced their paid weeks can see exactly what that assumption costs.
      standardAnnual: period === 'hour' ? amountValue * 2080 : null,
      shortWeeks: weeks < 52,
    };
  }, [amount, period, hoursPerWeek, daysPerWeek, paidWeeks, overtimeHours]);

  function reset() {
    setAmount('');
    setHoursPerWeek('40');
    setDaysPerWeek('5');
    setPaidWeeks('52');
    setOvertimeHours('0');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });
  const round = (value: number) => formatCurrency(value, currency);

  return (
    <CalculatorPanel label="Input · pay and hours">
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
          label="Pay amount"
          value={amount}
          onChange={setAmount}
          placeholder="25"
          min={0}
        />
        <SelectField
          label="Paid per"
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
        />
        <NumberField
          label="Hours per week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          unit="hr"
          placeholder="40"
          min={0}
          max={168}
        />
        <NumberField
          label="Days per week"
          value={daysPerWeek}
          onChange={setDaysPerWeek}
          unit="days"
          placeholder="5"
          min={0}
          max={7}
        />
        <div className="sm:col-span-2">
          <NumberField
            label="Paid weeks per year"
            value={paidWeeks}
            onChange={setPaidWeeks}
            unit="wks"
            placeholder="52"
            min={0}
            max={53}
            hint="Leave at 52 if you are paid for holidays. Drop it if you take unpaid time — that is where an hourly rate quietly loses to a salary."
          />
        </div>
        <div className="sm:col-span-2">
          <NumberField
            label="Overtime hours per week (optional)"
            value={overtimeHours}
            onChange={setOvertimeHours}
            unit="hr"
            placeholder="0"
            min={0}
            hint="Hours beyond 40 in a workweek, paid at 1.5× under the FLSA."
          />
        </div>
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Annual gross pay"
            value={round(result.annual)}
            verdict={`${formatNumber(result.annualHours)} paid hours a year · ${money(
              result.hourly,
            )}/hour`}
          >
            <p className="text-sm leading-relaxed text-ink-600">
              Every figure on this page is gross. Income tax, payroll taxes, pension and
              benefit deductions all depend on your country, filing status and employer,
              and none of them are modelled here.
            </p>
          </ResultCard>

          <ResultRows
            rows={[
              { label: 'Hourly', value: money(result.hourly) },
              { label: 'Daily', value: money(result.daily) },
              { label: 'Weekly', value: money(result.weekly) },
              { label: 'Every two weeks (26/yr)', value: money(result.biweekly) },
              { label: 'Twice a month (24/yr)', value: money(result.semimonthly) },
              { label: 'Monthly', value: money(result.monthly), emphasis: true },
              { label: 'Annual', value: round(result.annual), emphasis: true },
            ]}
          />

          {result.otHours > 0 && (
            <div className="rounded-card border border-line bg-surface p-5">
              <p className="eyebrow eyebrow-muted">Overtime at time and a half</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">Overtime rate</dt>
                  <dd className="numeric font-semibold text-ink-900">
                    {money(result.overtimeRate)}/hr
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-600">
                    {formatNumber(result.otHours)} overtime hours a week
                  </dt>
                  <dd className="numeric font-semibold text-ink-900">
                    {money(result.overtimeWeekly)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2">
                  <dt className="font-semibold text-ink-800">
                    Annual pay including overtime
                  </dt>
                  <dd className="numeric font-bold text-ink-900">
                    {round(result.annualWithOvertime)}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                The FLSA requires at least 1.5× the regular rate beyond 40 hours in a
                workweek, and the regular rate is total weekly compensation divided by
                hours actually worked — so non-discretionary bonuses and shift
                differentials push it above your base rate. There is no federal daily
                overtime requirement; several states impose one.
              </p>
            </div>
          )}

          {result.standardAnnual !== null && result.shortWeeks && (
            <div className="rounded-card border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-semibold text-amber-900">
                The 2,080-hour shortcut would say {round(result.standardAnnual)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">
                That figure assumes 40 hours across all 52 weeks, paid holidays included.
                At {paidWeeks} paid weeks you actually earn {round(result.annual)} — a
                difference of {round(result.standardAnnual - result.annual)} a year. This
                gap is the main reason a headline contractor rate can look better than a
                salary and not be.
              </p>
            </div>
          )}
        </div>
      )}
    </CalculatorPanel>
  );
}
