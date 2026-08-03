import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { FilterInternshipsDto } from './dto/filter-internships.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InternshipsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCompanyProfile(userId: string) {
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

  async create(userId: string, dto: CreateInternshipDto) {
    const companyProfile = await this.getOrCreateCompanyProfile(userId);

    if (!companyProfile.isApproved) {
      throw new ForbiddenException(
        'Hesabınız henüz Admin tarafından onaylanmamıştır. İlan oluşturabilmek için şirket profilinizin onaylanması gerekmektedir.',
      );
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
        status: 'PASSIVE', // Şirket eklediğinde Admin onayı beklenir (PASSIVE)
      },
      include: {
        company: true,
      },
    });
  }

  async findAll(filterDto: FilterInternshipsDto) {
    const {
      search,
      location,
      city,
      isRemote,
      internshipType,
      targetEducationLevel,
      workModel,
    } = filterDto;

    // Öğrenciler yalnızca ADMIN tarafından onaylanmış (ACTIVE) VE şirketi onaylı (isApproved: true) ilanları görebilir
    const where: Prisma.InternshipWhereInput = {
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

    // Remote butonu seçildiğinde (isRemote: true) sadece uzaktan çalışma ilanları süzülür. Seçili değilse TÜM ilanlar gelir.
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

  async findOne(id: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!internship) {
      throw new NotFoundException('Staj ilanı bulunamadı.');
    }

    return internship;
  }

  async findByCompany(userId: string) {
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

  async update(userId: string, id: string, dto: UpdateInternshipDto) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!internship) {
      throw new NotFoundException('Güncellenecek staj ilanı bulunamadı.');
    }

    if (internship.company.userId !== userId) {
      throw new ForbiddenException(
        'Bu ilanı düzenleme yetkiniz bulunmamaktadır.',
      );
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

  async remove(userId: string, id: string) {
    const internship = await this.prisma.internship.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!internship) {
      throw new NotFoundException('Silinecek staj ilanı bulunamadı.');
    }

    if (internship.company.userId !== userId) {
      throw new ForbiddenException('Bu ilanı silme yetkiniz bulunmamaktadır.');
    }

    await this.prisma.internship.delete({
      where: { id },
    });

    return { message: 'Staj ilanı başarıyla silindi.' };
  }
}
