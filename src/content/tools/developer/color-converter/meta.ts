import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'color-converter',
  category: 'developer',
  name: 'Color Converter',
  h1: 'Color Converter',
  metaTitle: 'Color Converter — HEX, RGB, HSL and Contrast',
  metaDescription:
    'Convert a colour between HEX, RGB, HSL, HSV and CMYK, and check the WCAG contrast ratio against any background with the AA and AAA thresholds applied.',
  shortDescription:
    'Convert a colour between HEX, RGB, HSL, HSV and CMYK, and check its WCAG contrast ratio against a background.',
  leadAnswer:
    'A hex colour is three bytes written in base 16 — #4F46E5 is red 79, green 70, blue 229. HSL describes the same colour as a hue angle, a saturation percentage and a lightness percentage, which is easier to reason about by hand but converts to exactly the same sRGB values.',
  keywords: [
    'color converter',
    'hex to rgb',
    'rgb to hex',
    'hex to hsl',
    'colour converter',
    'contrast ratio checker',
  ],
  faqs: [
    {
      question: 'How do I convert a hex colour to RGB by hand?',
      answer:
        'Split the six digits into three pairs and read each pair as a base-16 number. In #4F46E5, 4F is 4×16 + 15 = 79, 46 is 4×16 + 6 = 70, and E5 is 14×16 + 5 = 229, giving rgb(79, 70, 229). A three-digit hex is shorthand in which each digit is doubled, so #F60 means #FF6600.',
    },
    {
      question: 'What is the difference between HSL and HSV?',
      answer:
        'Both use the same hue angle, but they differ in what the third component means. In HSL, 100% lightness is always white and 50% is the pure hue. In HSV, 100% value is the brightest version of the hue and white only appears when saturation is also zero. Design tools tend to expose HSV; CSS uses HSL.',
    },
    {
      question: 'What contrast ratio do I need to meet WCAG?',
      answer:
        'WCAG 2.2 Success Criterion 1.4.3 requires a ratio of at least 4.5:1 for normal text and 3:1 for large text, which means 18.66px bold or 24px and above. The enhanced criterion 1.4.6 raises these to 7:1 and 4.5:1. User interface components and meaningful graphics need at least 3:1 under 1.4.11.',
    },
    {
      question: 'How is the contrast ratio calculated?',
      answer:
        'From relative luminance, not from the hex values directly. Each channel is divided by 255, linearised with the sRGB transfer function, then combined as 0.2126×R + 0.7152×G + 0.0722×B. The ratio is (lighter + 0.05) ÷ (darker + 0.05), which ranges from 1:1 for identical colours to 21:1 for black on white.',
    },
    {
      question: 'Why does green look brighter than blue at the same value?',
      answer:
        'Because human vision is not equally sensitive across the spectrum. The luminance coefficients reflect that: green carries 71.5% of perceived brightness, red 21.3%, and blue only 7.2%. Pure blue on black fails contrast requirements badly, while pure yellow on black passes easily, despite both being fully saturated.',
    },
    {
      question: 'Is CMYK conversion accurate for print?',
      answer:
        'No, and no simple formula can be. The naive conversion shown here ignores the printing process, the ink set, the paper and the colour profile, all of which change the result substantially. It is useful as an approximation only. Real print work uses an ICC profile for the specific press and stock.',
    },
    {
      question: 'What do the newer CSS colour spaces do that hex cannot?',
      answer:
        'Hex and rgb() can only describe colours inside the sRGB gamut. CSS Color Level 4 adds spaces such as oklch(), lab() and display-p3, which reach colours modern wide-gamut screens can show but sRGB cannot express, and which interpolate more evenly — a gradient in OKLCH avoids the muddy midpoint that the same gradient in sRGB produces.',
    },
    {
      question: 'Does the alpha channel affect contrast?',
      answer:
        'Yes, and it is a common source of accidental failures. A semi-transparent colour composites with whatever is behind it, so its effective contrast depends on the background. Check the ratio using the final composited colour rather than the declared one, particularly for text over images or gradients.',
    },
  ],
  sources: [
    {
      title: 'CSS Color Module Level 4',
      publisher: 'World Wide Web Consortium (W3C)',
      url: 'https://www.w3.org/TR/css-color-4/',
    },
    {
      title: 'Web Content Accessibility Guidelines (WCAG) 2.2 — Contrast (Minimum)',
      publisher: 'World Wide Web Consortium (W3C)',
      url: 'https://www.w3.org/TR/WCAG22/#contrast-minimum',
    },
    {
      title: 'Understanding Success Criterion 1.4.3: Contrast (Minimum)',
      publisher: 'W3C Web Accessibility Initiative',
      url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum',
    },
    {
      title: 'A Standard Default Color Space for the Internet — sRGB',
      publisher: 'World Wide Web Consortium (W3C)',
      url: 'https://www.w3.org/Graphics/Color/sRGB',
    },
  ],
  relatedSlugs: ['developer/base64-encoder', 'seo/readability-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
