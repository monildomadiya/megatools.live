import type { ReactNode } from 'react';
import { Container, PageHeader } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { SourcesBox } from '@/components/data';
import { AdSlot } from '@/components/ads/AdSlot';
import { DisclaimerNote, FAQ, RelatedTools } from '@/components/ui';
import { JsonLd } from '@/components/seo/JsonLd';
import { webApplication } from '@/lib/seo/jsonld';
import { site } from '@/lib/site';
import { UpcomingUpdateBanner } from '@/components/data/UpcomingUpdateBanner';
export type Provenance = { sourceUrls: string[]; effectiveFrom?: string; effectiveTo?:string; retrievedAt: string; dataset?:string; period?:string };
/** Complete tool/data page with rule explanation, provenance and related tools. */
export function ToolPage({title,summary,path,children,how,faq,meta,calculator=true}: {title:string;summary:string;path:string;children:ReactNode;how:ReactNode;faq:{question:string;answer:ReactNode}[];meta:Provenance;calculator?:boolean}) {
  return <Container className="py-8 sm:py-12"><Breadcrumbs items={[{label:'Home',href:'/'},{label:title,href:path}]} />{calculator&&<JsonLd data={webApplication({name:title,path,description:summary,category:'FinanceApplication'})} />}<PageHeader title={title} summary={summary} /><div className="space-y-10">{meta.dataset&&meta.period&&<UpcomingUpdateBanner dataset={meta.dataset} period={meta.period}/>} {children}<AdSlot /><section className="prose-content"><h2>How it works</h2>{how}</section><FAQ items={faq} /><SourcesBox sources={meta.sourceUrls.map((url)=>({url,title:new URL(url).hostname+new URL(url).pathname}))} effectiveFrom={meta.effectiveFrom} effectiveTo={meta.effectiveTo} lastUpdated={meta.retrievedAt} /><p><a className="text-link text-sm" href={`mailto:${site.contactEmail}?subject=${encodeURIComponent('Report an error: '+site.url+path)}`}>Report an error</a></p><RelatedTools links={[{title:'Per diem',href:'/per-diem'},{title:'VA disability',href:'/va-disability/calculator'},{title:'Military time',href:'/military-time'}].filter((link)=>link.href!==path)} /><DisclaimerNote /></div></Container>;
}



