import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalUsers: number;
        totalStudents: number;
        totalCompanies: number;
        totalInternships: number;
        totalApplications: number;
    }>;
    getCompanies(): Promise<({
        user: {
            id: string;
            email: string;
            createdAt: Date;
        };
    } & {
        id: string;
        userId: string;
        companyName: string;
        website: string | null;
        description: string | null;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    approveCompany(companyId: string): Promise<{
        id: string;
        userId: string;
        companyName: string;
        website: string | null;
        description: string | null;
        logoUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
