'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResultCard, ResultRows } from '@/components/tool/fields';

const CONTROL =
  'mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

const LABEL = 'block text-sm font-semibold text-ink-800';

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Accepts the forms people actually paste: #abc, #aabbcc, bare hex without the
 * hash, rgb()/rgba() with commas or spaces, and hsl()/hsla(). Anything else
 * returns null rather than guessing — a silently misparsed colour is worse than
 * a visible rejection.
 */
function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();
  if (value === '') return null;

  const hex = value.startsWith('#') ? value.slice(1) : value;
  if (/^[0-9a-f]{3}$/.test(hex)) {
    return {
      r: parseInt(hex[0]! + hex[0]!, 16),
      g: parseInt(hex[1]! + hex[1]!, 16),
      b: parseInt(hex[2]! + hex[2]!, 16),
    };
  }
  if (/^[0-9a-f]{6}$/.test(hex) || /^[0-9a-f]{8}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = /^rgba?\(([^)]+)\)$/.exec(value);
  if (rgbMatch) {
    const parts = rgbMatch[1]!.split(/[\s,/]+/).filter(Boolean).map(Number);
    const [r, g, b] = parts;
    if (r === undefined || g === undefined || b === undefined) return null;
    if ([r, g, b].some((part) => !Number.isFinite(part))) return null;
    return { r: clamp(Math.round(r), 0, 255), g: clamp(Math.round(g), 0, 255), b: clamp(Math.round(b), 0, 255) };
  }

  const hslMatch = /^hsla?\(([^)]+)\)$/.exec(value);
  if (hslMatch) {
    const parts = hslMatch[1]!.split(/[\s,/]+/).filter(Boolean);
    const h = Number.parseFloat(parts[0] ?? '');
    const s = Number.parseFloat(parts[1] ?? '');
    const l = Number.parseFloat(parts[2] ?? '');
    if (![h, s, l].every(Number.isFinite)) return null;
    return hslToRgb(((h % 360) + 360) % 360, clamp(s, 0, 100) / 100, clamp(l, 0, 100) / 100);
  }

  return null;
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];

  return {
    r: Math.round((r! + m) * 255),
    g: Math.round((g! + m) * 255),
    b: Math.round((b! + m) * 255),
  };
}

function rgbToHsl({ r, g, b }: Rgb) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === rn) hue = ((gn - bn) / delta) % 6;
    else if (max === gn) hue = (bn - rn) / delta + 2;
    else hue = (rn - gn) / delta + 4;
  }
  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return { h: hue, s: saturation * 100, l: lightness * 100 };
}

function rgbToHsv({ r, g, b }: Rgb) {
  const { h } = rgbToHsl({ r, g, b });
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const delta = max - min;
  return { h, s: (max === 0 ? 0 : delta / max) * 100, v: max * 100 };
}

/**
 * Naive device-independent CMYK. Deliberately labelled as an approximation in
 * the output: a real conversion depends on the press, the ink set, the paper
 * and an ICC profile, none of which a web page has access to.
 */
function rgbToCmyk({ r, g, b }: Rgb) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: ((1 - rn - k) / (1 - k)) * 100,
    m: ((1 - gn - k) / (1 - k)) * 100,
    y: ((1 - bn - k) / (1 - k)) * 100,
    k: k * 100,
  };
}

const toHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

