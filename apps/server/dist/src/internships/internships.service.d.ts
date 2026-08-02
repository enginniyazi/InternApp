import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { FilterInternshipsDto } from './dto/filter-internships.dto';
export declare class InternshipsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCompanyProfile;
    create(userId: string, dto: CreateInternshipDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(filterDto: FilterInternshipsDto): Promise<({
        company: {
            id: string;
            companyName: string;
            website: string | null;
            logoUrl: string | null;
        };
    } & {
        id: string;
        companyId: string;
        title: string;
        description: string;
        location: string;
        isRemote: boolean;
        requirements: string[];
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByCompany(userId: string): Promise<({
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
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    update(userId: string, id: string, dto: UpdateInternshipDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<{
        message: string;
    }>;
}
