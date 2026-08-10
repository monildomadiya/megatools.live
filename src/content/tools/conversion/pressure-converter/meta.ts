import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'pressure-converter',
  category: 'conversion',
  name: 'Pressure Converter',
  h1: 'Pressure Converter',
  metaTitle: 'Pressure Converter — bar, psi, kPa, atm, mmHg',
  metaDescription:
    'Convert bar, psi, kilopascals, atmospheres, mmHg and inches of mercury using exact SI factors, with gauge and absolute pressure handled separately.',
  shortDescription:
    'Convert between pascals, bar, psi, atmospheres and mmHg, with a gauge reading converted to absolute pressure rather than quietly confused with it.',
  leadAnswer:
    'Pressure is force distributed over an area, measured in pascals in SI, where one pascal is one newton per square metre. Because a pascal is tiny, practical work uses multiples and legacy units: the bar, the pound per square inch, the atmosphere, and the millimetre of mercury still standard in medicine.',
  keywords: [
    'pressure converter',
    'psi to bar',
    'bar to psi',
    'kpa to psi',
    'mmhg to kpa',
    'atm to bar',
    'tyre pressure converter',
    'pascal converter',
  ],
  faqs: [
    {
      question: 'What is the difference between gauge and absolute pressure?',
      answer:
        'Absolute pressure is measured from a perfect vacuum. Gauge pressure is measured from the surrounding atmosphere, so it reads zero when a vessel is open to the air. The two differ by one atmosphere, 101.325 kPa or 14.696 psi. Almost every everyday gauge — tyre, bicycle pump, boiler, scuba cylinder — reads gauge pressure, while thermodynamic calculations and weather data use absolute. A tyre at 32 psi gauge holds 46.7 psi absolute, and confusing the two is the most consequential error in this whole subject.',
    },
    {
      question: 'Is one bar the same as one atmosphere?',
      answer:
        'They are close but not equal. One bar is exactly 100,000 pascals by definition. One standard atmosphere is exactly 101,325 pascals, fixed by the 10th General Conference on Weights and Measures in 1954. So an atmosphere is about 1.3% more than a bar. For a tyre or a weather chart that difference is negligible; for a gas calculation or a pressure vessel rating it is not, and standards bodies now prefer the bar or the kilopascal precisely because the atmosphere carries historical baggage.',
    },
    {
      question: 'Is a torr the same as a millimetre of mercury?',
      answer:
        'Not exactly, though the difference almost never matters. A torr is defined as exactly 1/760 of a standard atmosphere, which is 133.322368… pascals. The conventional millimetre of mercury is defined from a mercury density of 13,595.1 kg/m³ under standard gravity, giving exactly 133.322387415 pascals. They differ by about one part in seven million. Vacuum work uses the torr, medicine uses mmHg, and both are listed here separately because the definitions are genuinely different even where the numbers are not.',
    },
    {
      question: 'Why is blood pressure still measured in millimetres of mercury?',
      answer:
        'Because the original instrument was a column of mercury, and the unit outlived the instrument. A reading of 120 mmHg meant the pressure would support a 120 mm mercury column. Modern monitors are electronic and mercury sphygmomanometers have been withdrawn on toxicity grounds, but the scale was kept so a century of clinical thresholds stayed valid. In SI a 120/80 reading is about 16.0/10.7 kPa, a form no clinician uses.',
    },
    {
      question: 'Should I set tyre pressure in psi, bar or kPa?',
      answer:
        'Whichever your vehicle placard uses, and convert rather than approximate. The placard in the driver-side door jamb gives the manufacturer’s cold inflation pressure, and it is a gauge figure. A common conversion trap is rounding 2.2 bar to 32 psi when it is 31.9, which is harmless, and then rounding 35 psi to 2.5 bar when it is 2.41, which is not. Pressure also rises roughly 1 psi for every 10°F of tyre temperature, so check when cold.',
    },
    {
      question: 'Why do weather reports use hectopascals and inches of mercury?',
      answer:
        'Meteorology moved from the millibar to the hectopascal, which was painless because they are exactly equal: 1 mbar = 1 hPa = 100 Pa. Standard sea-level pressure is 1013.25 hPa. Aviation and US broadcast weather kept inches of mercury, where the same standard pressure is 29.92 inHg. The three scales coexist because the changeover cost nothing for millibars and would have cost retraining for everything else.',
    },
    {
      question: 'Is psi a unit of force or of pressure?',
      answer:
        'Pressure. It is pounds-force per square inch — a force spread over an area — and the "force" half of the name is routinely dropped, which is where the confusion starts. One pound-force is exactly 4.4482216152605 newtons and one square inch is exactly 0.00064516 square metres, which makes 1 psi exactly 6,894.757293168 pascals. When a figure is written psig it is gauge pressure and psia is absolute.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI), 9th edition — derived units and the pascal',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'Tires — inflation pressure and vehicle placard guidance',
      publisher: 'National Highway Traffic Safety Administration (NHTSA)',
      url: 'https://www.nhtsa.gov/equipment/tires',
    },
  ],
  relatedSlugs: ['conversion/area-converter', 'lifestyle/fuel-cost-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
