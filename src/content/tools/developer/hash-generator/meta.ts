import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'hash-generator',
  category: 'developer',
  name: 'Hash Generator',
  h1: 'SHA Hash Generator',
  metaTitle: 'Hash Generator — SHA-256, SHA-384, SHA-512',
  metaDescription:
    'Generate SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text in your browser, in hex or Base64, using the Web Crypto API. Nothing you type is uploaded.',
  shortDescription:
    'Hash text with SHA-1, SHA-256, SHA-384 or SHA-512 entirely in your browser, in hex or Base64, with the digest length shown.',
  leadAnswer:
    'A cryptographic hash function turns an input of any length into a fixed-length digest, and is built so the process cannot be run backwards. The same input always gives the same digest, a one-character change gives a completely different one, and finding two inputs with the same digest should be infeasible.',
  keywords: [
    'hash generator',
    'sha256 generator',
    'sha256 hash',
    'sha512 hash generator',
    'checksum generator',
    'online hash calculator',
  ],
  faqs: [
    {
      question: 'Is the text I paste sent to a server?',
      answer:
        'No. Hashing runs entirely in your browser through the Web Crypto API, which is built into the browser itself. Nothing you type is transmitted, logged or stored, and the page keeps working with the network disconnected. You can confirm it by opening your browser network tools and watching that typing produces no request.',
    },
    {
      question: 'Can a hash be reversed to get the original text back?',
      answer:
        'Not by any known method against a modern hash function. A digest is a fixed size, so infinitely many inputs map to each one and the original is not recoverable in principle. What is possible is guessing: if the input was short and predictable — a common password, a four-digit PIN, a known email address — an attacker can hash candidates until the digests match. That is why hashing alone does not make small, guessable data private.',
    },
    {
      question: 'Why is MD5 not offered here?',
      answer:
        'Because the Web Crypto API deliberately does not implement it, and adding a hand-rolled copy would mean shipping a broken algorithm alongside working ones. MD5 has been practically collision-broken since 2004: two different inputs with the same MD5 digest can be produced in seconds on a laptop. It survives as a non-cryptographic checksum for detecting accidental corruption, and for nothing else.',
    },
    {
      question: 'Is SHA-1 still safe to use?',
      answer:
        'No, not where collision resistance matters. A real collision was published in 2017, and the cost of producing one has fallen a long way since. NIST disallowed SHA-1 for digital signature generation and has set 2030 as the date for removing it entirely. It is offered on this page because you will still meet it in old Git object IDs, legacy certificates and existing checksums that you may need to reproduce — not because you should choose it for anything new.',
    },
    {
      question: 'Should I use SHA-256 to store passwords?',
      answer:
        'No. SHA-256 is designed to be fast, and speed is exactly the wrong property for password storage — commodity hardware can test billions of candidates a second against a plain SHA-256 digest. Password storage needs a deliberately slow, memory-hard, salted function: Argon2id, scrypt, or bcrypt. Adding a salt to SHA-256 helps against precomputed tables but does not fix the speed problem.',
    },
    {
      question: 'What is the difference between SHA-256 and SHA-512?',
      answer:
        'They are the same design at different widths. SHA-256 works on 32-bit words and produces a 256-bit digest; SHA-512 works on 64-bit words and produces a 512-bit one. On 64-bit hardware SHA-512 is often the faster of the two despite producing more output. SHA-384 is SHA-512 truncated to 384 bits with a different starting state, which incidentally makes it immune to the length-extension weakness the other two share.',
    },
    {
      question: 'Why does adding a single space change the whole digest?',
      answer:
        'That is the avalanche property, and it is deliberate. A well-designed hash function is built so that flipping one bit of input flips about half the bits of output, with no pattern relating the two. It is what makes a digest usable for detecting tampering: there is no such thing as a small change producing a nearly-matching digest, so you never have to judge how close two digests are — they either match exactly or they do not.',
    },
  ],
  sources: [
    {
      title: 'FIPS PUB 180-4 — Secure Hash Standard (SHS)',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://csrc.nist.gov/pubs/fips/180-4/upd1/final',
    },
    {
      title: 'NIST SP 800-131A Rev. 2 — Transitioning the Use of Cryptographic Algorithms and Key Lengths',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://csrc.nist.gov/pubs/sp/800/131/a/r2/final',
    },
    {
      title: 'Password Storage Cheat Sheet — why general-purpose hashes are unsuitable for passwords',
      publisher: 'OWASP Foundation',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
    },
    {
      title: 'SubtleCrypto.digest() — Web Crypto API specification and supported algorithms',
      publisher: 'MDN Web Docs (Mozilla)',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest',
    },
  ],
  relatedSlugs: ['developer/base64-encoder', 'developer/password-generator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
