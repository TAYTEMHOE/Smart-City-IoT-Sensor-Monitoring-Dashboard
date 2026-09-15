import { z } from 'zod';

export const queryAlertsSchema = z.object({
  sensorId: z.string().min(1).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  acknowledged: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export type QueryAlertsDto = z.infer<typeof queryAlertsSchema>;
