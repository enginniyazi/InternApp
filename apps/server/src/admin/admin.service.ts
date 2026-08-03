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

    return this.prisma.companyProfile.update({
      where: { id: companyId },
      data: {
        isApproved: !company.isApproved,
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
        studentProfile: true,
        companyProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Kullanıcı bulunamadı.');
    return this.prisma.user.delete({ where: { id: userId } });
  }

  async getAllInternships() {
    return this.prisma.internship.findMany({
      include: {
        company: {
          select: {
            companyName: true,
            website: true,
            isApproved: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteInternship(internshipId: string) {
    const item = await this.prisma.internship.findUnique({
      where: { id: internshipId },
    });
    if (!item) throw new NotFoundException('İlan bulunamadı.');
    return this.prisma.internship.delete({ where: { id: internshipId } });
  }
}
