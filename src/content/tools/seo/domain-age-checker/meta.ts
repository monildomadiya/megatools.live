import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'domain-age-checker',
  category: 'seo',
  name: 'Domain Age Checker',
  h1: 'Domain Age Checker',
  metaTitle: 'Domain Age Checker — Registration Date via RDAP',
  metaDescription:
    'Check when a domain was first registered, how old it is, and when it expires — read live from the official registry over RDAP, with the raw dates shown.',
  shortDescription:
    'Look up a domain first registration date and age from the official registry, with the expiry date and registrar shown alongside.',
  leadAnswer:
    'Domain age is the time since a name was first registered, taken from the creation date the registry recorded. That date lives with the registry that issued the domain, not in the page or the site itself, so reading it means querying the registry directly rather than inferring anything from the website.',
  keywords: [
    'domain age checker',
    'domain age',
    'when was a domain registered',
    'domain registration date',
    'whois domain age',
    'domain expiry date checker',
  ],
  faqs: [
    {
      question: 'Does the domain I type get sent anywhere?',
      answer:
        'Yes, and this is the one tool on the site where that happens. Reading a registration date means asking the registry that holds it, so pressing the lookup button sends the domain name from your browser to rdap.org, which forwards it to the registry for that top-level domain. It does not pass through us and we do not log it, but it does leave your device. Nothing is sent while you type — only when you press the button.',
    },
    {
      question: 'Does domain age help a site rank in Google?',
      answer:
        'Not on its own. Google has said repeatedly that the age of a domain is not a ranking factor, and it does not appear in any published description of the ranking systems. What genuinely correlates with age is everything that accumulates alongside it: links built over years, content that has been refined, and a track record of being crawled. An eight-year-old domain that has never been used carries none of that, which is why expired-domain purchases so often disappoint.',
    },
    {
      question: 'Why does it say no data for my .de or .in domain?',
      answer:
        'Because RDAP coverage is not universal. ICANN requires it of registries for generic top-level domains such as .com, .net, .org and the newer ones, but country-code registries set their own policy. Several — Germany, India, the United Kingdom among them — either do not run a public RDAP service or do not publish a creation date through it. That is a registry decision, not a failure of the lookup, and no tool can read a date the registry does not publish.',
    },
    {
      question: 'What is RDAP, and why not WHOIS?',
      answer:
        'RDAP is the Registration Data Access Protocol, the designed replacement for WHOIS. WHOIS returns unstructured text in whatever layout each registry chose, so every consumer has to guess at parsing it; RDAP returns structured JSON with defined field names, supports internationalised text properly, and runs over HTTPS. ICANN required gTLD registries and registrars to offer RDAP from 2019 and has since set out the retirement of WHOIS.',
    },
    {
      question: 'Why is the registrant name hidden?',
      answer:
        'Registration data was widely redacted after the GDPR came into force in 2018. Registries and registrars now withhold personal contact details from public responses, and many replace them with a privacy service. Dates were never personal data in the same sense, so creation, expiry and last-changed dates are generally still published — which is why this tool reports those and does not attempt to report a registrant.',
    },
    {
      question: 'Is the age shown the age of the website or of the domain?',
      answer:
        'The domain. They are frequently very different. A domain can sit registered and unused for a decade before anything is published on it, and a site can move to a newly registered domain while keeping content that is far older. If you want to know how long a site has actually been publishing, look at the Internet Archive rather than the registration date.',
    },
    {
      question: 'Why does the creation date differ from what another tool shows?',
      answer:
        'Usually one of three reasons. Some tools show the registrar record rather than the registry record, and the two can disagree by a day. Dates are published in UTC, so a lookup rendered in a local timezone can shift by one day either way. And if a domain lapsed and was re-registered, the registry records the new creation date, not the original one — the earlier registration is simply gone from the current record.',
    },
  ],
  sources: [
    {
      title: 'RFC 9083 — JSON Responses for the Registration Data Access Protocol (RDAP)',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc9083.html',
    },
    {
      title: 'RFC 7480 — HTTP Usage in the Registration Data Access Protocol (RDAP)',
      publisher: 'Internet Engineering Task Force (IETF)',
      url: 'https://www.rfc-editor.org/rfc/rfc7480.html',
    },
    {
      title: 'Registration Data Access Protocol (RDAP) — what it replaces and who must offer it',
      publisher: 'ICANN',
      url: 'https://www.icann.org/rdap',
    },
    {
      title: 'A guide to Google Search ranking systems',
      publisher: 'Google Search Central',
      url: 'https://developers.google.com/search/docs/appearance/ranking-systems-guide',
    },
  ],
  relatedSlugs: ['date-time/date-difference-calculator', 'date-time/age-calculator'],
  privacyNote: 'Queries the public domain registry — the domain you enter leaves your browser',
  publishedAt: '2026-08-11',
  updatedAt: '2026-08-11',
};

export default meta;
