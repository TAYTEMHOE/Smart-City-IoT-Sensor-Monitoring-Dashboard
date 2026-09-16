import { z } from 'zod';

/**
 * Validates GET /readings query params. Coerces string query values
 * (everything on the wire is a string) into the right types.
 */
export const queryReadingsSchema = z.object({
  sensorId: z.string().min(1).optional(),
  sensorType: z.enum(['temperature', 'humidity', 'air_quality']).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  onlyAlerts: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  limit: z.coerce.number().int().positive().max(500).default(100),
  page: z.coerce.number().int().positive().default(1),
});

export type QueryReadingsDto = z.infer<typeof queryReadingsSchema>;
