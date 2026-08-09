import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'data-storage-converter',
  category: 'conversion',
  name: 'Data Storage Converter',
  h1: 'Data Storage Converter',
  metaTitle: 'Data Storage Converter — GB, GiB, MB, TB, Bits',
  metaDescription:
    'Convert between bytes, kB, MB, GB, TB and their binary counterparts KiB, MiB, GiB, TiB — and see why a 1 TB drive shows up as 931 GB in your operating system.',
  shortDescription:
    'Convert data sizes between decimal and binary units, and see exactly why a 1 TB drive reports as 931 GB once your computer has finished with it.',
  leadAnswer:
    'A gigabyte is 1,000,000,000 bytes; a gibibyte is 1,073,741,824. Storage is sold in the decimal units, while Windows reports the binary ones and still writes GB — which is why a 1 TB drive displays as 931 GB. Nothing is missing; only the label is wrong.',
  keywords: [
    'data storage converter',
    'gb to mb',
    'gib vs gb',
    'bytes converter',
    'tb to gb',
    'binary prefix converter',
  ],
  faqs: [
    {
      question: 'Why does my 1 TB hard drive show as 931 GB?',
      answer:
        'Because the two figures use different units with the same name. The manufacturer sells 1 TB meaning one trillion bytes, the decimal definition. Windows displays that capacity divided by 1024 three times — 1,000,000,000,000 ÷ 1024³ = 931.32 — but labels the result "GB" when it is really gibibytes. No storage is missing; the drive holds exactly what the box said. Only the label is wrong, and it is the operating system’s label, not the manufacturer’s.',
    },
    {
      question: 'What is the difference between GB and GiB?',
      answer:
        'A gigabyte (GB) is 1,000,000,000 bytes — 10⁹. A gibibyte (GiB) is 1,073,741,824 bytes — 2³⁰. The gibibyte is about 7.4% larger. IEC 80000-13 defines the binary prefixes kibi, mebi, gibi and tebi precisely so the two can be told apart, and the gap widens at every step: kilo/kibi differ by 2.4%, tera/tebi by 10%, peta/pebi by 12.6%.',
    },
    {
      question: 'Is a megabit the same as a megabyte?',
      answer:
        'No — a byte is eight bits, so a megabyte is eight megabits. This is why a 100 Mbps internet connection downloads at about 12.5 MB/s at best, not 100 MB/s. Network speeds are quoted in bits per second and file sizes in bytes, and the factor of eight between them accounts for most of the confusion about whether a connection is delivering what was sold.',
    },
    {
      question: 'Which units does macOS and Linux use?',
      answer:
        'macOS switched to decimal units in Snow Leopard (10.6, 2009), so a 1 TB drive displays as 1 TB and matches the box. Most Linux desktop environments follow suit, and command-line tools generally offer both — GNU coreutils uses --si for decimal and -h for binary. Windows remains the significant holdout, still dividing by 1024 while labelling the result GB.',
    },
    {
      question: 'Why is RAM measured in binary units but storage in decimal?',
      answer:
        'Because of how each is addressed. Memory is accessed through address lines, and n address lines give exactly 2ⁿ locations, so memory capacity is naturally a power of two — a 16 GB stick really is 16 GiB. Disk storage has no such constraint; sectors are simply counted, so manufacturers count them in the decimal units the SI prefixes were defined for. The mismatch is physical, not marketing.',
    },
    {
      question: 'How much video fits in a gigabyte?',
      answer:
        'It depends entirely on bitrate, not resolution alone. At a bitrate of 8 Mbps, typical for 1080p streaming, one gigabyte holds about 16 minutes. At 25 Mbps for 4K streaming it holds about 5 minutes. Broadcast-quality ProRes 422 at 4K runs near 500 Mbps, which is around 16 seconds per gigabyte. Multiply bitrate in megabits per second by the duration in seconds, then divide by 8,000 for gigabytes.',
    },
    {
      question: 'Were the binary prefixes ever officially adopted?',
      answer:
        'Yes. The IEC published them in 1998, IEEE adopted them in 2002, and they are now standardised in IEC 80000-13:2008 and endorsed by NIST and the BIPM. Adoption in software has been patchy — the terms sound unfamiliar and the industry had thirty years of habit — but they are the standard, and the ambiguity they resolve has been the subject of consumer class actions in the United States.',
    },
  ],
  sources: [
    {
      title: 'Prefixes for binary multiples',
      publisher: 'National Institute of Standards and Technology (NIST)',
      url: 'https://physics.nist.gov/cuu/Units/binary.html',
    },
    {
      title: 'IEC 80000-13:2008 — Quantities and units, Part 13: Information science and technology',
      publisher: 'International Electrotechnical Commission (IEC)',
      url: 'https://www.iso.org/standard/31898.html',
    },
    {
      title: 'The International System of Units (SI Brochure), 9th edition — SI prefixes',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/publications/si-brochure',
    },
  ],
  relatedSlugs: ['developer/base64-encoder'],
  publishedAt: '2026-08-09',
  updatedAt: '2026-08-09',
};

export default meta;
