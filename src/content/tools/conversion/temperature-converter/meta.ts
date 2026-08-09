import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'temperature-converter',
  category: 'conversion',
  name: 'Temperature Converter',
  h1: 'Temperature Converter',
  metaTitle: 'Temperature Converter — Celsius, Fahrenheit, K',
  metaDescription:
    'Convert between Celsius, Fahrenheit, Kelvin and Rankine, with absolute zero enforced and the difference between a temperature and a temperature interval explained.',
  shortDescription:
    'Convert between Celsius, Fahrenheit, Kelvin and Rankine — the one conversion that needs an offset rather than a factor.',
  leadAnswer:
    'Celsius and Fahrenheit differ in both step size and zero point, so no single multiplication converts between them. Fahrenheit equals Celsius times 1.8 plus 32; going the other way, subtract 32 first and then divide by 1.8. Kelvin shares the Celsius step size with its zero at absolute zero.',
  keywords: [
    'temperature converter',
    'celsius to fahrenheit',
    'fahrenheit to celsius',
    'kelvin converter',
    'c to f',
    'temperature conversion formula',
  ],
  faqs: [
    {
      question: 'How do I convert Celsius to Fahrenheit?',
      answer:
        'Multiply by 9/5 and add 32, so °F = °C × 1.8 + 32. Twenty degrees Celsius is 20 × 1.8 + 32 = 68 °F. Going the other way, subtract 32 first and then divide by 1.8 — doing those two steps in the wrong order is the most common arithmetic mistake with this conversion.',
    },
    {
      question: 'Why does temperature conversion need an offset?',
      answer:
        'Because Celsius and Fahrenheit are interval scales rather than ratio scales — their zero points are arbitrary rather than representing an absence of temperature. Length and mass conversions are a single multiplication because zero metres and zero pounds mean the same thing. Zero Celsius and zero Fahrenheit do not, so the conversion needs a shift as well as a scaling.',
    },
    {
      question: 'Is 20 °C twice as warm as 10 °C?',
      answer:
        'No. Ratios are meaningless on Celsius and Fahrenheit because their zeros are arbitrary — the same two temperatures are 50 °F and 68 °F, which is not a doubling either. Only Kelvin and Rankine start at absolute zero, so only on those scales does "twice as hot" mean anything. In kelvin, 10 °C and 20 °C are 283.15 K and 293.15 K, about 3.5 percent apart.',
    },
    {
      question: 'At what temperature are Celsius and Fahrenheit the same?',
      answer:
        'At −40 degrees. Setting °C = °F in the conversion gives x = 1.8x + 32, which solves to x = −40. It is the single point where the two scales cross, which is why −40 needs no unit stated and why it is worth remembering as a check on any conversion you do by hand.',
    },
    {
      question: 'What is absolute zero?',
      answer:
        'The lowest temperature that can exist — the point at which a system holds the minimum energy quantum mechanics permits. It is 0 K, −273.15 °C, −459.67 °F, and 0 °R. It cannot be reached, only approached, and the calculator rejects any input below it because such a temperature does not exist rather than merely being unusual.',
    },
    {
      question: 'Is a change of 1 °C the same as a change of 1 K?',
      answer:
        'Yes, exactly — the two scales use identical degree sizes and differ only in where zero sits. So a temperature interval of 5 °C is 5 K, while a temperature of 5 °C is 278.15 K. This distinction matters in engineering and thermodynamics, where mixing an interval with a point produces errors of 273 rather than small ones.',
    },
    {
      question: 'How is the kelvin defined?',
      answer:
        'Since 2019 it has been defined by fixing the Boltzmann constant at exactly 1.380649 × 10⁻²³ joules per kelvin. Before that it was defined by the triple point of water, which depended on the isotopic composition and purity of the sample used. The new definition ties temperature to energy directly and can be realised in any laboratory.',
    },
    {
      question: 'What is Rankine and who uses it?',
      answer:
        'Rankine is the absolute scale that uses Fahrenheit-sized degrees: 0 °R is absolute zero and water freezes at 491.67 °R. It stands in the same relationship to Fahrenheit that Kelvin does to Celsius, and it survives in some US thermodynamics and aerospace engineering, where absolute temperatures are needed but the surrounding calculations are already in customary units.',
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
      title: 'The International System of Units (SI) — NIST Special Publication 330',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.330-2019.pdf',
    },
  ],
  relatedSlugs: ['conversion/length-converter', 'conversion/weight-converter'],
  publishedAt: '2026-08-07',
  updatedAt: '2026-08-09',
};

export default meta;
