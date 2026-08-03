import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessagesByApplication(applicationId: string, currentUserId: string) {
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
      throw new NotFoundException('Başvuru bulunamadı.');
    }

    const isStudent = application.student.userId === currentUserId;
    const isCompany = application.internship.company.userId === currentUserId;

    if (!isStudent && !isCompany) {
      throw new ForbiddenException('Bu sohbeti görüntüleme yetkiniz yok.');
    }

    // Okunmadı işaretlerini güncelle
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

  async sendMessage(
    applicationId: string,
    senderId: string,
    content: string,
    attachmentUrl?: string,
  ) {
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
      throw new NotFoundException('Başvuru bulunamadı.');
    }

    const isStudent = application.student.userId === senderId;
    const isCompany = application.internship.company.userId === senderId;

    if (!isStudent && !isCompany) {
      throw new ForbiddenException(
        'Bu başvuru üzerinden mesaj gönderme yetkiniz yok.',
      );
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

    // Otomatik Bildirim Gönder
    const senderName = isStudent
      ? `${application.student.firstName} ${application.student.lastName}`
      : application.internship.company.companyName;

    await this.prisma.notification.create({
      data: {
        userId: receiverId,
        title: `💬 Yeni Mesaj: ${senderName}`,
        message:
          content.length > 50 ? `${content.substring(0, 50)}...` : content,
        type: 'NEW_MESSAGE',
        linkUrl: applicationId,
      },
    });

    return message;
  }
}
