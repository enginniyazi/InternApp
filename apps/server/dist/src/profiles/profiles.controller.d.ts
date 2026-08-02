import { ProfilesService } from './profiles.service';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getStudentProfile(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    } & {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        cvUrl: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStudentProfile(userId: string, dto: UpdateStudentProfileDto): Promise<{
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        cvUrl: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    uploadCv(userId: string, file: Express.Multer.File): Promise<{
        message: string;
        cvUrl: string | null;
    }>;
    getCompanyProfile(userId: string): Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
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
    }>;
    updateCompanyProfile(userId: string, dto: UpdateCompanyProfileDto): Promise<{
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
