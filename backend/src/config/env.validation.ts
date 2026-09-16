import { z } from 'zod';

/**
 * Validates process.env at boot. Fails fast with a readable error instead of
 * letting the app start with missing/malformed config.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  MQTT_URL: z.string().min(1, 'MQTT_URL is required'),
  MQTT_READING_TOPIC: z.string().default('smartcity/sensors/+/reading'),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }

  return result.data;
}
