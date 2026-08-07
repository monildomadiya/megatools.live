'use client';

import { useCallback, useEffect, useState } from 'react';
import { ResultRows } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * Character sets.
 *
 * The ambiguous glyphs are separated out rather than removed, so excluding them
 * is the reader's choice: dropping them costs a little entropy but makes a
 * password that has to be read off a screen and typed by hand far less
 * error-prone.
 */
const SETS = {
  lower: 'abcdefghijkmnopqrstuvwxyz',
  upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  digits: '23456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
} as const;

/**
 * Exactly the characters missing from each set above — no more, no less.
 *
 * These are concatenated onto the base set when lookalikes are allowed, so a
 * character listed here that is *also* in the base set would appear in the pool
 * twice and be drawn twice as often as its neighbours. That is a real, if
 * small, bias, and it would silently overstate the alphabet size the entropy
 * figure is computed from.
 */
const AMBIGUOUS = {
  lower: 'l',
  upper: 'IO',
  digits: '01',
  symbols: '',
} as const;

type SetName = keyof typeof SETS;

const SET_LABELS: Record<SetName, string> = {
  lower: 'Lowercase (a–z)',
  upper: 'Uppercase (A–Z)',
  digits: 'Digits (0–9)',
  symbols: 'Symbols (!@#…)',
};

/**
 * Uniform random integer in [0, max), drawn from the platform CSPRNG.
 *
 * The rejection loop is the point. Taking `getRandomValues() % max` directly
 * biases the result toward low indices whenever `max` does not divide 2^32
 * evenly — the first (2^32 mod max) values are reachable one extra way. The
 * skew is small, but it is a real loss of strength for no benefit, so values
 * landing in that uneven tail are discarded and redrawn.
 */
function randomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);

  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0]!;
  } while (value >= limit);

  return value % max;
}

/** Fisher–Yates, using the same unbiased source as everything else. */
function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [enabled, setEnabled] = useState<Record<SetName, boolean>>({
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
  });
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [requireEach, setRequireEach] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const activeSets = (Object.keys(SETS) as SetName[]).filter((name) => enabled[name]);

  const poolFor = useCallback(
    (name: SetName) => (avoidAmbiguous ? SETS[name] : SETS[name] + AMBIGUOUS[name]),
    [avoidAmbiguous],
  );

  const generate = useCallback(() => {
    const sets = (Object.keys(SETS) as SetName[]).filter((name) => enabled[name]);
    if (sets.length === 0) {
      setPassword('');
      return;
    }

    const pool = sets.map(poolFor).join('');
    const chars: string[] = [];

    // One character from each selected set first, so a site that demands a
    // digit or a symbol always gets one. This is why the entropy figure shown
    // is an upper bound when the option is on — see the page body.
    if (requireEach && length >= sets.length) {
      for (const name of sets) {
        const set = poolFor(name);
        chars.push(set[randomInt(set.length)]!);
      }
    }

    while (chars.length < length) {
      chars.push(pool[randomInt(pool.length)]!);
    }

    setPassword(shuffle(chars).join(''));
    setCopied(false);
  }, [enabled, length, poolFor, requireEach]);

  // Generate once on mount and whenever the options change, so the panel is
  // never showing a password that does not match the settings above it.
  useEffect(() => {
    generate();
  }, [generate]);

  const poolSize = activeSets.reduce((total, name) => total + poolFor(name).length, 0);
  const entropy = poolSize > 0 ? length * Math.log2(poolSize) : 0;

  const strength =
    entropy >= 100
      ? { label: 'Very strong', tone: 'text-emerald-700 dark:text-emerald-300' }
      : entropy >= 75
        ? { label: 'Strong', tone: 'text-emerald-700 dark:text-emerald-300' }
        : entropy >= 60
          ? { label: 'Adequate', tone: 'text-amber-700 dark:text-amber-300' }
          : { label: 'Weak', tone: 'text-red-700 dark:text-red-300' };

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (insecure context, or denied
      // permission). The password is selectable in the field either way.
    }
  }

  return (
    <CalculatorPanel>
      <div>
        <label htmlFor="generated-password" className="block text-sm font-medium text-ink-800">
          Generated password
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id="generated-password"
            readOnly
            value={password}
            onFocus={(event) => event.currentTarget.select()}
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-lg border border-ink-300 bg-panel-2 px-3.5 py-2.5 font-mono text-base text-ink-900 outline-none focus:border-brand-500"
          />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={generate}
              className="flex-1 rounded-lg bg-invert px-4 py-2.5 text-sm font-semibold text-on-invert transition-colors hover:bg-invert-hover sm:flex-none"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={copy}
              disabled={!password}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-panel-2 disabled:opacity-50 sm:flex-none"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        {/* Announced rather than shown: the visible label already says "Copied",
            but that change is invisible to a screen reader user. */}
        <p aria-live="polite" className="sr-only">
          {copied ? 'Password copied to clipboard' : ''}
        </p>
      </div>

      <div className="mt-7">
        <label htmlFor="length" className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink-800">Length</span>
          <span className="text-sm tabular-nums text-ink-600">{length} characters</span>
        </label>
        <input
          id="length"
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
          className="mt-2 w-full accent-brand-solid"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink-800">Include</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(Object.keys(SETS) as SetName[]).map((name) => {
            const only = activeSets.length === 1 && enabled[name];
            return (
              <label
                key={name}
                className={`flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm ${
                  only ? 'opacity-60' : 'cursor-pointer hover:bg-panel-2'
                }`}
              >
                <input
                  type="checkbox"
                  checked={enabled[name]}
                  // Refuses to empty the pool: unchecking the last remaining set
                  // would leave nothing to draw from.
                  disabled={only}
                  onChange={(event) =>
                    setEnabled((prev) => ({ ...prev, [name]: event.target.checked }))
                  }
                  className="h-4 w-4 accent-brand-solid"
                />
                <span className="text-ink-800">{SET_LABELS[name]}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={avoidAmbiguous}
            onChange={(event) => setAvoidAmbiguous(event.target.checked)}
            className="h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">Avoid lookalikes (0/O, 1/l/I)</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm hover:bg-panel-2">
          <input
            type="checkbox"
            checked={requireEach}
            onChange={(event) => setRequireEach(event.target.checked)}
            className="h-4 w-4 accent-brand-solid"
          />
          <span className="text-ink-800">At least one of each type</span>
        </label>
      </div>

      <div className="mt-7">
        <p className="mb-2 text-sm font-medium text-ink-600">Strength</p>
        <ResultRows
          rows={[
            { label: 'Alphabet size', value: `${poolSize} characters` },
            {
              label: 'Entropy',
              value: `${entropy.toFixed(1)} bits`,
              emphasis: true,
            },
            { label: 'Rating', value: strength.label },
            {
              label: 'Combinations',
              value: entropy > 0 ? `2^${Math.round(entropy)}` : '—',
            },
          ]}
        />
        <p className={`mt-3 text-sm font-semibold ${strength.tone}`}>
          {strength.label} — {entropy.toFixed(0)} bits of entropy
        </p>
        {requireEach && (
          <p className="mt-2 text-sm text-ink-500">
            With “at least one of each type” on, the true entropy is slightly below this
            figure. The reason is explained below.
          </p>
        )}
      </div>
    </CalculatorPanel>
  );
}
