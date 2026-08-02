/**
 * Profiles API servisi — Öğrenci ve şirket profil yönetimi.
 */

import { api } from './api';
import type { StudentProfileData } from '../components/profile/ProfileWizard';

interface StudentProfileApiResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  university?: string;
  department?: string;
  grade?: string;
  gpa?: number;
  educationLevel?: string;
  internshipStatus?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
  cvUrl?: string;
}

export async function fetchStudentProfile(): Promise<StudentProfileData> {
  const data = await api.get<StudentProfileApiResponse>('/profiles/student');
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    city: data.city || '',
    university: data.university || '',
    department: data.department || '',
    grade: data.grade || '',
    gpa: data.gpa ? String(data.gpa) : '',
    educationLevel: data.educationLevel || 'BACHELOR',
    internshipStatus: data.internshipStatus || 'MANDATORY',
    skills: data.skills || [],
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    bio: data.bio || '',
    cvUrl: data.cvUrl,
  };
}

export async function updateStudentProfile(
  profile: Partial<StudentProfileData>
): Promise<StudentProfileData> {
  const payload = {
    ...profile,
    gpa: profile.gpa ? parseFloat(profile.gpa) : undefined,
  };
  const data = await api.patch<StudentProfileApiResponse>('/profiles/student', payload);
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    city: data.city || '',
    university: data.university || '',
    department: data.department || '',
    grade: data.grade || '',
    gpa: data.gpa ? String(data.gpa) : '',
    educationLevel: data.educationLevel || 'BACHELOR',
    internshipStatus: data.internshipStatus || 'MANDATORY',
    skills: data.skills || [],
    linkedinUrl: data.linkedinUrl || '',
    githubUrl: data.githubUrl || '',
    bio: data.bio || '',
    cvUrl: data.cvUrl,
  };
}

export async function uploadCv(file: File): Promise<string> {
  const data = await api.upload<{ cvUrl: string }>('/profiles/student/cv', file);
  return data.cvUrl;
}
