import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    await this.ensureSeedData();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async ensureSeedData() {
    try {
      this.logger.log('🌱 Canlı veritabanı seed kontrolü yapılıyor...');
      const passwordHash = await bcrypt.hash('123456', 10);

      // 1. Admin
      await this.user.upsert({
        where: { email: 'admin@stajapp.com' },
        update: {},
        create: {
          email: 'admin@stajapp.com',
          passwordHash,
          role: Role.ADMIN,
        },
      });

      // 2. Öğrenci
      await this.user.upsert({
        where: { email: 'ahmet@ogrenci.edu.tr' },
        update: {},
        create: {
          email: 'ahmet@ogrenci.edu.tr',
          passwordHash,
          role: Role.STUDENT,
          studentProfile: {
            create: {
              firstName: 'Ahmet',
              lastName: 'Yılmaz',
              bio: 'Full-stack geliştirme ile ilgilenen 3. sınıf öğrencisi.',
            },
          },
        },
      });

      // 3. Şirket
      await this.user.upsert({
        where: { email: 'hr@techvision.com' },
        update: {},
        create: {
          email: 'hr@techvision.com',
          passwordHash,
          role: Role.COMPANY,
          companyProfile: {
            create: {
              companyName: 'TechVision A.Ş.',
              description:
                'Yapay zeka ve bulut teknolojileri geliştiren yazılım şirketi.',
              website: 'https://techvision.com',
            },
          },
        },
      });

      this.logger.log(
        '✅ Canlı veritabanı otomatik olarak başarıyla dolduruldu!',
      );
    } catch (err) {
      this.logger.error('Otomatik seed sırasında hata oluştu:', err);
    }
  }
}
