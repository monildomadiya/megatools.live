import 'server-only';
import rawChangelog from '../../../data/manual/changelog.json';
import { z } from 'zod';
const entrySchema = z.object({ date: z.iso.date(), title: z.string().min(1), description: z.string().optional(), url: z.string().startsWith('/').optional() });
export type ChangelogEntry = z.infer<typeof entrySchema>;
/** Validates update entries and returns a copy ordered newest first. */
export function getChangelog(): ChangelogEntry[] {
  return z.array(entrySchema).parse(rawChangelog).sort((a, b) => b.date.localeCompare(a.date));
}

