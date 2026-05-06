"use client";

interface AdSlotProps {
  slotName: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdSlot({ slotName, format = 'auto', className = '' }: AdSlotProps) {
  // In development, show a placeholder. In production, this would render the AdSense code.
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className={`my-8 flex justify-center overflow-hidden bg-gray-50 border border-dashed border-gray-300 rounded-lg min-h-[100px] ${className}`}>
      {isDev ? (
        <div className="flex flex-col items-center justify-center p-4 text-gray-400">
          <span className="text-xs font-bold uppercase tracking-wider">AdSpace: {slotName}</span>
          <span className="text-[10px]">Google AdSense Placeholder</span>
        </div>
      ) : (
        /* 
           TODO: Replace this comment with actual Google AdSense script 
           Example:
           <ins className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT}
                data-ad-slot={slotName}
                data-ad-format={format}
                data-full-width-responsive="true"></ins>
        */
        <div className="flex items-center justify-center p-4 text-gray-300 italic text-xs">
          Advertisement
        </div>
      )}
    </div>
  );
}
