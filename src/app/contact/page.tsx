import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { TrustPage } from '@/components/layout/TrustPage';
import { site } from '@/lib/site';
export function generateMetadata(): Metadata { return buildMetadata({ path: '/contact', title: 'Contact', description: 'Contact MegaTools about corrections, official data sources, or feedback. Do not send personal financial or medical information.' }); }
export default function Contact() { return <TrustPage path="/contact" title="Contact" summary="Send feedback or report a data issue by email."><h2>Email the site team</h2>{site.contactEmail === 'contact@example.com' ? <p>Our public contact address is being set up. The temporary address below is a placeholder and is not monitored.</p> : <p>Email us with your question or feedback.</p>}<p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p><h2>Reporting a correction</h2><p>Include the page URL, the rate period, what looks incorrect, and a link to the official source if you have one.</p><h2>Keep your information private</h2><p>Do not send Social Security numbers, service records, medical records, account numbers, or other sensitive details. We cannot provide individual benefits decisions or act as your finance office.</p></TrustPage>; }

