'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import {
  DateField,
  ResetButton,
  ResultCard,
  ResultRows,
  SelectField,
} from '@/components/tool/fields';

/**
 * A curated list rather than `Intl.supportedValuesOf('timeZone')`, which returns
 * over 400 identifiers including deprecated aliases. Every entry is an IANA
 * identifier, never an abbreviation: CST is Central, China and Cuba time
 * depending on who is speaking, whereas America/Chicago is exactly one place.
 */
const ZONES = [
  { id: 'UTC', label: 'UTC — Coordinated Universal Time' },
  { id: 'Pacific/Auckland', label: 'Auckland' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'Australia/Perth', label: 'Perth' },
  { id: 'Asia/Tokyo', label: 'Tokyo' },
  { id: 'Asia/Seoul', label: 'Seoul' },
  { id: 'Asia/Shanghai', label: 'Shanghai / Beijing' },
  { id: 'Asia/Hong_Kong', label: 'Hong Kong' },
  { id: 'Asia/Singapore', label: 'Singapore' },
  { id: 'Asia/Bangkok', label: 'Bangkok' },
  { id: 'Asia/Kolkata', label: 'Mumbai / Delhi (IST)' },
  { id: 'Asia/Karachi', label: 'Karachi' },
  { id: 'Asia/Dubai', label: 'Dubai' },
  { id: 'Europe/Moscow', label: 'Moscow' },
  { id: 'Asia/Jerusalem', label: 'Jerusalem' },
  { id: 'Europe/Istanbul', label: 'Istanbul' },
  { id: 'Africa/Johannesburg', label: 'Johannesburg' },
  { id: 'Europe/Athens', label: 'Athens' },
  { id: 'Europe/Berlin', label: 'Berlin' },
  { id: 'Europe/Paris', label: 'Paris' },
  { id: 'Europe/Madrid', label: 'Madrid' },
  { id: 'Africa/Lagos', label: 'Lagos' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Dublin', label: 'Dublin' },
  { id: 'Atlantic/Reykjavik', label: 'Reykjavík' },
  { id: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: 'America/New_York', label: 'New York' },
  { id: 'America/Toronto', label: 'Toronto' },
  { id: 'America/Chicago', label: 'Chicago' },
  { id: 'America/Mexico_City', label: 'Mexico City' },
  { id: 'America/Denver', label: 'Denver' },
  { id: 'America/Phoenix', label: 'Phoenix (no DST)' },
  { id: 'America/Los_Angeles', label: 'Los Angeles' },
  { id: 'America/Anchorage', label: 'Anchorage' },
  { id: 'Pacific/Honolulu', label: 'Honolulu' },
] as const;

type ZoneId = (typeof ZONES)[number]['id'];

/**
 * Offset of a zone, in milliseconds, at a given instant.
 *
 * Formats the instant in the target zone, reads the wall-clock parts back, and
 * treats them as if they were UTC. The gap between that and the real instant is
 * the offset. It is roundabout, but it is the only way to get an IANA offset out
 * of the platform without shipping a copy of the tz database.
 */
function offsetAt(zone: string, instant: number): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(instant))) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }

  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    // ICU renders midnight as hour 24 in some locales under hour12: false.
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );

  return asIfUtc - instant;
}

/**
 * Turns a wall-clock time in a named zone into an absolute instant.
 *
 * The offset depends on the instant, and the instant depends on the offset, so
 * this guesses with the UTC reading, corrects, and corrects once more. Two
 * iterations is enough for every real zone — the second pass only matters when
 * the first guess landed on the far side of a DST transition.
 */
function toInstant(
  zone: string,
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): { instant: number; exists: boolean } {
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute);

  let instant = wallAsUtc - offsetAt(zone, wallAsUtc);
  instant = wallAsUtc - offsetAt(zone, instant);

  // A time inside a spring-forward gap never happens. Formatting the instant
  // back and finding a different wall clock is how that shows up.
  const check = offsetAt(zone, instant);
  const exists = wallAsUtc - check === instant;

  return { instant, exists };
}

function formatInZone(instant: number, zone: string) {
  const date = new Date(instant);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  const day = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
  const abbreviation =
    new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value ?? '';

  return { time, day, abbreviation };
}

