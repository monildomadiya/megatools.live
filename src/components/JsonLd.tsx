/**
 * Renders a JSON-LD graph. Kept as a server component so the structured data is
 * present in the initial HTML — crawlers that do not execute JavaScript still
 * see it.
 */
export function JsonLd({ json }: { json: string }) {
  return (
    <script
      type="application/ld+json"
      // The payload comes from JSON.stringify over our own typed objects, so it
      // is already escaped JSON with no author-controlled markup.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
