'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Calculator } from 'lucide-react';
import { navigationRoutes, routeHref } from '@/lib/navigation';
import { Container } from './Container';
/** Responsive navigation with Escape, focus restoration and bounded menu focus. */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const first = menu.current?.querySelector<HTMLAnchorElement>('a');
    first?.focus();
    function closeForDesktop(event: MediaQueryListEvent) { if (event.matches) { setOpen(false); document.querySelector<HTMLAnchorElement>('a[aria-label="MegaTools home"]')?.focus(); } }
    const media = window.matchMedia('(min-width: 1280px)');
    media.addEventListener('change', closeForDesktop);
    return () => media.removeEventListener('change', closeForDesktop);
  }, [open]);
  function close() { setOpen(false); button.current?.focus(); }
  return <header className="site-header"><Container className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4"><Link href="/" className="inline-flex items-center text-xl font-extrabold tracking-tight text-primary" aria-label="MegaTools home"><span className="brand-mark"><Calculator size={21} aria-hidden="true" /></span>Mega<span className="text-accent">Tools</span></Link><nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">{navigationRoutes.map((route) => <Link key={route.path} aria-current={pathname === route.path || pathname.startsWith(route.path + '/') ? 'page' : undefined} className="site-nav-link" href={routeHref(route)}>{route.navTitle}</Link>)}</nav><button ref={button} type="button" className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold xl:hidden" aria-expanded={open} aria-controls="mobile-navigation" onKeyDown={(event) => { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }} onClick={() => open ? close() : setOpen(true)}>{open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}{open ? 'Close menu' : 'Menu'}</button><div ref={menu} id="mobile-navigation" hidden={!open} className="w-full xl:hidden" onKeyDown={(event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
    if (event.key === 'Tab') {
      const links = menu.current?.querySelectorAll<HTMLAnchorElement>('a');
      const first = links?.[0]; const last = links?.[links.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); button.current?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); button.current?.focus(); }
    }
  }}><nav aria-label="Mobile navigation" className="grid gap-1 border-t border-border pt-4 sm:grid-cols-2">{navigationRoutes.map((route) => <Link key={route.path} href={routeHref(route)} onClick={close} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-50">{route.navTitle}<span className="ml-2 text-xs text-muted">{route.status === 'soon' ? 'Coming soon' : ''}</span></Link>)}</nav></div></Container></header>;
}




