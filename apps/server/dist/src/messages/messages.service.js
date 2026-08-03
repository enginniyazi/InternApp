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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMessagesByApplication(applicationId, currentUserId) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: true,
                internship: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Başvuru bulunamadı.');
        }
        const isStudent = application.student.userId === currentUserId;
        const isCompany = application.internship.company.userId === currentUserId;
        if (!isStudent && !isCompany) {
            throw new common_1.ForbiddenException('Bu sohbeti görüntüleme yetkiniz yok.');
        }
        await this.prisma.message.updateMany({
            where: {
                applicationId,
                receiverId: currentUserId,
                isRead: false,
            },
            data: { isRead: true },
        });
        return this.prisma.message.findMany({
            where: { applicationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        studentProfile: { select: { firstName: true, lastName: true } },
                        companyProfile: { select: { companyName: true } },
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessage(applicationId, senderId, content, attachmentUrl) {
        const application = await this.prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                student: true,
                internship: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException('Başvuru bulunamadı.');
        }
        const isStudent = application.student.userId === senderId;
        const isCompany = application.internship.company.userId === senderId;
        if (!isStudent && !isCompany) {
            throw new common_1.ForbiddenException('Bu başvuru üzerinden mesaj gönderme yetkiniz yok.');
        }
        const receiverId = isStudent
            ? application.internship.company.userId
            : application.student.userId;
        const message = await this.prisma.message.create({
            data: {
                applicationId,
                senderId,
                receiverId,
                content,
                attachmentUrl,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        studentProfile: { select: { firstName: true, lastName: true } },
                        companyProfile: { select: { companyName: true } },
                    },
                },
            },
        });
        const senderName = isStudent
            ? `${application.student.firstName} ${application.student.lastName}`
            : application.internship.company.companyName;
        await this.prisma.notification.create({
            data: {
                userId: receiverId,
                title: `💬 Yeni Mesaj: ${senderName}`,
                message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
                type: 'NEW_MESSAGE',
                linkUrl: `/applications/${applicationId}`,
            },
        });
        return message;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map