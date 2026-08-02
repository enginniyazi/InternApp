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
  bio?: string;
  cvUrl?: string;
}

export async function fetchStudentProfile(): Promise<StudentProfileData> {
  const data = await api.get<StudentProfileApiResponse>('/profiles/student');
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    bio: data.bio || '',
    cvUrl: data.cvUrl,
  };
}

export async function updateStudentProfile(
  profile: Partial<StudentProfileData>
): Promise<StudentProfileData> {
  const data = await api.patch<StudentProfileApiResponse>('/profiles/student', profile);
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || '',
    bio: data.bio || '',
    cvUrl: data.cvUrl,
  };
}

export async function uploadCv(file: File): Promise<string> {
  const data = await api.upload<{ cvUrl: string }>('/profiles/student/cv', file);
  return data.cvUrl;
}
