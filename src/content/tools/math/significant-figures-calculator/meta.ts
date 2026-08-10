import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'significant-figures-calculator',
  category: 'math',
  name: 'Significant Figures Calculator',
  h1: 'Significant Figures Calculator',
  metaTitle: 'Significant Figures Calculator — Count and Round',
  metaDescription:
    'Count the significant figures in any number and round to a chosen precision, with the rule applied to each digit shown and trailing-zero ambiguity flagged.',
  shortDescription:
    'Count significant figures in a number and round to a given precision, with ambiguous trailing zeros flagged rather than silently resolved.',
  leadAnswer:
    'Significant figures are the digits in a measurement that carry real information about its precision. All non-zero digits count, zeros between them count, leading zeros never count, and trailing zeros count only when a decimal point makes clear they were measured rather than used as placeholders.',
  keywords: [
    'significant figures calculator',
    'sig figs calculator',
    'how many significant figures',
    'round to significant figures',
    'significant digits',
    'sig fig rules',
    'rounding calculator',
  ],
  faqs: [
    {
      question: 'Are trailing zeros significant?',
      answer:
        'Only when a decimal point is present. In 1.200 the two trailing zeros are significant, giving four significant figures, because there would be no reason to write them unless they had been measured. In 1200 with no decimal point they are ambiguous: the number could be the result of a measurement good to two, three or four figures, and the notation cannot tell you which. This calculator flags that case rather than picking an answer for you.',
    },
    {
      question: 'Why is 1500 ambiguous when 1500.0 is not?',
      answer:
        'Because a trailing zero does two different jobs and the notation cannot distinguish them. In 1500 the zeros might be measured digits or they might be placeholders holding the 1 and the 5 in the right columns. Writing 1500.0 removes the doubt — the decimal point signals that every digit shown was measured, giving five significant figures. Scientific notation removes it more cleanly still: 1.5 × 10³ is unambiguously two figures, 1.500 × 10³ is unambiguously four.',
    },
    {
      question: 'Do leading zeros ever count?',
      answer:
        'Never. In 0.00340 the three zeros before the 3 are placeholders that position the decimal point, so they carry no information about precision. The significant figures are 3, 4 and the trailing 0 — three in total. This is easiest to see in scientific notation, where the same number is 3.40 × 10⁻³ and the leading zeros disappear entirely.',
    },
    {
      question: 'How many significant figures should a calculated answer have?',
      answer:
        'Two different rules, depending on the operation. For multiplication and division, the answer carries as many significant figures as the input with the fewest — 4.56 × 1.4 is 6.4, not 6.384, because 1.4 has only two. For addition and subtraction the rule is about decimal places rather than figures: 12.11 + 0.3 is 12.4, because 0.3 is only good to one decimal place. Mixing the two rules up is the most common error in the subject.',
    },
    {
      question: 'What is round-half-to-even, and why does it matter?',
      answer:
        'It is the rounding rule most standards bodies specify, including NIST: when a value falls exactly halfway, round to the nearest even digit rather than always rounding up. So 2.5 becomes 2 and 3.5 becomes 4. Always rounding halves upward introduces a small systematic bias that accumulates across a long column of figures, which is precisely what round-half-to-even removes. Everyday arithmetic and most calculators, including this one, use round-half-up, which is fine for one number and wrong for ten thousand.',
    },
    {
      question: 'Do exact numbers have significant figures?',
      answer:
        'No, and treating them as though they do is a common way to lose precision needlessly. Counted quantities are exact: if you have 3 samples, that 3 is not a measurement good to one figure. Defined constants are exact too — an inch is exactly 25.4 mm and there are exactly 12 in a dozen. Exact values never limit the precision of a result, so only the measured inputs are counted when applying the rules above.',
    },
    {
      question: 'Is a significant figure the same as a decimal place?',
      answer:
        'No, and the distinction matters most for small numbers. 0.00340 has three significant figures and five decimal places. 340 has two or three significant figures depending on the trailing zero, and zero decimal places. Significant figures describe how much of the number is meaningful; decimal places describe where the number is cut off. This calculator reports both, because instructions and specifications use each of them and rarely say which they mean.',
    },
  ],
  sources: [
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units, rounding and significant digits',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'Uncertainty of Measurement Results — reporting and significant digits',
      publisher: 'NIST Physical Measurement Laboratory',
      url: 'https://physics.nist.gov/cuu/Uncertainty/index.html',
    },
    {
      title: 'The International System of Units (SI), 9th edition — expressing measurement results',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
  ],
  relatedSlugs: ['math/average-calculator', 'math/standard-deviation-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
