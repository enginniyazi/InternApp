/**
 * Applications API servisi — Başvuru işlemleri.
 */

import { api } from './api';
import type { ApplicationItem } from '../components/applications/StudentApplicationsList';
import type { ApplicantItem } from '../components/applications/CompanyApplicationsModal';
import type { InternshipData } from '../components/internships/InternshipCard';

interface StudentApplicationApiItem {
  id: string;
  status: ApplicationItem['status'];
  note?: string;
  createdAt: string;
  internship: InternshipData;
}

interface CompanyApplicationApiItem {
  id: string;
  status: ApplicantItem['status'];
  createdAt: string;
  note?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    cvUrl?: string;
    user: {
      email: string;
    };
  };
}

export async function applyToInternship(internshipId: string, note?: string): Promise<void> {
  await api.post('/applications', { internshipId, note });
}

export async function fetchStudentApplications(): Promise<ApplicationItem[]> {
  const items = await api.get<StudentApplicationApiItem[]>('/applications/student');
  return items.map((item) => ({
    id: item.id,
    internshipTitle: item.internship.title,
    companyName: item.internship.company?.companyName || 'Şirket',
    status: item.status,
    createdAt: item.createdAt,
    note: item.note,
    internship: item.internship,
  }));
}

export async function fetchCompanyApplications(internshipId?: string): Promise<ApplicantItem[]> {
  const url = internshipId
    ? `/applications/company?internshipId=${internshipId}`
    : '/applications/company';
  const items = await api.get<CompanyApplicationApiItem[]>(url);
  return items.map((item) => ({
    id: item.id,
    studentName: `${item.student.firstName} ${item.student.lastName}`,
    studentEmail: item.student.user.email,
    cvUrl: item.student.cvUrl,
    status: item.status,
    createdAt: item.createdAt,
  }));
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicantItem['status'],
  note?: string
): Promise<void> {
  await api.patch(`/applications/${applicationId}/status`, { status, note });
}
