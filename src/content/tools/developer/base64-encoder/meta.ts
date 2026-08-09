import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'base64-encoder',
  category: 'developer',
  name: 'Base64 Encoder',
  h1: 'Base64 Encoder & Decoder',
  metaTitle: 'Base64 Encoder & Decoder — URL-Safe, UTF-8',
  metaDescription:
    'Encode and decode Base64 in your browser, with correct UTF-8 handling and a URL-safe variant. Nothing you paste is uploaded, and Base64 is not encryption.',
  shortDescription:
    'Encode and decode Base64 locally in your browser, with proper UTF-8 handling and the URL-safe alphabet — and a clear warning that this is encoding, not encryption.',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 to text',
    'url safe base64',
    'decode base64 online',
    'base64url',
  ],
  faqs: [
    {
      question: 'Is Base64 encryption?',
      answer:
        'No, and treating it as such is a genuine security failure rather than a pedantic distinction. Base64 is a reversible encoding with no key and no secret — anyone who sees the string can decode it in seconds, including with this page. Its purpose is to carry arbitrary bytes safely through channels that only accept text. If a password, API key or personal record is Base64 in a database or a log, it is stored in plain text with an extra step.',
    },
    {
      question: 'Why does Base64 make data bigger?',
      answer:
        'Because it packs 6 bits of information into each 8-bit character. Three bytes of input become four characters of output, so the encoded form is about 33% larger, plus padding and any line breaks. That overhead is the price of being able to send binary data through email bodies, JSON strings, XML documents and URLs without anything being mangled in transit.',
    },
    {
      question: 'What is URL-safe Base64?',
      answer:
        'A variant that swaps two characters from the standard alphabet: plus becomes minus, and slash becomes underscore. Both of the originals have special meanings in URLs — a plus can be read as an encoded space in a query string, and a slash separates path segments — so a standard Base64 value pasted into a URL can be corrupted. Padding is usually dropped too. RFC 4648 section 5 defines this variant, and JSON Web Tokens use it throughout.',
    },
    {
      question: 'What are the equals signs at the end for?',
      answer:
        'Padding. Base64 works on groups of three input bytes, and when the input length is not a multiple of three the final group is short. One or two equals signs mark how many bytes were missing, so a decoder knows not to invent them. An input whose length is a multiple of three needs no padding at all, which is why some Base64 strings end in equals signs and others do not.',
    },
    {
      question: 'Why does btoa fail on emoji and accented characters?',
      answer:
        'Because the browser’s built-in btoa only accepts characters in the range 0–255 — it predates Unicode being the default. Anything above that, including é, 中 and every emoji, throws an error. The fix is to convert the text to UTF-8 bytes first and encode those, which is what this tool does. It is why a naive implementation appears to work perfectly until the first customer with an accent in their name.',
    },
    {
      question: 'Can I decode the payload of a JWT here?',
      answer:
        'Yes, and it is a common reason to reach for a Base64 decoder. A JSON Web Token is three dot-separated URL-safe Base64 segments: header, payload and signature. Paste the middle segment with URL-safe mode on and the claims come out as readable JSON. Note what that demonstrates — a JWT payload is signed, not encrypted, so anyone holding the token can read its contents. Never put a secret in one.',
    },
    {
      question: 'What is Base64 actually used for?',
      answer:
        'Anywhere binary data has to travel through a text-only channel. Email attachments, under MIME. Images inlined into CSS or HTML as data URIs. Binary fields inside JSON and XML. HTTP Basic authentication headers, which are just a username and password Base64-encoded — again, encoded, not protected, which is why Basic auth over plain HTTP is unsafe.',
    },
  ],
  sources: [
    {
      title: 'RFC 4648 — The Base16, Base32, and Base64 Data Encodings',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc4648',
    },
    {
      title: 'RFC 2045 — MIME Part One: Format of Internet Message Bodies, section 6.8',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc2045#section-6.8',
    },
    {
      title: 'Encoding Standard — UTF-8 encode and decode',
      publisher: 'WHATWG',
      url: 'https://encoding.spec.whatwg.org/',
    },
  ],
  relatedSlugs: ['developer/json-formatter', 'conversion/data-storage-converter'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
