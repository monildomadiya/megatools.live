'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultRows, SelectField, UnitToggle } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const TEXTAREA =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 font-mono text-sm leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

type Mode = 'pretty' | 'minify';

const MODES = [
  { value: 'pretty' as const, label: 'Pretty print' },
  { value: 'minify' as const, label: 'Minify' },
];

const INDENTS = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: 'tab', label: 'Tab' },
] as const;

/**
 * Turns a character offset into a line and column.
 *
 * V8 reports "position 42" and Firefox reports "line 3 column 7", so neither
 * engine's message alone is portable. Recomputing from the offset gives the
 * same answer everywhere, and a caret under the offending character is more
 * use than either message.
 */
function locate(text: string, position: number) {
  const before = text.slice(0, position);
  const line = before.split('\n').length;
  const column = position - (before.lastIndexOf('\n') + 1) + 1;
  const lineText = text.split('\n')[line - 1] ?? '';
  return { line, column, lineText };
}

/** V8 and SpiderMonkey both embed an offset, in different phrasings. */
function extractPosition(message: string): number | null {
  const match = /position (\d+)/i.exec(message);
  return match ? Number(match[1]) : null;
}

interface Stats {
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  keys: number;
  depth: number;
}

function inspect(value: unknown, depth = 1, stats?: Stats): Stats {
  const acc: Stats = stats ?? {
    objects: 0,
    arrays: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    keys: 0,
    depth: 0,
  };

  acc.depth = Math.max(acc.depth, depth);

  if (value === null) {
    acc.nulls += 1;
  } else if (Array.isArray(value)) {
    acc.arrays += 1;
    for (const item of value) inspect(item, depth + 1, acc);
  } else if (typeof value === 'object') {
    acc.objects += 1;
    for (const [, item] of Object.entries(value as Record<string, unknown>)) {
      acc.keys += 1;
      inspect(item, depth + 1, acc);
    }
  } else if (typeof value === 'string') {
    acc.strings += 1;
  } else if (typeof value === 'number') {
    acc.numbers += 1;
  } else if (typeof value === 'boolean') {
    acc.booleans += 1;
  }

  return acc;
}

/**
 * Recursively rebuilds objects with their keys in order. Arrays keep their
 * order — an array's order is data, not presentation, and sorting one would
 * change the document's meaning rather than its formatting.
 */
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, sortKeys(item)]),
    );
  }
  return value;
}

/**
 * Integers above Number.MAX_SAFE_INTEGER survive the trip through a double only
 * by luck. Rather than warn about the parsed value — which has already lost the
 * digits — this checks the source text for long bare integer literals.
 */
