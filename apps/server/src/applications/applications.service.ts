import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async applyToInternship(userId: string, dto: CreateApplicationDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.STUDENT) {
      throw new ForbiddenException(
        'Sadece öğrenciler staj başvurusunda bulunabilir.',
      );
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
      throw new NotFoundException('Başvurulacak staj ilanı bulunamadı.');
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
      throw new ConflictException('Bu staj ilanına daha önce başvurdunuz.');
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
      void this.mailService.sendNewApplicationNotification(
        companyEmail,
        studentName,
        internship.title,
      );
    }

    return application;
  }

  async getStudentApplications(userId: string) {
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

  async getCompanyApplications(companyUserId: string, internshipId?: string) {
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

  async updateApplicationStatus(
    companyUserId: string,
    applicationId: string,
    dto: UpdateApplicationStatusDto,
  ) {
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
      throw new NotFoundException('Başvuru bulunamadı.');
    }

    if (application.internship.company.userId !== companyUserId) {
      throw new ForbiddenException(
        'Bu başvuruyu değerlendirme yetkiniz bulunmamaktadır.',
      );
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
      void this.mailService.sendStatusUpdateNotification(
        studentEmail,
        application.internship.title,
        dto.status,
      );
    }

    return updated;
  }
}
