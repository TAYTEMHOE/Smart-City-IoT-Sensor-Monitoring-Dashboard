import { Test } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { MqttService } from './mqtt.service';
import { MQTT_CLIENT } from './mqtt.tokens';

describe('MqttService', () => {
  let service: MqttService;
  let client: EventEmitter & {
    subscribe: jest.Mock;
    end: jest.Mock;
  };

  beforeEach(async () => {
    client = Object.assign(new EventEmitter(), {
      subscribe: jest.fn(),
      end: jest.fn(),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [MqttService, { provide: MQTT_CLIENT, useValue: client }],
    }).compile();

    service = moduleRef.get(MqttService);
  });

  it('forwards client "message" events to registered handlers after init', () => {
    service.onModuleInit();

    const handler = jest.fn();
    service.onMessage(handler);

    const payload = Buffer.from('{"sensorId":"temp-01"}');
    client.emit('message', 'smartcity/sensors/temp-01/reading', payload);

    expect(handler).toHaveBeenCalledWith(
      'smartcity/sensors/temp-01/reading',
      payload,
    );
  });

  it('supports multiple handlers registered via onMessage', () => {
    service.onModuleInit();

    const first = jest.fn();
    const second = jest.fn();
    service.onMessage(first);
    service.onMessage(second);

    client.emit('message', 'topic', Buffer.from('{}'));

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('subscribes on the underlying client', () => {
    service.subscribe('smartcity/sensors/+/reading');

    expect(client.subscribe).toHaveBeenCalledWith(
      'smartcity/sensors/+/reading',
      expect.any(Function),
    );
  });

  it('does not throw when a subscribe callback receives an error', () => {
    client.subscribe.mockImplementation((_topic, cb) => cb(new Error('boom')));

    expect(() => service.subscribe('bad/topic')).not.toThrow();
  });

  it('ends the client connection on module destroy', () => {
    service.onModuleDestroy();

    expect(client.end).toHaveBeenCalledWith(true);
  });
});
