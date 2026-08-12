'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ResetButton, ResultRows, UnitToggle } from '@/components/tool/fields';
import { CalculatorPanel } from '@/components/tool/ToolShell';

/**
 * The fonts and widths Google renders results in.
 *
 * Truncation is decided by how wide the text draws, not by how many characters
 * it contains, so the check has to draw the text. Arial is the substitute for
 * Google's own font: its metrics are close enough that the measurement lands
 * within a few pixels for ordinary Latin text, and it is present on effectively
 * every device, which a webfont would not be.
 */
const LAYOUTS = {
  desktop: {
    label: 'Desktop',
    titleFont: '400 20px Arial, Helvetica, sans-serif',
    descFont: '400 14px Arial, Helvetica, sans-serif',
    /** Width of the results column in pixels. */
    width: 600,
    descLines: 2,
  },
  mobile: {
    label: 'Mobile',
    titleFont: '400 16px Arial, Helvetica, sans-serif',
    descFont: '400 14px Arial, Helvetica, sans-serif',
    width: 380,
    descLines: 3,
  },
} as const;

type LayoutKey = keyof typeof LAYOUTS;

/** Greedy word wrap against a measured width — the same thing a browser does. */
function wrap(
  text: string,
  measure: (value: string) => number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = words[0]!;

  for (const word of words.slice(1)) {
    const candidate = `${line} ${word}`;
    if (measure(candidate) <= maxWidth) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  lines.push(line);
  return lines;
}

/** Cuts a string to fit a width, ending in an ellipsis the way a snippet does. */
function truncateToWidth(
  text: string,
  measure: (value: string) => number,
  maxWidth: number,
): { text: string; truncated: boolean } {
  if (measure(text) <= maxWidth) return { text, truncated: false };

  let cut = text;
  while (cut.length > 0 && measure(`${cut}…`) > maxWidth) {
    cut = cut.slice(0, -1);
  }
  return { text: `${cut.trimEnd()}…`, truncated: true };
}

const DEFAULTS = {
  title: 'Unit Price Calculator — Compare Cost Per Unit',
  url: 'https://megatools.live/tools/lifestyle/unit-price-calculator',
  description:
    'Compare up to four products on price per unit, across mixed sizes and units, and see which is genuinely cheaper — including when the bigger pack is not.',
};

export default function SerpSnippetPreview() {
  const [title, setTitle] = useState(DEFAULTS.title);
  const [url, setUrl] = useState(DEFAULTS.url);
  const [description, setDescription] = useState(DEFAULTS.description);
  const [layout, setLayout] = useState<LayoutKey>('desktop');

  const titleId = useId();
  const urlId = useId();
  const descId = useId();

  // Measurement needs a canvas, which does not exist during server rendering.
  // Deferring it to an effect keeps the first client render identical to the
  // server's, so nothing mismatches on hydration; the figures appear a frame
  // later.
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [measurable, setMeasurable] = useState(false);

  useEffect(() => {
    contextRef.current = document.createElement('canvas').getContext('2d');
    setMeasurable(contextRef.current !== null);
  }, []);

  const spec = LAYOUTS[layout];

  const analysis = useMemo(() => {
    const context = contextRef.current;
    if (!measurable || context === null) return null;

    const measureWith = (font: string) => (value: string) => {
      context.font = font;
      return context.measureText(value).width;
    };

    const measureTitle = measureWith(spec.titleFont);
    const measureDesc = measureWith(spec.descFont);

    const titleWidth = measureTitle(title);
    const shownTitle = truncateToWidth(title, measureTitle, spec.width);

    const lines = wrap(description, measureDesc, spec.width);
    const shownLines = lines.slice(0, spec.descLines);
    const descTruncated = lines.length > spec.descLines;

    if (descTruncated && shownLines.length > 0) {
      const last = shownLines[shownLines.length - 1]!;
      shownLines[shownLines.length - 1] = truncateToWidth(
        `${last} ${lines[spec.descLines]!}`,
        measureDesc,
        spec.width,
      ).text;
    }

    return {
      titleWidth,
      titlePct: (titleWidth / spec.width) * 100,
      shownTitle,
      lines,
      shownLines,
      descTruncated,
    };
  }, [title, description, spec, measurable]);

  const display = useMemo(() => {
    try {
      const parsed = new URL(url);
      const segments = parsed.pathname.split('/').filter(Boolean);
      return {
        host: parsed.hostname.replace(/^www\./, ''),
        crumbs: segments.slice(0, 3),
      };
    } catch {
      return { host: url || 'example.com', crumbs: [] as string[] };
    }
  }, [url]);

  const inputClass =
    'mt-2 w-full rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

  return (
    <CalculatorPanel label="Input · snippet">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <UnitToggle
          label="Layout"
          value={layout}
          onChange={setLayout}
          options={[
            { value: 'desktop' as const, label: 'Desktop' },
            { value: 'mobile' as const, label: 'Mobile' },
          ]}
        />
        <ResetButton
          onClick={() => {
            setTitle(DEFAULTS.title);
            setUrl(DEFAULTS.url);
            setDescription(DEFAULTS.description);
          }}
        />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={titleId} className="block text-sm font-semibold text-ink-800">
            Title
          </label>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="The title element of the page"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={urlId} className="block text-sm font-semibold text-ink-800">
            URL
          </label>
          <input
            id={urlId}
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/page"
            className={`${inputClass} text-sm`}
          />
        </div>

        <div>
          <label htmlFor={descId} className="block text-sm font-semibold text-ink-800">
            Meta description
          </label>
          <textarea
            id={descId}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="The description you would like shown beneath the title"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>
      </div>

      <div className="mt-7">
        <p className="eyebrow eyebrow-muted mb-3">Preview · {spec.label.toLowerCase()}</p>
        <div className="rounded-card border border-line bg-panel p-5">
          <div
            // The preview has to be set in the face the measurement assumed,
            // or the box on screen and the pixel figures below it disagree.
            style={{ maxWidth: spec.width, fontFamily: 'Arial, Helvetica, sans-serif' }}
          >
            <p className="truncate text-sm text-ink-600">
              {display.host}
              {display.crumbs.length > 0 && (
                <span className="text-ink-400"> › {display.crumbs.join(' › ')}</span>
              )}
            </p>
            <p
              className="mt-1 leading-snug text-[#1a0dab]"
              style={{ fontSize: layout === 'desktop' ? 20 : 16 }}
            >
              {analysis ? analysis.shownTitle.text : title}
            </p>
            <div className="mt-1 text-sm leading-relaxed text-ink-600">
              {analysis
                ? analysis.shownLines.map((line, index) => <p key={index}>{line}</p>)
                : description}
            </div>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="mt-6 space-y-4">
          <ResultRows
            rows={[
              {
                label: `Title width (limit about ${spec.width}px)`,
                value: `${Math.round(analysis.titleWidth)}px · ${Math.round(
                  analysis.titlePct,
                )}%`,
                emphasis: true,
              },
              { label: 'Title characters', value: String(title.length) },
              {
                label: `Description lines (about ${spec.descLines} shown)`,
                value: String(analysis.lines.length),
              },
              { label: 'Description characters', value: String(description.length) },
            ]}
          />

          {analysis.shownTitle.truncated && (
            <p
              role="alert"
              className="rounded-control border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800"
            >
              The title is wider than the column and will be cut. What survives is what sits
              at the front, so move the words that identify the page ahead of the site name
              rather than after it.
            </p>
          )}

          {analysis.descTruncated && (
            <p className="rounded-control border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink-600">
              The description runs past the lines usually shown. That is not itself a problem
              — Google frequently generates its own description from page content anyway — but
              anything after the cut is not doing any work in the result.
            </p>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            Widths are measured in your browser using Arial at the sizes Google renders
            results in, which is close to the real thing rather than identical to it. Layouts
            vary by device, by query and by result type, and titles are frequently rewritten.
            Use the figure as a guide, not as a limit to optimise against.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
