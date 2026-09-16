import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AlertsService } from '../alerts/alerts.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ReadingsService } from '../readings/readings.service';
import { IngestionService } from './ingestion.service';

describe('IngestionService', () => {
  let service: IngestionService;
  let mqttService: { subscribe: jest.Mock; onMessage: jest.Mock };
  let readingsService: { create: jest.Mock; markAsAlert: jest.Mock };
  let alertsService: { evaluate: jest.Mock };
  let config: { get: jest.Mock };

  const validPayload = {
    sensorId: 'temp-01',
    sensorType: 'temperature',
    value: 22.5,
    unit: '°C',
    timestamp: '2026-09-16T09:00:00.000Z',
  };

  beforeEach(async () => {
    mqttService = { subscribe: jest.fn(), onMessage: jest.fn() };
    readingsService = { create: jest.fn(), markAsAlert: jest.fn() };
    alertsService = { evaluate: jest.fn() };
    config = {
      get: jest.fn().mockReturnValue('smartcity/sensors/+/reading'),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        IngestionService,
        { provide: MqttService, useValue: mqttService },
        { provide: ReadingsService, useValue: readingsService },
        { provide: AlertsService, useValue: alertsService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = moduleRef.get(IngestionService);
  });

  /** onModuleInit registers the message handler with MqttService; grab it so
   * each test can feed raw (topic, Buffer) pairs the way MqttService would. */
  function getMessageHandler(): (
    topic: string,
    payload: Buffer,
  ) => Promise<void> {
    service.onModuleInit();
    return mqttService.onMessage.mock.calls[0][0];
  }

  it('subscribes to the configured reading topic on init', () => {
    service.onModuleInit();

    expect(config.get).toHaveBeenCalledWith('mqtt.readingTopic');
    expect(mqttService.subscribe).toHaveBeenCalledWith(
      'smartcity/sensors/+/reading',
    );
  });

  it('persists a valid reading and does nothing else when no alert fires', async () => {
    readingsService.create.mockResolvedValue({
      _id: 'reading-1',
      ...validPayload,
    });
    alertsService.evaluate.mockResolvedValue(null);

    const handler = getMessageHandler();
    await handler(
      'smartcity/sensors/temp-01/reading',
      Buffer.from(JSON.stringify(validPayload)),
    );

    expect(readingsService.create).toHaveBeenCalledWith({
      sensorId: 'temp-01',
      sensorType: 'temperature',
      value: 22.5,
      unit: '°C',
      timestamp: new Date(validPayload.timestamp),
    });
    expect(alertsService.evaluate).toHaveBeenCalledWith({
      _id: 'reading-1',
      ...validPayload,
    });
    expect(readingsService.markAsAlert).not.toHaveBeenCalled();
  });

  it('flags the reading as an alert when AlertsService returns one', async () => {
    readingsService.create.mockResolvedValue({
      _id: 'reading-2',
      ...validPayload,
    });
    alertsService.evaluate.mockResolvedValue({ direction: 'above' });

    const handler = getMessageHandler();
    await handler(
      'smartcity/sensors/temp-01/reading',
      Buffer.from(JSON.stringify(validPayload)),
    );

    expect(readingsService.markAsAlert).toHaveBeenCalledWith('reading-2');
  });

  it('drops a message that is not valid JSON without persisting anything', async () => {
    const handler = getMessageHandler();
    await handler(
      'smartcity/sensors/temp-01/reading',
      Buffer.from('{not json'),
    );

    expect(readingsService.create).not.toHaveBeenCalled();
    expect(alertsService.evaluate).not.toHaveBeenCalled();
  });

  it('drops a message that fails schema validation without persisting anything', async () => {
    const handler = getMessageHandler();
    await handler(
      'smartcity/sensors/temp-01/reading',
      Buffer.from(JSON.stringify({ sensorId: 'temp-01' })),
    );

    expect(readingsService.create).not.toHaveBeenCalled();
    expect(alertsService.evaluate).not.toHaveBeenCalled();
  });

  it('does not throw when persistence fails', async () => {
    readingsService.create.mockRejectedValue(new Error('db down'));

    const handler = getMessageHandler();
    await expect(
      handler(
        'smartcity/sensors/temp-01/reading',
        Buffer.from(JSON.stringify(validPayload)),
      ),
    ).resolves.toBeUndefined();

    expect(alertsService.evaluate).not.toHaveBeenCalled();
  });
});
