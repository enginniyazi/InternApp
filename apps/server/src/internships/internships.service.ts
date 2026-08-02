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

    return this.prisma.internship.create({
      data: {
        companyId: companyProfile.id,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        isRemote: dto.isRemote ?? false,
        requirements: dto.requirements ?? [],
      },
      include: {
        company: true,
      },
    });
  }

  async findAll(filterDto: FilterInternshipsDto) {
    const { search, location, isRemote } = filterDto;

    const where: Prisma.InternshipWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (typeof isRemote === 'boolean') {
      where.isRemote = isRemote;
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
