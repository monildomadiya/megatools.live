'use client';

import { useEffect, useState } from 'react';
import { ResultRows, SelectField, UnitToggle } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * Exactly what the Web Crypto API implements — no more.
 *
 * MD5 is absent because `SubtleCrypto.digest` deliberately does not offer it,
 * and shipping a hand-written copy would mean putting a collision-broken
 * algorithm on the same menu as working ones with nothing to distinguish them.
 * The page body says so in as many words rather than leaving readers to wonder
 * whether it was an oversight.
 */
const ALGORITHMS = [
  { value: 'SHA-256', label: 'SHA-256 (default)', bits: 256 },
  { value: 'SHA-384', label: 'SHA-384', bits: 384 },
  { value: 'SHA-512', label: 'SHA-512', bits: 512 },
  { value: 'SHA-1', label: 'SHA-1 (legacy — do not use for new work)', bits: 160 },
] as const;

type Algorithm = (typeof ALGORITHMS)[number]['value'];

const ENCODINGS = [
  { value: 'hex', label: 'Hex' },
  { value: 'base64', label: 'Base64' },
] as const;

type Encoding = (typeof ENCODINGS)[number]['value'];

const HEX = '0123456789abcdef';

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) {
    out += HEX[byte >> 4]! + HEX[byte & 0x0f]!;
  }
  return out;
}

/**
 * `btoa` takes a string of code units below 256, so the digest is walked byte
 * by byte rather than passed through a text decoder — decoding it as UTF-8
 * would mangle any byte that is not valid on its own.
 */
function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

const DEFAULT_INPUT = 'The quick brown fox jumps over the lazy dog';

export default function HashGenerator() {
  const [text, setText] = useState(DEFAULT_INPUT);
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [encoding, setEncoding] = useState<Encoding>('hex');
  const [digest, setDigest] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // `crypto.subtle` is only exposed in a secure context, so over plain http
    // on something other than localhost it is simply not there. Saying that
    // outright beats an empty box the reader cannot explain.
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      setDigest('');
      setError(
        'Your browser only exposes the Web Crypto digest API over HTTPS or on localhost. Open this page over HTTPS to hash.',
      );
      return;
    }

    setError('');

    // Digesting is asynchronous, so a fast typist can have several in flight at
    // once and they are not guaranteed to settle in order. The flag makes the
    // result of a superseded run get thrown away instead of overwriting a newer
    // digest with an older one.
    let current = true;

    crypto.subtle
      .digest(algorithm, new TextEncoder().encode(text))
      .then((buffer) => {
        if (!current) return;
        const bytes = new Uint8Array(buffer);
        setDigest(encoding === 'hex' ? toHex(bytes) : toBase64(bytes));
        setCopied(false);
      })
      .catch(() => {
        if (!current) return;
        setDigest('');
        setError('This browser refused the requested algorithm.');
      });

    return () => {
      current = false;
    };
  }, [algorithm, encoding, text]);

  async function copy() {
    if (!digest) return;
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Refused in an insecure context or by policy. The field stays selectable.
    }
  }

  const spec = ALGORITHMS.find((entry) => entry.value === algorithm)!;
  const inputBytes = new TextEncoder().encode(text).length;

  return (
    <CalculatorPanel label="Input · digest">
      <div>
        <label htmlFor="hash-input" className="block text-sm font-medium text-ink-800">
          Text to hash
        </label>
        <textarea
          id="hash-input"
          rows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
          placeholder="Type or paste anything"
          className="mt-1.5 w-full resize-y rounded-lg border border-ink-300 bg-panel-2 px-3.5 py-2.5 text-base leading-relaxed text-ink-900 outline-none placeholder:text-ink-400 focus:border-brand-500"
        />
        <p className="numeric mt-1.5 text-xs text-ink-500">
          {inputBytes} {inputBytes === 1 ? 'byte' : 'bytes'} of UTF-8
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Algorithm"
          value={algorithm}
          onChange={setAlgorithm}
          options={ALGORITHMS.map((entry) => ({ value: entry.value, label: entry.label }))}
        />
        <div>
          <p className="block text-sm font-semibold text-ink-800">Output encoding</p>
          <div className="mt-2">
            <UnitToggle
              label="Output encoding"
              value={encoding}
              onChange={setEncoding}
              options={ENCODINGS}
            />
          </div>
        </div>
      </div>

      <div className="mt-7">
        <label htmlFor="hash-output" className="block text-sm font-medium text-ink-800">
          {algorithm} digest
        </label>
        <textarea
          id="hash-output"
          readOnly
          rows={3}
          value={error ? '' : digest}
          onFocus={(event) => event.currentTarget.select()}
          spellCheck={false}
          className="mt-1.5 w-full resize-y break-all rounded-lg border border-ink-300 bg-panel-2 px-3.5 py-2.5 font-mono text-sm leading-relaxed text-ink-900 outline-none focus:border-brand-500"
        />

        {error ? (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        ) : (
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={!digest}
              className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2 disabled:opacity-50"
            >
              {copied ? 'Copied' : 'Copy digest'}
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2"
            >
              Clear
            </button>
          </div>
        )}
        <p aria-live="polite" className="sr-only">
          {copied ? 'Digest copied to clipboard' : ''}
        </p>
      </div>

      <div className="mt-7">
        <p className="mb-2 text-sm font-medium text-ink-600">Digest properties</p>
        <ResultRows
          rows={[
            { label: 'Algorithm', value: algorithm },
            { label: 'Digest length', value: `${spec.bits} bits`, emphasis: true },
            { label: 'As hex characters', value: String(spec.bits / 4) },
            { label: 'Input length', value: `${inputBytes} bytes` },
            {
              label: 'Suitable for new work',
              value: algorithm === 'SHA-1' ? 'No — collisions are practical' : 'Yes',
            },
          ]}
        />
        {algorithm === 'SHA-1' && (
          <p className="mt-3 text-sm text-amber-700">
            SHA-1 is here so you can reproduce existing digests — Git object IDs, old
            checksums, legacy certificates. A collision was demonstrated in 2017 and NIST
            has disallowed it for signatures. Do not choose it for anything new.
          </p>
        )}
      </div>
    </CalculatorPanel>
  );
}
