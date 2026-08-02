import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;

  const mockProfilesService = {
    getStudentProfile: jest.fn(),
    updateStudentProfile: jest.fn(),
    uploadCv: jest.fn(),
    getCompanyProfile: jest.fn(),
    updateCompanyProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: mockProfilesService }],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    jest.clearAllMocks();
  });

  it('controller tanımlı olmalıdır', () => {
    expect(controller).toBeDefined();
  });

  describe('getStudentProfile', () => {
    it('service.getStudentProfile metodunu çağırmalıdır', async () => {
      mockProfilesService.getStudentProfile.mockResolvedValue({ id: '1' });
      const result = await controller.getStudentProfile('user-1');

      expect(mockProfilesService.getStudentProfile).toHaveBeenCalledWith(
        'user-1',
      );
      expect(result).toEqual({ id: '1' });
    });
  });
});
