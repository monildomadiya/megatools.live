'use client';
import { useSearchParams } from 'next/navigation';
import { PerDiemCalculator, type LocalityIndex } from './PerDiemCalculator';
export function PrefilledPerDiemCalculator({locations}:{locations:LocalityIndex}){const params=useSearchParams();const location=params.get('location');return <PerDiemCalculator key={location??'standard'} locations={locations} initialLocation={locations.some(l=>l.key===location)?location!:'standard'}/>;}