/** UTC+5:30 rather than 19800000. */
function formatOffset(ms: number): string {
  const sign = ms < 0 ? '−' : '+';
  const total = Math.abs(ms) / 60000;
  const hours = Math.floor(total / 60);
  const minutes = Math.round(total % 60);
  return `UTC${sign}${hours}${minutes === 0 ? '' : `:${String(minutes).padStart(2, '0')}`}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export default function TimeZoneConverter() {
  // Static defaults, not "now": this component is server-rendered before it
  // hydrates, and seeding state from the clock would make the two disagree.
  // The "Use current time" button fills them from the browser instead.
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [from, setFrom] = useState<ZoneId>('Europe/London');
  const [to, setTo] = useState<ZoneId>('America/New_York');

  const result = useMemo(() => {
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(time);
    if (!dateMatch || !timeMatch) return null;

    const hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2]);
    if (hour > 23 || minute > 59) return null;

    const { instant, exists } = toInstant(
      from,
      Number(dateMatch[1]),
      Number(dateMatch[2]),
      Number(dateMatch[3]),
      hour,
      minute,
    );

    const fromOffset = offsetAt(from, instant);
    const toOffset = offsetAt(to, instant);

    return {
      instant,
      exists,
      fromOffset,
      toOffset,
      difference: toOffset - fromOffset,
      target: formatInZone(instant, to),
      source: formatInZone(instant, from),
      utc: formatInZone(instant, 'UTC'),
      // Every zone at once, ordered by offset so the world reads left to right.
      all: [...ZONES]
        .map((zone) => ({
          ...zone,
          offset: offsetAt(zone.id, instant),
          ...formatInZone(instant, zone.id),
        }))
        .sort((a, b) => b.offset - a.offset),
    };
  }, [date, time, from, to]);

  function useCurrentTime() {
    const now = new Date();
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (ZONES.some((zone) => zone.id === local)) setFrom(local as ZoneId);
    const parts = formatInZone(now.getTime(), local);
    setDate(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: local,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now),
    );
    setTime(parts.time);
  }

  function reset() {
    setDate('');
    setTime('09:00');
    setFrom('Europe/London');
    setTo('America/New_York');
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  const zoneOptions = ZONES.map((zone) => ({ value: zone.id, label: zone.label }));

  return (
    <CalculatorPanel>
      <div className="grid gap-5 sm:grid-cols-2">
        <DateField label="Date" value={date} onChange={setDate} />
        <div>
          <label htmlFor="tz-time" className="block text-sm font-semibold text-ink-800">
            Time (24-hour)
          </label>
          <input
            id="tz-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="numeric mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15"
          />
        </div>
        <SelectField label="From" value={from} onChange={setFrom} options={zoneOptions} />
        <SelectField label="To" value={to} onChange={setTo} options={zoneOptions} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={useCurrentTime}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
        >
          Use current time
        </button>
        <button
          type="button"
          onClick={swap}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
        >
          ⇄ Swap zones
        </button>
      </div>

      {!date && (
        <p className="mt-6 text-sm leading-relaxed text-ink-500">
          Pick a date to convert. The date matters: daylight saving means the gap between
          two cities is not the same in January as it is in July.
        </p>
      )}

      {result && (
        <div className="mt-7 space-y-4">
          {!result.exists && (
            <p role="alert" className="text-sm text-amber-700">
              That wall-clock time does not exist in {from} on this date — the clocks go
              forward and the hour is skipped. The nearest real instant is shown below.
            </p>
          )}

          <ResultCard
            label={`${result.source.time} in ${ZONES.find((z) => z.id === from)!.label} is`}
            value={result.target.time}
            unit={result.target.abbreviation}
            verdict={`${result.target.day} in ${ZONES.find((z) => z.id === to)!.label}`}
          />

          <ResultRows
            rows={[
              {
                label: 'Difference',
                value:
                  result.difference === 0
                    ? 'Same time'
                    : `${result.difference > 0 ? '+' : '−'}${Math.floor(
                        Math.abs(result.difference) / 3600000,
                      )}h${
                        Math.abs(result.difference) % 3600000 === 0
                          ? ''
                          : ` ${pad(Math.round((Math.abs(result.difference) % 3600000) / 60000))}m`
                      }`,
                emphasis: true,
              },
              {
                label: `${ZONES.find((z) => z.id === from)!.label} offset on this date`,
                value: `${formatOffset(result.fromOffset)} (${result.source.abbreviation})`,
              },
              {
                label: `${ZONES.find((z) => z.id === to)!.label} offset on this date`,
                value: `${formatOffset(result.toOffset)} (${result.target.abbreviation})`,
              },
              { label: 'The same moment in UTC', value: `${result.utc.time} · ${result.utc.day}` },
            ]}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              The same moment everywhere, east to west
            </p>
            <div className="overflow-x-auto rounded-card border border-line bg-panel">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-ink-600">
                    <th scope="col" className="px-4 py-2.5 font-medium">City</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Local time</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Date</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {result.all.map((zone) => (
                    <tr
                      key={zone.id}
                      className={zone.id === from || zone.id === to ? 'bg-panel-2' : undefined}
                    >
                      <td className="px-4 py-2.5 text-ink-800">{zone.label}</td>
                      <td className="numeric px-4 py-2.5 font-semibold text-ink-900">
                        {zone.time}
                      </td>
                      <td className="px-4 py-2.5 text-ink-600">{zone.day}</td>
                      <td className="numeric px-4 py-2.5 text-ink-600">
                        {formatOffset(zone.offset)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ink-500">
            Offsets come from your device&rsquo;s copy of the IANA time zone database. If a
            government has changed its daylight saving rules very recently, an out-of-date
            device can be wrong — check against an official source before booking anything
            expensive.
          </p>
        </div>
      )}

      <div className="mt-6">
        <ResetButton onClick={reset} />
      </div>
    </CalculatorPanel>
  );
}
