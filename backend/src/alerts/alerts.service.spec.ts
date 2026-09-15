import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Alert } from '../database/schemas/alert.schema';
import { ReadingDocument } from '../database/schemas/reading.schema';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
  let service: AlertsService;
  const alertModel = { create: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AlertsService,
        { provide: getModelToken(Alert.name), useValue: alertModel },
      ],
    }).compile();

    service = moduleRef.get(AlertsService);
  });

  function reading(overrides: Partial<ReadingDocument> = {}): ReadingDocument {
    return {
      sensorId: 'temp-01',
      sensorType: 'temperature',
      value: 20,
      timestamp: new Date('2026-01-01T00:00:00.000Z'),
      _id: 'reading-id',
      ...overrides,
    } as ReadingDocument;
  }

  it('does not create an alert for a value within bounds', async () => {
    const result = await service.evaluate(reading({ value: 20 }));

    expect(result).toBeNull();
    expect(alertModel.create).not.toHaveBeenCalled();
  });

  it('creates an "above" alert when value exceeds the max threshold', async () => {
    alertModel.create.mockResolvedValue({ direction: 'above' });

    await service.evaluate(reading({ value: 45 }));

    expect(alertModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'above', threshold: 40, value: 45 }),
    );
  });

  it('creates a "below" alert when value is under the min threshold', async () => {
    alertModel.create.mockResolvedValue({ direction: 'below' });

    await service.evaluate(reading({ value: -20 }));

    expect(alertModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: 'below',
        threshold: -10,
        value: -20,
      }),
    );
  });

  it('only evaluates the max bound for sensor types with no min (air_quality)', async () => {
    const result = await service.evaluate(
      reading({ sensorType: 'air_quality', value: 5 }),
    );

    expect(result).toBeNull();
    expect(alertModel.create).not.toHaveBeenCalled();
  });
});
