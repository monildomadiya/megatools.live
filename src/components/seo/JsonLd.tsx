import { serializeJsonLd } from '@/lib/seo/jsonld';
/** Safe server-rendered structured data, without client JavaScript. */
export function JsonLd({ data }: { data: object }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />; }
