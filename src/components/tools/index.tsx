import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & { id: string; label: string; hint?: string; error?: string };
function Field({ id, label, hint, error, type, ...props }: FieldProps & { type: 'number' | 'date' }) {
  return <div><label htmlFor={id} className="field-label">{label}</label><input {...props} id={id} type={type} className="field-input" aria-invalid={error ? true : props['aria-invalid']} aria-describedby={[props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined} />{hint && <p id={`${id}-hint`} className="mt-2 text-sm text-muted">{hint}</p>}{error && <p id={`${id}-error`} className="mt-2 text-sm text-red-700">{error}</p>}</div>;
}
/** Labeled numeric input. Callers supply min, max and step for the official rule. */
export function NumberField(props: FieldProps) { return <Field {...props} type="number" />; }
/** Labeled date input in the browser's native date picker. */
export function DateField(props: FieldProps) { return <Field {...props} type="date" />; }
/** Native select with a visible label and optional guidance. */
export function SelectField({ id, label, hint, options, ...props }: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { id: string; label: string; hint?: string; options: { value: string; label: string }[] }) {
  return <div><label htmlFor={id} className="field-label">{label}</label><select {...props} id={id} className="field-input" aria-describedby={[props['aria-describedby'], hint && `${id}-hint`].filter(Boolean).join(' ') || undefined}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{hint && <p id={`${id}-hint`} className="mt-2 text-sm text-muted">{hint}</p>}</div>;
}
/** Native radios retain arrow-key navigation; use inside a client calculator. */
export function RadioGroup({ name, legend, options, value, onChange, disabled }: { name: string; legend: string; options: { value: string; label: string }[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return <fieldset disabled={disabled}><legend className="field-label">{legend}</legend><div className="flex flex-wrap gap-4">{options.map((option) => <label key={option.value} className="flex min-h-11 items-center gap-2"><input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="accent-primary" />{option.label}</label>)}</div></fieldset>;
}
/** Checkbox-backed switch with native keyboard behavior. */
export function Toggle({ label, id, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> & { id: string; label: string }) { return <label htmlFor={id} className="flex min-h-11 items-center gap-3"><input {...props} id={id} type="checkbox" role="switch" className="h-5 w-5 accent-primary" /><span>{label}</span></label>; }
/** Polite live region for calculator results. */
export function ResultPanel({ title = 'Your estimate', children }: { title?: string; children: ReactNode }) { return <section aria-live="polite" aria-atomic="true" className="result-panel"><h2 className="mb-4 text-xl font-semibold text-primary">{title}</h2>{children}</section>; }

