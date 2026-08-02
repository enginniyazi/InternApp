import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;

  const mockAdminService = {
    getStats: jest.fn(),
    getCompanies: jest.fn(),
    approveCompany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    jest.clearAllMocks();
  });

  it('controller tanımlı olmalıdır', () => {
    expect(controller).toBeDefined();
  });

  describe('getStats', () => {
    it('service.getStats metodunu çağırmalıdır', async () => {
      mockAdminService.getStats.mockResolvedValue({ totalUsers: 5 });
      const result = await controller.getStats();

      expect(mockAdminService.getStats).toHaveBeenCalled();
      expect(result).toEqual({ totalUsers: 5 });
    });
  });
});
