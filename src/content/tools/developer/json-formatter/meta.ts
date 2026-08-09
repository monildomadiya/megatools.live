import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'json-formatter',
  category: 'developer',
  name: 'JSON Formatter',
  h1: 'JSON Formatter & Validator',
  metaTitle: 'JSON Formatter & Validator — Pretty Print, Minify',
  metaDescription:
    'Format, validate and minify JSON in your browser. Errors are reported with a line and column, and nothing you paste is ever sent to a server.',
  shortDescription:
    'Pretty-print, validate and minify JSON entirely in your browser, with syntax errors reported by line and column rather than as a bare exception.',
  keywords: [
    'json formatter',
    'json validator',
    'json beautifier',
    'json minify',
    'pretty print json',
    'format json online',
  ],
  faqs: [
    {
      question: 'Is my JSON sent to a server?',
      answer:
        'No. Everything on this page runs in your browser using the built-in JSON parser, and the page makes no network request with your input. That matters because the things people most often need to format are config files, API responses and log payloads — exactly the material that tends to contain credentials, tokens and personal data. You can confirm it by opening your browser’s network tab while you paste.',
    },
    {
      question: 'Why does my JSON fail to parse when it looks fine?',
      answer:
        'Four causes account for almost all of it: a trailing comma after the last item in an object or array, single quotes instead of double quotes, unquoted object keys, and a comment. All four are legal in JavaScript and none are legal in JSON. A fifth, harder to spot, is a smart quote pasted in from a word processor, which looks almost identical to a straight quote and is not one.',
    },
    {
      question: 'Are comments allowed in JSON?',
      answer:
        'No. Douglas Crockford removed them from the specification deliberately, on the grounds that people were using them to hold parsing directives rather than notes. Several supersets add them back — JSON5, JSONC as used by VS Code, and HJSON — but a file with comments is not JSON and a strict parser will reject it. If you need a config format with comments, use one that has them rather than hoping the parser is lenient.',
    },
    {
      question: 'Does JSON allow trailing commas?',
      answer:
        'No. An array written as [1, 2, 3,] is invalid, as is an object with a comma after its final member. This is the most common single cause of a parse failure, because JavaScript, Python and most other languages permit it and editors do not always flag it. JSON5 permits it; JSON itself does not.',
    },
    {
      question: 'What is the difference between JSON and a JavaScript object?',
      answer:
        'JSON is a text format that happens to look like JavaScript object literal syntax, but it is far stricter. Keys must be double-quoted strings. Values may only be strings, numbers, booleans, null, arrays and objects — no functions, no undefined, no dates, no comments, no NaN or Infinity. Every JSON document is valid JavaScript, but the reverse is nowhere close to true.',
    },
    {
      question: 'How should dates be represented in JSON?',
      answer:
        'JSON has no date type, so dates are conventionally strings in ISO 8601 format, such as 2026-08-09T14:30:00Z. This is what JavaScript’s JSON.stringify produces from a Date object and what most APIs expect. Unix timestamps as numbers are the other common choice; they are compact and unambiguous but unreadable, and they need a documented unit because seconds and milliseconds both appear in the wild.',
    },
    {
      question: 'Are large integers safe in JSON?',
      answer:
        'The format itself places no limit on the size of a number, but most parsers read numbers into a double-precision float, which represents integers exactly only up to 2⁵³ − 1, or 9,007,199,254,740,991. A 64-bit database ID above that silently loses precision when it round-trips through JavaScript. The standard workaround is to transmit large identifiers as strings, which is why so many APIs return IDs quoted.',
    },
  ],
  sources: [
    {
      title: 'RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc8259',
    },
    {
      title: 'ECMA-404 — The JSON Data Interchange Syntax, 2nd edition',
      publisher: 'Ecma International',
      url: 'https://ecma-international.org/publications-and-standards/standards/ecma-404/',
    },
    {
      title: 'ECMAScript Language Specification — The JSON Object',
      publisher: 'Ecma International (ECMA-262)',
      url: 'https://tc39.es/ecma262/#sec-json-object',
    },
  ],
  relatedSlugs: ['developer/base64-encoder'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
