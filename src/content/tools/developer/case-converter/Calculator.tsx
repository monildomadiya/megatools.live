'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton } from '@/components/tool/fields';

const TEXTAREA =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

/**
 * Words that stay lowercase inside a title unless they are first or last.
 *
 * Follows the APA rule: articles, coordinating conjunctions, and prepositions
 * of three letters or fewer. Style guides genuinely disagree about the
 * preposition cut-off, so the page states which one is in force rather than
 * implying there is a single correct list.
 */
const MINOR_WORDS = new Set([
  'a', 'an', 'the',
  'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
  'as', 'at', 'by', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via',
]);

/**
 * Splits a string into words at every boundary any convention recognises:
 * separators, punctuation, and a lower-to-upper transition.
 *
 * The two lookahead groups matter. Without them, `XMLHttpRequest` splits into
 * single letters — the first keeps a run of capitals together until the last
 * one, which belongs to the following word, and the second catches the ordinary
 * camelCase hump.
 */
function splitWords(input: string): string[] {
  return input
    .replace(/([\p{Lu}]+)([\p{Lu}][\p{Ll}])/gu, '$1 $2')
    .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

const capitalise = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

interface Conversion {
  key: string;
  label: string;
  hint: string;
  convert: (words: string[], original: string) => string;
}

const CONVERSIONS: Conversion[] = [
  {
    key: 'camel',
    label: 'camelCase',
    hint: 'JavaScript and Java variables, JSON keys',
    convert: (words) =>
      words
        .map((word, index) => (index === 0 ? word.toLowerCase() : capitalise(word)))
        .join(''),
  },
  {
    key: 'pascal',
    label: 'PascalCase',
    hint: 'Classes and types in most C-family languages',
    convert: (words) => words.map(capitalise).join(''),
  },
  {
    key: 'snake',
    label: 'snake_case',
    hint: 'Python, Ruby, Rust, SQL columns',
    convert: (words) => words.map((word) => word.toLowerCase()).join('_'),
  },
  {
    key: 'constant',
    label: 'CONSTANT_CASE',
    hint: 'Constants and environment variables',
    convert: (words) => words.map((word) => word.toUpperCase()).join('_'),
  },
  {
    key: 'kebab',
    label: 'kebab-case',
    hint: 'URL slugs, CSS classes, HTML attributes',
    convert: (words) => words.map((word) => word.toLowerCase()).join('-'),
  },
  {
    key: 'train',
    label: 'Train-Case',
    hint: 'HTTP header names',
    convert: (words) => words.map(capitalise).join('-'),
  },
  {
    key: 'dot',
    label: 'dot.case',
    hint: 'Config keys, package namespaces',
    convert: (words) => words.map((word) => word.toLowerCase()).join('.'),
  },
  {
    key: 'title',
    label: 'Title Case',
    hint: 'Headings — APA rule, minor words lowercase',
    convert: (words) =>
      words
        .map((word, index) => {
          const lower = word.toLowerCase();
          const isEdge = index === 0 || index === words.length - 1;
          return !isEdge && MINOR_WORDS.has(lower) ? lower : capitalise(word);
        })
        .join(' '),
  },
  {
    key: 'sentence',
    label: 'Sentence case',
    hint: 'Body copy, UI labels, most modern style guides',
    convert: (words) =>
      words
        .map((word, index) => (index === 0 ? capitalise(word) : word.toLowerCase()))
        .join(' '),
  },
  {
    key: 'lower',
    label: 'lowercase',
    hint: 'Preserves the original spacing and punctuation',
    convert: (_words, original) => original.toLowerCase(),
  },
  {
    key: 'upper',
    label: 'UPPERCASE',
    hint: 'Preserves the original spacing and punctuation',
    convert: (_words, original) => original.toUpperCase(),
  },
  {
    key: 'alternating',
    label: 'aLtErNaTiNg',
    hint: 'For when the tone requires it',
    convert: (_words, original) =>
      [...original]
        .map((character, index) =>
          index % 2 === 0 ? character.toLowerCase() : character.toUpperCase(),
        )
        .join(''),
  },
];

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(() => {
    if (input.trim() === '') return null;
    const words = splitWords(input);
    if (words.length === 0) return null;
    return {
      words,
      rows: CONVERSIONS.map((conversion) => ({
        ...conversion,
        output: conversion.convert(words, input.trim()),
      })),
    };
  }, [input]);

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  }

  return (
    <CalculatorPanel label="Input · text">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="case-input" className="block text-sm font-semibold text-ink-800">
          Your text
        </label>
        <ResetButton onClick={() => setInput('')} />
      </div>
      <textarea
        id="case-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={3}
        spellCheck={false}
        placeholder="user account id, userAccountId, USER_ACCOUNT_ID — any of them work"
        className={TEXTAREA}
      />
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Words are split on spaces, punctuation, underscores, hyphens and camelCase humps,
        so you can paste an identifier in any existing style. Everything runs in your
        browser.
      </p>

      {results && (
        <div className="mt-7">
          <p className="mb-2 text-sm font-medium text-ink-600">
            Detected {results.words.length} word{results.words.length === 1 ? '' : 's'}:{' '}
            <span className="font-mono text-ink-800">{results.words.join(' · ')}</span>
          </p>

          <div
            aria-live="polite"
            className="divide-y divide-line overflow-hidden rounded-card border border-line bg-panel"
          >
            {results.rows.map((row) => (
              <div
                key={row.key}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-800">{row.label}</p>
                  <p className="text-xs text-ink-500">{row.hint}</p>
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                  <code className="min-w-0 truncate font-mono text-sm text-ink-900">
                    {row.output}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(row.key, row.output)}
                    className="shrink-0 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-700 transition-colors hover:bg-panel-2"
                  >
                    {copiedKey === row.key ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            Title Case follows the APA rule: articles, coordinating conjunctions and short
            prepositions stay lowercase unless they are the first or last word. Other style
            guides draw the line in different places, so check yours before publishing.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
