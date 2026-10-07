'use client';
import { useEffect, useRef } from 'react';
declare global { interface Window { adsbygoogle?: object[] } }
/** Manual slots stay off until approval, client ID and a slot ID are configured. */
export function AdSlot({ minHeight=280 }: { minHeight?:number }){
 const ref=useRef<HTMLElement>(null);const pushed=useRef(false);const client=process.env.NEXT_PUBLIC_ADSENSE_CLIENT;const slot=process.env.NEXT_PUBLIC_ADSENSE_SLOT;const enabled=process.env.NEXT_PUBLIC_ADS_ENABLED==='true'&&/^ca-pub-\d{16}$/.test(client??'')&&/^\d+$/.test(slot??'');
 useEffect(()=>{if(!enabled||!ref.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!pushed.current){pushed.current=true;(window.adsbygoogle??=[]).push({});observer.disconnect();}},{rootMargin:'200px'});observer.observe(ref.current);return()=>observer.disconnect();},[enabled]);
 if(!enabled)return null;
 return <aside ref={ref} aria-label="Advertisement" className="mt-40 mb-12 rounded-xl border border-border bg-slate-50 text-center" style={{minHeight:Math.max(280,minHeight)}}><p className="p-3 text-xs text-muted">Advertisement</p><ins className="adsbygoogle block" data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/></aside>;
}

