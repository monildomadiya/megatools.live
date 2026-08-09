import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'speed-converter',
  category: 'conversion',
  name: 'Speed Converter',
  h1: 'Speed & Pace Converter',
  metaTitle: 'Speed Converter — mph, km/h, Knots, m/s',
  metaDescription:
    'Convert speed between mph, km/h, metres per second, feet per second and knots using exact factors, and switch between speed and running or cycling pace.',
  shortDescription:
    'Convert speed between mph, km/h, m/s, ft/s and knots with exact factors, and turn any of them into a running or cycling pace per mile or kilometre.',
  leadAnswer:
    'Speed is distance divided by time, and every common unit is an exact definition: a mile per hour is 0.44704 metres per second, and a knot is one nautical mile of exactly 1,852 metres per hour. Mach is the exception — a ratio to the local speed of sound, not a fixed speed.',
  keywords: [
    'speed converter',
    'mph to kmh',
    'knots to mph',
    'metres per second to km/h',
    'pace calculator',
    'min per km to mph',
  ],
  faqs: [
    {
      question: 'How do I convert mph to km/h?',
      answer:
        'Multiply by exactly 1.609344. A mile is defined as exactly 1,609.344 metres, so 60 mph is 96.56 km/h. Going the other way, divide by 1.609344, or multiply by 0.621371. The rough mental version — add 60% — is accurate to under 1%, which is fine for reading a foreign speed limit sign.',
    },
    {
      question: 'How do I convert km/h to m/s?',
      answer:
        'Divide by 3.6. There are 1,000 metres in a kilometre and 3,600 seconds in an hour, so the factor is 1000 ÷ 3600 = 0.2777…. A car at 100 km/h is travelling 27.8 metres every second, which is a more useful way to think about stopping distance than the speedometer figure.',
    },
    {
      question: 'What is a knot and why is it used at sea?',
      answer:
        'A knot is one nautical mile per hour, and a nautical mile is exactly 1,852 metres — about 15% longer than a statute mile. The nautical mile was defined to approximate one minute of latitude, so a navigator could read distance straight off the latitude scale at the side of a chart. Speed in knots therefore converts directly into degrees of latitude per hour, which is why aviation and marine navigation both kept it.',
    },
    {
      question: 'Is Mach a fixed speed?',
      answer:
        'No, and this is the point people most often miss. Mach number is a ratio of an object’s speed to the local speed of sound, and the speed of sound depends on the temperature of the air. At sea level in the International Standard Atmosphere at 15 °C it is about 340.3 m/s, but in the stratosphere at −56.5 °C it drops to about 295 m/s. An aircraft holding Mach 0.85 is flying at different true airspeeds at different altitudes.',
    },
    {
      question: 'How do I convert a running pace to a speed?',
      answer:
        'Divide the distance unit by the time. A pace of 5:00 per kilometre is 5 minutes, or 1/12 of an hour, per kilometre, so the speed is 12 km/h. In general, speed in km/h is 60 divided by the pace in minutes per kilometre; speed in mph is 60 divided by the pace in minutes per mile. This converter does both directions.',
    },
    {
      question: 'What is the difference between speed and velocity?',
      answer:
        'Speed is a scalar — a magnitude with no direction. Velocity is a vector, carrying both magnitude and direction. A car driving in a circle at a constant 50 km/h has constant speed but continuously changing velocity, because its direction changes. Everyday use treats the words as synonyms; physics does not, and the distinction is what makes circular motion an acceleration.',
    },
    {
      question: 'Why is wind speed sometimes given in knots and sometimes in km/h?',
      answer:
        'Marine and aviation forecasts use knots because navigation does. Public land forecasts use whatever the national meteorological service has standardised on — km/h in most of Europe and Canada, mph in the United Kingdom and United States. Some scientific data is published in metres per second, which is the SI form. They describe the same wind; only the unit changes.',
    },
  ],
  sources: [
    {
      title: 'The International System of Units (SI Brochure), 9th edition',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
    {
      title: 'NIST Special Publication 811 — Guide for the Use of the International System of Units',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://www.nist.gov/pml/special-publication-811',
    },
    {
      title: 'U.S. Standard Atmosphere, 1976 (NASA-TM-X-74335)',
      publisher: 'NOAA / NASA / United States Air Force',
      url: 'https://ntrs.nasa.gov/citations/19770009539',
    },
  ],
  relatedSlugs: ['conversion/length-converter'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
