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
            const userCount = await this.user.count();
            if (userCount > 0) {
                return;
            }
            this.logger.log('🌱 Canlı veritabanı boş tespit edildi, otomatik seed başlatılıyor...');
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
            await this.user.upsert({
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
            });
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