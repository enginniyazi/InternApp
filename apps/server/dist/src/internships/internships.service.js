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
exports.InternshipsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InternshipsService = class InternshipsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCompanyProfile(userId) {
        let companyProfile = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!companyProfile) {
            companyProfile = await this.prisma.companyProfile.create({
                data: {
                    userId,
                    companyName: 'Şirket Adı',
                },
            });
        }
        return companyProfile;
    }
    async create(userId, dto) {
        const companyProfile = await this.getOrCreateCompanyProfile(userId);
        if (!companyProfile.isApproved) {
            throw new common_1.ForbiddenException('Hesabınız henüz Admin tarafından onaylanmamıştır. İlan oluşturabilmek için şirket profilinizin onaylanması gerekmektedir.');
        }
        return this.prisma.internship.create({
            data: {
                companyId: companyProfile.id,
                title: dto.title,
                description: dto.description,
                location: dto.location,
                isRemote: dto.isRemote ?? false,
                requirements: dto.requirements ?? [],
                internshipType: dto.internshipType,
                targetEducationLevel: dto.targetEducationLevel,
                targetDepartments: dto.targetDepartments ?? [],
                targetGrades: dto.targetGrades ?? [],
                weeklyDays: dto.weeklyDays ?? 5,
                durationWeeks: dto.durationWeeks ?? 12,
                workModel: dto.workModel,
                city: dto.city ?? 'İstanbul',
                district: dto.district,
                stipendType: dto.stipendType,
                hasMealAllowance: dto.hasMealAllowance ?? true,
                hasTransportation: dto.hasTransportation ?? true,
                hasEquipment: dto.hasEquipment ?? true,
                returnOfferProbability: dto.returnOfferProbability,
                requiredSkills: dto.requiredSkills ?? [],
                languageRequirements: dto.languageRequirements,
                applicationDeadline: dto.applicationDeadline
                    ? new Date(dto.applicationDeadline)
                    : null,
                expectedStartDate: dto.expectedStartDate
                    ? new Date(dto.expectedStartDate)
                    : null,
                quota: dto.quota ?? 1,
                status: 'PASSIVE',
            },
            include: {
                company: true,
            },
        });
    }
    async findAll(filterDto) {
        const { search, location, city, isRemote, internshipType, targetEducationLevel, workModel, } = filterDto;
        const where = {
            status: 'ACTIVE',
            company: {
                isApproved: true,
            },
        };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { requiredSkills: { hasSome: [search] } },
            ];
        }
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (city) {
            where.city = { equals: city, mode: 'insensitive' };
        }
        if (isRemote === true) {
            where.isRemote = true;
        }
        if (internshipType) {
            where.internshipType = internshipType;
        }
        if (targetEducationLevel) {
            where.targetEducationLevel = targetEducationLevel;
        }
        if (workModel) {
            where.workModel = workModel;
        }
        return this.prisma.internship.findMany({
            where,
            include: {
                company: {
                    select: {
                        id: true,
                        companyName: true,
                        website: true,
                        logoUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const internship = await this.prisma.internship.findUnique({
            where: { id },
            include: {
                company: true,
            },
        });
        if (!internship) {
            throw new common_1.NotFoundException('Staj ilanı bulunamadı.');
        }
        return internship;
    }
    async findByCompany(userId) {
        const companyProfile = await this.prisma.companyProfile.findUnique({
            where: { userId },
        });
        if (!companyProfile) {
            return [];
        }
        return this.prisma.internship.findMany({
            where: { companyId: companyProfile.id },
            include: {
                company: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async update(userId, id, dto) {
        const internship = await this.prisma.internship.findUnique({
            where: { id },
            include: { company: true },
        });
        if (!internship) {
            throw new common_1.NotFoundException('Güncellenecek staj ilanı bulunamadı.');
        }
        if (internship.company.userId !== userId) {
            throw new common_1.ForbiddenException('Bu ilanı düzenleme yetkiniz bulunmamaktadır.');
        }
        return this.prisma.internship.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                location: dto.location,
                isRemote: dto.isRemote,
                requirements: dto.requirements,
                internshipType: dto.internshipType,
                targetEducationLevel: dto.targetEducationLevel,
                targetDepartments: dto.targetDepartments,
                targetGrades: dto.targetGrades,
                weeklyDays: dto.weeklyDays,
                durationWeeks: dto.durationWeeks,
                workModel: dto.workModel,
                city: dto.city,
                district: dto.district,
                stipendType: dto.stipendType,
                hasMealAllowance: dto.hasMealAllowance,
                hasTransportation: dto.hasTransportation,
                hasEquipment: dto.hasEquipment,
                returnOfferProbability: dto.returnOfferProbability,
                requiredSkills: dto.requiredSkills,
                languageRequirements: dto.languageRequirements,
                applicationDeadline: dto.applicationDeadline
                    ? new Date(dto.applicationDeadline)
                    : undefined,
                expectedStartDate: dto.expectedStartDate
                    ? new Date(dto.expectedStartDate)
                    : undefined,
                quota: dto.quota,
            },
            include: {
                company: true,
            },
        });
    }
    async remove(userId, id) {
        const internship = await this.prisma.internship.findUnique({
            where: { id },
            include: { company: true },
        });
        if (!internship) {
            throw new common_1.NotFoundException('Silinecek staj ilanı bulunamadı.');
        }
        if (internship.company.userId !== userId) {
            throw new common_1.ForbiddenException('Bu ilanı silme yetkiniz bulunmamaktadır.');
        }
        await this.prisma.internship.delete({
            where: { id },
        });
        return { message: 'Staj ilanı başarıyla silindi.' };
    }
};
exports.InternshipsService = InternshipsService;
exports.InternshipsService = InternshipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InternshipsService);
//# sourceMappingURL=internships.service.js.map