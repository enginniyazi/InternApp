import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        studentProfile: {
            id: string;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string | null;
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
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }>;
}
export {};
