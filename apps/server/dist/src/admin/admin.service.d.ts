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
        isApproved: boolean;
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
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        studentProfile: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            city: string | null;
            university: string | null;
            department: string | null;
            grade: string | null;
            gpa: number | null;
            educationLevel: import(".prisma/client").$Enums.EducationLevel | null;
            internshipStatus: import(".prisma/client").$Enums.InternshipType | null;
            skills: string[];
            linkedinUrl: string | null;
            githubUrl: string | null;
            cvUrl: string | null;
            bio: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        companyProfile: {
            id: string;
            userId: string;
            companyName: string;
            website: string | null;
            description: string | null;
            logoUrl: string | null;
            isApproved: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }[]>;
    deleteUser(userId: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        refreshTokenHash: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllInternships(): Promise<({
        company: {
            companyName: string;
            website: string | null;
            isApproved: boolean;
        };
        _count: {
            applications: number;
        };
    } & {
        id: string;
        companyId: string;
        title: string;
        description: string;
        location: string;
        isRemote: boolean;
        requirements: string[];
        internshipType: import(".prisma/client").$Enums.InternshipType;
        targetEducationLevel: import(".prisma/client").$Enums.EducationLevel;
        targetDepartments: string[];
        targetGrades: number[];
        weeklyDays: number;
        durationWeeks: number;
        workModel: import(".prisma/client").$Enums.WorkModel;
        city: string;
        district: string | null;
        stipendType: import(".prisma/client").$Enums.StipendType;
        hasMealAllowance: boolean;
        hasTransportation: boolean;
        hasEquipment: boolean;
        returnOfferProbability: import(".prisma/client").$Enums.ReturnOfferProbability;
        requiredSkills: string[];
        languageRequirements: string | null;
        applicationDeadline: Date | null;
        expectedStartDate: Date | null;
        quota: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    deleteInternship(internshipId: string): Promise<{
        id: string;
        companyId: string;
        title: string;
        description: string;
        location: string;
        isRemote: boolean;
        requirements: string[];
        internshipType: import(".prisma/client").$Enums.InternshipType;
        targetEducationLevel: import(".prisma/client").$Enums.EducationLevel;
        targetDepartments: string[];
        targetGrades: number[];
        weeklyDays: number;
        durationWeeks: number;
        workModel: import(".prisma/client").$Enums.WorkModel;
        city: string;
        district: string | null;
        stipendType: import(".prisma/client").$Enums.StipendType;
        hasMealAllowance: boolean;
        hasTransportation: boolean;
        hasEquipment: boolean;
        returnOfferProbability: import(".prisma/client").$Enums.ReturnOfferProbability;
        requiredSkills: string[];
        languageRequirements: string | null;
        applicationDeadline: Date | null;
        expectedStartDate: Date | null;
        quota: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
