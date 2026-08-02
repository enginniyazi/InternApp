import { Test, TestingModule } from '@nestjs/testing';
import { InternshipsService } from './internships.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('InternshipsService', () => {
  let service: InternshipsService;

  const mockPrismaService = {
    companyProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    internship: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InternshipsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InternshipsService>(InternshipsService);
    jest.clearAllMocks();
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('şirket profili yoksa oluşturup ilanı eklemelidir', async () => {
      mockPrismaService.companyProfile.findUnique.mockResolvedValue(null);
      mockPrismaService.companyProfile.create.mockResolvedValue({
        id: 'company-prof-1',
        userId: 'user-1',
      });
      mockPrismaService.internship.create.mockResolvedValue({
        id: 'internship-1',
        title: 'Frontend Stajyeri',
      });

      const dto = {
        title: 'Frontend Stajyeri',
        description: 'React bilen stajyer.',
        location: 'İstanbul',
      };

      const result = await service.create('user-1', dto);

      expect(mockPrismaService.companyProfile.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', companyName: 'Şirket Adı' },
      });
      expect(result.id).toEqual('internship-1');
    });
  });

  describe('findAll', () => {
    it('filtreye göre ilan listesini getirmelidir', async () => {
      mockPrismaService.internship.findMany.mockResolvedValue([
        { id: '1', title: 'React Stajyeri' },
      ]);

      const result = await service.findAll({ search: 'React' });

      expect(mockPrismaService.internship.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('ilan yoksa NotFoundException fırlatmalıdır', async () => {
      mockPrismaService.internship.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('başka bir şirketin ilanını silmeye çalışırsa ForbiddenException fırlatmalıdır', async () => {
      mockPrismaService.internship.findUnique.mockResolvedValue({
        id: 'internship-1',
        company: { userId: 'owner-user-id' },
      });

      await expect(
        service.remove('other-user-id', 'internship-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
