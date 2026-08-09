'use client';

import { useMemo, useState } from 'react';
import { CalculatorPanel } from '@/components/tool/ToolShell';
import { ResetButton, ResultCard, ResultRows } from '@/components/tool/fields';
import { formatNumber } from '@/lib/format';

const TEXTAREA =
  'mt-2 w-full resize-y rounded-control border border-line bg-panel-2 px-3.5 py-3 text-base leading-relaxed text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15';

/**
 * Syllable count by heuristic, because English orthography does not permit a
 * rule-based one — "business" and "busy" share a stem and disagree, and no
 * short algorithm gets "poem", "fire" and "orange" all right.
 *
 * This is the widely used vowel-group approach with the standard corrections:
 * strip a silent trailing e, keep a syllabic -le, and never return zero. It is
 * accurate to within about one syllable on nearly every word, which is enough
 * for an average taken over hundreds of them and is why two readability tools
 * rarely agree exactly.
 */
function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length === 0) return 0;
  if (clean.length <= 3) return 1;

  const trimmed = clean
    // Silent e, but not in -le, -ale etc. where the e carries a syllable.
    .replace(/(?:[^laeiouy]es|[^laeiouy]e)$/, '')
    .replace(/^y/, '');

  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(groups ? groups.length : 1, 1);
}

/**
 * Sentence splitting that survives the abbreviations and decimals that break
 * the naive "split on a full stop" version. Not perfect — nothing short is —
 * but it stops "Dr. Smith" and "3.5 kg" from inflating the sentence count.
 */
function splitSentences(text: string): string[] {
  const guarded = text
    .replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc|e\.g|i\.e|approx|Inc|Ltd|Co)\./gi, '$1<dot>')
    .replace(/(\d)\.(\d)/g, '$1<dot>$2');

  return guarded
    .split(/(?<=[.!?])[\s\n]+/)
    .map((sentence) => sentence.replace(/<dot>/g, '.').trim())
    .filter((sentence) => /[a-zA-Z]/.test(sentence));
}

function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter((word) => word !== '');
}

function fleschVerdict(score: number): { label: string; tone: 'good' | 'warn' | 'bad' } {
  if (score >= 80) return { label: 'Very easy — around a fourth-grade level', tone: 'good' };
  if (score >= 60) return { label: 'Plain English — the usual target', tone: 'good' };
  if (score >= 50) return { label: 'Fairly difficult — tenth to twelfth grade', tone: 'warn' };
  if (score >= 30) return { label: 'Difficult — college level', tone: 'warn' };
  return { label: 'Very difficult — academic or legal prose', tone: 'bad' };
}

