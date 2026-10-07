import { routes, type RouteSection } from './navigation';
import { getPerDiem, getStates, perDiemParams } from './data/per-diem';
import { getVaRates, getGiRules, getRetirementRules } from './data/benefits';
import { hourlyTimes } from './calc/military-time';
export * from './navigation';
export const sitemapSections = ['core', 'per-diem', 'bah', 'military-pay', 'va', 'tools'] as const;
export type SectionUrl = { path: string; lastModified?: string };
export type SectionUrlProvider = () => SectionUrl[] | Promise<SectionUrl[]>;
function liveUrls(section: RouteSection): SectionUrl[] { return routes.filter(r=>r.section===section&&r.status==='live'&&!r.path.includes('[')).map(r=>({path:r.path})); }
export const sectionUrlProviders: Record<RouteSection, SectionUrlProvider> = {
 core:()=>liveUrls('core'),
 'per-diem':()=>{ const lastModified=getPerDiem().meta.retrievedAt; return [...liveUrls('per-diem'),...getStates('FY2027').map(state=>({path:`/per-diem/${state}`})),...perDiemParams().map(p=>({path:`/per-diem/${p.state}/${p.location}`}))].map(url=>({...url,lastModified})); },
 bah:()=>liveUrls('bah'),
 'military-pay':()=>liveUrls('military-pay'),
 va:()=>[...liveUrls('va'),{path:'/va-disability/rates/2026'}].map(url=>({...url,lastModified:getVaRates().meta.retrievedAt})),
 tools:()=>[...liveUrls('tools').map(url=>({...url,lastModified:url.path.startsWith('/gi-bill')?getGiRules().meta.retrievedAt:url.path.startsWith('/military-retirement')?getRetirementRules().meta.retrievedAt:undefined})),...hourlyTimes.map(hhmm=>({path:`/military-time/${hhmm}`}))],
};
export async function getSectionUrls(section: RouteSection): Promise<SectionUrl[]> {
 const unique=new Map<string,SectionUrl>(); for(const entry of await sectionUrlProviders[section]()){
 if(!entry.path.startsWith('/')||entry.path.startsWith('//')||entry.path.includes('[')||/^\/api(?:\/|$)/.test(entry.path)||/[?#]/.test(entry.path))throw new Error(`Invalid sitemap path: ${entry.path}`);
 if(entry.lastModified&&Number.isNaN(Date.parse(entry.lastModified)))throw new Error(`Invalid sitemap update date: ${entry.path}`);unique.set(entry.path,entry);
 }return [...unique.values()].sort((a,b)=>a.path.localeCompare(b.path));
}
