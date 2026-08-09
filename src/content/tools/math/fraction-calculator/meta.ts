import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'fraction-calculator',
  category: 'math',
  name: 'Fraction Calculator',
  h1: 'Fraction Calculator',
  metaTitle: 'Fraction Calculator — Add, Subtract, Multiply, Divide',
  metaDescription:
    'Add, subtract, multiply and divide fractions and mixed numbers, with the common denominator and every simplification step shown rather than just the answer.',
  shortDescription:
    'Add, subtract, multiply and divide fractions or mixed numbers, and see the common denominator, the working, and the simplified result.',
  leadAnswer:
    'A fraction represents a number as one integer divided by another. Multiplying and dividing them is straightforward, because numerators and denominators combine directly. Adding and subtracting needs a common denominator first, since thirds and quarters count different-sized pieces and cannot be added as they stand.',
  keywords: [
    'fraction calculator',
    'add fractions',
    'mixed number calculator',
    'simplify fractions',
    'dividing fractions',
    'fraction to decimal',
  ],
  faqs: [
    {
      question: 'How do I add fractions with different denominators?',
      answer:
        'Rewrite both fractions over a common denominator, then add the numerators and leave the denominator alone. For 2/3 + 1/4, the lowest common denominator is 12: 2/3 becomes 8/12, 1/4 becomes 3/12, and the sum is 11/12. Multiplying the two denominators together always gives a workable common denominator — it just may not be the lowest one, which means more simplifying at the end.',
    },
    {
      question: 'Why do you flip the second fraction when dividing?',
      answer:
        'Because dividing by a number is the same as multiplying by its reciprocal, and the reciprocal of a fraction is that fraction turned upside down. Dividing by 2 is multiplying by 1/2; dividing by 2/3 is multiplying by 3/2. So 1/2 ÷ 3/4 becomes 1/2 × 4/3 = 4/6 = 2/3. The rule is not arbitrary — it follows from the definition of division.',
    },
    {
      question: 'How do I simplify a fraction to lowest terms?',
      answer:
        'Divide the numerator and the denominator by their greatest common divisor. For 18/24, the greatest common divisor is 6, so the fraction reduces to 3/4. The efficient way to find the GCD by hand is Euclid’s algorithm: repeatedly replace the larger number with its remainder when divided by the smaller, until the remainder is zero. The last non-zero value is the GCD.',
    },
    {
      question: 'What is a mixed number and when should I use one?',
      answer:
        'A mixed number combines a whole number with a proper fraction, such as 2 3/4. It is easier to picture — you can see immediately that it is a bit under three — which is why recipes and measurements use it. An improper fraction, 11/4 for the same value, is easier to compute with. The usual practice is to convert to improper fractions to do the arithmetic and back to a mixed number to state the answer.',
    },
    {
      question: 'How do I convert a fraction to a decimal?',
      answer:
        'Divide the numerator by the denominator: 3/8 is 3 ÷ 8 = 0.375. Whether the decimal terminates depends entirely on the denominator once the fraction is in lowest terms. If its only prime factors are 2 and 5, the decimal terminates; if any other prime is present, it repeats forever. That is why 1/8 terminates and 1/3 does not, and why the answer changes with the number base.',
    },
    {
      question: 'Can a denominator be zero?',
      answer:
        'No. A fraction with denominator zero is undefined, not infinite. Division asks how many times the denominator fits into the numerator, and zero fits into anything an unlimited number of times — or no times at all, for 0/0. There is no consistent value to assign, so mathematics leaves it undefined and this calculator rejects it.',
    },
    {
      question: 'Why do computers get 0.1 + 0.2 wrong but fractions right?',
      answer:
        'Because binary floating point cannot represent 0.1 exactly, in the same way decimal cannot represent 1/3 exactly. The stored value is very slightly off, and the errors accumulate, which is how 0.1 + 0.2 becomes 0.30000000000000004 in most programming languages. Fraction arithmetic keeps the numerator and denominator as whole numbers throughout, so nothing is ever approximated — which is exactly why this calculator works that way.',
    },
  ],
  sources: [
    {
      title: 'Common Core State Standards for Mathematics — Number and Operations: Fractions',
      publisher: 'Common Core State Standards Initiative',
      url: 'https://www.thecorestandards.org/Math/Content/NF/',
    },
    {
      title: 'National curriculum in England: mathematics programmes of study',
      publisher: 'UK Department for Education',
      url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
    },
    {
      title: 'IEEE 754-2019 — Standard for Floating-Point Arithmetic',
      publisher: 'Institute of Electrical and Electronics Engineers (IEEE)',
      url: 'https://standards.ieee.org/ieee/754/6210/',
    },
  ],
  relatedSlugs: ['math/ratio-calculator', 'math/percentage-calculator'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
