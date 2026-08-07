'use client';

import { useId } from 'react';

/* ---------------------------------------------------------------------------
   Shared form primitives for calculators. Every calculator on the site composes
   these so the inputs behave identically everywhere: same touch target height,
   same error treatment, same numeric keyboard on mobile.
--------------------------------------------------------------------------- */

const fieldBase =
  // `panel-2` rather than `panel`: the field sits inside a white card, so
  // matching the card would leave the border doing all the work of showing
  // where the input is. A half-step recess reads as a field at a glance.
  'w-full rounded-control border bg-panel-2 px-3.5 py-3 text-base text-ink-900 transition-colors placeholder:text-ink-400 focus:outline-none focus:ring-4 focus:ring-brand-500/15';

const labelBase = 'block text-sm font-semibold text-ink-800';

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
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <div className="relative mt-2">
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
          // Figures the reader types should look like the figures the tool
          // reports back, so the input carries the same mono face as the result.
          className={`numeric ${fieldBase} ${unit ? 'pr-14' : ''} ${
            error
              ? 'border-red-400 focus:ring-red-500/20'
              : 'border-line focus:border-brand-500'
          }`}
        />
        {unit && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-ink-500"
          >
            {unit}
          </span>
        )}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-sm leading-relaxed text-ink-500">
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
      <label htmlFor={id} className={labelBase}>
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
        className={`numeric ${fieldBase} mt-2 ${
          error
            ? 'border-red-400 focus:ring-red-500/20'
            : 'border-line focus:border-brand-500'
        }`}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-sm leading-relaxed text-ink-500">
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
      <label htmlFor={id} className={labelBase}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={`${fieldBase} mt-2 border-line focus:border-brand-500`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-2 text-sm leading-relaxed text-ink-500">{hint}</p>}
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
 *
 * The selected segment is a white pill on a grey track — the same
 * card-on-surface relationship the whole site is built from, at control scale.
 */
export function UnitToggle<T extends string>({
  label,
  value,
  onChange,
  options,
}: UnitToggleProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-full border border-line bg-panel-2 p-1"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
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

/**
 * The primary result readout: one big number plus a plain-language reading.
 *
 * Sized far larger than anything else on the page on purpose. This is the single
 * figure the reader came for, and a result that competes with the H1 for
 * attention makes them hunt for it.
 */
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
    neutral: 'bg-surface border-line',
    good: 'bg-emerald-50 border-emerald-200',
    warn: 'bg-amber-50 border-amber-200',
    bad: 'bg-red-50 border-red-200',
  }[tone];

  const verdictClass = {
    neutral: 'text-ink-800',
    good: 'text-emerald-800',
    warn: 'text-amber-800',
    bad: 'text-red-800',
  }[tone];

  return (
    <div
      // Results appear after the reader acts, so screen readers need to be told.
      // `polite` rather than `assertive`: it should not interrupt typing.
      aria-live="polite"
      className={`rounded-card border p-5 sm:p-7 ${toneClass}`}
    >
      <p className="eyebrow eyebrow-muted">{label}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="numeric text-4xl font-bold text-ink-900 sm:text-5xl">
          {value}
        </span>
        {unit && <span className="text-lg font-semibold text-ink-500">{unit}</span>}
      </p>
      {verdict && (
        <p className={`mt-3 text-lg font-bold tracking-tight ${verdictClass}`}>
          {verdict}
        </p>
      )}
      {children && <div className="mt-5">{children}</div>}
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
    <dl className="divide-y divide-line overflow-hidden rounded-card border border-line bg-panel">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-4 px-5 py-3.5"
        >
          <dt className="text-sm text-ink-600">{row.label}</dt>
          <dd
            className={`numeric shrink-0 text-sm ${
              row.emphasis ? 'font-bold text-ink-900' : 'font-semibold text-ink-800'
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
    <button type="button" onClick={onClick} className="btn btn-outline btn-sm">
      Reset
    </button>
  );
}