/** WCAG 2.2 relative luminance, using the sRGB transfer function. */
function luminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const normalised = value / 255;
    return normalised <= 0.03928
      ? normalised / 12.92
      : Math.pow((normalised + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const first = luminance(a);
  const second = luminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function ColorConverter() {
  const [input, setInput] = useState('#4F46E5');
  const [background, setBackground] = useState('#FFFFFF');

  const color = useMemo(() => parseColor(input), [input]);
  const backdrop = useMemo(() => parseColor(background), [background]);

  const derived = useMemo(() => {
    if (!color) return null;
    const hsl = rgbToHsl(color);
    const hsv = rgbToHsv(color);
    const cmyk = rgbToCmyk(color);
    const relative = luminance(color);

    return {
      hex: toHex(color),
      rgbCss: `rgb(${color.r} ${color.g} ${color.b})`,
      hslCss: `hsl(${hsl.h} ${hsl.s.toFixed(1)}% ${hsl.l.toFixed(1)}%)`,
      hsvText: `${hsv.h}°, ${hsv.s.toFixed(1)}%, ${hsv.v.toFixed(1)}%`,
      cmykText: `${cmyk.c.toFixed(0)}%, ${cmyk.m.toFixed(0)}%, ${cmyk.y.toFixed(0)}%, ${cmyk.k.toFixed(0)}%`,
      relative,
      onWhite: contrastRatio(color, { r: 255, g: 255, b: 255 }),
      onBlack: contrastRatio(color, { r: 0, g: 0, b: 0 }),
      pair: backdrop ? contrastRatio(color, backdrop) : null,
    };
  }, [color, backdrop]);

  const verdict = (ratio: number) => {
    if (ratio >= 7) return { label: 'Passes AAA for normal text', tone: 'good' as const };
    if (ratio >= 4.5) return { label: 'Passes AA for normal text', tone: 'good' as const };
    if (ratio >= 3) return { label: 'Large text and UI components only', tone: 'warn' as const };
    return { label: 'Fails WCAG for text', tone: 'bad' as const };
  };

  return (
    <CalculatorPanel label="Colour · convert and check">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="color-input" className={LABEL}>
            Colour
          </label>
          <div className="flex items-center gap-3">
            <input
              id="color-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="#4F46E5"
              className={`numeric ${CONTROL}`}
            />
            <input
              type="color"
              aria-label="Pick a colour"
              value={derived?.hex ?? '#000000'}
              onChange={(event) => setInput(event.target.value.toUpperCase())}
              className="mt-2 h-12 w-14 shrink-0 cursor-pointer rounded-control border border-line bg-panel-2 p-1"
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Hex, rgb() or hsl(). A leading hash is optional and three-digit shorthand works.
          </p>
        </div>

        <div>
          <label htmlFor="bg-input" className={LABEL}>
            Background to check against
          </label>
          <div className="flex items-center gap-3">
            <input
              id="bg-input"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              placeholder="#FFFFFF"
              className={`numeric ${CONTROL}`}
            />
            <input
              type="color"
              aria-label="Pick a background colour"
              value={backdrop ? toHex(backdrop) : '#FFFFFF'}
              onChange={(event) => setBackground(event.target.value.toUpperCase())}
              className="mt-2 h-12 w-14 shrink-0 cursor-pointer rounded-control border border-line bg-panel-2 p-1"
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Use the colour the text will actually sit on, after any transparency has
            composited.
          </p>
        </div>
      </div>

      {input.trim() !== '' && !color && (
        <p role="alert" className="mt-5 text-sm text-red-600">
          That is not a colour this tool can read. Try a hex value such as #4F46E5, or an
          rgb() or hsl() expression.
        </p>
      )}

      {color && derived && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Hex"
            value={derived.hex}
            verdict={derived.rgbCss}
            tone="neutral"
          >
            <div
              className="flex h-24 items-center justify-center rounded-card border border-line"
              style={{ backgroundColor: derived.hex }}
            >
              <span
                className="text-lg font-bold"
                style={{ color: backdrop ? toHex(backdrop) : '#FFFFFF' }}
              >
                Sample text on this colour
              </span>
            </div>
          </ResultCard>

          <ResultRows
            rows={[
              { label: 'HEX', value: derived.hex, emphasis: true },
              { label: 'RGB', value: derived.rgbCss },
              { label: 'HSL', value: derived.hslCss },
              { label: 'HSV / HSB', value: derived.hsvText },
              { label: 'CMYK (approximate)', value: derived.cmykText },
              { label: 'Relative luminance', value: derived.relative.toFixed(4) },
            ]}
          />

          {derived.pair !== null && (
            <ResultCard
              label="Contrast against the chosen background"
              value={`${derived.pair.toFixed(2)}:1`}
              verdict={verdict(derived.pair).label}
              tone={verdict(derived.pair).tone}
            />
          )}

          <ResultRows
            rows={[
              {
                label: 'Against white',
                value: `${derived.onWhite.toFixed(2)}:1 — ${verdict(derived.onWhite).label}`,
              },
              {
                label: 'Against black',
                value: `${derived.onBlack.toFixed(2)}:1 — ${verdict(derived.onBlack).label}`,
              },
              { label: 'AA threshold, normal text', value: '4.5:1' },
              { label: 'AA threshold, large text', value: '3:1' },
              { label: 'AAA threshold, normal text', value: '7:1' },
            ]}
          />

          <p className="text-sm leading-relaxed text-ink-500">
            Large text means at least 18.66px bold or 24px regular. Contrast is computed
            from WCAG 2.2 relative luminance in sRGB; an alpha channel is ignored, so check
            the composited colour rather than the declared one when transparency is
            involved.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
