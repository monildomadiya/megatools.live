import { describe, expect, it } from 'vitest';
import { breadcrumbList, organization, serializeJsonLd, webApplication, website } from './jsonld';
describe('structured data', () => {
  it('prevents script termination while preserving the parsed data', () => {
    const data = { name: '</script><script>alert("x")</script>', nested: { value: '<!--' } };
    const result = serializeJsonLd(data);
    expect(result).not.toContain('<');
    expect(result).toContain('\\u003c/script>');
    expect(JSON.parse(result)).toEqual(data);
  });
  it('uses canonical breadcrumb URLs and sequential positions', () => {
    const data = breadcrumbList([{ label: 'Home', href: '/' }, { label: 'About', href: '/about/?ref=1' }]);
    expect(data.itemListElement).toEqual([{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://megatools.live' }, { '@type': 'ListItem', position: 2, name: 'About', item: 'https://megatools.live/about' }]);
  });
  it('describes a free browser calculator without unsupported claims', () => {
    expect(webApplication({ name: 'Calculator', path: '/test', description: 'An estimate.', category: 'FinanceApplication' })).toMatchObject({ '@type': 'WebApplication', operatingSystem: 'Any', offers: { price: '0', priceCurrency: 'USD' } });
    expect(website().publisher['@id']).toBe(organization()['@id']);
    expect(serializeJsonLd([website(), organization()])).not.toMatch(/FAQPage|AggregateRating|Review/);
  });
});
