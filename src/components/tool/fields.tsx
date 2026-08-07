'use client';

import { useId } from 'react';

/* ---------------------------------------------------------------------------
   Shared form primitives for calculators. Every calculator on the site composes
   these so the inputs behave identically everywhere: same touch target height,
   same error treatment, same numeric keyboard on mobile.
--------------------------------------------------------------------------- */

const fieldBase =
  // `panel-2` rather than `panel`: the field sits inside a panel-coloured card,
  // so matching it leaves the border doing all the work of showing where the
  // input is. A half-step recess reads as a field in both themes.
  'w-full rounded-lg border bg-panel-2 px-3.5 py-2.5 text-base text-ink-900 transition-colors placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30';

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Trailing unit shown inside the field, e.g. "kg", "%", "years". */
  unit?: string;
  placeholder?: string;
  /** Short help text under the field. Use for constraints, not decoration. */
  hint?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  /** `decimal` keeps the mobile keypad numeric while still allowing a point. */
  inputMode?: 'decimal' | 'numeric';
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  error,
  min,
  max,
  step = 'any' as unknown as number,
  inputMode = 'decimal',
}: NumberFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          type="number"
          inputMode={inputMode}
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`${fieldBase} ${unit ? 'pr-14' : ''} ${
            error ? 'border-red-400 focus:ring-red-500/30' : 'border-ink-300 focus:border-brand-500'
          }`}
        />
        {unit && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-medium text-ink-500"
          >
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Native date input. Added as a shared primitive rather than kept local to one
 * calculator because Date & Time is a whole category — every tool in it needs
 * the same control, and the native picker is the one input where rolling our
 * own would lose the platform keyboard and locale handling.
 */
export function DateField({
  label,
  value,
  onChange,
  hint,
  error,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  /** ISO `YYYY-MM-DD`. */
  min?: string;
  max?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`${fieldBase} mt-1.5 ${
          error ? 'border-red-400 focus:ring-red-500/30' : 'border-ink-300 focus:border-brand-500'
        }`}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  hint?: string;
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  hint,
}: SelectFieldProps<T>) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-800">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={`${fieldBase} mt-1.5 border-ink-300 focus:border-brand-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1.5 text-sm text-ink-500">{hint}</p>}
    </div>
  );
}

interface UnitToggleProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

/**
 * Metric/US switch. Implemented as a radiogroup rather than a select because it
 * is a two-way choice a reader makes before anything else, and one tap beats
 * open-scroll-tap.
 */
export function UnitToggle<T extends string>({
  label,
  value,
  onChange,
  options,
}: UnitToggleProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-ink-100 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? 'bg-panel text-ink-900 shadow-panel'
              : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** The primary result readout: one big number plus a plain-language reading. */
export function ResultCard({
  label,
  value,
  unit,
  verdict,
  tone = 'neutral',
  children,
}: {
  label: string;
  value: string;
  unit?: string;
  verdict?: string;
  tone?: 'neutral' | 'good' | 'warn' | 'bad';
  children?: React.ReactNode;
}) {
  const toneClass = {
    neutral: 'bg-ink-50 border-line',
    good: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900',
    warn: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
    bad: 'bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900',
  }[tone];

  const verdictClass = {
    neutral: 'text-ink-700',
    good: 'text-emerald-800 dark:text-emerald-300',
    warn: 'text-amber-800 dark:text-amber-300',
    bad: 'text-red-800 dark:text-red-300',
  }[tone];

  return (
    <div
      // Results appear after the reader acts, so screen readers need to be told.
      // `polite` rather than `assertive`: it should not interrupt typing.
      aria-live="polite"
      className={`rounded-xl border p-5 sm:p-6 ${toneClass}`}
    >
      <p className="text-sm font-medium text-ink-600">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight text-ink-900 tabular-nums">
          {value}
        </span>
        {unit && <span className="text-lg font-medium text-ink-500">{unit}</span>}
      </p>
      {verdict && <p className={`mt-2 font-semibold ${verdictClass}`}>{verdict}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/** Secondary figures shown beneath the headline result. */
export function ResultRows({
  rows,
}: {
  rows: readonly { label: string; value: string; emphasis?: boolean }[];
}) {
  return (
    <dl className="divide-y divide-line rounded-xl border border-line">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3">
          <dt className="text-sm text-ink-600">{row.label}</dt>
          <dd
            className={`text-sm tabular-nums ${
              row.emphasis ? 'font-bold text-ink-900' : 'font-medium text-ink-800'
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
    >
      Reset
    </button>
  );
}
