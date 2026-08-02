import { InternshipType, EducationLevel, WorkModel } from '@prisma/client';
export declare class FilterInternshipsDto {
    search?: string;
    location?: string;
    city?: string;
    isRemote?: boolean;
    internshipType?: InternshipType;
    targetEducationLevel?: EducationLevel;
    workModel?: WorkModel;
}
