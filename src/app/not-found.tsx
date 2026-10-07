import Link from 'next/link';
import { Container, PageHeader } from '@/components/layout/Container';
import { navigationRoutes, routeHref } from '@/lib/routes';
/** Recovery page links to all tool hubs, including prelaunch directory cards. */
export default function NotFound() { return <Container className="py-14"><PageHeader eyebrow="404 · Page not found" title="Let’s find the right page" summary="This address is unavailable. Choose a tool below or return to the MegaTools directory." /><Link href="/" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 py-3 font-semibold text-white">Back to home</Link><h2 className="section-title mt-10">Explore the tools</h2><ul className="grid gap-4 sm:grid-cols-2">{navigationRoutes.map((route) => <li key={route.path}><Link href={routeHref(route)} className="text-link">{route.navTitle}</Link>{route.status === 'soon' && <span className="ml-2 text-sm text-muted">Coming soon</span>}</li>)}</ul></Container>; }
