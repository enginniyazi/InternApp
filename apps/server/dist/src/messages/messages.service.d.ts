import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMessagesByApplication(applicationId: string, currentUserId: string): Promise<({
        sender: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            studentProfile: {
                firstName: string;
                lastName: string;
            } | null;
            companyProfile: {
                companyName: string;
            } | null;
        };
    } & {
        id: string;
        applicationId: string;
        senderId: string;
        receiverId: string;
        content: string;
        attachmentUrl: string | null;
        isRead: boolean;
        createdAt: Date;
    })[]>;
    sendMessage(applicationId: string, senderId: string, content: string, attachmentUrl?: string): Promise<{
        sender: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            studentProfile: {
                firstName: string;
                lastName: string;
            } | null;
            companyProfile: {
                companyName: string;
            } | null;
        };
    } & {
        id: string;
        applicationId: string;
        senderId: string;
        receiverId: string;
        content: string;
        attachmentUrl: string | null;
        isRead: boolean;
        createdAt: Date;
    }>;
}
