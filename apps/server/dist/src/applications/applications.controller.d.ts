import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    apply(userId: string, dto: CreateApplicationDto): Promise<{
        internship: {
            company: {
                id: string;
                userId: string;
                companyName: string;
                website: string | null;
                description: string | null;
                logoUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
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
        };
    } & {
        id: string;
        studentId: string;
        internshipId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getStudentApplications(userId: string): Promise<({
        internship: {
            company: {
                id: string;
                userId: string;
                companyName: string;
                website: string | null;
                description: string | null;
                logoUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
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
        };
    } & {
        id: string;
        studentId: string;
        internshipId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getCompanyApplications(userId: string, internshipId?: string): Promise<({
        internship: {
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
        };
        student: {
            user: {
                email: string;
            };
        } & {
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
        };
    } & {
        id: string;
        studentId: string;
        internshipId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateStatus(userId: string, id: string, dto: UpdateApplicationStatusDto): Promise<{
        internship: {
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
        };
        student: {
            user: {
                id: string;
                email: string;
                passwordHash: string;
                role: import(".prisma/client").$Enums.Role;
                refreshTokenHash: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
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
        };
    } & {
        id: string;
        studentId: string;
        internshipId: string;
        status: import(".prisma/client").$Enums.ApplicationStatus;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
