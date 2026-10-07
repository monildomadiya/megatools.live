import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
export const alt = 'MegaTools — Military & federal pay calculators';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', background: '#f8fafc', padding: '88px', color: '#142d4e' }}><div style={{ display: 'flex', fontSize: 88, fontWeight: 700, letterSpacing: '-4px' }}>Mega<span style={{ color: '#b45309' }}>Tools</span></div><div style={{ display: 'flex', marginTop: 32, fontSize: 38 }}>{site.tagline}</div><div style={{ display: 'flex', marginTop: 56, fontSize: 24, color: '#475569' }}>Official sources · Clear answers · Free tools</div></div>, size);
}
