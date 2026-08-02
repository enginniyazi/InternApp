import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    approveCompany(id: string): Promise<{
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
