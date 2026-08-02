import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('servis tanımlanmış olmalıdır', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('e-posta adresi zaten varsa ConflictException fırlatmalıdır', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      });

      await expect(
        service.register({
          email: 'existing@example.com',
          password: 'password123',
          role: Role.STUDENT,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('yeni kullanıcı başarıyla kaydedilmeli ve tokenlar dönmelidir', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'new@example.com',
        role: Role.STUDENT,
        createdAt: new Date(),
        studentProfile: {
          id: 'prof-1',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
        },
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.register({
        email: 'new@example.com',
        password: 'password123',
        role: Role.STUDENT,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
      });

      expect(result.user.id).toEqual('new-user-id');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('login', () => {
    it('kullanıcı bulunamazsa UnauthorizedException fırlatmalıdır', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'notfound@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('şifre yanlışsa UnauthorizedException fırlatmalıdır', async () => {
      const hashed = await bcrypt.hash('realpassword', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash: hashed,
        role: Role.STUDENT,
      });

      await expect(
        service.login({
          email: 'user@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doğru bilgilerle giriş yapıldığında kullanıcı bilgileri ve tokenlar dönmelidir', async () => {
      const password = 'password123';
      const passwordHash = await bcrypt.hash(password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'user@example.com',
        passwordHash,
        role: Role.STUDENT,
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.login({
        email: 'user@example.com',
        password,
      });

      expect(result.user.id).toEqual('user-id');
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });

  describe('logout', () => {
    it('kullanıcının refreshTokenHash alanını sıfırlamalıdır', async () => {
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.logout('user-id');

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { refreshTokenHash: null },
      });
      expect(result.message).toBe('Başarıyla çıkış yapıldı.');
    });
  });
});
