import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Role, ApplicationStatus } from '@prisma/client';
import { ForbiddenException, ConflictException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    studentProfile: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    companyProfile: {
      findUnique: jest.fn(),
    },
    internship: {
      findUnique: jest.fn(),
    },
    application: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockMailService = {
    sendNewApplicationNotification: jest.fn(),
    sendStatusUpdateNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    jest.clearAllMocks();
  });

  it('servis tanımlı olmalıdır', () => {
    expect(service).toBeDefined();
  });

  describe('applyToInternship', () => {
    it('kullanıcı öğrenci değilse ForbiddenException fırlatmalıdır', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: Role.COMPANY,
      });

      await expect(
        service.applyToInternship('user-1', { internshipId: 'int-1' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('aynı ilana 2. defa başvurulursa ConflictException fırlatmalıdır', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        role: Role.STUDENT,
      });
      mockPrismaService.studentProfile.findUnique.mockResolvedValue({
        id: 'stud-1',
      });
      mockPrismaService.internship.findUnique.mockResolvedValue({
        id: 'int-1',
        title: 'Staj',
        company: { user: { email: 'comp@test.com' } },
      });
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
      });

      await expect(
        service.applyToInternship('user-1', { internshipId: 'int-1' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateApplicationStatus', () => {
    it('şirket ilanın sahibi değilse ForbiddenException fırlatmalıdır', async () => {
      mockPrismaService.application.findUnique.mockResolvedValue({
        id: 'app-1',
        internship: {
          title: 'Staj',
          company: { userId: 'owner-company-id' },
        },
      });

      await expect(
        service.updateApplicationStatus('other-company-id', 'app-1', {
          status: ApplicationStatus.ACCEPTED,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
