import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async getStudentProfile(userId: string) {
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
      throw new NotFoundException('Öğrenci profili bulunamadı.');
    }

    return profile;
  }

  async updateStudentProfile(userId: string, dto: UpdateStudentProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.STUDENT) {
      throw new ForbiddenException(
        'Bu işlem için öğrenci olmanız gerekmektedir.',
      );
    }

    return this.prisma.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        firstName: dto.firstName || 'Öğrenci',
        lastName: dto.lastName || 'Kullanıcı',
        phone: dto.phone,
        bio: dto.bio,
        cvUrl: dto.cvUrl,
      },
      update: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.cvUrl !== undefined && { cvUrl: dto.cvUrl }),
      },
    });
  }

  async uploadCv(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.STUDENT) {
      throw new ForbiddenException('Sadece öğrenciler CV yükleyebilir.');
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

  async getCompanyProfile(userId: string) {
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
      throw new NotFoundException('Şirket profili bulunamadı.');
    }

    return profile;
  }

  async updateCompanyProfile(userId: string, dto: UpdateCompanyProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== Role.COMPANY) {
      throw new ForbiddenException(
        'Bu işlem için şirket olmanız gerekmektedir.',
      );
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
}
