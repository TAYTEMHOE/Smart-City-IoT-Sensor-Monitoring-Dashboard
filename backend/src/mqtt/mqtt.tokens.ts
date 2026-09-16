/**
 * DI token for the raw MQTT client, so tests can provide a mock instead of
 * opening a real network connection.
 */
export const MQTT_CLIENT = Symbol('MQTT_CLIENT');
