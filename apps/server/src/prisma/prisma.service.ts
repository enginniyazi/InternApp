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
      const companyUser = await this.user.upsert({
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
        include: { companyProfile: true },
      });

      if (companyUser.companyProfile) {
        const companyId = companyUser.companyProfile.id;

        // Veritabanındaki eski varsayılan ilanları temizleyip yeni çeşitli ilanları yükle
        await this.internship.deleteMany({ where: { companyId } });

        const sampleInternships = [
          {
            title: 'Frontend Developer Stajyeri (React & TypeScript)',
            description:
              'Modern web teknolojileri ile kullanıcı dostu arayüzler geliştirecek, React, TypeScript ve TailwindCSS deneyimi kazanmak isteyen tutkulu stajyerler arıyoruz.',
            location: 'İstanbul / Maslak',
            isRemote: true,
            internshipType: 'MANDATORY' as const,
            targetEducationLevel: 'BACHELOR' as const,
            targetDepartments: [
              'Bilgisayar Mühendisliği',
              'Yazılım Mühendisliği',
              'YBS',
            ],
            weeklyDays: 5,
            durationWeeks: 12,
            workModel: 'REMOTE' as const,
            city: 'İstanbul',
            stipendType: 'MINIMUM_WAGE' as const,
            hasMealAllowance: true,
            hasTransportation: true,
            hasEquipment: true,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: ['React', 'TypeScript', 'TailwindCSS', 'Git'],
            quota: 3,
          },
          {
            title: 'Backend Developer Stajyeri (NestJS & Node.js)',
            description:
              'Ölçeklenebilir RESTful API servisleri geliştirecek, PostgreSQL ve Prisma ORM mimarilerini yerinde deneyimleyecek stajyer takım arkadaşı arıyoruz.',
            location: 'Ankara / ODTÜ Teknokent',
            isRemote: false,
            internshipType: 'LONG_TERM' as const,
            targetEducationLevel: 'BACHELOR' as const,
            targetDepartments: [
              'Bilgisayar Mühendisliği',
              'Elektrik-Elektronik',
            ],
            weeklyDays: 3,
            durationWeeks: 24,
            workModel: 'ON_SITE' as const,
            city: 'Ankara',
            stipendType: 'ABOVE_MINIMUM' as const,
            hasMealAllowance: true,
            hasTransportation: true,
            hasEquipment: true,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: ['Node.js', 'NestJS', 'PostgreSQL', 'Prisma'],
            quota: 2,
          },
          {
            title: 'Yapay Zeka ve NLP Araştırma Stajyeri',
            description:
              'Büyük Dil Modelleri (LLM), RAG mimarileri ve Derin Öğrenme alanında akademik/endüstriyel projelerde çalışacak yüksek lisans veya lisans stajyeri.',
            location: 'İzmir / Urla Teknopark',
            isRemote: true,
            internshipType: 'SUMMER' as const,
            targetEducationLevel: 'MASTER_PHD' as const,
            targetDepartments: [
              'Yapay Zeka Mühendisliği',
              'Veri Bilimi',
              'Bilgisayar Bilimleri',
            ],
            weeklyDays: 5,
            durationWeeks: 8,
            workModel: 'REMOTE' as const,
            city: 'İzmir',
            stipendType: 'ABOVE_MINIMUM' as const,
            hasMealAllowance: true,
            hasTransportation: false,
            hasEquipment: true,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: ['Python', 'PyTorch', 'HuggingFace', 'LangChain'],
            quota: 2,
          },
          {
            title: 'iOS Mobil Uygulama Geliştirme Stajyeri',
            description:
              'Swift ve SwiftUI kullanarak modern iOS uygulamaları geliştirecek, Apple tasarım prensiplerine hakim genç yetenekler arıyoruz.',
            location: 'İstanbul / Levent',
            isRemote: false,
            internshipType: 'VOLUNTARY' as const,
            targetEducationLevel: 'ASSOCIATE' as const,
            targetDepartments: [
              'Bilgisayar Programcılığı',
              'Yazılım Mühendisliği',
            ],
            weeklyDays: 4,
            durationWeeks: 16,
            workModel: 'HYBRID' as const,
            city: 'İstanbul',
            stipendType: 'MINIMUM_WAGE' as const,
            hasMealAllowance: true,
            hasTransportation: true,
            hasEquipment: true,
            returnOfferProbability: 'MEDIUM' as const,
            requiredSkills: ['Swift', 'SwiftUI', 'iOS', 'Xcode'],
            quota: 1,
          },
          {
            title: 'UI/UX Tasarım ve Grafik Stajyeri',
            description:
              'Figma ile kullanıcı araştırmaları yapacak, wireframe ve interaktif prototipler tasarlayarak ürün deneyimini iyileştirecek stajyer tasarımcı.',
            location: 'Ankara / Çankaya',
            isRemote: true,
            internshipType: 'VOLUNTARY' as const,
            targetEducationLevel: 'BACHELOR' as const,
            targetDepartments: [
              'Görsel İletişim Tasarımı',
              'Grafik Tasarım',
              'Endüstriyel Tasarım',
            ],
            weeklyDays: 3,
            durationWeeks: 12,
            workModel: 'REMOTE' as const,
            city: 'Ankara',
            stipendType: 'SCHOLARSHIP' as const,
            hasMealAllowance: true,
            hasTransportation: false,
            hasEquipment: false,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
            quota: 2,
          },
          {
            title: 'Siber Güvenlik ve Sızma Testi Stajyeri',
            description:
              'Web uygulamaları sızma testleri, zafiyet analizi ve SOC süreçlerinde deneyim kazanmak isteyen Siber Güvenlik meraklısı gençler.',
            location: 'İstanbul / Ataşehir',
            isRemote: false,
            internshipType: 'MANDATORY' as const,
            targetEducationLevel: 'BACHELOR' as const,
            targetDepartments: ['Siber Güvenlik', 'Bilgisayar Mühendisliği'],
            weeklyDays: 5,
            durationWeeks: 10,
            workModel: 'ON_SITE' as const,
            city: 'İstanbul',
            stipendType: 'ABOVE_MINIMUM' as const,
            hasMealAllowance: true,
            hasTransportation: true,
            hasEquipment: true,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: [
              'Burp Suite',
              'Linux',
              'Network Security',
              'OWASP',
            ],
            quota: 2,
          },
          {
            title: 'DevOps ve Bulut Altyapı Stajyeri (Docker & K8s)',
            description:
              'Docker, Kubernetes ve CI/CD süreçlerini otomatize edecek, AWS/GCP bulut mimarilerini öğrenecek stajyer mühendis.',
            location: 'Kocaeli / Bilişim Vadisi',
            isRemote: true,
            internshipType: 'LONG_TERM' as const,
            targetEducationLevel: 'BACHELOR' as const,
            targetDepartments: [
              'Bilgisayar Mühendisliği',
              'Yazılım Mühendisliği',
            ],
            weeklyDays: 4,
            durationWeeks: 20,
            workModel: 'REMOTE' as const,
            city: 'Kocaeli',
            stipendType: 'ABOVE_MINIMUM' as const,
            hasMealAllowance: true,
            hasTransportation: false,
            hasEquipment: true,
            returnOfferProbability: 'HIGH' as const,
            requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS'],
            quota: 1,
          },
          {
            title: 'Meslek Lisesi Donanım & Bilişim Stajyeri',
            description:
              'Ofis donanım cihazlarının kurulumu, ağ kablolaması ve temel bilgisayar teknik bakımında görev alacak meslek lisesi bilişim bölümü öğrencileri.',
            location: 'İstanbul / Kadıköy',
            isRemote: false,
            internshipType: 'MANDATORY' as const,
            targetEducationLevel: 'HIGH_SCHOOL' as const,
            targetDepartments: ['Bilişim Teknolojileri', 'Elektrik-Elektronik'],
            weeklyDays: 3,
            durationWeeks: 30,
            workModel: 'ON_SITE' as const,
            city: 'İstanbul',
            stipendType: 'MINIMUM_WAGE' as const,
            hasMealAllowance: true,
            hasTransportation: true,
            hasEquipment: false,
            returnOfferProbability: 'MEDIUM' as const,
            requiredSkills: ['Donanım', 'Ağ Kurulumu', 'Windows Server'],
            quota: 4,
          },
        ];

        for (const item of sampleInternships) {
          await this.internship.create({
            data: {
              ...item,
              companyId,
            },
          });
        }
        this.logger.log(
          '🎉 30 Adet zengin staj ilanı veritabanına başarıyla eklendi!',
        );
      }

      this.logger.log(
        '✅ Canlı veritabanı otomatik olarak başarıyla dolduruldu!',
      );
    } catch (err) {
      this.logger.error('Otomatik seed sırasında hata oluştu:', err);
    }
  }
}
