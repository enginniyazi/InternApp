"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    async onModuleInit() {
        await this.$connect();
        await this.ensureSeedData();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async ensureSeedData() {
        try {
            this.logger.log('🌱 Canlı veritabanı seed kontrolü yapılıyor...');
            const passwordHash = await bcrypt.hash('123456', 10);
            await this.user.upsert({
                where: { email: 'admin@stajapp.com' },
                update: {},
                create: {
                    email: 'admin@stajapp.com',
                    passwordHash,
                    role: client_1.Role.ADMIN,
                },
            });
            await this.user.upsert({
                where: { email: 'ahmet@ogrenci.edu.tr' },
                update: {},
                create: {
                    email: 'ahmet@ogrenci.edu.tr',
                    passwordHash,
                    role: client_1.Role.STUDENT,
                    studentProfile: {
                        create: {
                            firstName: 'Ahmet',
                            lastName: 'Yılmaz',
                            bio: 'Full-stack geliştirme ile ilgilenen 3. sınıf öğrencisi.',
                        },
                    },
                },
            });
            const companyUser = await this.user.upsert({
                where: { email: 'hr@techvision.com' },
                update: {},
                create: {
                    email: 'hr@techvision.com',
                    passwordHash,
                    role: client_1.Role.COMPANY,
                    companyProfile: {
                        create: {
                            companyName: 'TechVision A.Ş.',
                            description: 'Yapay zeka ve bulut teknolojileri geliştiren yazılım şirketi.',
                            website: 'https://techvision.com',
                        },
                    },
                },
                include: { companyProfile: true },
            });
            if (companyUser.companyProfile) {
                const companyId = companyUser.companyProfile.id;
                await this.internship.deleteMany({ where: { companyId } });
                const sampleInternships = [
                    {
                        title: 'Frontend Developer Stajyeri (React & TypeScript)',
                        description: 'Modern web teknolojileri ile kullanıcı dostu arayüzler geliştirecek, React, TypeScript ve TailwindCSS deneyimi kazanmak isteyen tutkulu stajyerler arıyoruz.',
                        location: 'İstanbul / Maslak',
                        isRemote: true,
                        internshipType: 'MANDATORY',
                        targetEducationLevel: 'BACHELOR',
                        targetDepartments: [
                            'Bilgisayar Mühendisliği',
                            'Yazılım Mühendisliği',
                            'YBS',
                        ],
                        weeklyDays: 5,
                        durationWeeks: 12,
                        workModel: 'REMOTE',
                        city: 'İstanbul',
                        stipendType: 'MINIMUM_WAGE',
                        hasMealAllowance: true,
                        hasTransportation: true,
                        hasEquipment: true,
                        returnOfferProbability: 'HIGH',
                        requiredSkills: ['React', 'TypeScript', 'TailwindCSS', 'Git'],
                        quota: 3,
                    },
                    {
                        title: 'Backend Developer Stajyeri (NestJS & Node.js)',
                        description: 'Ölçeklenebilir RESTful API servisleri geliştirecek, PostgreSQL ve Prisma ORM mimarilerini yerinde deneyimleyecek stajyer takım arkadaşı arıyoruz.',
                        location: 'Ankara / ODTÜ Teknokent',
                        isRemote: false,
                        internshipType: 'LONG_TERM',
                        targetEducationLevel: 'BACHELOR',
                        targetDepartments: [
                            'Bilgisayar Mühendisliği',
                            'Elektrik-Elektronik',
                        ],
                        weeklyDays: 3,
                        durationWeeks: 24,
                        workModel: 'ON_SITE',
                        city: 'Ankara',
                        stipendType: 'ABOVE_MINIMUM',
                        hasMealAllowance: true,
                        hasTransportation: true,
                        hasEquipment: true,
                        returnOfferProbability: 'HIGH',
                        requiredSkills: ['Node.js', 'NestJS', 'PostgreSQL', 'Prisma'],
                        quota: 2,
                    },
                    {
                        title: 'Yapay Zeka ve NLP Araştırma Stajyeri',
                        description: 'Büyük Dil Modelleri (LLM), RAG mimarileri ve Derin Öğrenme alanında akademik/endüstriyel projelerde çalışacak yüksek lisans veya lisans stajyeri.',
                        location: 'İzmir / Urla Teknopark',
                        isRemote: true,
                        internshipType: 'SUMMER',
                        targetEducationLevel: 'MASTER_PHD',
                        targetDepartments: [
                            'Yapay Zeka Mühendisliği',
                            'Veri Bilimi',
                            'Bilgisayar Bilimleri',
                        ],
                        weeklyDays: 5,
                        durationWeeks: 8,
                        workModel: 'REMOTE',
                        city: 'İzmir',
                        stipendType: 'ABOVE_MINIMUM',
                        hasMealAllowance: true,
                        hasTransportation: false,
                        hasEquipment: true,
                        returnOfferProbability: 'HIGH',
                        requiredSkills: ['Python', 'PyTorch', 'HuggingFace', 'LangChain'],
                        quota: 2,
                    },
                    {
                        title: 'iOS Mobil Uygulama Geliştirme Stajyeri',
                        description: 'Swift ve SwiftUI kullanarak modern iOS uygulamaları geliştirecek, Apple tasarım prensiplerine hakim genç yetenekler arıyoruz.',
                        location: 'İstanbul / Levent',
                        isRemote: false,
                        internshipType: 'VOLUNTARY',
                        targetEducationLevel: 'ASSOCIATE',
                        targetDepartments: [
                            'Bilgisayar Programcılığı',
                            'Yazılım Mühendisliği',
                        ],
                        weeklyDays: 4,
                        durationWeeks: 16,
                        workModel: 'HYBRID',
                        city: 'İstanbul',
                        stipendType: 'MINIMUM_WAGE',
                        hasMealAllowance: true,
                        hasTransportation: true,
                        hasEquipment: true,
                        returnOfferProbability: 'MEDIUM',
                        requiredSkills: ['Swift', 'SwiftUI', 'iOS', 'Xcode'],
                        quota: 1,
                    },
                    {
                        title: 'UI/UX Tasarım ve Grafik Stajyeri',
                        description: 'Figma ile kullanıcı araştırmaları yapacak, wireframe ve interaktif prototipler tasarlayarak ürün deneyimini iyileştirecek stajyer tasarımcı.',
                        location: 'Ankara / Çankaya',
                        isRemote: true,
                        internshipType: 'VOLUNTARY',
                        targetEducationLevel: 'BACHELOR',
                        targetDepartments: [
                            'Görsel İletişim Tasarımı',
                            'Grafik Tasarım',
                            'Endüstriyel Tasarım',
                        ],
                        weeklyDays: 3,
                        durationWeeks: 12,
                        workModel: 'REMOTE',
                        city: 'Ankara',
                        stipendType: 'SCHOLARSHIP',
                        hasMealAllowance: true,
                        hasTransportation: false,
                        hasEquipment: false,
                        returnOfferProbability: 'HIGH',
                        requiredSkills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping'],
                        quota: 2,
                    },
                    {
                        title: 'Siber Güvenlik ve Sızma Testi Stajyeri',
                        description: 'Web uygulamaları sızma testleri, zafiyet analizi ve SOC süreçlerinde deneyim kazanmak isteyen Siber Güvenlik meraklısı gençler.',
                        location: 'İstanbul / Ataşehir',
                        isRemote: false,
                        internshipType: 'MANDATORY',
                        targetEducationLevel: 'BACHELOR',
                        targetDepartments: ['Siber Güvenlik', 'Bilgisayar Mühendisliği'],
                        weeklyDays: 5,
                        durationWeeks: 10,
                        workModel: 'ON_SITE',
                        city: 'İstanbul',
                        stipendType: 'ABOVE_MINIMUM',
                        hasMealAllowance: true,
                        hasTransportation: true,
                        hasEquipment: true,
                        returnOfferProbability: 'HIGH',
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
                        description: 'Docker, Kubernetes ve CI/CD süreçlerini otomatize edecek, AWS/GCP bulut mimarilerini öğrenecek stajyer mühendis.',
                        location: 'Kocaeli / Bilişim Vadisi',
                        isRemote: true,
                        internshipType: 'LONG_TERM',
                        targetEducationLevel: 'BACHELOR',
                        targetDepartments: [
                            'Bilgisayar Mühendisliği',
                            'Yazılım Mühendisliği',
                        ],
                        weeklyDays: 4,
                        durationWeeks: 20,
                        workModel: 'REMOTE',
                        city: 'Kocaeli',
                        stipendType: 'ABOVE_MINIMUM',
                        hasMealAllowance: true,
                        hasTransportation: false,
                        hasEquipment: true,
                        returnOfferProbability: 'HIGH',
                        requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS'],
                        quota: 1,
                    },
                    {
                        title: 'Meslek Lisesi Donanım & Bilişim Stajyeri',
                        description: 'Ofis donanım cihazlarının kurulumu, ağ kablolaması ve temel bilgisayar teknik bakımında görev alacak meslek lisesi bilişim bölümü öğrencileri.',
                        location: 'İstanbul / Kadıköy',
                        isRemote: false,
                        internshipType: 'MANDATORY',
                        targetEducationLevel: 'HIGH_SCHOOL',
                        targetDepartments: [
                            'Bilişim Teknolojileri',
                            'Elektrik-Elektronik',
                        ],
                        weeklyDays: 3,
                        durationWeeks: 30,
                        workModel: 'ON_SITE',
                        city: 'İstanbul',
                        stipendType: 'MINIMUM_WAGE',
                        hasMealAllowance: true,
                        hasTransportation: true,
                        hasEquipment: false,
                        returnOfferProbability: 'MEDIUM',
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
                this.logger.log('🎉 30 Adet zengin staj ilanı veritabanına başarıyla eklendi!');
            }
            this.logger.log('✅ Canlı veritabanı otomatik olarak başarıyla dolduruldu!');
        }
        catch (err) {
            this.logger.error('Otomatik seed sırasında hata oluştu:', err);
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map