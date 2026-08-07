import { adsEnabled, adsenseClientId } from '@/lib/site';

type SlotFormat = 'leaderboard' | 'in-article' | 'rectangle';

// Reserved heights matched to the format so turning ads on does not introduce
// layout shift. CLS is scored on the field data Google already has for the
// domain, so an ad that pushes content down costs ranking as well as UX.
const RESERVED_HEIGHT: Record<SlotFormat, string> = {
  leaderboard: 'min-h-[90px]',
  'in-article': 'min-h-[250px]',
  rectangle: 'min-h-[250px]',
};

interface AdSlotProps {
  slotId: string;
  format?: SlotFormat;
  className?: string;
}

/**
 * Renders nothing at all until AdSense approval lands and NEXT_PUBLIC_ADS_ENABLED
 * is set. Empty ad containers on a site under review read as a site built for
 * ads rather than for readers, so the pre-approval build ships with no ad markup
 * whatsoever — not a hidden div, not a placeholder box.
 */
export function AdSlot({ slotId, format = 'in-article', className = '' }: AdSlotProps) {
  if (!adsEnabled || !adsenseClientId) return null;

  return (
    <div className={`my-8 ${RESERVED_HEIGHT[format]} ${className}`}>
      <span className="mb-1 block text-center text-[11px] uppercase tracking-wide text-ink-400">
        Advertisement
      </span>
      <ins
        className="adsbygoogle block"
        data-ad-client={adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
