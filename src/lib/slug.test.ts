import { describe, expect, it } from 'vitest';
import { slugify, stateFromSlug, stateSlug, states } from './slug';
describe('slugs', () => {
  it('strips accents, punctuation and repeated spaces', () => {
    expect(slugify('Denver / Aurora')).toBe('denver-aurora');
    expect(slugify('  San José...   County! ')).toBe('san-jose-county');
    expect(slugify('')).toBe('');
  });
  it('resolves full names and USPS codes', () => {
    expect(stateSlug('District of Columbia')).toBe('district-of-columbia');
    expect(stateSlug(' dc ')).toBe('district-of-columbia');
    expect(stateSlug('New Mexico')).toBe('new-mexico');
    expect(stateFromSlug('puerto-rico')).toEqual({ code: 'PR', name: 'Puerto Rico' });
    expect(stateFromSlug('missing')).toBeUndefined();
    expect(() => stateSlug('missing')).toThrow('Unknown state');
  });
  it('round-trips every state and territory without collisions', () => {
    const slugs = Object.keys(states).map(stateSlug);
    expect(new Set(slugs).size).toBe(Object.keys(states).length);
    for (const [code, name] of Object.entries(states)) expect(stateFromSlug(stateSlug(code))).toEqual({ code, name });
    expect(Object.keys(states)).toHaveLength(57);
  });
});
