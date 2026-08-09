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
import { parseNumber } from '@/lib/format';

/**
 * Factors are bytes per unit. Decimal and binary units are kept in one list,
 * flagged by `system`, rather than split behind a toggle: the entire point of
 * the page is that GB and GiB are different sizes, and putting them side by
 * side in the same results table is what makes that visible.
 */
const UNITS = [
  { value: 'b', label: 'Bits (b)', bytes: 0.125, system: 'bit' as const, short: 'b' },
  { value: 'B', label: 'Bytes (B)', bytes: 1, system: 'decimal' as const, short: 'B' },
  { value: 'kB', label: 'Kilobytes (kB, 10³)', bytes: 1e3, system: 'decimal' as const, short: 'kB' },
  { value: 'MB', label: 'Megabytes (MB, 10⁶)', bytes: 1e6, system: 'decimal' as const, short: 'MB' },
  { value: 'GB', label: 'Gigabytes (GB, 10⁹)', bytes: 1e9, system: 'decimal' as const, short: 'GB' },
  { value: 'TB', label: 'Terabytes (TB, 10¹²)', bytes: 1e12, system: 'decimal' as const, short: 'TB' },
  { value: 'PB', label: 'Petabytes (PB, 10¹⁵)', bytes: 1e15, system: 'decimal' as const, short: 'PB' },
  { value: 'KiB', label: 'Kibibytes (KiB, 2¹⁰)', bytes: 1024, system: 'binary' as const, short: 'KiB' },
  { value: 'MiB', label: 'Mebibytes (MiB, 2²⁰)', bytes: 1024 ** 2, system: 'binary' as const, short: 'MiB' },
  { value: 'GiB', label: 'Gibibytes (GiB, 2³⁰)', bytes: 1024 ** 3, system: 'binary' as const, short: 'GiB' },
  { value: 'TiB', label: 'Tebibytes (TiB, 2⁴⁰)', bytes: 1024 ** 4, system: 'binary' as const, short: 'TiB' },
  { value: 'PiB', label: 'Pebibytes (PiB, 2⁵⁰)', bytes: 1024 ** 5, system: 'binary' as const, short: 'PiB' },
] as const;

type UnitCode = (typeof UNITS)[number]['value'];

const unitFor = (code: UnitCode) => UNITS.find((u) => u.value === code)!;

/**
 * Sizes span twenty orders of magnitude, so a fixed decimal count is wrong at
 * one end or the other. Significant figures scale sensibly across the range,
 * and exact integers are shown as integers because 1024 KiB should not read
 * "1024.0000".
 */
function present(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs < 1e-6 || abs >= 1e15) return value.toExponential(4);
  if (Number.isInteger(value) && abs < 1e15) {
    return value.toLocaleString('en-US');
  }
  const decimals = abs >= 100 ? 2 : abs >= 1 ? 4 : 6;
  const fixed = value.toFixed(decimals);
  const trimmed = fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
  const [whole, fraction] = trimmed.split('.');
  return fraction
    ? `${Number(whole).toLocaleString('en-US')}.${fraction}`
    : Number(whole).toLocaleString('en-US');
}

const TRANSFER_UNITS = [
  { value: 'mbps', label: 'Megabits per second (Mbps)', bitsPerSecond: 1e6 },
  { value: 'gbps', label: 'Gigabits per second (Gbps)', bitsPerSecond: 1e9 },
  { value: 'mbyps', label: 'Megabytes per second (MB/s)', bitsPerSecond: 8e6 },
] as const;

type TransferCode = (typeof TRANSFER_UNITS)[number]['value'];

function duration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} sec`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    return `${m} min ${Math.round(seconds % 60)} sec`;
  }
  // Hours up to two days, so adding a 10% allowance to a 22-hour transfer
  // reads as "24 hr 41 min" rather than jumping the unit to "1.0 days".
  if (seconds < 172800) {
    const h = Math.floor(seconds / 3600);
    return `${h} hr ${Math.round((seconds % 3600) / 60)} min`;
  }
  return `${(seconds / 86400).toFixed(1)} days`;
}

export default function DataStorageConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<UnitCode>('TB');
  const [to, setTo] = useState<UnitCode>('GiB');
  const [speed, setSpeed] = useState('100');
  const [speedUnit, setSpeedUnit] = useState<TransferCode>('mbps');

  const parsed = parseNumber(amount);

  const result = useMemo(() => {
    if (parsed === null || parsed < 0) return null;

    const bytes = parsed * unitFor(from).bytes;
    const target = unitFor(to);

    return {
      bytes,
      converted: bytes / target.bytes,
      // Bits ride with the decimal table rather than getting a row of their
      // own: the bit/byte factor of eight is a decimal-side concern, and a
      // one-row third table would read as an afterthought.
      decimalRows: UNITS.filter((u) => u.system === 'decimal' || u.system === 'bit').map((unit) => ({
        label: unit.label,
        value: present(bytes / unit.bytes),
        emphasis: unit.value === to,
      })),
      binaryRows: UNITS.filter((u) => u.system === 'binary').map((unit) => ({
        label: unit.label,
        value: present(bytes / unit.bytes),
        emphasis: unit.value === to,
      })),
    };
  }, [parsed, from, to]);

  const transfer = useMemo(() => {
    if (!result) return null;
    const rate = parseNumber(speed);
    if (rate === null || rate <= 0) return null;
    const bitsPerSecond =
      rate * TRANSFER_UNITS.find((u) => u.value === speedUnit)!.bitsPerSecond;
    return (result.bytes * 8) / bitsPerSecond;
  }, [result, speed, speedUnit]);

  function reset() {
    setAmount('1');
    setFrom('TB');
    setTo('GiB');
    setSpeed('100');
    setSpeedUnit('mbps');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const fromUnit = unitFor(from);
  const toUnit = unitFor(to);

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField label="Size" value={amount} onChange={setAmount} placeholder="1" min={0} />
        <div className="flex items-end">
          <button
            type="button"
            onClick={swap}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
          >
            ⇄ Swap units
          </button>
        </div>
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
        />
        <SelectField
          label="To"
          value={to}
          onChange={setTo}
          options={UNITS.map((u) => ({ value: u.value, label: u.label }))}
          hint="Units ending in -bi are binary: 1024-based, not 1000-based."
        />
      </div>

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard
            label={`${present(parsed!)} ${fromUnit.short} converted`}
            value={present(result.converted)}
            unit={toUnit.short}
            verdict={`${present(result.bytes)} bytes exactly`}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Decimal units — what storage is sold in
            </p>
            <ResultRows rows={result.decimalRows} />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Binary units — what Windows shows, mislabelled as MB and GB
            </p>
            <ResultRows rows={result.binaryRows} />
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-line pt-6">
        <p className="text-sm font-semibold text-ink-800">How long would this take to transfer?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">
          At the full line rate, with no overhead. Real transfers run slower — TCP, TLS and
          filesystem overhead typically cost 5–15%.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Connection speed"
            value={speed}
            onChange={setSpeed}
            placeholder="100"
            min={0}
          />
          <SelectField
            label="Measured in"
            value={speedUnit}
            onChange={setSpeedUnit}
            options={TRANSFER_UNITS.map((u) => ({ value: u.value, label: u.label }))}
          />
        </div>

        {transfer !== null && (
          <div className="mt-4">
            <ResultRows
              rows={[
                { label: 'Transfer time at line rate', value: duration(transfer), emphasis: true },
                { label: 'Allowing 10% overhead', value: duration(transfer / 0.9) },
              ]}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
