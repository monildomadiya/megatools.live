import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'password-generator',
  category: 'developer',
  name: 'Password Generator',
  h1: 'Random Password Generator',
  metaTitle: 'Password Generator — Strong Random Passwords',
  metaDescription:
    'Generate strong random passwords in your browser using the operating system cryptographic random number generator, with the entropy of each result shown in bits.',
  shortDescription:
    'Generate cryptographically random passwords entirely in your browser, with the real entropy of each one shown rather than a vague strength meter.',
  leadAnswer:
    'A password’s resistance to guessing comes from entropy — the number of passwords the generator could have produced — not from looking complicated. Length contributes more than character variety: every extra character multiplies the search space, while substituting a 3 for an e barely changes it at all.',
  keywords: [
    'password generator',
    'random password generator',
    'strong password',
    'secure password generator',
    'password entropy',
    'passphrase generator',
  ],
  faqs: [
    {
      question: 'Are these passwords generated on a server?',
      answer:
        'No. Generation runs entirely in your browser using the Web Crypto API, which draws from your operating system cryptographic random number generator. Nothing is transmitted, logged or stored, and the page works with the network disconnected. You can verify this by opening your browser network tools and watching that no request is made when you generate.',
    },
    {
      question: 'What is password entropy and how many bits do I need?',
      answer:
        'Entropy measures how many guesses an attacker would need on average, expressed in bits: each extra bit doubles the work. It is calculated as the password length multiplied by the base-2 logarithm of the alphabet size. Below about 60 bits is weak against a determined offline attack on a stolen password database. Around 75 to 80 bits is comfortable for most accounts, and 100 bits or more is beyond any foreseeable brute-force attack.',
    },
    {
      question: 'Is a long passphrase better than a short complex password?',
      answer:
        'Usually, yes. Length contributes more entropy than symbol variety does. A 20-character password drawn from lowercase letters alone carries about 94 bits, while a 10-character password using all four character types carries about 65. NIST guidance reflects this: it recommends allowing long passwords and dropping mandatory composition rules, because those rules push people toward predictable substitutions like replacing an "a" with an "@".',
    },
    {
      question: 'Why does requiring one of each character type slightly reduce entropy?',
      answer:
        'Because it removes some possible passwords from the set. If every result must contain at least one digit, then all the results containing no digits can no longer occur, so there are fewer possibilities overall. The reduction is small — typically well under one bit at normal lengths — and it is usually worth accepting because many sites reject passwords that lack a required character type. The figure shown on this page is the unconstrained entropy, so treat it as an upper bound when that option is on.',
    },
    {
      question: 'Does Math.random work for generating passwords?',
      answer:
        'No, and this is the most common flaw in password generators. Math.random is a fast, statistically-decent generator that is not cryptographically secure: its internal state can be recovered from a modest number of outputs, which lets an attacker reproduce every value it will produce next. This tool uses crypto.getRandomValues, which is specified to draw from a cryptographically strong source.',
    },
    {
      question: 'What is modulo bias and why does it matter here?',
      answer:
        'If you take a random 32-bit number and reduce it with a remainder operation to pick from an alphabet whose size does not divide evenly into the range, the lower-numbered characters come up slightly more often. The skew is small but it is a real reduction in strength and it is entirely avoidable. This generator uses rejection sampling: values falling in the uneven tail of the range are discarded and redrawn, so every character is equally likely.',
    },
    {
      question: 'Should I use a password manager instead?',
      answer:
        'Use both. A generator gives you a password no human would invent; a manager means you never have to remember or retype it, and that you never reuse one across sites. Reuse is the failure that actually causes most account compromises, because one breached site then unlocks the others. Generate here, store it in a manager, and never type it a second time.',
    },
  ],
  sources: [
    {
      title: 'NIST Special Publication 800-63B — Digital Identity Guidelines: Authentication and Lifecycle Management',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://pages.nist.gov/800-63-3/sp800-63b.html',
    },
    {
      title: 'NIST SP 800-90A Rev. 1 — Recommendation for Random Number Generation Using Deterministic Random Bit Generators',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://csrc.nist.gov/pubs/sp/800/90/a/r1/final',
    },
    {
      title: 'Authentication Cheat Sheet — password strength and storage guidance',
      publisher: 'OWASP Foundation',
      url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
    },
    {
      title: 'Crypto.getRandomValues() — Web Crypto API specification and behaviour',
      publisher: 'MDN Web Docs (Mozilla)',
      url: 'https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues',
    },
  ],
  relatedSlugs: ['math/percentage-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
