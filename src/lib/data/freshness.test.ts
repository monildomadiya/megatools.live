import { expect, it } from 'vitest';
import { nextUpdate } from './freshness';
it('calculates the next effective period without labeling it published',()=>{expect(nextUpdate('per-diem','FY2027')).toBe('2027-10-01');expect(nextUpdate('va-compensation','2026')).toBe('2026-12-01');expect(nextUpdate('gi-bill','2026-2027')).toBe('2027-08-01');expect(nextUpdate('bah','2026')).toBe('2027-01-01');expect(nextUpdate('retirement','current-rules')).toBeNull();});
