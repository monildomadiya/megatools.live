import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TrustPage } from '@/components/layout/TrustPage';
import { site } from '@/lib/site';
export function generateMetadata(): Metadata { return buildMetadata({ path: '/disclaimer', title: 'Disclaimer', description: 'MegaTools is independent of government agencies. Calculator estimates do not determine pay or benefit entitlement.' }); }
export default function Disclaimer() { return <TrustPage path="/disclaimer" title="Disclaimer" summary={site.disclaimer}><h2>Estimates and official decisions</h2><p>Calculator results are for general information and planning. Actual pay, reimbursements, taxes, and benefits depend on your circumstances and the rules that apply to you. A calculator cannot establish eligibility or authorize payment.</p><h2>Confirm before acting</h2><p>Verify results with your finance office, benefits administrator, or the <Link href="/sources">official source</Link>. Check effective dates and source notes carefully, especially when rules or rates have recently changed.</p><h2>Corrections</h2><p>If you spot an error, <Link href="/contact">tell us</Link> which page and period are affected. We review corrections against official sources.</p></TrustPage>; }

