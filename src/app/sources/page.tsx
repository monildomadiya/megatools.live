import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { TrustPage } from '@/components/layout/TrustPage';
import { DataTable } from '@/components/tables/DataTable';
import { datasets } from '@/lib/data/registry';
import { getPerDiem } from '@/lib/data/per-diem';
import { getVaRates, getGiRules, getRetirementRules } from '@/lib/data/benefits';
import { formatDate } from '@/lib/format';
export function generateMetadata(): Metadata { return buildMetadata({ path: '/sources', title: 'Official sources', description: 'Official GSA, DoD, DFAS, VA, eCFR, IRS, and Social Security sources used for MegaTools rate lookups and calculators.' }); }
export default function Sources() { const published=[getPerDiem('FY2026').meta,getPerDiem().meta,getVaRates().meta,getGiRules().meta,getRetirementRules().meta];return <TrustPage path="/sources" title="Official sources" summary="Our rate tables and calculation rules come from official government sources. This directory lists the official publishers for each tool."><p>Published data includes GSA FY2026–FY2027 per diem, VA 2026 compensation, and GI Bill 2026–2027 rates. Each data page identifies sources and dates. BAH, basic pay, BAS, and PCS source downloads are blocked in this environment; those tools accept amounts you verify with the official publisher.</p><DataTable caption="Published datasets and provenance" rows={published} rowKey={row=>row.dataset+row.period} columns={[{key:'dataset',label:'Dataset / period',render:row=>row.dataset+' · '+row.period},{key:'effective',label:'Effective from',render:row=>formatDate(row.effectiveFrom)},{key:'retrieved',label:'Last updated',render:row=>formatDate(row.retrievedAt)},{key:'source',label:'Official sources',render:row=><ul>{row.sourceUrls.map(url=><li key={url}><a className="break-all" href={url}>{new URL(url).hostname}</a></li>)}</ul>}]}/><DataTable caption="Dataset source directory" rows={datasets} rowKey={(row) => row.id} columns={[{ key: 'dataset', label: 'Dataset', render: (row) => row.name }, { key: 'publisher', label: 'Official publisher', render: (row) => <a href={row.sourceUrl}>{row.publisher}</a> }, { key: 'schedule', label: 'Update schedule', render: (row) => row.updateSchedule }]} /></TrustPage>; }



