import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'quadratic-equation-solver',
  category: 'math',
  name: 'Quadratic Equation Solver',
  h1: 'Quadratic Equation Solver',
  metaTitle: 'Quadratic Equation Solver — Roots & Discriminant',
  metaDescription:
    'Solve ax² + bx + c = 0 for real or complex roots, with the discriminant, the vertex and the factored form — computed the numerically stable way.',
  shortDescription:
    'Solve any quadratic for real or complex roots, with the discriminant, the vertex and the working shown.',
  leadAnswer:
    'A quadratic equation is any equation that can be written as ax² + bx + c = 0 with a not equal to zero. It has exactly two roots once complex numbers are allowed, and the discriminant b² − 4ac decides their nature: positive gives two distinct real roots, zero gives one repeated root, negative gives a conjugate pair.',
  keywords: [
    'quadratic equation solver',
    'quadratic formula calculator',
    'discriminant calculator',
    'roots of a quadratic',
    'complex roots calculator',
    'vertex form calculator',
  ],
  faqs: [
    {
      question: 'What does the discriminant actually tell me?',
      answer:
        'The discriminant is b² − 4ac, the part under the square root. Positive means the parabola crosses the x-axis twice, so there are two distinct real roots. Zero means it touches the axis at exactly one point, giving a repeated root. Negative means it never touches the axis, and the two roots are complex conjugates. You can read all three cases off the sign without finishing the calculation.',
    },
    {
      question: 'Why does this page use a different form of the quadratic formula?',
      answer:
        'Because the textbook form loses accuracy in a predictable case. When b² is much larger than 4ac, one of the two roots is computed as the difference of two nearly equal numbers, and most of the significant digits cancel. The standard fix computes the well-conditioned root first, then obtains the other from the product of the roots, c/a. Both forms are algebraically identical; only one of them survives finite-precision arithmetic.',
    },
    {
      question: 'What happens if a is zero?',
      answer:
        'The equation is not quadratic any more, it is linear: bx + c = 0, with the single root −c/b. The quadratic formula cannot be used because it divides by 2a. This solver detects the case and solves the linear equation instead rather than returning an error or, worse, an infinity. If b is also zero the equation is either an identity, when c is zero, or has no solution at all.',
    },
    {
      question: 'How do I read a complex root?',
      answer:
        'A negative discriminant gives roots of the form p ± qi, where p is −b/2a and q is √(4ac − b²)/2a. The two roots are conjugates: same real part, equal and opposite imaginary parts. In physical problems that usually means the system oscillates rather than settling, which is why a negative discriminant is informative rather than a failure.',
    },
    {
      question: 'What is the vertex, and how is it found?',
      answer:
        'The vertex is the turning point of the parabola, at x = −b/2a, which is also the axis of symmetry. Its y value is found by substituting that x back in, giving c − b²/4a. When a is positive the vertex is the minimum of the function; when a is negative it is the maximum. Optimisation questions about a quadratic are almost always asking for the vertex, not the roots.',
    },
    {
      question: 'Can the roots be checked without solving again?',
      answer:
        'Yes, with Vieta’s formulas: the two roots sum to −b/a and multiply to c/a. Both are shown here. They are the fastest sanity check available — if a pair of roots fails either identity, the arithmetic is wrong somewhere, and the check costs one addition and one multiplication.',
    },
    {
      question: 'Why do the roots sometimes come back as long decimals?',
      answer:
        'Because most quadratics do not have tidy roots. Textbook exercises are constructed so the discriminant is a perfect square, which makes the answer a fraction; a quadratic taken from real data has no reason to be. Results are shown to several significant figures, and the significant figures calculator on this site covers how many of them are worth quoting.',
    },
  ],
  sources: [
    {
      title: 'NIST Digital Library of Mathematical Functions §1.11 — Zeros of Polynomials',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://dlmf.nist.gov/1.11',
    },
    {
      title: 'What Every Computer Scientist Should Know About Floating-Point Arithmetic (ACM Computing Surveys, 23:1)',
      publisher: 'David Goldberg / Oracle documentation',
      url: 'https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html',
    },
    {
      title: 'IEEE 754-2019 — Standard for Floating-Point Arithmetic',
      publisher: 'IEEE Standards Association',
      url: 'https://standards.ieee.org/ieee/754/6210/',
    },
  ],
  relatedSlugs: ['math/significant-figures-calculator', 'math/fraction-calculator'],
  publishedAt: '2026-08-12',
  updatedAt: '2026-08-12',
};

export default meta;
