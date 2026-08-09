'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultRows, UnitToggle } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const TEXTAREA =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 font-mono text-sm leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

type Direction = 'encode' | 'decode';

const DIRECTIONS = [
  { value: 'encode' as const, label: 'Encode' },
  { value: 'decode' as const, label: 'Decode' },
];

/**
 * Encodes text as UTF-8 bytes before Base64.
 *
 * `btoa` alone throws on any code point above 255, so a naive implementation
 * works until the first accented name or emoji. TextEncoder produces the UTF-8
 * byte sequence, and mapping each byte to a latin1 character gives btoa
 * something it will accept — the standard workaround, and the reason the tool
 * handles 中文 and 👍 without complaint.
 */
function encodeBase64(text: string, urlSafe: boolean, padded: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  let output = btoa(binary);

  if (urlSafe) output = output.replace(/\+/g, '-').replace(/\//g, '_');
  if (!padded) output = output.replace(/=+$/, '');
  return output;
}

function decodeBase64(input: string): { text: string; bytes: number } {
  // Accept either alphabet and tolerate missing padding, since URL-safe values
  // are conventionally unpadded and people paste JWT segments straight in.
  const normalised = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const remainder = normalised.length % 4;
  if (remainder === 1) throw new Error('length');
  const padded = remainder === 0 ? normalised : normalised + '='.repeat(4 - remainder);

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  // `fatal` so invalid UTF-8 raises rather than being papered over with
  // replacement characters — decoding binary that is not text should say so.
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  return { text, bytes: bytes.length };
}

/** A quick hex preview, useful when the decoded bytes are not text. */
function hexPreview(input: string): string | null {
  try {
    const normalised = input.trim().replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    const remainder = normalised.length % 4;
    if (remainder === 1) return null;
    const padded = remainder === 0 ? normalised : normalised + '='.repeat(4 - remainder);
    const binary = atob(padded);
    return [...binary]
      .slice(0, 24)
      .map((character) => character.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  } catch {
    return null;
  }
}

export default function Base64Encoder() {
  const [direction, setDirection] = useState<Direction>('encode');
  const [input, setInput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [padded, setPadded] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (input.trim() === '') return null;

    if (direction === 'encode') {
      const output = encodeBase64(input, urlSafe, padded);
      const inputBytes = new TextEncoder().encode(input).length;
      return {
        ok: true as const,
        output,
        inputBytes,
        outputBytes: output.length,
        overhead: inputBytes === 0 ? 0 : (output.length / inputBytes - 1) * 100,
        characters: [...input].length,
      };
    }

    try {
      const { text, bytes } = decodeBase64(input);
      return {
        ok: true as const,
        output: text,
        inputBytes: input.trim().replace(/\s+/g, '').length,
        outputBytes: bytes,
        overhead: 0,
        characters: [...text].length,
        looksLikeJson: /^\s*[[{]/.test(text),
      };
    } catch (error) {
      return {
        ok: false as const,
        message:
          error instanceof Error && error.message === 'length'
            ? 'That is not a valid Base64 length — a Base64 string can never be one character longer than a multiple of four.'
            : 'This decodes to bytes that are not valid UTF-8 text. It may be binary data such as an image, or the string may be corrupted.',
        hex: hexPreview(input),
      };
    }
  }, [direction, input, urlSafe, padded]);

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

  function reset() {
    setInput('');
    setCopied(false);
  }

  return (
    <CalculatorPanel label={direction === 'encode' ? 'Input · plain text' : 'Input · Base64'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Direction"
          value={direction}
          onChange={setDirection}
          options={DIRECTIONS}
        />
        <ResetButton onClick={reset} />
      </div>

      <label htmlFor="b64-input" className="mt-6 block text-sm font-semibold text-ink-800">
        {direction === 'encode' ? 'Text to encode' : 'Base64 to decode'}
      </label>
      <textarea
        id="b64-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        rows={6}
        spellCheck={false}
        placeholder={
          direction === 'encode'
            ? 'Any text, including accented characters and emoji.'
            : 'SGVsbG8sIHdvcmxkIQ=='
        }
        className={TEXTAREA}
      />

      {direction === 'encode' && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={(event) => setUrlSafe(event.target.checked)}
              className="h-4 w-4 rounded border-line"
            />
            URL-safe alphabet (RFC 4648 §5)
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={padded}
              onChange={(event) => setPadded(event.target.checked)}
              className="h-4 w-4 rounded border-line"
            />
            Include padding
          </label>
        </div>
      )}

      {direction === 'decode' && (
        <p className="mt-3 text-sm leading-relaxed text-ink-500">
          Both alphabets are accepted and missing padding is tolerated, so a JWT segment
          can be pasted straight in.
        </p>
      )}

      {result && !result.ok && (
        <div className="mt-7 rounded-card border border-red-200 bg-red-50 p-5" aria-live="polite">
          <p className="text-sm font-bold text-red-800">Could not decode</p>
          <p className="mt-2 text-sm leading-relaxed text-red-700">{result.message}</p>
          {result.hex && (
            <>
              <p className="mt-3 text-sm text-red-800">First bytes, as hex:</p>
              <pre className="mt-1 overflow-x-auto font-mono text-xs text-ink-800">
                {result.hex}
              </pre>
            </>
          )}
        </div>
      )}

      {result?.ok && (
        <div className="mt-7 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-ink-600">
                {direction === 'encode' ? 'Base64 output' : 'Decoded text'}
              </p>
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
              className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-card border border-line bg-panel-2 p-4 font-mono text-sm leading-relaxed text-ink-900"
            >
              {result.output}
            </pre>
          </div>

          <ResultRows
            rows={
              direction === 'encode'
                ? [
                    { label: 'Characters in', value: formatNumber(result.characters) },
                    { label: 'UTF-8 bytes in', value: formatNumber(result.inputBytes) },
                    {
                      label: 'Base64 characters out',
                      value: formatNumber(result.outputBytes),
                      emphasis: true,
                    },
                    { label: 'Size overhead', value: `${result.overhead.toFixed(1)}%` },
                  ]
                : [
                    { label: 'Base64 characters in', value: formatNumber(result.inputBytes) },
                    {
                      label: 'Bytes decoded',
                      value: formatNumber(result.outputBytes),
                      emphasis: true,
                    },
                    { label: 'Characters of text', value: formatNumber(result.characters) },
                  ]
            }
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Base64 is an encoding, not encryption. Anything here can be read by anyone who
            has the string — including whoever finds it in a log file. Everything runs in
            your browser and nothing is uploaded, but the string itself protects nothing.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
