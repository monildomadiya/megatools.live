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
import { CURRENCIES, formatCurrency, parseNumber, type CurrencyCode } from '@/lib/format';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CONTROL =
  'w-full rounded-control border border-line bg-panel-2 px-3 py-2.5 text-base text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

const MINUTES_PER_DAY = 1440;

interface Row {
  start: string;
  end: string;
  breakMinutes: string;
}

const emptyRow = (): Row => ({ start: '', end: '', breakMinutes: '' });

/** "HH:MM" to minutes past midnight, or null if the field is empty or malformed. */
function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

/**
 * Worked minutes for one shift.
 *
 * A finish at or before the start means the shift crossed midnight, so a day is
 * added rather than the row being treated as an error — night shifts are the
 * case a timesheet calculator most needs to get right, and rejecting them would
 * push the reader into doing the wrap-around by hand.
 */
function shiftMinutes(row: Row): number | null {
  const start = toMinutes(row.start);
  const end = toMinutes(row.end);
  if (start === null || end === null) return null;

  const span = end > start ? end - start : end + MINUTES_PER_DAY - start;
  const unpaid = Math.max(parseNumber(row.breakMinutes) ?? 0, 0);
  return Math.max(span - unpaid, 0);
}

/** 465 minutes reads as "7h 45m" — the format a payslip queries get argued in. */
function hoursMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return `${hours}h ${String(rest).padStart(2, '0')}m`;
}

const decimal = (minutes: number) => (minutes / 60).toFixed(2);

export default function WorkHoursCalculator() {
  const [rows, setRows] = useState<Row[]>(() => DAYS.map(emptyRow));
  const [rate, setRate] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [threshold, setThreshold] = useState('40');
  const [multiplier, setMultiplier] = useState('1.5');

  function update(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  const perDay = useMemo(() => rows.map(shiftMinutes), [rows]);

  const result = useMemo(() => {
    const worked = perDay.filter((value): value is number => value !== null);
    if (worked.length === 0) return null;

    const totalMinutes = worked.reduce((sum, value) => sum + value, 0);

    const overtimeAfter = Math.max(parseNumber(threshold) ?? 40, 0) * 60;
    const overtimeMinutes = Math.max(totalMinutes - overtimeAfter, 0);
    const regularMinutes = totalMinutes - overtimeMinutes;

    const hourlyRate = parseNumber(rate);
    const premium = Math.max(parseNumber(multiplier) ?? 1.5, 1);

    const pay =
      hourlyRate !== null && hourlyRate >= 0
        ? {
            regular: (regularMinutes / 60) * hourlyRate,
            overtime: (overtimeMinutes / 60) * hourlyRate * premium,
          }
        : null;

    return {
      totalMinutes,
      regularMinutes,
      overtimeMinutes,
      daysWorked: worked.filter((value) => value > 0).length,
      averageMinutes: worked.length > 0 ? totalMinutes / worked.length : 0,
      pay,
      premium,
    };
  }, [perDay, rate, threshold, multiplier]);

  function reset() {
    setRows(DAYS.map(emptyRow));
    setRate('');
    setThreshold('40');
    setMultiplier('1.5');
  }

  const money = (value: number) => formatCurrency(value, currency, { decimals: 2 });

  return (
    <CalculatorPanel label="Timesheet · one week">
      <div className="flex justify-end">
        <ResetButton onClick={reset} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="hidden gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-ink-500 sm:grid sm:grid-cols-[7rem_1fr_1fr_6rem_5rem]">
          <span>Day</span>
          <span>Start</span>
          <span>Finish</span>
          <span>Unpaid break</span>
          <span className="text-right">Hours</span>
        </div>

        {rows.map((row, index) => {
          const minutes = perDay[index] ?? null;
          return (
            <div
              key={DAYS[index]}
              className="grid gap-3 rounded-card border border-line p-3 sm:grid-cols-[7rem_1fr_1fr_6rem_5rem] sm:items-center sm:border-0 sm:p-0"
            >
              <span className="text-sm font-semibold text-ink-800">{DAYS[index]}</span>
              <label className="block">
                <span className="sr-only">{DAYS[index]} start time</span>
                <input
                  type="time"
                  value={row.start}
                  onChange={(event) => update(index, { start: event.target.value })}
                  className={`numeric ${CONTROL}`}
                />
              </label>
              <label className="block">
                <span className="sr-only">{DAYS[index]} finish time</span>
                <input
                  type="time"
                  value={row.end}
                  onChange={(event) => update(index, { end: event.target.value })}
                  className={`numeric ${CONTROL}`}
                />
              </label>
              <label className="block">
                <span className="sr-only">{DAYS[index]} unpaid break in minutes</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="30"
                  value={row.breakMinutes}
                  onChange={(event) => update(index, { breakMinutes: event.target.value })}
                  className={`numeric ${CONTROL}`}
                />
              </label>
              <span className="numeric text-sm font-semibold text-ink-700 sm:text-right">
                {minutes === null ? '—' : `${decimal(minutes)} h`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <NumberField
          label="Hourly rate (optional)"
          value={rate}
          onChange={setRate}
          placeholder="18.50"
          min={0}
        />
        <SelectField
          label="Currency"
          value={currency}
          onChange={setCurrency}
          options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
        />
        <NumberField
          label="Overtime starts after"
          value={threshold}
          onChange={setThreshold}
          unit="h/week"
          placeholder="40"
          min={0}
          hint="40 is the US federal weekly threshold. Set it to your contract’s figure, or to 0 to price every hour at the premium rate."
        />
        <NumberField
          label="Overtime multiplier"
          value={multiplier}
          onChange={setMultiplier}
          unit="×"
          placeholder="1.5"
          min={1}
        />
      </div>

      {result && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Total hours this week"
            value={decimal(result.totalMinutes)}
            unit="hours"
            verdict={`${hoursMinutes(result.totalMinutes)} across ${result.daysWorked} ${
              result.daysWorked === 1 ? 'day' : 'days'
            }`}
          />

          <ResultRows
            rows={[
              {
                label: 'Regular hours',
                value: `${decimal(result.regularMinutes)} h (${hoursMinutes(result.regularMinutes)})`,
              },
              {
                label: 'Overtime hours',
                value: `${decimal(result.overtimeMinutes)} h (${hoursMinutes(result.overtimeMinutes)})`,
                emphasis: result.overtimeMinutes > 0,
              },
              {
                label: 'Average shift length',
                value: hoursMinutes(result.averageMinutes),
              },
              ...(result.pay
                ? [
                    { label: 'Regular pay', value: money(result.pay.regular) },
                    {
                      label: `Overtime pay at ${result.premium}×`,
                      value: money(result.pay.overtime),
                    },
                    {
                      label: 'Gross pay for the week',
                      value: money(result.pay.regular + result.pay.overtime),
                      emphasis: true,
                    },
                  ]
                : []),
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Pay shown is gross, before tax and any other deduction. Overtime is applied on
            a weekly threshold only — jurisdictions with a daily rule, such as California’s
            eight-hour day, will produce a different split. A finish time at or before the
            start is treated as a shift running past midnight.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
