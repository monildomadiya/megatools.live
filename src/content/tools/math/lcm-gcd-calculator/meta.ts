import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'lcm-gcd-calculator',
  category: 'math',
  name: 'LCM & GCD Calculator',
  h1: 'LCM and GCD Calculator',
  metaTitle: 'LCM and GCD Calculator — With Working Shown',
  metaDescription:
    'Find the lowest common multiple and greatest common divisor of any list of numbers, with the Euclidean algorithm steps and prime factorisations both shown.',
  shortDescription:
    'Find the LCM and GCD of any list of whole numbers, with the Euclidean algorithm worked through step by step.',
  leadAnswer:
    'The greatest common divisor of two numbers is the largest number dividing both exactly; the lowest common multiple is the smallest number both divide into. They are linked: for any two positive integers, their GCD multiplied by their LCM equals their product, so finding one immediately gives the other.',
  keywords: [
    'lcm calculator',
    'gcd calculator',
    'hcf calculator',
    'greatest common divisor',
    'lowest common multiple',
    'euclidean algorithm calculator',
  ],
  faqs: [
    {
      question: 'What is the difference between GCD, GCF and HCF?',
      answer:
        'Nothing — they are three names for the same quantity. Greatest common divisor is usual in mathematics and computing, greatest common factor in American schooling, and highest common factor in British and Indian schooling. All three mean the largest whole number that divides every number in the set exactly.',
    },
    {
      question: 'How does the Euclidean algorithm work?',
      answer:
        'Divide the larger number by the smaller and keep the remainder. Then divide the previous divisor by that remainder, and repeat. When the remainder reaches zero, the last non-zero remainder is the GCD. It works because any number dividing both a and b must also divide their difference, so replacing the pair with a smaller pair preserves the answer. It is over two thousand years old and still the method computers use.',
    },
    {
      question: 'Does GCD times LCM always equal the product?',
      answer:
        'For exactly two positive integers, yes: gcd(a, b) × lcm(a, b) = a × b. For three or more numbers it is false. gcd(4, 6, 10) is 2 and lcm(4, 6, 10) is 60, giving 120, while the product is 240. The LCM of several numbers is built up pairwise instead, taking the LCM of the first two, then of that result with the third, and so on.',
    },
    {
      question: 'What is the GCD when one of the numbers is zero?',
      answer:
        'Every number divides zero exactly, so gcd(a, 0) is a. That is the convention and it is also what makes the Euclidean algorithm terminate correctly — the final step always reaches a remainder of zero. gcd(0, 0) is defined as 0. The LCM involving zero is 0, which is why this tool asks for positive numbers: an LCM of zero is technically correct and never useful.',
    },
    {
      question: 'What does it mean for two numbers to be coprime?',
      answer:
        'Their GCD is 1, meaning they share no prime factor. 8 and 15 are coprime even though neither is prime. When two numbers are coprime their LCM is simply their product, and a fraction with coprime numerator and denominator is already in lowest terms. It is the property that matters in cryptography, in gear design, and any time you want two cycles to stay out of step for as long as possible.',
    },
    {
      question: 'Why do I need the LCM for fractions?',
      answer:
        'Adding fractions requires a common denominator, and the lowest common multiple of the denominators is the smallest one that works. For 1/6 + 1/8, the LCM of 6 and 8 is 24, so the sum becomes 4/24 + 3/24 = 7/24. Multiplying the denominators instead would give 48 and an answer of 14/48, which is correct but then has to be cancelled back down.',
    },
    {
      question: 'Is prime factorisation a better method?',
      answer:
        'It is more instructive and far slower. Factorising shows why the answer is what it is — the GCD takes the lowest power of each shared prime, the LCM the highest power of every prime appearing. But factorising a large number is genuinely hard, while the Euclidean algorithm finds a GCD of two thirty-digit numbers in well under a hundred steps. This page shows both: the factorisation to explain, the algorithm to compute.',
    },
  ],
  sources: [
    {
      title: "Euclid's Elements, Book VII, Propositions 1–3 — the original algorithm",
      publisher: 'Clark University (D. E. Joyce edition)',
      url: 'https://mathcs.clarku.edu/~djoyce/elements/bookVII/bookVII.html',
    },
    {
      title: "Euclid's algorithm — definition and complexity",
      publisher: 'NIST Dictionary of Algorithms and Data Structures',
      url: 'https://xlinux.nist.gov/dads/HTML/euclidalgo.html',
    },
    {
      title: 'Least Common Multiple and Greatest Common Divisor',
      publisher: 'Wolfram MathWorld',
      url: 'https://mathworld.wolfram.com/LeastCommonMultiple.html',
    },
  ],
  relatedSlugs: ['math/fraction-calculator', 'math/ratio-calculator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
