import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'keyword-density-calculator',
  category: 'seo',
  name: 'Keyword Density Calculator',
  h1: 'Keyword Density Calculator',
  metaTitle: 'Keyword Density Calculator — Phrase Frequency',
  metaDescription:
    'Check how often a word or phrase appears in your text as a percentage of total words, with one, two and three-word frequency lists and a target phrase count.',
  shortDescription:
    'Measure how often each word and phrase appears in a piece of text, as a count and as a percentage of the total.',
  leadAnswer:
    'Keyword density is the number of times a term appears in a text divided by the total word count, expressed as a percentage. A phrase used 12 times in a 1,500-word article has a density of 0.8%. No search engine publishes a target figure, and none of the major ones treats the raw ratio as a ranking signal.',
  keywords: [
    'keyword density calculator',
    'keyword density checker',
    'keyword frequency',
    'phrase density',
    'word frequency counter',
    'keyword stuffing check',
  ],
  faqs: [
    {
      question: 'How is keyword density calculated?',
      answer:
        'Divide the number of occurrences of the term by the total number of words, then multiply by 100. A phrase appearing 9 times in a 1,200-word page has a density of 0.75%. For multi-word phrases some tools divide by the number of phrase slots rather than words, which gives a slightly higher figure — this one divides by total words and says so.',
    },
    {
      question: 'What is a good keyword density?',
      answer:
        'There is no published figure from any search engine, and the widely repeated “1 to 3%” has no source behind it. Modern retrieval models saturate term frequency, so the tenth repetition contributes almost nothing over the ninth. Write naturally and use this tool to catch accidental over-repetition rather than to hit a target.',
    },
    {
      question: 'Is keyword stuffing still penalised?',
      answer:
        'Yes. Google’s spam policies name keyword stuffing explicitly and describe it as loading pages with repeated words or phrases to manipulate rankings, including lists of numbers or cities with no purpose. It is one of the few practices the documentation calls out by name, and it can lead to a manual action rather than a quiet demotion.',
    },
    {
      question: 'Why does my density figure differ between tools?',
      answer:
        'Because the counting rules differ. Tools disagree on whether to strip HTML, count stop words, treat hyphenated forms as one word or two, include alt text and meta tags, and how to handle multi-word phrases in the denominator. None is wrong; they are answering slightly different questions. Compare a page against itself over time using one tool, not across tools.',
    },
    {
      question: 'Do search engines actually use term frequency?',
      answer:
        'They use it, but not linearly. Classical models such as BM25 apply a saturation function so that repeated occurrences give rapidly diminishing returns, and they normalise for document length so that a long page cannot win by repetition alone. Modern ranking adds semantic matching on top, which further weakens the value of literal repetition.',
    },
    {
      question: 'Should I count stop words in the total?',
      answer:
        'Include them in the denominator, since they are genuinely part of the text, but exclude them from the frequency list where they would otherwise crowd out everything meaningful. That is what this tool does, and it is why the top-terms list starts with content words rather than with “the”.',
    },
    {
      question: 'What are two and three-word phrases useful for?',
      answer:
        'They show what the page is actually about far better than single words do. A page can mention “density” and “keyword” frequently without ever using the phrase together. Checking two and three-word groupings also surfaces unintentional repetition of a stock phrase, which is one of the clearest markers of thin writing.',
    },
    {
      question: 'Does using a keyword in the title or headings matter more?',
      answer:
        'Position and markup carry weight that a flat density figure cannot see. A term in the title, the first paragraph, or a heading is more informative about the page’s subject than the same term buried in the tenth paragraph. Density treats every occurrence as equal, which is one of its main weaknesses as a measure.',
    },
  ],
  sources: [
    {
      title: 'Spam policies for Google web search — keyword stuffing',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/essentials/spam-policies',
    },
    {
      title: 'Creating helpful, reliable, people-first content',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
    },
    {
      title: 'The Probabilistic Relevance Framework: BM25 and Beyond',
      publisher: 'Robertson & Zaragoza, Foundations and Trends in Information Retrieval',
      url: 'https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf',
    },
    {
      title: 'SEO Starter Guide',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
    },
  ],
  relatedSlugs: ['seo/word-counter', 'seo/readability-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
