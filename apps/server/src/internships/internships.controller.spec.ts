import { Test, TestingModule } from '@nestjs/testing';
import { InternshipsController } from './internships.controller';
import { InternshipsService } from './internships.service';

describe('InternshipsController', () => {
  let controller: InternshipsController;

  const mockInternshipsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByCompany: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternshipsController],
      providers: [
        { provide: InternshipsService, useValue: mockInternshipsService },
      ],
    }).compile();

    controller = module.get<InternshipsController>(InternshipsController);
    jest.clearAllMocks();
  });

  it('controller tanımlı olmalıdır', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('service.create metodunu çağırmalıdır', async () => {
      const dto = {
        title: 'Backend Developer Stajyeri',
        description: 'NestJS stajyeri',
        location: 'Ankara',
      };
      mockInternshipsService.create.mockResolvedValue({
        id: '1',
        ...dto,
      });

      const result = await controller.create('user-1', dto);

      expect(mockInternshipsService.create).toHaveBeenCalledWith('user-1', dto);
      expect(result.id).toEqual('1');
    });
  });

  describe('findAll', () => {
    it('service.findAll metodunu çağırmalıdır', async () => {
      mockInternshipsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll({});

      expect(mockInternshipsService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });
  });
});