export default function ReadabilityCalculator() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const trimmed = text.trim();
    if (trimmed === '') return null;

    const sentences = splitSentences(trimmed);
    const words = splitWords(trimmed);
    if (words.length === 0 || sentences.length === 0) return null;

    const syllablesPerWord = words.map(countSyllables);
    const totalSyllables = syllablesPerWord.reduce((total, count) => total + count, 0);
    const letters = words.join('').replace(/[^\p{L}]/gu, '').length;

    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const polysyllables = syllablesPerWord.filter((count) => count >= 3).length;

    const wordsPerSentence = wordCount / sentenceCount;
    const syllablesPerWordAvg = totalSyllables / wordCount;

    const flesch = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWordAvg;
    const fleschKincaid = 0.39 * wordsPerSentence + 11.8 * syllablesPerWordAvg - 15.59;
    const fog = 0.4 * (wordsPerSentence + 100 * (polysyllables / wordCount));
    // SMOG is defined over a 30-sentence sample; the standard generalisation
    // scales the polysyllable count to 30 sentences, which is what every
    // implementation does for shorter text. It is unreliable below ~10
    // sentences, and the page says so rather than hiding it.
    const smog = 1.043 * Math.sqrt(polysyllables * (30 / sentenceCount)) + 3.1291;
    const colemanLiau =
      0.0588 * ((letters / wordCount) * 100) - 0.296 * ((sentenceCount / wordCount) * 100) - 15.8;
    const ari = 4.71 * (letters / wordCount) + 0.5 * wordsPerSentence - 21.43;

    const grades = [fleschKincaid, fog, smog, colemanLiau, ari].filter((value) =>
      Number.isFinite(value),
    );
    const consensus = grades.reduce((total, value) => total + value, 0) / grades.length;

    // The sentences doing the damage, so the score turns into an edit.
    const longest = sentences
      .map((sentence) => ({ sentence, length: splitWords(sentence).length }))
      .sort((a, b) => b.length - a.length)
      .slice(0, 3)
      .filter((entry) => entry.length > 25);

    const hardWords = [
      ...new Set(
        words
          .map((word, index) => ({ word, syllables: syllablesPerWord[index]! }))
          .filter((entry) => entry.syllables >= 4)
          .map((entry) => entry.word.toLowerCase()),
      ),
    ].slice(0, 8);

    return {
      flesch: Math.max(Math.min(flesch, 121.22), -100),
      fleschKincaid,
      fog,
      smog,
      colemanLiau,
      ari,
      consensus,
      wordCount,
      sentenceCount,
      totalSyllables,
      wordsPerSentence,
      syllablesPerWordAvg,
      polysyllables,
      polysyllablePercent: (polysyllables / wordCount) * 100,
      longest,
      hardWords,
      shortSample: sentenceCount < 10,
    };
  }, [text]);

  const verdict = result ? fleschVerdict(result.flesch) : null;

  return (
    <CalculatorPanel label="Input · your writing">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="readability-input" className="block text-sm font-semibold text-ink-800">
          Paste your text
        </label>
        <ResetButton onClick={() => setText('')} />
      </div>
      <textarea
        id="readability-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={10}
        placeholder="Paste at least a few paragraphs. Readability formulas average over a sample, so a single sentence will not give a meaningful score."
        className={TEXTAREA}
      />

      {result && verdict && (
        <div className="mt-7 space-y-4">
          <ResultCard
            label="Flesch Reading Ease"
            value={result.flesch.toFixed(1)}
            // The scale is conventionally described as 0–100 but is not bounded
            // there: very short sentences of one-syllable words score above it.
            // Printing "115.5 / 100" reads as a bug rather than as the formula
            // behaving as designed.
            unit={result.flesch > 100 ? 'above the 0–100 scale' : '/ 100'}
            verdict={verdict.label}
            tone={verdict.tone}
          />

          {result.shortSample && (
            <p className="rounded-card border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
              Only {result.sentenceCount} sentence
              {result.sentenceCount === 1 ? '' : 's'} — too short for a stable score. SMOG in
              particular was designed for a 30-sentence sample and is unreliable here. Paste
              a few hundred words for a reading you can act on.
            </p>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">
              Grade level, by formula — a US school grade
            </p>
            <ResultRows
              rows={[
                {
                  label: 'Consensus (mean of the five below)',
                  value: `Grade ${result.consensus.toFixed(1)}`,
                  emphasis: true,
                },
                { label: 'Flesch–Kincaid Grade Level', value: result.fleschKincaid.toFixed(1) },
                { label: 'Gunning Fog Index', value: result.fog.toFixed(1) },
                { label: 'SMOG Index', value: result.smog.toFixed(1) },
                { label: 'Coleman–Liau Index', value: result.colemanLiau.toFixed(1) },
                { label: 'Automated Readability Index', value: result.ari.toFixed(1) },
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink-600">What the formulas are counting</p>
            <ResultRows
              rows={[
                { label: 'Words', value: formatNumber(result.wordCount) },
                { label: 'Sentences', value: formatNumber(result.sentenceCount) },
                {
                  label: 'Average sentence length',
                  value: `${result.wordsPerSentence.toFixed(1)} words`,
                  emphasis: true,
                },
                { label: 'Syllables', value: formatNumber(result.totalSyllables) },
                {
                  label: 'Syllables per word',
                  value: result.syllablesPerWordAvg.toFixed(2),
                },
                {
                  label: 'Words of three or more syllables',
                  value: `${formatNumber(result.polysyllables)} (${result.polysyllablePercent.toFixed(1)}%)`,
                },
              ]}
            />
          </div>

          {result.longest.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-ink-600">
                Longest sentences — splitting these moves the score most
              </p>
              <ul className="space-y-2">
                {result.longest.map((entry) => (
                  <li
                    key={entry.sentence.slice(0, 40)}
                    className="rounded-card border border-line bg-panel-2 p-4 text-sm leading-relaxed text-ink-700"
                  >
                    <span className="numeric font-semibold text-ink-900">
                      {entry.length} words
                    </span>{' '}
                    — {entry.sentence}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.hardWords.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-ink-600">
                Longest words — replace only the ones that have a plainer equivalent
              </p>
              <p className="text-sm leading-relaxed text-ink-700">
                {result.hardWords.join(', ')}
              </p>
            </div>
          )}

          <p className="text-sm leading-relaxed text-ink-500">
            These formulas measure sentence length and word length. They cannot see
            structure, logic, or whether a sentence means anything — a paragraph of short
            random words scores well. Treat a poor score as a prompt to reread, not as an
            instruction to shorten everything.
          </p>
        </div>
      )}
    </CalculatorPanel>
  );
}
