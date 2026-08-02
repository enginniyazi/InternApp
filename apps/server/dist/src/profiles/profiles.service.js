"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ProfilesService = class ProfilesService {
    prisma;
    storageService;
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getStudentProfile(userId) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Öğrenci profili bulunamadı.');
        }
        return profile;
    }
    async updateStudentProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== client_1.Role.STUDENT) {
            throw new common_1.ForbiddenException('Bu işlem için öğrenci olmanız gerekmektedir.');
        }
        return this.prisma.studentProfile.upsert({
            where: { userId },
            create: {
                userId,
                firstName: dto.firstName || 'Öğrenci',
                lastName: dto.lastName || 'Kullanıcı',
                phone: dto.phone,
                city: dto.city,
                university: dto.university,
                department: dto.department,
                grade: dto.grade,
                gpa: dto.gpa,
                educationLevel: dto.educationLevel,
                internshipStatus: dto.internshipStatus,
                skills: dto.skills || [],
                linkedinUrl: dto.linkedinUrl,
                githubUrl: dto.githubUrl,
                bio: dto.bio,
                cvUrl: dto.cvUrl,
            },
            update: {
                ...(dto.firstName && { firstName: dto.firstName }),
                ...(dto.lastName && { lastName: dto.lastName }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.university !== undefined && { university: dto.university }),
                ...(dto.department !== undefined && { department: dto.department }),
                ...(dto.grade !== undefined && { grade: dto.grade }),
                ...(dto.gpa !== undefined && { gpa: dto.gpa }),
                ...(dto.educationLevel !== undefined && {
                    educationLevel: dto.educationLevel,
                }),
                ...(dto.internshipStatus !== undefined && {
                    internshipStatus: dto.internshipStatus,
                }),
                ...(dto.skills !== undefined && { skills: dto.skills }),
                ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
                ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
                ...(dto.bio !== undefined && { bio: dto.bio }),
                ...(dto.cvUrl !== undefined && { cvUrl: dto.cvUrl }),
            },
        });
    }
    async uploadCv(userId, file) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== client_1.Role.STUDENT) {
            throw new common_1.ForbiddenException('Sadece öğrenciler CV yükleyebilir.');
        }
        const cvUrl = await this.storageService.saveCv(file);
        const updatedProfile = await this.prisma.studentProfile.upsert({
            where: { userId },
            create: {
                userId,
                firstName: 'Öğrenci',
                lastName: 'Kullanıcı',
                cvUrl,
            },
            update: {
                cvUrl,
            },
        });
        return {
            message: 'CV başarıyla yüklendi.',
            cvUrl: updatedProfile.cvUrl,
        };
    }
    async getCompanyProfile(userId) {
        const profile = await this.prisma.companyProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Şirket profili bulunamadı.');
        }
        return profile;
    }
    async updateCompanyProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== client_1.Role.COMPANY) {
            throw new common_1.ForbiddenException('Bu işlem için şirket olmanız gerekmektedir.');
        }
        return this.prisma.companyProfile.upsert({
            where: { userId },
            create: {
                userId,
                companyName: dto.companyName || 'Şirket Adı',
                website: dto.website,
                description: dto.description,
                logoUrl: dto.logoUrl,
            },
            update: {
                ...(dto.companyName && { companyName: dto.companyName }),
                ...(dto.website !== undefined && { website: dto.website }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
            },
        });
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map