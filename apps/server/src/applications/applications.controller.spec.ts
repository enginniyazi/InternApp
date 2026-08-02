import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationStatus } from '@prisma/client';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  const mockApplicationsService = {
    applyToInternship: jest.fn(),
    getStudentApplications: jest.fn(),
    getCompanyApplications: jest.fn(),
    updateApplicationStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    jest.clearAllMocks();
  });

  it('controller tanımlı olmalıdır', () => {
    expect(controller).toBeDefined();
  });

  describe('apply', () => {
    it('service.applyToInternship metodunu çağırmalıdır', async () => {
      const dto = { internshipId: 'int-1' };
      mockApplicationsService.applyToInternship.mockResolvedValue({
        id: 'app-1',
      });

      const result = await controller.apply('user-1', dto);

      expect(mockApplicationsService.applyToInternship).toHaveBeenCalledWith(
        'user-1',
        dto,
      );
      expect(result).toEqual({ id: 'app-1' });
    });
  });

  describe('updateStatus', () => {
    it('service.updateApplicationStatus metodunu çağırmalıdır', async () => {
      const dto = { status: ApplicationStatus.ACCEPTED };
      mockApplicationsService.updateApplicationStatus.mockResolvedValue({
        id: 'app-1',
        status: ApplicationStatus.ACCEPTED,
      });

      const result = await controller.updateStatus('comp-1', 'app-1', dto);

      expect(
        mockApplicationsService.updateApplicationStatus,
      ).toHaveBeenCalledWith('comp-1', 'app-1', dto);
      expect(result.status).toEqual(ApplicationStatus.ACCEPTED);
    });
  });
});
