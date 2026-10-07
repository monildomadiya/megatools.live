import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MapPin, House, Wallet, HeartPulse, Truck, GraduationCap, ChartNoAxesCombined, Clock3, BookOpen, LockKeyhole, CircleCheck, Calculator } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { website, organization, breadcrumbList } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/layout/Container';
import { UpdatesList } from '@/components/data/UpdatesList';
import { navigationRoutes } from '@/lib/navigation';

const toolDetails = [
  { icon: MapPin, label: 'Official GSA rates', category: 'Travel' },
  { icon: House, label: 'Use your verified allowance', category: 'Housing' },
  { icon: Wallet, label: 'Use your verified pay', category: 'Pay' },
  { icon: HeartPulse, label: 'Ratings & official VA rates', category: 'Benefits' },
  { icon: Truck, label: 'Use your authorized amounts', category: 'Moving' },
  { icon: GraduationCap, label: 'Education benefit estimate', category: 'Education' },
  { icon: ChartNoAxesCombined, label: 'High-3 & BRS projections', category: 'Retirement' },
  { icon: Clock3, label: '12-hour, 24-hour & Zulu', category: 'Everyday' },
];
export function generateMetadata(): Metadata {
  return buildMetadata({ path: '/', title: 'Military & Federal Pay Calculators', description: 'Free military and federal pay tools. Explore per diem, BAH, military pay, VA disability, PCS, GI Bill, retirement, and military time.' });
}
export default function Home() {
  return <>
    <JsonLd data={website()} /><JsonLd data={organization()} /><JsonLd data={breadcrumbList([{ label: 'Home', href: '/' }])} />
    <section className="home-hero"><Container><div className="hero-layout">
      <div><p className="eyebrow"><span className="status-dot" /> BUILT FOR LIFE IN SERVICE</p><h1 className="hero-title">Your next decision.<br /><span>A little clearer.</span></h1><p className="hero-description">Military &amp; federal pay calculators, official rate lookups, and practical planning tools. Make sense of your benefits, one number at a time.</p><div className="flex flex-wrap gap-3"><a className="button-primary" href="#tools">Explore the tools <ArrowRight size={18} aria-hidden="true" /></a><Link className="button-secondary" href="/sources"><BookOpen size={17} aria-hidden="true" /> Our data sources</Link></div><p className="mt-6 flex items-center gap-2 text-sm text-muted"><CircleCheck size={16} className="text-accent" aria-hidden="true" /> Free to use. No account needed.</p></div>
      <aside className="hero-feature" aria-label="Start with a travel tool"><div className="flex items-center justify-between"><span className="feature-label">PLAN YOUR NEXT TRIP</span><MapPin size={23} aria-hidden="true" /></div><h2>Know your destination.<br />Find your per diem.</h2><p>Look up published lodging and meal rates by city or ZIP, then build your trip estimate.</p><div className="feature-steps"><span><span>01</span> Find your location</span><span><span>02</span> Review official GSA rates</span><span><span>03</span> Calculate your travel days</span></div><Link className="feature-link" href="/per-diem">Find per diem rates <ArrowUpRight size={20} aria-hidden="true" /></Link><Link className="mt-4 inline-flex text-sm text-teal-100 underline underline-offset-4" href="/per-diem/calculator">Already have a destination? Calculate a trip</Link></aside>
    </div></Container></section>
    <div className="trust-strip"><Container className="grid gap-5 py-6 sm:grid-cols-3">{[
      { icon: BookOpen, title: 'Know where numbers come from', text: 'Source links and dates on rate pages.' },
      { icon: Calculator, title: 'Useful tools. Clear assumptions.', text: 'Planning estimates are labeled.' },
      { icon: LockKeyhole, title: 'Your inputs stay yours', text: 'No accounts or saved calculator inputs.' },
    ].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3"><Icon size={20} className="mt-1 shrink-0 text-accent" aria-hidden="true" /><div><p className="text-sm font-semibold text-primary">{title}</p><p className="mt-1 text-xs leading-5 text-muted">{text}</p></div></div>)}</Container></div>
    <Container className="py-14 sm:py-20"><section id="tools" className="scroll-mt-8" aria-labelledby="tools-heading"><div className="section-heading"><div><p className="eyebrow">THE TOOLKIT</p><h2 id="tools-heading" className="section-title">What are you planning for?</h2></div><p className="max-w-sm text-sm leading-6 text-muted">From a travel day to your next chapter.<br className="hidden sm:block" /> Choose a tool and get started.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{navigationRoutes.map((route, index) => {
      const { icon: Icon, label, category } = toolDetails[index] ?? { icon: Calculator, label: 'Explore the tool', category: 'Planning' };
      return <Link key={route.path} href={route.path} className="tool-card group"><div className="flex items-start justify-between gap-3"><span className="tool-icon"><Icon size={23} strokeWidth={1.7} aria-hidden="true" /></span><span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{category}</span></div><h3 className="mt-6 text-lg font-bold tracking-tight text-primary">{route.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-muted">{route.description}</p><div className="mt-6 flex items-center justify-between gap-2 border-t border-border pt-4"><span className="text-xs font-medium text-muted">{label}</span><ArrowUpRight size={18} className="shrink-0 text-accent" aria-hidden="true" /></div></Link>;
    })}</div></section>
    <section className="updates-layout" aria-labelledby="updates-heading"><div><p className="eyebrow">KEEPING YOU INFORMED</p><h2 id="updates-heading" className="section-title">The latest numbers.<br />The context behind them.</h2><p className="text-sm leading-7 text-muted">Published rates change. See what was updated, which period it covers, and where the information came from.</p><Link href="/updates" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">View all data updates <ArrowRight size={16} aria-hidden="true" /></Link></div><div className="updates-panel"><UpdatesList limit={3} /></div></section>
    <section className="home-about"><div><p className="eyebrow">INDEPENDENT BY DESIGN</p><h2 className="text-2xl font-bold tracking-tight text-primary">Built to help you understand your options.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted">MegaTools brings published rates and practical calculators together. Estimates help you plan; your agency or benefits provider confirms your entitlement.</p></div><Link href="/about" className="button-secondary shrink-0">About MegaTools <ArrowUpRight size={17} aria-hidden="true" /></Link></section></Container>
  </>;
}

