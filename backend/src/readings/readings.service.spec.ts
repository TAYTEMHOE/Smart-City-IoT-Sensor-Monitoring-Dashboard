import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Reading } from '../database/schemas/reading.schema';
import { QueryReadingsDto } from './dto/query-readings.schema';
import { CreateReadingInput } from './interfaces/reading.interface';
import { ReadingsService } from './readings.service';

describe('ReadingsService', () => {
  let service: ReadingsService;

  const execMock = jest.fn();
  const queryChain = {
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: execMock,
  };
  const readingModel = {
    create: jest.fn(),
    updateOne: jest.fn(),
    find: jest.fn().mockReturnValue(queryChain),
    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn() }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    readingModel.find.mockReturnValue(queryChain);
    queryChain.sort.mockReturnThis();
    queryChain.skip.mockReturnThis();
    queryChain.limit.mockReturnThis();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ReadingsService,
        { provide: getModelToken(Reading.name), useValue: readingModel },
      ],
    }).compile();

    service = moduleRef.get(ReadingsService);
  });

  function input(
    overrides: Partial<CreateReadingInput> = {},
  ): CreateReadingInput {
    return {
      sensorId: 'temp-01',
      sensorType: 'temperature',
      value: 22.5,
      unit: '°C',
      timestamp: new Date('2026-09-16T09:00:00.000Z'),
      ...overrides,
    };
  }

  describe('create', () => {
    it('persists the reading with a server-side receivedAt and isAlert=false', async () => {
      readingModel.create.mockResolvedValue({ _id: 'reading-1' });

      await service.create(input());

      expect(readingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...input(),
          isAlert: false,
          receivedAt: expect.any(Date),
        }),
      );
    });

    it('returns the created document', async () => {
      const created = { _id: 'reading-1', ...input() };
      readingModel.create.mockResolvedValue(created);

      await expect(service.create(input())).resolves.toBe(created);
    });

    it('logs and rethrows when persistence fails', async () => {
      readingModel.create.mockRejectedValue(new Error('db down'));

      await expect(service.create(input())).rejects.toThrow('db down');
    });
  });

  describe('markAsAlert', () => {
    it('flags the given reading id as an alert', async () => {
      await service.markAsAlert('reading-1');

      expect(readingModel.updateOne).toHaveBeenCalledWith(
        { _id: 'reading-1' },
        { $set: { isAlert: true } },
      );
    });
  });

  describe('query', () => {
    function filters(
      overrides: Partial<QueryReadingsDto> = {},
    ): QueryReadingsDto {
      return { limit: 100, page: 1, ...overrides };
    }

    it('applies no filters beyond pagination when none are given', async () => {
      execMock.mockResolvedValue([]);
      readingModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.query(filters());

      expect(readingModel.find).toHaveBeenCalledWith({});
      expect(readingModel.countDocuments).toHaveBeenCalledWith({});
    });

    it('filters by sensorId, sensorType and onlyAlerts', async () => {
      execMock.mockResolvedValue([]);
      readingModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.query(
        filters({
          sensorId: 'temp-01',
          sensorType: 'temperature',
          onlyAlerts: true,
        }),
      );

      expect(readingModel.find).toHaveBeenCalledWith({
        sensorId: 'temp-01',
        sensorType: 'temperature',
        isAlert: true,
      });
    });

    it('filters by a from/to time range on timestamp', async () => {
      execMock.mockResolvedValue([]);
      readingModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.query(
        filters({
          from: '2026-01-01T00:00:00.000Z',
          to: '2026-01-02T00:00:00.000Z',
        }),
      );

      expect(readingModel.find).toHaveBeenCalledWith({
        timestamp: {
          $gte: new Date('2026-01-01T00:00:00.000Z'),
          $lte: new Date('2026-01-02T00:00:00.000Z'),
        },
      });
    });

    it('paginates using skip/limit derived from page and limit', async () => {
      execMock.mockResolvedValue([]);
      readingModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.query(filters({ page: 3, limit: 20 }));

      expect(queryChain.skip).toHaveBeenCalledWith(40);
      expect(queryChain.limit).toHaveBeenCalledWith(20);
    });

    it('returns data and meta.total from the query results', async () => {
      const docs = [{ _id: 'r1' }, { _id: 'r2' }];
      execMock.mockResolvedValue(docs);
      readingModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(2),
      });

      const result = await service.query(filters({ page: 1, limit: 100 }));

      expect(result).toEqual({
        data: docs,
        meta: { total: 2, page: 1, limit: 100 },
      });
    });
  });
});
