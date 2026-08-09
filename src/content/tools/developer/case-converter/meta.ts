import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'case-converter',
  category: 'developer',
  name: 'Case Converter',
  h1: 'Case Converter',
  metaTitle: 'Case Converter — camelCase, snake_case, Title Case',
  metaDescription:
    'Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case and sentence case, all at once and entirely in your browser.',
  shortDescription:
    'Convert text into every common programming and editorial case at once — camelCase, snake_case, kebab-case, Title Case and the rest — in one pass.',
  leadAnswer:
    'Case conventions carry meaning in code: camelCase for variables, PascalCase for classes and types, snake_case for Python and SQL columns, kebab-case for URLs and CSS, CONSTANT_CASE for constants and environment variables. Converting between them means finding the word boundaries first, which is the harder half.',
  keywords: [
    'case converter',
    'camelcase converter',
    'snake case converter',
    'title case converter',
    'kebab case',
    'uppercase lowercase converter',
  ],
  faqs: [
    {
      question: 'What is the difference between camelCase and PascalCase?',
      answer:
        'Only the first letter. camelCase starts lowercase and capitalises each subsequent word — userAccountId. PascalCase capitalises the first word too — UserAccountId. Most language conventions use them for different things: in JavaScript, Java and C#, variables and functions are camelCase while classes and types are PascalCase, so the case itself tells you what kind of thing a name refers to.',
    },
    {
      question: 'Which case should I use for a URL slug?',
      answer:
        'kebab-case, lowercase, with hyphens between words. Google has stated that hyphens are treated as word separators in URLs while underscores are not, so this-is-a-page reads as three words and this_is_a_page can read as one. Lowercase matters too: URL paths are case-sensitive on most servers, so two casings of the same path are two different pages as far as a crawler is concerned.',
    },
    {
      question: 'What words are not capitalised in title case?',
      answer:
        'Style guides differ, which is why there is no single correct answer. The common core is that articles (a, an, the), coordinating conjunctions (and, but, or, nor) and short prepositions stay lowercase unless they are the first or last word. Where guides diverge is the length cut-off for prepositions: APA and Chicago capitalise prepositions of four letters or more, while AP uses a threshold of four as well but differs elsewhere. This tool follows the APA-style rule and says so rather than pretending there is a universal one.',
    },
    {
      question: 'Why does uppercasing sometimes change the length of a string?',
      answer:
        'Because case mapping is not one-to-one. The German ß uppercases to SS, two characters where there was one. The Turkish dotless ı and dotted İ map differently again, and lowercasing "I" in a Turkish locale gives ı rather than i — which has broken real software that compared identifiers case-insensitively. Unicode defines all of this in its default case algorithms, and the rule to remember is that changing case is a locale-sensitive transformation, not a per-character lookup.',
    },
    {
      question: 'What is snake_case used for?',
      answer:
        'Python variables and functions, Ruby methods, SQL column names in most schemas, and Rust identifiers all use snake_case. It has one practical advantage over camelCase: it survives being lowercased. Systems that fold identifiers to lowercase — which many SQL databases do — turn userAccountId into useraccountid and lose the word boundaries entirely, whereas user_account_id comes through intact.',
    },
    {
      question: 'What is CONSTANT_CASE and when is it used?',
      answer:
        'Uppercase words separated by underscores, also called SCREAMING_SNAKE_CASE. It is the near-universal convention for compile-time constants and for environment variables. The environment variable case is more than convention: POSIX defines the portable character set for environment variable names as uppercase letters, digits and underscore, so lowercase names, while usually accepted, are outside the standard.',
    },
    {
      question: 'How does the converter split words in the first place?',
      answer:
        'It looks for the boundaries every convention uses: spaces and punctuation, underscores and hyphens, and the transition from a lowercase letter to an uppercase one. Runs of capitals are handled as a unit so that XMLHttpRequest splits into XML, Http and Request rather than into single letters. Digits are treated as attached to the word they follow, so version2 stays one word rather than becoming two.',
    },
  ],
  sources: [
    {
      title: 'The Unicode Standard, Section 3.13 — Default Case Algorithms',
      publisher: 'The Unicode Consortium',
      url: 'https://www.unicode.org/versions/latest/',
    },
    {
      title: 'APA Style — Title Case and Sentence Case Capitalization',
      publisher: 'American Psychological Association',
      url: 'https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case',
    },
    {
      title: 'POSIX.1-2017 — Environment Variable Definition',
      publisher: 'The Open Group / IEEE',
      url: 'https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap08.html',
    },
  ],
  relatedSlugs: ['seo/slug-generator', 'developer/json-formatter'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
