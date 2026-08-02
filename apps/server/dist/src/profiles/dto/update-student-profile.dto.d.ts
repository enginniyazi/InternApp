import { EducationLevel, InternshipType } from '@prisma/client';
export declare class UpdateStudentProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    university?: string;
    department?: string;
    grade?: string;
    gpa?: number;
    educationLevel?: EducationLevel;
    internshipStatus?: InternshipType;
    skills?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    bio?: string;
    cvUrl?: string;
}
