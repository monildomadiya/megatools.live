import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'ratio-calculator',
  category: 'math',
  name: 'Ratio Calculator',
  h1: 'Ratio Calculator',
  metaTitle: 'Ratio Calculator — Simplify, Scale & Divide',
  metaDescription:
    'Simplify a ratio to its lowest terms, solve a proportion for the missing value, or split a total in a given ratio — with the working shown for each.',
  shortDescription:
    'Simplify ratios, solve proportions for a missing term, or divide a quantity in a given ratio.',
  keywords: [
    'ratio calculator',
    'simplify ratio',
    'ratio simplifier',
    'proportion calculator',
    'divide in a ratio',
    'aspect ratio calculator',
  ],
  faqs: [
    {
      question: 'How do I simplify a ratio?',
      answer:
        'Divide every term by the greatest common divisor of all of them. For 18:24 the GCD is 6, giving 3:4. If the terms have decimals, multiply everything by a power of ten first so they become whole numbers, then simplify — 1.5:2 becomes 15:20, which reduces to 3:4.',
    },
    {
      question: 'What is the difference between a ratio and a fraction?',
      answer:
        'A fraction compares a part to the whole; a ratio usually compares one part to another part. In a class with a 2:3 ratio of girls to boys, girls are two-fifths of the class, not two-thirds. Converting a part-to-part ratio into a fraction means adding the terms first to get the whole, and forgetting that step is the single most common ratio error.',
    },
    {
      question: 'How do I solve a proportion?',
      answer:
        'Cross-multiply. If a/b = c/x then a × x = b × c, so x = (b × c) ÷ a. This works for any missing term in the proportion, and it is the arithmetic behind scaling a recipe, converting a map distance, or resizing an image without distorting it.',
    },
    {
      question: 'How do I divide an amount in a given ratio?',
      answer:
        'Add the ratio terms to get the number of shares, divide the total by that to find one share, then multiply each term by the share value. Splitting £1,200 in the ratio 2:3:7 means 12 shares of £100, giving £200, £300 and £700. Always check that the parts add back to the original total — that is the arithmetic proving itself.',
    },
    {
      question: 'Do both sides of a ratio have to be in the same units?',
      answer:
        'Yes, and this is where most silent errors come from. A ratio of two quantities of the same kind is dimensionless — the units cancel — which only works if they were the same units to begin with. Comparing 50 cm to 2 m is a ratio of 50:200, or 1:4, not 50:2. Convert first, then form the ratio.',
    },
    {
      question: 'What does an aspect ratio like 16:9 mean?',
      answer:
        'It is the ratio of width to height, and it describes a shape rather than a size. Every 16:9 screen has the same proportions whether it is a phone or a cinema, so 1920×1080, 2560×1440 and 3840×2160 are all 16:9. To find a missing dimension, solve it as a proportion: a 16:9 image 1,000 pixels wide is 1,000 × 9 ÷ 16 = 562.5 pixels tall.',
    },
    {
      question: 'What is the difference between 1:4 and 1 in 4?',
      answer:
        'They describe different things and the ambiguity causes real mistakes. A 1:4 dilution normally means one part concentrate to four parts diluent — five parts total. "One in four" means one part out of four in total, so one part concentrate to three parts diluent. Mixing chemicals, fuel or fertiliser on the wrong reading of the same numbers gives a solution 25 percent stronger than intended.',
    },
    {
      question: 'Can a ratio have more than two terms?',
      answer:
        'Yes. Ratios with three or more terms are common in recipes, concrete mixes and share splits — a 1:2:4 concrete mix is one part cement, two parts sand, four parts aggregate. They simplify the same way, by dividing every term by the greatest common divisor of all of them, and they divide a total the same way, by adding all the terms to get the share count.',
    },
  ],
  sources: [
    {
      title: 'Special Publication 811 — Guide for the Use of the International System of Units (SI)',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title:
        'NIST Guide to the SI, Chapter 7 — rules and style conventions for expressing values of quantities',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values',
    },
    {
      title: 'The International System of Units (SI) — NIST Special Publication 330',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.330-2019.pdf',
    },
  ],
  relatedSlugs: ['math/percentage-calculator', 'math/average-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
};

export default meta;
