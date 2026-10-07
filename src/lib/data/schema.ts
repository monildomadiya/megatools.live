import { z } from 'zod';
export const metaSchema = z.object({ dataset: z.string(), period: z.string(), effectiveFrom: z.iso.date(), effectiveTo: z.iso.date().optional(), sourceUrls: z.array(z.url()).min(1), retrievedAt: z.iso.datetime({ offset: true }) });
export const locationSchema = z.object({ id: z.string(), state: z.string(), stateSlug: z.string(), name: z.string(), slug: z.string(), counties: z.array(z.string()), seasons: z.array(z.object({ start: z.iso.date(), end: z.iso.date(), lodging: z.number().positive() })).min(1), mie: z.number().positive(), monthlyLodging:z.array(z.number().positive()).length(12).optional() });
export const perDiemSchema = z.object({ meta: metaSchema, standard: z.object({ lodging: z.number().positive(), mie: z.number().positive() }), locations: z.array(locationSchema).min(1) });
export type PerDiemData = z.infer<typeof perDiemSchema>;
export type PerDiemLocation = z.infer<typeof locationSchema>;
export type MieBreakdown = { mie: number; breakfast: number; lunch: number; dinner: number; incidentals: number; firstLast: number };

