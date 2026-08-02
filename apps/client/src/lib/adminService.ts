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

export async function fetchAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>('/admin/stats');
}

export async function fetchAdminCompanies(): Promise<AdminCompanyItem[]> {
  return api.get<AdminCompanyItem[]>('/admin/companies');
}

export async function approveCompany(companyId: string): Promise<void> {
  await api.patch(`/admin/companies/${companyId}/approve`);
}
