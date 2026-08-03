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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const [totalUsers, totalStudents, totalCompanies, totalInternships, totalApplications,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.studentProfile.count(),
            this.prisma.companyProfile.count(),
            this.prisma.internship.count(),
            this.prisma.application.count(),
        ]);
        return {
            totalUsers,
            totalStudents,
            totalCompanies,
            totalInternships,
            totalApplications,
        };
    }
    async getCompanies() {
        return this.prisma.companyProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async approveCompany(companyId) {
        const company = await this.prisma.companyProfile.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Şirket profili bulunamadı.');
        }
        return this.prisma.companyProfile.update({
            where: { id: companyId },
            data: {
                updatedAt: new Date(),
            },
        });
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                studentProfile: {
                    select: {
                        firstName: true,
                        lastName: true,
                        university: true,
                        department: true,
                    },
                },
                companyProfile: {
                    select: {
                        companyName: true,
                        website: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteUser(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Kullanıcı bulunamadı.');
        return this.prisma.user.delete({ where: { id: userId } });
    }
    async getAllInternships() {
        return this.prisma.internship.findMany({
            include: {
                company: {
                    select: {
                        companyName: true,
                    },
                },
                _count: {
                    select: { applications: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteInternship(internshipId) {
        const item = await this.prisma.internship.findUnique({ where: { id: internshipId } });
        if (!item)
            throw new common_1.NotFoundException('İlan bulunamadı.');
        return this.prisma.internship.delete({ where: { id: internshipId } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map