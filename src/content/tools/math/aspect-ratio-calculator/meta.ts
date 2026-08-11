import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'aspect-ratio-calculator',
  category: 'math',
  name: 'Aspect Ratio Calculator',
  h1: 'Aspect Ratio Calculator',
  metaTitle: 'Aspect Ratio Calculator — Resize Without Distortion',
  metaDescription:
    'Find the missing width or height that keeps an image or video in proportion, identify the ratio of any size, and check it against the standard broadcast ratios.',
  shortDescription:
    'Find the width or height that keeps a size in proportion, and identify which standard ratio a set of dimensions matches.',
  leadAnswer:
    'An aspect ratio is width divided by height, written as two whole numbers reduced to their simplest form. A 1920 by 1080 frame is 16:9 because both numbers divide by 120. Keeping that quotient constant while changing the pixel dimensions is what stops an image from stretching.',
  keywords: [
    'aspect ratio calculator',
    'image resize calculator',
    'ratio calculator width height',
    '16:9 calculator',
    'proportional resize',
    'pixel dimensions calculator',
  ],
  faqs: [
    {
      question: 'How do I resize an image without distorting it?',
      answer:
        'Change one dimension and let the other follow from the ratio. If the original is 1920 by 1080 and you need it 800 wide, the height is 800 × 1080 ÷ 1920 = 450. Anything other than 450 stretches or squashes the picture. Enter the original size and the one dimension you know above, and the tool works out the other.',
    },
    {
      question: 'Why is 1920 by 1080 called 16:9?',
      answer:
        'Because both numbers share a factor of 120. Dividing gives 16 and 9, which is the ratio in lowest terms. The same ratio describes 1280 by 720, 3840 by 2160 and 640 by 360 — all of them are 16:9, and all of them scale between each other without distortion. Reducing to lowest terms is exactly the same operation as simplifying a fraction.',
    },
    {
      question: 'What is the difference between 16:9 and 1.78:1?',
      answer:
        'Nothing, except the convention. Broadcast and computing express the ratio as two whole numbers, so 16:9. Cinema expresses it as a decimal against a height of one, so 1.78:1 — because 16 divided by 9 is 1.777. Film ratios you will meet in the same notation are 1.85:1 for standard widescreen and 2.39:1 for anamorphic scope. The tool shows both forms for any size you enter.',
    },
    {
      question: 'Why does my 4:3 photo have black bars on a widescreen display?',
      answer:
        'Because the source and the display disagree about shape, and something has to give. Letterboxing adds bars rather than distorting the image, which is the correct default. The alternatives are worse: stretching makes everyone look wide, and cropping to fill throws away the top and bottom of the frame. Bars are the only option that shows you exactly what was filmed.',
    },
    {
      question: 'Is a 2:1 ratio the same as 2:1 pixel dimensions?',
      answer:
        'Only if the pixels are square, which on any modern display they are. Older broadcast formats used non-square pixels — DV PAL stored 720 by 576 but displayed as 4:3, which only works because each pixel was wider than it was tall. If you are handling legacy video, the stored dimensions and the display aspect ratio are two different numbers and you need both.',
    },
    {
      question: 'What ratio should I use for a social media post?',
      answer:
        'It depends on the platform and it changes, so check the current specification rather than a blog post. The common shapes are 1:1 square, 4:5 portrait, 9:16 for full-screen vertical video, and 16:9 for landscape. What matters more than picking correctly is knowing that a platform will crop anything that does not match, and the crop is usually centred — so keep important content away from the edges.',
    },
    {
      question: 'Why do my numbers not reduce to a nice ratio?',
      answer:
        'Because not every size is a standard one. 1000 by 618 reduces to 500:309, which is correct and unhelpful. When that happens the decimal form is the more useful reading — 1.618:1 in that example, which is the golden ratio. The tool shows both and also tells you the closest standard ratio, so you can see whether an odd size is nearly 16:9 or genuinely something else.',
    },
  ],
  sources: [
    {
      title: 'Recommendation ITU-R BT.709 — Parameter values for HDTV production and international programme exchange',
      publisher: 'International Telecommunication Union (ITU)',
      url: 'https://www.itu.int/rec/R-REC-BT.709',
    },
    {
      title: 'Recommendation ITU-R BT.2020 — Parameter values for ultra-high definition television systems',
      publisher: 'International Telecommunication Union (ITU)',
      url: 'https://www.itu.int/rec/R-REC-BT.2020',
    },
    {
      title: 'Recommendation ITU-R BT.601 — Studio encoding parameters for standard 4:3 and widescreen 16:9 digital television',
      publisher: 'International Telecommunication Union (ITU)',
      url: 'https://www.itu.int/rec/R-REC-BT.601',
    },
  ],
  relatedSlugs: ['math/ratio-calculator', 'math/fraction-calculator'],
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
