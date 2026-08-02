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
                const internshipCount = await this.internship.count({
                    where: { companyId },
                });
                if (internshipCount === 0) {
                    const sampleInternships = [
                        {
                            title: 'Frontend Developer Stajyeri (React & TypeScript)',
                            description: 'Modern web teknolojileri ile kullanıcı dostu arayüzler geliştirecek, React, TypeScript ve TailwindCSS deneyimi kazanmak isteyen tutkulu stajyerler arıyoruz.',
                            location: 'İstanbul / Maslak',
                            isRemote: true,
                        },
                        {
                            title: 'Backend Developer Stajyeri (NestJS & Node.js)',
                            description: 'Ölçeklenebilir RESTful API servisleri geliştirecek, PostgreSQL ve Prisma ORM mimarilerini yerinde deneyimleyecek stajyer takım arkadaşı arıyoruz.',
                            location: 'Ankara / ODTÜ Teknokent',
                            isRemote: false,
                        },
                        {
                            title: 'Yapay Zeka ve Veri Bilimi Stajyeri',
                            description: 'Python, PyTorch ve Scikit-Learn kullanarak makine öğrenmesi modelleri eğitecek, veri temizleme ve analiz süreçlerinde rol alacak vizyoner stajyer.',
                            location: 'İzmir / Urla Teknopark',
                            isRemote: true,
                        },
                        {
                            title: 'iOS Mobil Uygulama Geliştirme Stajyeri',
                            description: 'Swift ve SwiftUI kullanarak modern iOS uygulamaları geliştirecek, Apple tasarım prensiplerine hakim genç yetenekler arıyoruz.',
                            location: 'İstanbul / Levent',
                            isRemote: false,
                        },
                        {
                            title: 'Android Mobil Uygulama Geliştirme Stajyeri',
                            description: 'Kotlin ve Jetpack Compose teknolojileri ile yüksek performanslı Android uygulamaları tasarlayacak stajyer aranıyor.',
                            location: 'İstanbul / Kadıköy',
                            isRemote: true,
                        },
                        {
                            title: 'UI/UX Tasarım Stajyeri (Figma & Prototipleme)',
                            description: 'Figma ile kullanıcı araştırmaları yapacak, wireframe ve interaktif prototipler tasarlayarak ürün deneyimini iyileştirecek stajyer tasarımcı.',
                            location: 'Ankara / Çankaya',
                            isRemote: true,
                        },
                        {
                            title: 'Siber Güvenlik ve Sızma Testi Stajyeri',
                            description: 'Web uygulamaları sızma testleri, zafiyet analizi ve SOC süreçlerinde deneyim kazanmak isteyen Siber Güvenlik meraklısı gençler.',
                            location: 'İstanbul / Ataşehir',
                            isRemote: false,
                        },
                        {
                            title: 'DevOps ve Bulut Altyapı Stajyeri (Docker & K8s)',
                            description: 'Docker, Kubernetes ve CI/CD süreçlerini otomatize edecek, AWS/GCP bulut mimarilerini öğrenecek stajyer mühendis.',
                            location: 'Kocaeli / Bilişim Vadisi',
                            isRemote: true,
                        },
                        {
                            title: 'QA & Yazılım Test Otomasyon Stajyeri',
                            description: 'Cypress ve Playwright ile uçtan uca otomatik test senaryoları yazacak, yazılım kalitesini artıracak detaycı stajyer.',
                            location: 'İstanbul / Şişli',
                            isRemote: true,
                        },
                        {
                            title: 'Gömülü Sistemler ve IoT Geliştirme Stajyeri',
                            description: 'C/C++ ve RTOS kullanarak akıllı donanım kartları ve IoT cihaz yazılımları geliştirecek stajyer mühendis.',
                            location: 'Ankara / Ostim Teknopark',
                            isRemote: false,
                        },
                        {
                            title: 'Veritabanı Yöneticisi (DBA) Stajyeri',
                            description: 'PostgreSQL, Redis ve MongoDB sorgu optimizasyonu ve yedekleme stratejileri üzerine çalışacak veri odaklı stajyer.',
                            location: 'İstanbul / Ümraniye',
                            isRemote: false,
                        },
                        {
                            title: 'Dijital Pazarlama ve SEO Stajyeri',
                            description: 'Google Analytics, SEO optimizasyonu ve sosyal medya içerik stratejilerini yönetecek yaratıcı pazarlama stajyeri.',
                            location: 'İzmir / Alsancak',
                            isRemote: true,
                        },
                        {
                            title: 'İnsan Kaynakları ve İşe Alım Stajyeri',
                            description: 'Teknoloji pozisyonları için yetenek avcılığı yapacak, mülakat süreçlerini ve stajyer programlarını koordine edecek İK stajyeri.',
                            location: 'İstanbul / Maslak',
                            isRemote: false,
                        },
                        {
                            title: 'Ürün Yönetimi (Product Management) Stajyeri',
                            description: 'Kullanıcı geri bildirimlerini analiz ederek ürün yol haritaları çıkaracak, Agile/Scrum takımlarıyla çalışacak Junior PM adayı.',
                            location: 'İstanbul / Levent',
                            isRemote: true,
                        },
                        {
                            title: 'Oyun Geliştirci Stajyeri (Unity & C#)',
                            description: 'Unity ve C# ile 2D/3D mobil ve PC oyun mekanikleri geliştirecek, fizik motorları üzerine çalışacak heyecanlı stajyer.',
                            location: 'Eskişehir / Anadolu Teknopark',
                            isRemote: false,
                        },
                        {
                            title: 'Unreal Engine 5 Teknik Sanatçı (Technical Artist) Stajyeri',
                            description: 'Shader, ışıklandırma ve görsel efektler (VFX) geliştirecek Unreal Engine tutkunu stajyer adayları.',
                            location: 'İstanbul / Beşiktaş',
                            isRemote: true,
                        },
                        {
                            title: 'Blokzincir ve Akıllı Sözleşme Geliştirici Stajyeri',
                            description: 'Solidity ve Web3.js ile Ethereum ağında merkeziyetsiz uygulamalar (DApp) yazacak araştırma meraklısı stajyer.',
                            location: 'İstanbul / Maslak',
                            isRemote: true,
                        },
                        {
                            title: 'Veri Analisti Stajyeri (Power BI & SQL)',
                            description: 'Büyük veri kümelerinden anlamlı iş zekası raporları ve gösterge panelleri (Dashboard) hazırlayacak stajyer.',
                            location: 'Ankara / Bilkent Cyberpark',
                            isRemote: false,
                        },
                        {
                            title: 'İçerik Pazarlama ve Metin Yazarlığı Stajyeri',
                            description: 'Teknoloji blokları için teknik makaleler yazacak, bülten ve sosyal medya metinleri üretecek Türkçe-İngilizce hakim stajyer.',
                            location: 'İstanbul / Kadıköy',
                            isRemote: true,
                        },
                        {
                            title: 'Müşteri Başarısı (Customer Success) Stajyeri',
                            description: 'SaaS ürünümüzü kullanan kurumsal müşterilerin teknik destek süreçlerini ve memnuniyetini yönetecek stajyer.',
                            location: 'İstanbul / Şişli',
                            isRemote: true,
                        },
                        {
                            title: 'Büyüme Pazarlaması (Growth Hacking) Stajyeri',
                            description: 'A/B testleri kurgulayacak, müşteri edinme kanallarını analiz edecek veri odaklı pazarlama stajyeri.',
                            location: 'İstanbul / Maslak',
                            isRemote: true,
                        },
                        {
                            title: 'Grafik Tasarım ve İllüstrasyon Stajyeri',
                            description: 'Adobe Illustrator ve Photoshop ile dijital medya görselleri, bannerlar ve maskot illüstrasyonları çizecek tasarımcı.',
                            location: 'İzmir / Karşıyaka',
                            isRemote: true,
                        },
                        {
                            title: 'Sistem Yöneticisi (System Admin) Stajyeri',
                            description: 'Linux sunucu kurulumları, ağ konfigürasyonları ve güvenlik duvarı ayarlarından sorumlu stajyer sistem yöneticisi.',
                            location: 'Ankara / Maltepe',
                            isRemote: false,
                        },
                        {
                            title: 'İş Analisti (Business Analyst) Stajyeri',
                            description: 'Müşteri taleplerini teknik gereksinim dökümanlarına (PRD) dönüştürecek analitik düşünen stajyer.',
                            location: 'İstanbul / Levent',
                            isRemote: false,
                        },
                        {
                            title: 'Doğal Dil İşleme (NLP) Araştırma Stajyeri',
                            description: 'Büyük Dil Modelleri (LLM), RAG mimarileri ve Türkçe metin işleme üzerine Ar-Ge çalışmaları yapacak stajyer.',
                            location: 'İstanbul / Maslak',
                            isRemote: true,
                        },
                        {
                            title: 'Bilgisayarlı Görü (Computer Vision) Stajyeri',
                            description: 'OpenCV ve YOLO modelleri ile nesne tespiti, yüz tanıma ve kamera görüntü işleme algoritmaları geliştirecek stajyer.',
                            location: 'Ankara / METUTECH',
                            isRemote: false,
                        },
                        {
                            title: 'Donanım Tasarım ve PCB Geliştirme Stajyeri',
                            description: 'Altium Designer ile elektronik devre kartları çizecek, SMD lehimleme ve test süreçlerinde rol alacak mühendislik stajyeri.',
                            location: 'Bursa / NOSAB',
                            isRemote: false,
                        },
                        {
                            title: 'Teknik Destek Mühendisi Stajyeri',
                            description: 'API entegrasyon hatalarını inceleyecek, yazılım ürünümüz için ilk seviye teknik destek sunacak iletişim yönü güçlü stajyer.',
                            location: 'İstanbul / Kadıköy',
                            isRemote: true,
                        },
                        {
                            title: 'Teknoloji Muhabiri ve Yayıncılık Stajyeri',
                            description: 'Yazılım ve girişimcilik dünyasından haberler derleyecek, röportajlar ve podcast yayınları hazırlayacak içerik stajyeri.',
                            location: 'İstanbul / Beşiktaş',
                            isRemote: true,
                        },
                        {
                            title: 'Proje Yönetimi Adayı (PMO) Stajyeri',
                            description: 'Jira, Confluence ve Trello üzerinde Agile proje takvimini izleyecek ve koordinasyon sağlayacak stajyer.',
                            location: 'İstanbul / Maslak',
                            isRemote: true,
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