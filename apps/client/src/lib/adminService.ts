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
    university?: string;
    department?: string;
  };
  companyProfile?: {
    companyName: string;
    website?: string;
  };
}

export interface AdminInternshipItem {
  id: string;
  title: string;
  location: string;
  city: string;
  internshipType: string;
  targetEducationLevel: string;
  createdAt: string;
  company: {
    companyName: string;
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
