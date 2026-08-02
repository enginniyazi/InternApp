import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { Role } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ProfilesService', () => {
  let service: ProfilesService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    studentProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    companyProfile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockStorageService = {
    saveCv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    jest.clearAllMocks();
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentProfile', () => {
    it('profil yoksa NotFoundException fırlatmalıdır', async () => {
      mockPrismaService.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.getStudentProfile('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('profil varsa getirmelidir', async () => {
      mockPrismaService.studentProfile.findUnique.mockResolvedValue({
        id: 'prof-1',
        firstName: 'Ali',
      });

      const result = await service.getStudentProfile('user-1');
      expect(result.id).toEqual('prof-1');
    });
  });

  describe('updateStudentProfile', () => {
    it('kullanıcı öğrenci değilse ForbiddenException fırlatmalıdır', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: Role.COMPANY,
      });

      await expect(
        service.updateStudentProfile('user-1', { firstName: 'Ali' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
