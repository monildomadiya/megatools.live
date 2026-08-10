import type { ToolMeta } from '@/lib/tools/types';

const meta: ToolMeta = {
  slug: 'cron-expression-translator',
  category: 'developer',
  name: 'Cron Expression Translator',
  h1: 'Cron Expression Translator',
  metaTitle: 'Cron Expression Translator — Explain and Preview Runs',
  metaDescription:
    'Translate a cron expression into plain English and preview its next run times, including the day-of-month and day-of-week rule that catches almost everyone.',
  shortDescription:
    'Turn a cron expression into plain English and see its next run times, with the day-of-month and day-of-week OR rule made visible rather than assumed.',
  leadAnswer:
    'A cron expression is five fields — minute, hour, day of month, month, day of week — that together define when a scheduled job runs. Each field takes a value, a range, a list or a step. The rule that surprises people is that day of month and day of week are combined with OR, not AND, when both are set.',
  keywords: [
    'cron expression translator',
    'cron expression explained',
    'crontab generator',
    'cron schedule parser',
    'cron next run time',
    'what does this cron do',
    'crontab syntax',
  ],
  faqs: [
    {
      question: 'Why does my job run more often than I expect?',
      answer:
        'Almost always the day-of-month and day-of-week rule. When both fields are restricted — neither is an asterisk — standard cron treats them as OR rather than AND. So `0 0 1 * MON` does not mean "the first of the month, if it is a Monday"; it means "the first of the month, and also every Monday". The behaviour is specified rather than a bug, and it is inherited from Vixie cron into nearly every implementation. If you need the AND version, restrict one field in cron and test the other inside the job itself.',
    },
    {
      question: 'What time zone does cron use?',
      answer:
        'The system time zone of the machine running it, unless the crontab sets `CRON_TZ` or the platform provides its own override. This matters more than it sounds: a server on UTC and a laptop on local time will run the same expression at different wall-clock moments. Managed schedulers frequently default to UTC regardless of where you are. This page previews runs in your browser’s local time zone and labels them, so compare that against wherever the job actually executes.',
    },
    {
      question: 'What happens to a job scheduled during a daylight saving change?',
      answer:
        'It depends on the implementation, and the behaviour is genuinely inconsistent. When clocks go forward, an hour disappears — a job set for 02:30 has no 02:30 to run at that day. Some implementations skip it, some run it immediately after the jump. When clocks go back the hour repeats, and a job may run twice. The reliable fix is to run schedules in UTC, or to avoid scheduling anything in the small hours where transitions happen.',
    },
    {
      question: 'What is the difference between */15 and 0,15,30,45?',
      answer:
        'For the minute field, nothing — both fire at 0, 15, 30 and 45 past the hour. The step form is shorthand for stepping through the whole allowed range from its start. They diverge when the step does not divide the range evenly: `*/7` in the minute field gives 0, 7, 14, 21, 28, 35, 42, 49 and 56, then restarts at 0 in the next hour, so the gap between 56 and 0 is four minutes rather than seven. Steps are regular within an hour, not across one.',
    },
    {
      question: 'Are the shorthand strings like @daily portable?',
      answer:
        'Mostly, but not universally. `@yearly`, `@annually`, `@monthly`, `@weekly`, `@daily`, `@midnight` and `@hourly` are widely supported and map to fixed expressions — `@daily` is `0 0 * * *`. `@reboot` is different in kind: it runs at start-up rather than on a schedule, and it is not supported everywhere, notably in many container and managed environments. This translator handles the five-field form; expand a shorthand before pasting it.',
    },
    {
      question: 'Why does my expression have six fields?',
      answer:
        'Because some schedulers add a seconds field at the front, including Quartz, Spring’s scheduler and several cloud products. Others add an optional year at the end. Those dialects also introduce characters that standard cron does not have, such as `?`, `L` for last, and `#` for the nth weekday of a month. A six-field expression pasted into a five-field parser is silently misread — the minute field is filled with what was meant as seconds — so check which dialect your scheduler expects.',
    },
    {
      question: 'Does cron catch up on runs it missed?',
      answer:
        'Standard cron does not. If the machine is off or asleep when a job was due, that run simply does not happen, and nothing is queued. `anacron` exists specifically to cover this case on machines that are not always on, and most managed schedulers offer their own catch-up or retry policy. If a missed run matters, the schedule is not the place to solve it — the job needs to be idempotent and to work out for itself what it still owes.',
    },
  ],
  sources: [
    {
      title: 'crontab — POSIX.1-2017 utility specification',
      publisher: 'The Open Group Base Specifications',
      url: 'https://pubs.opengroup.org/onlinepubs/9699919799/utilities/crontab.html',
    },
    {
      title: 'crontab(5) — Linux manual page for the crontab file format',
      publisher: 'man7.org Linux man-pages project',
      url: 'https://man7.org/linux/man-pages/man5/crontab.5.html',
    },
    {
      title: 'systemd.timer(5) — timer unit configuration',
      publisher: 'man7.org Linux man-pages project',
      url: 'https://man7.org/linux/man-pages/man5/systemd.timer.5.html',
    },
  ],
  relatedSlugs: ['developer/unix-timestamp-converter', 'date-time/time-zone-converter'],
  publishedAt: '2026-08-10',
  updatedAt: '2026-08-10',
};

export default meta;
