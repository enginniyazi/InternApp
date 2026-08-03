/**
 * Admin API servisi — İstatistikler ve şirket yönetimi.
 */

import { api } from './api';

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalCompanies: number;
  totalInternships: number;
  totalApplications: number;
}

export interface AdminCompanyItem {
  id: string;
  companyName: string;
  website?: string;
  description?: string;
  isApproved?: boolean;
  createdAt: string;
  user: {
    email: string;
  };
}

export interface AdminUserItem {
  id: string;
  email: string;
  role: 'STUDENT' | 'COMPANY' | 'ADMIN';
  createdAt: string;
  studentProfile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    city?: string;
    university?: string;
    department?: string;
    grade?: string;
    gpa?: number;
    educationLevel?: string;
    skills?: string[];
    bio?: string;
    resumeUrl?: string;
  };
  companyProfile?: {
    companyName: string;
    website?: string;
    description?: string;
    isApproved?: boolean;
  };
}

export interface AdminInternshipItem {
  id: string;
  title: string;
  description: string;
  requirements?: string[];
  location: string;
  city: string;
  workModel?: string;
  internshipType: string;
  targetEducationLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  stipendType?: string;
  perks?: string[];
  durationWeeks?: number;
  daysPerWeek?: number;
  status?: 'ACTIVE' | 'PASSIVE' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  company: {
    companyName: string;
    website?: string;
    isApproved?: boolean;
  };
  _count: {
    applications: number;
  };
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>('/admin/stats');
}

export async function fetchAdminCompanies(): Promise<AdminCompanyItem[]> {
  return api.get<AdminCompanyItem[]>('/admin/companies');
}

export async function approveCompany(companyId: string): Promise<void> {
  await api.patch(`/admin/companies/${companyId}/approve`);
}

export async function fetchAdminUsers(): Promise<AdminUserItem[]> {
  return api.get<AdminUserItem[]>('/admin/users');
}

export async function deleteAdminUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

export async function fetchAdminInternships(): Promise<AdminInternshipItem[]> {
  return api.get<AdminInternshipItem[]>('/admin/internships');
}

export async function deleteAdminInternship(internshipId: string): Promise<void> {
  await api.delete(`/admin/internships/${internshipId}`);
}

export async function toggleAdminInternshipStatus(internshipId: string): Promise<void> {
  await api.patch(`/admin/internships/${internshipId}/toggle-status`);
}