function findUnsafeIntegers(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(/(?<![\w."])-?\d{16,}(?![\w.])/g)) {
    const literal = match[0];
    if (!Number.isSafeInteger(Number(literal))) found.add(literal);
  }
  return [...found].slice(0, 3);
}

const SAMPLE = `{"name":"megatools","version":2,"tags":["free","no-signup"],"limits":{"rate":null,"maxBytes":1048576},"active":true}`;

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('pretty');
  const [indent, setIndent] = useState<(typeof INDENTS)[number]['value']>('2');
  const [sorted, setSorted] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (input.trim() === '') return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const position = extractPosition(message);
      return {
        ok: false as const,
        message,
        location: position === null ? null : locate(input, Math.min(position, input.length - 1)),
      };
    }

    const value = sorted ? sortKeys(parsed) : parsed;
    const spacing = indent === 'tab' ? '\t' : Number(indent);
    const output = mode === 'minify' ? JSON.stringify(value) : JSON.stringify(value, null, spacing);
    const minified = JSON.stringify(value);

    return {
      ok: true as const,
      output,
      stats: inspect(parsed),
      inputBytes: new TextEncoder().encode(input).length,
      outputBytes: new TextEncoder().encode(output).length,
      minifiedBytes: new TextEncoder().encode(minified).length,
      unsafeIntegers: findUnsafeIntegers(input),
      topLevel: Array.isArray(parsed)
        ? 'array'
        : parsed === null
          ? 'null'
          : typeof parsed === 'object'
            ? 'object'
            : typeof parsed,
    };
  }, [input, mode, indent, sorted]);

  async function copy() {
    if (!result?.ok) return;
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <CalculatorPanel label="Input · JSON">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle label="Output style" value={mode} onChange={setMode} options={MODES} />
        <ResetButton onClick={() => setInput('')} />
      </div>

      <label htmlFor="json-input" className="mt-6 block text-sm font-semibold text-ink-800">
        Paste your JSON
      </label>
      <textarea
        id="json-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={8}
        spellCheck={false}
        placeholder={SAMPLE}
        className={TEXTAREA}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setInput(SAMPLE)}
          className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
        >
          Load a sample
        </button>
        <label className="inline-flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            checked={sorted}
            onChange={(event) => setSorted(event.target.checked)}
            className="h-4 w-4 rounded border-line"
          />
          Sort object keys alphabetically
        </label>
      </div>

      {mode === 'pretty' && (
        <div className="mt-5 max-w-xs">
          <SelectField label="Indentation" value={indent} onChange={setIndent} options={INDENTS} />
        </div>
      )}

      {result && !result.ok && (
        <div className="mt-7 rounded-card border border-red-200 bg-red-50 p-5" aria-live="polite">
          <p className="text-sm font-bold text-red-800">Not valid JSON</p>
          <p className="mt-2 font-mono text-sm leading-relaxed text-red-700">{result.message}</p>
          {result.location && (
            <>
              <p className="mt-3 text-sm text-red-800">
                Line {result.location.line}, column {result.location.column}
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-panel p-3 font-mono text-xs leading-relaxed text-ink-800">
                {result.location.lineText}
                {'\n'}
                {' '.repeat(Math.max(result.location.column - 1, 0))}^
              </pre>
            </>
          )}
          <p className="mt-3 text-sm leading-relaxed text-red-700">
            The usual culprits: a trailing comma, single quotes instead of double, an
            unquoted key, or a comment. None of those are legal JSON even though all four
            are legal JavaScript.
          </p>
        </div>
      )}

      {result?.ok && (
        <div className="mt-7 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink-600">Valid JSON — formatted output</p>
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-line px-3.5 py-1.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              aria-live="polite"
              className="max-h-96 overflow-auto rounded-card border border-line bg-panel-2 p-4 font-mono text-sm leading-relaxed text-ink-900"
            >
              {result.output}
            </pre>
          </div>

          {result.unsafeIntegers.length > 0 && (
            <p className="rounded-card border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
              Precision warning: {result.unsafeIntegers.join(', ')} exceeds the largest
              integer a double-precision float can hold exactly, so the value above has
              already been rounded. Identifiers this large should be transmitted as
              strings.
            </p>
          )}

          <ResultRows
            rows={[
              { label: 'Top-level value', value: result.topLevel, emphasis: true },
              { label: 'Objects', value: formatNumber(result.stats.objects) },
              { label: 'Arrays', value: formatNumber(result.stats.arrays) },
              { label: 'Keys', value: formatNumber(result.stats.keys) },
              {
                label: 'Values by type',
                value: `${result.stats.strings} string, ${result.stats.numbers} number, ${result.stats.booleans} boolean, ${result.stats.nulls} null`,
              },
              { label: 'Maximum nesting depth', value: formatNumber(result.stats.depth) },
              { label: 'Input size', value: `${formatNumber(result.inputBytes)} bytes` },
              {
                label: 'Minified size',
                value: `${formatNumber(result.minifiedBytes)} bytes (${
                  result.inputBytes === 0
                    ? '0'
                    : (100 - (result.minifiedBytes / result.inputBytes) * 100).toFixed(1)
                }% smaller)`,
              },
            ]}
          />
        </div>
      )}
    </CalculatorPanel>
  );
}
