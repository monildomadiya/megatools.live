import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { TrustPage } from '@/components/layout/TrustPage';
import { UpdatesList } from '@/components/data/UpdatesList';
export function generateMetadata(): Metadata { return buildMetadata({ path: '/updates', title: 'Data updates', description: 'Track official dataset additions, annual rate changes, and corrections on MegaTools.' }); }
export default function Updates() { return <TrustPage path="/updates" title="Data updates" summary="Follow dataset additions and corrections. Updates are listed newest first."><UpdatesList /></TrustPage>; }

