import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getMessages(applicationId: string, userId: string): Promise<({
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
    sendMessage(applicationId: string, userId: string, content: string, attachmentUrl?: string): Promise<{
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
