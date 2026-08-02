import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendNewApplicationNotification(companyEmail: string, studentName: string, internshipTitle: string): Promise<void>;
    sendStatusUpdateNotification(studentEmail: string, internshipTitle: string, status: string): Promise<void>;
}
