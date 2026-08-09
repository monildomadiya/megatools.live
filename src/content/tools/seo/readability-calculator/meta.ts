import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'readability-calculator',
  category: 'seo',
  name: 'Readability Calculator',
  h1: 'Readability Score Calculator',
  metaTitle: 'Readability Calculator — Flesch, Fog, SMOG, Grade',
  metaDescription:
    'Score your text with Flesch Reading Ease, Flesch-Kincaid Grade, Gunning Fog, SMOG, Coleman-Liau and ARI, and see which sentences are dragging the score down.',
  shortDescription:
    'Score your writing with six established readability formulas at once, and see exactly which sentences and words are pushing the grade level up.',
  keywords: [
    'readability calculator',
    'flesch reading ease',
    'flesch kincaid grade level',
    'gunning fog index',
    'smog index',
    'readability score checker',
  ],
  faqs: [
    {
      question: 'What is a good Flesch Reading Ease score?',
      answer:
        'On the 0–100 scale, 60–70 is described as plain English readable by 13- to 15-year-olds, and it is the target most general-audience writing aims for. Above 80 is very easy, at roughly a fourth-grade level. Below 30 is very difficult and typical of academic and legal prose. Popular newspapers score around 60–70, and insurance policies often fall below 20 — which is why several US states set a statutory minimum score for consumer insurance contracts.',
    },
    {
      question: 'How is a readability grade level calculated?',
      answer:
        'Almost every formula uses just two inputs: average sentence length and a proxy for word difficulty, usually syllables per word or the proportion of long words. Flesch-Kincaid, for example, is 0.39 times words per sentence plus 11.8 times syllables per word, minus 15.59. The result is expressed as a US school grade, so 8.0 means an average eighth-grader should manage it. The formulas differ mainly in how they weight the two inputs.',
    },
    {
      question: 'Which readability formula should I use?',
      answer:
        'For general web writing, Flesch Reading Ease and Flesch-Kincaid Grade are the most widely recognised and the ones most tools report. For health and safety materials, SMOG is the usual choice because it was calibrated for complete comprehension rather than partial. For business writing, Gunning Fog is conventional. The sensible approach is to look at several — if they broadly agree, the reading is reliable; if they disagree sharply, something about the text is unusual.',
    },
    {
      question: 'Can I write for a low grade level without dumbing content down?',
      answer:
        'Yes, and this is the most important thing to understand about these scores. A lower grade level comes from shorter sentences and more familiar words, not from having less to say. Technical accuracy and reading ease are largely independent — you can explain a complex idea in short sentences with common words, and it will usually be a better explanation. What you cannot do is keep the necessary terminology out of the count, which is why domain-heavy writing has a floor.',
    },
    {
      question: 'Does readability affect SEO rankings?',
      answer:
        'Not directly. Google has repeatedly said there is no readability score in its ranking systems, and no formula is a documented ranking factor. What readability affects is behaviour — whether people stay, understand, and act — and those outcomes matter. Writing to hit a number is pointless; writing so people understand you is not, and the score is a rough proxy for the second thing.',
    },
    {
      question: 'Why do different tools give different scores for the same text?',
      answer:
        'Because the hard parts are not specified. Counting syllables in English cannot be done reliably by rule, so every implementation uses a slightly different heuristic and they disagree on words like "business", "poem" and "fire". Sentence detection differs too: abbreviations, decimals, ellipses and bullet lists all cause splits or missed splits. Expect a spread of half a grade level between tools, and treat any single score as approximate.',
    },
    {
      question: 'What do these formulas not measure?',
      answer:
        'Almost everything that actually makes writing clear. They do not see structure, logical order, headings, whether an example follows a claim, or whether a sentence means anything at all. A paragraph of short random words scores brilliantly. Because they count syllables rather than familiarity, they also penalise a common long word like "everybody" while rewarding a rare short one like "wend". They are a smoke alarm, not an editor.',
    },
  ],
  sources: [
    {
      title: 'Flesch, R. (1948). A new readability yardstick. Journal of Applied Psychology, 32(3)',
      publisher: 'American Psychological Association / PubMed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/18867058/',
    },
    {
      title:
        'Kincaid, J.P. et al. (1975). Derivation of New Readability Formulas for Navy Enlisted Personnel (Research Branch Report 8-75)',
      publisher: 'US Naval Air Station Memphis / Defense Technical Information Center',
      url: 'https://apps.dtic.mil/sti/citations/ADA006655',
    },
    {
      title: 'Federal Plain Language Guidelines',
      publisher: 'US Plain Language Action and Information Network (PLAIN)',
      url: 'https://www.plainlanguage.gov/guidelines/',
    },
  ],
  relatedSlugs: ['seo/word-counter'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
