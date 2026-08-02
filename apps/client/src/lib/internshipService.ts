/**
 * Internships API servisi — İlan CRUD işlemleri.
 */

import { api } from './api';
import type { InternshipData } from '../components/internships/InternshipCard';

export async function fetchInternships(params?: {
  search?: string;
  location?: string;
  city?: string;
  isRemote?: boolean;
  internshipType?: string;
  targetEducationLevel?: string;
  workModel?: string;
}): Promise<InternshipData[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.location) query.set('location', params.location);
  if (params?.city) query.set('city', params.city);
  if (params?.isRemote !== undefined) query.set('isRemote', String(params.isRemote));
  if (params?.internshipType) query.set('internshipType', params.internshipType);
  if (params?.targetEducationLevel) query.set('targetEducationLevel', params.targetEducationLevel);
  if (params?.workModel) query.set('workModel', params.workModel);

  const qs = query.toString();
  const url = qs ? `/internships?${qs}` : '/internships';
  const items = await api.get<InternshipData[]>(url);
  return items;
}

export async function fetchMyInternships(): Promise<InternshipData[]> {
  const items = await api.get<InternshipData[]>('/internships/my');
  return items;
}

export async function createInternship(data: Partial<InternshipData>): Promise<InternshipData> {
  const item = await api.post<InternshipData>('/internships', data);
  return item;
}

export async function updateInternship(
  id: string,
  data: Partial<InternshipData>
): Promise<InternshipData> {
  const item = await api.patch<InternshipData>(`/internships/${id}`, data);
  return item;
}

export async function deleteInternship(id: string): Promise<void> {
  await api.delete(`/internships/${id}`);
}
