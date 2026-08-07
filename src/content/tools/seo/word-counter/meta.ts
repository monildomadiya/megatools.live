import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'word-counter',
  category: 'seo',
  name: 'Word Counter',
  h1: 'Word & Character Counter',
  metaTitle: 'Word Counter — Words, Characters, Reading Time',
  metaDescription:
    'Count words, characters, sentences and paragraphs as you type, with reading and speaking time from published reading-rate research. Nothing leaves your browser.',
  shortDescription:
    'Count words, characters, sentences and paragraphs as you type, with the exact counting rule for each figure stated rather than assumed.',
  keywords: [
    'word counter',
    'character counter',
    'word count tool',
    'reading time calculator',
    'words per minute',
    'keyword density',
  ],
  faqs: [
    {
      question: 'Why does my word count differ from Microsoft Word or Google Docs?',
      answer:
        'Because there is no single definition of a word. The main disagreements are hyphenated compounds, numbers, and text separated by an em dash without spaces. This tool counts a run of non-whitespace characters as one word, so "state-of-the-art" counts as one. Word counts it as one too, but some tools split on the hyphen and return four. Differences of one or two per cent between tools are normal and neither is wrong.',
    },
    {
      question: 'How is character count with and without spaces different?',
      answer:
        'The with-spaces figure counts every character including spaces, tabs and line breaks. The without-spaces figure removes all whitespace. Publishing and translation work usually quotes characters with spaces, while some character limits — older SMS gateways, certain database fields — count differently again. If you are working to a hard limit, check which one the limit refers to before trusting either number.',
    },
    {
      question: 'How is reading time calculated?',
      answer:
        'By dividing the word count by 238 words per minute, the average silent reading rate for non-fiction English prose found in Brysbaert’s 2019 meta-analysis of 190 studies. That figure is an average across adult readers: individual rates vary widely, and dense technical material is read considerably more slowly than narrative. Treat the result as an estimate with a wide margin, not a stopwatch.',
    },
    {
      question: 'How is speaking time calculated?',
      answer:
        'At 130 words per minute, which is a typical measured pace for prepared speech delivered to an audience. Conversational speech runs faster, often 150 to 170 words per minute, and deliberately slow presentation can drop below 110. If you are timing a talk, read a page aloud at your real pace and calibrate against that rather than relying on any generic figure.',
    },
    {
      question: 'What counts as a sentence?',
      answer:
        'A run of text ending in a full stop, question mark or exclamation mark. This is a heuristic and it has known failure cases: abbreviations such as "Dr." or "e.g." are counted as sentence endings, and a sentence ending in an ellipsis or a closing quotation mark may be counted differently than you expect. For ordinary prose the count is close; for text dense with abbreviations it will read high.',
    },
    {
      question: 'Does this tool send my text anywhere?',
      answer:
        'No. Everything is computed in your browser as you type, and nothing is transmitted or stored. The page works with the network disconnected. That matters if the thing you are counting is unpublished writing, client work, or anything else you would not paste into a stranger’s server.',
    },
    {
      question: 'What is keyword density and does it still matter for SEO?',
      answer:
        'Keyword density is how often a term appears as a share of total words. It was once used as a direct ranking signal and is not treated that way now — modern search systems evaluate meaning rather than repetition, and deliberately hitting a density target is closer to a penalty risk than an optimisation. The frequency list here is useful for a different reason: it shows you what your writing is actually about, which is often not what you intended.',
    },
  ],
  sources: [
    {
      title: 'How many words do we read per minute? A review and meta-analysis of reading rate (Journal of Memory and Language, 2019)',
      publisher: 'Marc Brysbaert, Ghent University',
      url: 'https://www.sciencedirect.com/science/article/pii/S0749596X19300786',
    },
    {
      title: 'Unicode Standard Annex #29 — Unicode Text Segmentation (word and grapheme cluster boundaries)',
      publisher: 'The Unicode Consortium',
      url: 'https://unicode.org/reports/tr29/',
    },
    {
      title: 'Control your title links in search results',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/appearance/title-link',
    },
    {
      title: 'Unicode Standard Annex #15 — Unicode Normalization Forms',
      publisher: 'The Unicode Consortium',
      url: 'https://unicode.org/reports/tr15/',
    },
  ],
  relatedSlugs: ['developer/password-generator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
