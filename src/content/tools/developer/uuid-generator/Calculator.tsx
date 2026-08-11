'use client';

import { useCallback, useEffect, useState } from 'react';
import { ResultRows, UnitToggle } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

const VERSIONS = [
  { value: 'v4', label: 'Version 4' },
  { value: 'v7', label: 'Version 7' },
] as const;

type Version = (typeof VERSIONS)[number]['value'];

const HEX = '0123456789abcdef';

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const byte of bytes) {
    out += HEX[byte >> 4]! + HEX[byte & 0x0f]!;
  }
  return out;
}

/**
 * Sixteen random bytes with the version and variant fields overwritten.
 *
 * Built from `crypto.getRandomValues` rather than `crypto.randomUUID`, which
 * would be one line. Two reasons: `randomUUID` is only available in a secure
 * context, so the page would break over plain http on a local network, and it
 * cannot produce a version 7 UUID — the two paths would then differ in where
 * their randomness came from, which is exactly the thing this page claims to be
 * explicit about.
 */
function randomBytes(): Uint8Array {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytes;
}

/** 122 random bits: everything except the 4 version bits and the 2 variant bits. */
function uuidV4(): Uint8Array {
  const bytes = randomBytes();
  bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10x
  return bytes;
}

/**
 * A 48-bit big-endian Unix millisecond timestamp, then 74 random bits.
 *
 * The timestamp is split with division rather than shifts on purpose: `<<` in
 * JavaScript coerces to a signed 32-bit integer, so `ms >> 40` on a value that
 * currently needs 41 bits does not mean what it appears to. Dividing by powers
 * of two keeps the whole calculation in the double's exact-integer range, which
 * runs to 2^53.
 */
function uuidV7(): Uint8Array {
  const bytes = randomBytes();
  const ms = Date.now();

  bytes[0] = Math.floor(ms / 2 ** 40) & 0xff;
  bytes[1] = Math.floor(ms / 2 ** 32) & 0xff;
  bytes[2] = Math.floor(ms / 2 ** 24) & 0xff;
  bytes[3] = Math.floor(ms / 2 ** 16) & 0xff;
  bytes[4] = Math.floor(ms / 2 ** 8) & 0xff;
  bytes[5] = ms & 0xff;

  bytes[6] = (bytes[6]! & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10x
  return bytes;
}

/** The canonical 8-4-4-4-12 text form. */
function format(bytes: Uint8Array, { hyphens, upper }: { hyphens: boolean; upper: boolean }) {
  const hex = toHex(bytes);
  const text = hyphens
    ? `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    : hex;
  return upper ? text.toUpperCase() : text;
}

export default function UuidGenerator() {
  const [version, setVersion] = useState<Version>('v4');
  const [count, setCount] = useState(5);
  const [hyphens, setHyphens] = useState(true);
  const [upper, setUpper] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const made: string[] = [];
    for (let i = 0; i < count; i += 1) {
      made.push(format(version === 'v4' ? uuidV4() : uuidV7(), { hyphens, upper }));
    }
    setUuids(made);
    setCopied(false);
  }, [count, hyphens, upper, version]);

  // Generated on mount and whenever an option changes, so the output never
  // disagrees with the controls above it.
  useEffect(() => {
    generate();
  }, [generate]);

  async function copy() {
    if (uuids.length === 0) return;
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused in an insecure context or by policy.
      // The textarea is selectable either way.
    }
  }

  const isV4 = version === 'v4';

  return (
    <CalculatorPanel label="Options · output">
      <div className="flex flex-wrap items-center gap-3">
        <UnitToggle
          label="UUID version"
          value={version}
          onChange={setVersion}
          options={VERSIONS}
        />
        <p className="text-sm text-ink-500">
          {isV4 ? 'Random. No ordering, no timestamp.' : 'Time-ordered. Sorts by creation.'}
        </p>
      </div>

      <div className="mt-7">
        <label htmlFor="uuid-output" className="block text-sm font-medium text-ink-800">
          Generated {count === 1 ? 'UUID' : 'UUIDs'}
        </label>
        <textarea
          id="uuid-output"
          readOnly
          rows={Math.min(Math.max(count, 3), 12)}
          value={uuids.join('\n')}
          onFocus={(event) => event.currentTarget.select()}
          spellCheck={false}
          className="mt-1.5 w-full resize-y rounded-lg border border-ink-300 bg-panel-2 px-3.5 py-2.5 font-mono text-sm leading-relaxed text-ink-900 outline-none focus:border-brand-500"
        />

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={generate}
            className="rounded-lg bg-invert px-4 py-2.5 text-sm font-semibold text-on-invert transition-colors hover:bg-invert-hover"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={uuids.length === 0}
            className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2 disabled:opacity-50"
          >
            {copied ? 'Copied' : 'Copy all'}
          </button>
        </div>
        {/* The button label changes visibly; this is the same change for a
            screen reader. */}
        <p aria-live="polite" className="sr-only">
          {copied ? `${uuids.length} UUIDs copied to clipboard` : ''}
        </p>
      </div>

      <div className="mt-7">
        <label htmlFor="uuid-count" className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink-800">How many</span>
          <span className="numeric text-sm text-ink-600">{count}</span>
        </label>
        <input
          id="uuid-count"
          type="range"
          min={1}
          max={50}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
          className="mt-2 w-full accent-brand-solid"
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={hyphens}
            onChange={(event) => setHyphens(event.target.checked)}
            className="h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">Hyphens (8-4-4-4-12)</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={upper}
            onChange={(event) => setUpper(event.target.checked)}
            className="h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">Uppercase</span>
        </label>
      </div>

      <div className="mt-7">
        <p className="mb-2 text-sm font-medium text-ink-600">What you are looking at</p>
        <ResultRows
          rows={[
            { label: 'Version', value: isV4 ? '4 — random' : '7 — Unix time, then random' },
            {
              label: 'Layout',
              value: isV4 ? '122 random bits' : '48-bit timestamp + 74 random bits',
            },
            { label: 'Random bits', value: isV4 ? '122' : '74', emphasis: true },
            {
              label: 'Even odds of one collision at',
              value: isV4 ? '≈ 2.7 × 10¹⁸ UUIDs' : '≈ 1.6 × 10¹¹ per millisecond',
            },
            { label: 'Sorts by creation time', value: isV4 ? 'No' : 'Yes' },
          ]}
        />
        {!isV4 && (
          <p className="mt-3 text-sm text-ink-500">
            Ordering here is at millisecond resolution. Several version 7 UUIDs generated
            inside the same millisecond are ordered only by chance — the reason, and the
            fix the specification offers, are below.
          </p>
        )}
      </div>
    </CalculatorPanel>
  );
}
