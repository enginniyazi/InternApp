import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalStudents,
      totalCompanies,
      totalInternships,
      totalApplications,
    ] = await Promise.all([
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

  async approveCompany(companyId: string) {
    const company = await this.prisma.companyProfile.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Şirket profili bulunamadı.');
    }

    // Profitably mark as updated / verified
    return this.prisma.companyProfile.update({
      where: { id: companyId },
      data: {
        updatedAt: new Date(),
      },
    });
  }
}
