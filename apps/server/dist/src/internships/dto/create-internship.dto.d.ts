import { InternshipType, EducationLevel, WorkModel, StipendType, ReturnOfferProbability } from '@prisma/client';
export declare class CreateInternshipDto {
    title: string;
    description: string;
    location: string;
    isRemote?: boolean;
    requirements?: string[];
    internshipType?: InternshipType;
    targetEducationLevel?: EducationLevel;
    targetDepartments?: string[];
    targetGrades?: number[];
    weeklyDays?: number;
    durationWeeks?: number;
    workModel?: WorkModel;
    city?: string;
    district?: string;
    stipendType?: StipendType;
    hasMealAllowance?: boolean;
    hasTransportation?: boolean;
    hasEquipment?: boolean;
    returnOfferProbability?: ReturnOfferProbability;
    requiredSkills?: string[];
    languageRequirements?: string;
    applicationDeadline?: Date | string;
    expectedStartDate?: Date | string;
    quota?: number;
}
