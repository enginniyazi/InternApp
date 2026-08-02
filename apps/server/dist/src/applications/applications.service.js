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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
let ApplicationsService = class ApplicationsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async applyToInternship(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== client_1.Role.STUDENT) {
            throw new common_1.ForbiddenException('Sadece öğrenciler staj başvurusunda bulunabilir.');
        }
        let studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!studentProfile) {
            studentProfile = await this.prisma.studentProfile.create({
                data: {
                    userId,
                    firstName: 'Öğrenci',
                    lastName: 'Kullanıcı',
                },
            });
        }
        const internship = await this.prisma.internship.findUnique({
            where: { id: dto.internshipId },
            include: {
                company: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!internship) {
            throw new common_1.NotFoundException('Başvurulacak staj ilanı bulunamadı.');
        }
        const existingApplication = await this.prisma.application.findUnique({
            where: {
                studentId_internshipId: {
                    studentId: studentProfile.id,
                    internshipId: dto.internshipId,
                },
            },
        });
        if (existingApplication) {
            throw new common_1.ConflictException('Bu staj ilanına daha önce başvurdunuz.');
        }
        const application = await this.prisma.application.create({
            data: {
                studentId: studentProfile.id,
                internshipId: dto.internshipId,
                note: dto.note,
            },
            include: {
                internship: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        const companyEmail = internship.company?.user?.email;
        if (companyEmail) {
            const studentName = `${studentProfile.firstName} ${studentProfile.lastName}`;
            void this.mailService.sendNewApplicationNotification(companyEmail, studentName, internship.title);
        }
        return application;
    }
    async getStudentApplications(userId) {
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!studentProfile) {
            return [];
        }
        return this.prisma.application.findMany({
            where: { studentId: studentProfile.id },
            include: {
                internship: {
                    include: {
                        company: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getCompanyApplications(companyUserId, internshipId) {
        const companyProfile = await this.prisma.companyProfile.findUnique({
            where: { userId: companyUserId },
        });
        if (!companyProfile) {
            return [];
        }
        return this.prisma.application.findMany({
            where: {
                internship: {
                    companyId: companyProfile.id,
                    ...(internshipId && { id: internshipId }),
                },
            },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                },
                internship: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateApplicationStatus(companyUserId, applicationId, dto) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                internship: {
                    include: {
                        company: true,
                    },
                },
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Başvuru bulunamadı.');
        }
        if (application.internship.company.userId !== companyUserId) {
            throw new common_1.ForbiddenException('Bu başvuruyu değerlendirme yetkiniz bulunmamaktadır.');
        }
        const updated = await this.prisma.application.update({
            where: { id: applicationId },
            data: {
                status: dto.status,
                ...(dto.note && { note: dto.note }),
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                internship: true,
            },
        });
        const studentEmail = application.student?.user?.email;
        if (studentEmail) {
            void this.mailService.sendStatusUpdateNotification(studentEmail, application.internship.title, dto.status);
        }
        return updated;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map