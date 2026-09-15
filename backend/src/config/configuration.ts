import { validateEnv } from './env.validation';

/**
 * Typed config object consumed via ConfigService, built from validated env vars.
 */
export default () => {
  const env = validateEnv(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    mongodb: {
      uri: env.MONGODB_URI,
    },
    mqtt: {
      url: env.MQTT_URL,
      readingTopic: env.MQTT_READING_TOPIC,
    },
    cors: {
      origin: env.CORS_ORIGIN,
    },
  };
};

export type AppConfig = ReturnType<typeof import('./configuration').default>;
