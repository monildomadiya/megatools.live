import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'weight-converter',
  category: 'conversion',
  name: 'Weight Converter',
  h1: 'Weight & Mass Converter',
  metaTitle: 'Weight Converter — kg, lb, st, oz and Tons',
  metaDescription:
    'Convert between kilograms, pounds, stone, ounces, grams and all three tons using the exact defined factors, with troy weight for precious metals included.',
  shortDescription:
    'Convert between every common mass unit using exact defined factors — including stone, troy ounces, and all three kinds of ton.',
  keywords: [
    'weight converter',
    'kg to lbs',
    'pounds to kilograms',
    'stone to kg',
    'ounces to grams',
    'mass converter',
  ],
  faqs: [
    {
      question: 'How many pounds are in a kilogram?',
      answer:
        'One kilogram is about 2.20462 pounds. The relationship is defined in the other direction: since the 1959 International Yard and Pound Agreement, one pound is exactly 0.45359237 kilograms. Every other imperial and US customary mass unit is defined from that pound, which is why all the factors on this page are exact rather than measured.',
    },
    {
      question: 'What is the difference between weight and mass?',
      answer:
        'Mass is how much matter something contains and does not change with location. Weight is the force gravity exerts on that mass, so it varies — the same object weighs about a sixth as much on the Moon. Kilograms, pounds and stone are all mass units, so a bathroom scale reading is technically a mass, and this page converts mass throughout.',
    },
    {
      question: 'Why is a troy ounce heavier than a normal ounce?',
      answer:
        'They come from different systems. A troy ounce is 480 grains, about 31.103 grams; an avoirdupois ounce is 437.5 grains, about 28.350 grams — so a troy ounce is roughly 10 percent heavier. Confusingly, a troy pound is only 12 troy ounces against 16 for avoirdupois, which makes a troy pound lighter than a normal pound even though its ounces are heavier.',
    },
    {
      question: 'How many kilograms are in a stone?',
      answer:
        'One stone is exactly 14 pounds, which is 6.35029318 kilograms. It remains in everyday use for body weight in the UK and Ireland while being essentially unknown elsewhere, and it is normally quoted alongside pounds — "11 stone 4" means 11 × 14 + 4 = 158 pounds.',
    },
    {
      question: 'Is a ton the same as a tonne?',
      answer:
        'No, and there are three different units in play. A metric tonne is 1,000 kg. A US short ton is 2,000 pounds, about 907 kg. A British long ton is 2,240 pounds, about 1,016 kg. The short ton is about 10 percent lighter than a tonne and the long ton about 1.6 percent heavier, so shipping and commodity figures need the variety stated.',
    },
    {
      question: 'How is the kilogram defined now?',
      answer:
        'Since 2019 it has been defined by fixing the Planck constant at exactly 6.62607015 × 10⁻³⁴ joule seconds. Before that it was the mass of a physical platinum-iridium cylinder held near Paris, which had drifted measurably against its own official copies over a century. The kilogram is now reproducible in any suitably equipped laboratory rather than depending on one object.',
    },
    {
      question: 'What is a grain and why does it still exist?',
      answer:
        'A grain is exactly 1/7000 of a pound, about 64.8 milligrams, and it is the common ancestor of both the avoirdupois and troy systems. It survives in two niches where very small masses matter and tradition is strong: bullet and propellant masses in ammunition, and the dosage of some older pharmaceutical preparations.',
    },
    {
      question: 'Why does this page convert through kilograms?',
      answer:
        'Every unit here is defined against the kilogram, so converting value to kilograms and then to the target unit uses two exact factors. A lookup table of every pair would need dozens of entries, each one a rounded number, and chained conversions would accumulate error that this approach cannot produce.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI Brochure), 9th edition',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title:
        'Guide for the Use of the International System of Units (SI) — NIST Special Publication 811',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title:
        'NIST Handbook 44 — Specifications, Tolerances, and Other Technical Requirements for Weighing and Measuring Devices',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/publications/nist-handbooks/nist-handbook-44',
    },
    {
      title: 'Unit Conversion — Office of Weights and Measures',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion',
    },
  ],
  relatedSlugs: ['conversion/length-converter', 'health/bmi-calculator'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-07',
  featured: true,
};

export default meta;
