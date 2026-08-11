import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'number-base-converter',
  category: 'developer',
  name: 'Number Base Converter',
  h1: 'Number Base Converter',
  metaTitle: 'Number Base Converter — Binary, Hex, Decimal',
  metaDescription:
    'Convert whole numbers between binary, octal, decimal, hexadecimal and any base from 2 to 36, at any size — arbitrary-precision, so nothing is lost to rounding.',
  shortDescription:
    'Convert whole numbers between binary, octal, decimal, hex and any base from 2 to 36, at any size without precision loss.',
  leadAnswer:
    'A number base is how many distinct digits a notation uses before it needs a second column. Decimal has ten, binary two, hexadecimal sixteen. The quantity never changes when you convert — 255, 0xFF and 11111111 are the same number written three ways, and only the notation differs.',
  keywords: [
    'number base converter',
    'binary to decimal',
    'hex to decimal converter',
    'decimal to binary',
    'base converter',
    'octal to hex',
  ],
  faqs: [
    {
      question: 'Why is hexadecimal used so much in programming?',
      answer:
        'Because sixteen is two to the fourth, so exactly four binary digits fit in one hex digit with nothing left over. That makes the conversion a lookup rather than arithmetic: 1111 is F, 1010 is A, every time, regardless of position. A byte is always two hex characters and a 32-bit value always eight. Decimal has no such relationship with binary, which is why a byte in decimal tells you nothing about its bits.',
    },
    {
      question: 'Can this handle very large numbers?',
      answer:
        'Yes. The conversion uses arbitrary-precision integers rather than ordinary JavaScript numbers, which are only exact up to about nine quadrillion. Many converters silently lose precision above that: enter a twenty-digit number and the last few digits come back wrong, with no error and no warning. This one is exact at any length you can type.',
    },
    {
      question: 'What is the highest base I can use?',
      answer:
        'Thirty-six, because that is where the digits run out — ten numerals plus twenty-six letters. Base 36 is occasionally used for compact identifiers for exactly that reason. Anything higher needs an agreed alphabet, which is why Base64 exists as a separate specification with its own defined character set rather than as base 64 in this sense.',
    },
    {
      question: 'Why does 0.1 in decimal not convert cleanly to binary?',
      answer:
        'For the same reason a third does not convert cleanly to decimal. A fraction terminates in a given base only when its denominator divides a power of that base. Ten has factors of two and five, so a fifth terminates in decimal; two has only itself, so anything with a factor of five in the denominator repeats forever in binary. 0.1 becomes an infinite repeating binary fraction, which is why 0.1 plus 0.2 does not equal 0.3 in most programming languages.',
    },
    {
      question: 'How are negative numbers represented in binary?',
      answer:
        'On this page a minus sign is shown, which is the mathematical notation. Computers do not work that way — they use two’s complement, where the leading bit carries a negative weight, so in eight bits −1 is 11111111 and −128 is 10000000. Two’s complement exists because it makes subtraction the same circuit as addition. If you are reading a raw register value, expect two’s complement, not a sign.',
    },
    {
      question: 'What do the 0b, 0o and 0x prefixes mean?',
      answer:
        'They are notation telling a compiler or reader which base follows: 0b for binary, 0o for octal, 0x for hexadecimal, and a bare number for decimal. They are not part of the value. 0xFF and 255 are the same number, and the prefix exists only because 11 is ambiguous otherwise — three in binary, nine in octal, eleven in decimal, seventeen in hex.',
    },
    {
      question: 'Why does octal still exist?',
      answer:
        'Mostly Unix file permissions, where it fits the problem exactly. Permissions come in three groups of three bits — read, write, execute for owner, group and others — and three bits is exactly one octal digit. That is why chmod 755 is written the way it is: 7 is 111, 5 is 101. Outside that and a few older architectures, hexadecimal has replaced it.',
    },
  ],
  sources: [
    {
      title: 'ECMA-262 — Number.prototype.toString ( radix ) and the digit alphabet for bases 2 to 36',
      publisher: 'Ecma International',
      url: 'https://tc39.es/ecma262/#sec-number.prototype.tostring',
    },
    {
      title: 'IEEE 754-2019 — Standard for Floating-Point Arithmetic',
      publisher: 'IEEE',
      url: 'https://standards.ieee.org/ieee/754/6210/',
    },
    {
      title: 'The Unicode Standard — code point notation and the U+ hexadecimal convention',
      publisher: 'The Unicode Consortium',
      url: 'https://www.unicode.org/versions/latest/',
    },
  ],
  relatedSlugs: ['developer/base64-encoder', 'conversion/data-storage-converter'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
