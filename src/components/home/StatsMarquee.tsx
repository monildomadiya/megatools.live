/**
 * The figures strip, sliding.
 *
 * Every number here is a fact about the build rather than a marketing claim —
 * no user counts, no ratings, nothing the site cannot evidence. That is the
 * whole reason it can run as a marquee without reading as puffery: a reader who
 * stops on any one of them can go and check it.
 *
 * The list is rendered three times and the track translates by exactly a third
 * of its width, which lands the loop on an identical frame. Three rather than
 * two because the seam is only invisible while the track still covers the
 * viewport at the end of the cycle, and two copies of a ~1600px row run out on
 * a wide desktop. Copies after the first are hidden from assistive technology
 * so the figures are announced once.
 */

interface Stat {
  value: string;
  label: string;
}

export function StatsMarquee({ stats }: { stats: Stat[] }) {
  const row = (key: string, hidden: boolean) => (
    <ul key={key} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {stats.map((stat) => (
        <li key={stat.label} className="flex shrink-0 items-center gap-3 px-6 py-5 sm:px-8">
          <span className="numeric text-2xl font-bold leading-none text-ink-900 sm:text-3xl">
            {stat.value}
          </span>
          {/* Never wraps. A width cap turned the longer labels into two lines,
              which made every item a different height and the strip read as
              ragged rather than as one continuous rule of figures. */}
          <span className="whitespace-nowrap text-sm text-ink-500">{stat.label}</span>
          <span aria-hidden className="ml-3 h-1.5 w-1.5 rounded-full bg-brand-300" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee border-y border-line bg-panel">
      <div className="marquee-track">
        {row('a', false)}
        {row('b', true)}
        {row('c', true)}
      </div>
    </div>
  );
}
