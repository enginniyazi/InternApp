import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
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
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
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
        };
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<Tokens>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private updateRefreshTokenHash;
}
