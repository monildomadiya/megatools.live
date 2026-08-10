import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'unix-timestamp-converter',
  category: 'developer',
  name: 'Unix Timestamp Converter',
  h1: 'Unix Timestamp Converter',
  metaTitle: 'Unix Timestamp Converter — Epoch Time to Date',
  metaDescription:
    'Convert a Unix timestamp to a readable date in UTC and your local zone, or turn a date back into epoch seconds. Detects seconds, milliseconds and microseconds.',
  shortDescription:
    'Convert epoch timestamps to readable dates and back, in seconds, milliseconds or microseconds, UTC or local.',
  leadAnswer:
    'A Unix timestamp is the number of seconds since 00:00:00 UTC on 1 January 1970, the epoch. POSIX defines it as if every day contained exactly 86,400 seconds, so leap seconds are excluded and the value is a calendar offset rather than a true count of elapsed physical seconds.',
  keywords: [
    'unix timestamp converter',
    'epoch converter',
    'epoch time to date',
    'timestamp to date',
    'unix time',
    'milliseconds to date',
  ],
  faqs: [
    {
      question: 'What is a Unix timestamp?',
      answer:
        'It is a count of seconds since 1 January 1970 at 00:00:00 UTC, known as the Unix epoch. Because it is a single integer in a fixed reference frame, it sorts, compares and stores far more reliably than any written date format, which is why almost every system uses it internally and renders a human-readable date only at the edge.',
    },
    {
      question: 'Is my timestamp in seconds or milliseconds?',
      answer:
        'Count the digits. A current timestamp in seconds has 10 digits, in milliseconds 13, in microseconds 16, and in nanoseconds 19. JavaScript’s Date.now() returns milliseconds while most Unix tooling and databases use seconds, and mixing the two produces dates in either 1970 or the year 55,000 — an unmistakable symptom once you have seen it.',
    },
    {
      question: 'Do Unix timestamps account for leap seconds?',
      answer:
        'No. POSIX defines seconds since the epoch as if every day were exactly 86,400 seconds long, so the 27 leap seconds inserted since 1972 are not represented. A Unix timestamp is therefore not a true count of elapsed physical seconds; it is an unambiguous label for a point on the UTC calendar, which is what nearly every application actually needs.',
    },
    {
      question: 'What is the year 2038 problem?',
      answer:
        'A signed 32-bit integer overflows at 03:14:07 UTC on 19 January 2038, wrapping to December 1901. Any system still storing time in a 32-bit signed value will fail then. Modern platforms use 64-bit values, which push the limit past the expected lifetime of the universe, but embedded devices, old file formats and database columns typed too narrowly remain genuinely at risk.',
    },
    {
      question: 'Can a Unix timestamp be negative?',
      answer:
        'Yes. Negative values represent times before 1970 — −86400 is 31 December 1969. Support is inconsistent: many languages and databases handle negative timestamps correctly, while some libraries and APIs reject or silently mangle them. For historical dates, a date type is usually a better choice than an epoch integer.',
    },
    {
      question: 'What is the difference between ISO 8601 and RFC 3339?',
      answer:
        'RFC 3339 is a tightly constrained profile of ISO 8601 for internet protocols. It requires a full date and time, a T or space separator, and an explicit offset such as Z or +01:00. ISO 8601 permits many forms RFC 3339 forbids, including week dates, ordinal dates, and times with no offset at all. Emit RFC 3339 and you are valid under both.',
    },
    {
      question: 'Should I store times as timestamps or as local times?',
      answer:
        'Store past events as an instant — an epoch value or a UTC timestamp — because the instant is the fact and any local rendering can be derived from it. Future scheduled events are different: store the local wall-clock time plus an IANA zone name such as Europe/London, so that a 09:00 meeting stays at 09:00 if that zone changes its rules before the date arrives.',
    },
    {
      question: 'Why does my timestamp show a different date than expected?',
      answer:
        'Almost always a time zone or a unit issue. A timestamp is an instant, so the same value is a different calendar date in Auckland and in Los Angeles — a date near midnight will disagree by a day. Check whether the value is seconds or milliseconds first, then check which zone is being used to render it.',
    },
  ],
  sources: [
    {
      title: 'RFC 3339 — Date and Time on the Internet: Timestamps',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc3339',
    },
    {
      title: 'Base Definitions, section 4.16 — Seconds Since the Epoch',
      publisher: 'The Open Group / IEEE POSIX',
      url: 'https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html',
    },
    {
      title: 'Time Zone Database',
      publisher: 'Internet Assigned Numbers Authority (IANA)',
      url: 'https://www.iana.org/time-zones',
    },
    {
      title: 'Resolution 4 of the 27th CGPM (2022) — on the use of UTC and leap seconds',
      publisher: 'Bureau International des Poids et Mesures (BIPM)',
      url: 'https://www.bipm.org/en/cgpm-2022/resolution-4',
    },
  ],
  relatedSlugs: ['date-time/time-zone-converter', 'date-time/date-difference-calculator'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
