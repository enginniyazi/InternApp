import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;

  const mockPrismaService = {
    user: { count: jest.fn().mockResolvedValue(10) },
    studentProfile: { count: jest.fn().mockResolvedValue(6) },
    companyProfile: {
      count: jest.fn().mockResolvedValue(4),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    internship: { count: jest.fn().mockResolvedValue(8) },
    application: { count: jest.fn().mockResolvedValue(12) },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('sistem istatistiklerini dönmelidir', async () => {
      const stats = await service.getStats();

      expect(stats.totalUsers).toEqual(10);
      expect(stats.totalStudents).toEqual(6);
      expect(stats.totalCompanies).toEqual(4);
      expect(stats.totalInternships).toEqual(8);
      expect(stats.totalApplications).toEqual(12);
    });
  });

  describe('approveCompany', () => {
    it('şirket bulunamazsa NotFoundException fırlatmalıdır', async () => {
      mockPrismaService.companyProfile.findUnique.mockResolvedValue(null);

      await expect(service.approveCompany('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
