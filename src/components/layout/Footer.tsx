import Link from 'next/link';
import { navigationRoutes, routeHref, trustRoutes } from '@/lib/routes';
import { site } from '@/lib/site';
import { Container } from './Container';
/** Shared tool links, trust links and required independence statement. */
export function Footer() {
  return <footer className="mt-16 border-t border-border bg-white py-12"><Container><div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]"><div><Link href="/" className="text-xl font-extrabold text-primary">MegaTools</Link><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">Free tools for military members, veterans, families, and federal employees.</p></div><nav aria-label="Footer tools"><h2 className="mb-3 text-sm font-semibold text-primary">Explore the tools</h2><ul className="grid grid-cols-2 gap-3 text-sm">{navigationRoutes.map((route) => <li key={route.path}><Link href={routeHref(route)} className="text-muted hover:underline">{route.navTitle}</Link></li>)}</ul></nav><nav aria-label="About MegaTools"><h2 className="mb-3 text-sm font-semibold text-primary">About MegaTools</h2><ul className="grid grid-cols-2 gap-3 text-sm">{trustRoutes.map((route) => <li key={route.path}><Link href={route.path} className="text-muted hover:underline">{route.title}</Link></li>)}</ul></nav></div><div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed text-muted"><p>{site.disclaimer}</p><p className="mt-3">© {new Date().getUTCFullYear()} MegaTools. All rights reserved.</p></div></Container></footer>;
}
